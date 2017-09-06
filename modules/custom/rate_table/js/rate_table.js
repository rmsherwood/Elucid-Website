/*
  This module initializes and controls Rate
  Table blocks
*/

(function ($) {

  // Represents onsite locations.
  var Onsite  = true;
  var Offsite = false;

  /*
    Represents the default number of rates to
    display in rate tables.

    Note: this should be made a configuration
    setting.
  */
  var DefaultNum = 10;

  /*
    Determines whether or not tables list onsite
    or offsite prices by default.

    Note: this should be made a configuration
    setting.
  */
  var DefaultOnsite = Offsite;

  // Represents the default filter terms.
  var DefaultQuery = '';

  /*
    Represents the set of labor categories as
    an array of Labor Category objects.

    Note: each Labor Category object has the
    following structure:

      {
        id: NODEID,
        name: NAME,
        vehicle: VEHICLENODEID
      }
  */
  var LaborCategories = drupalSettings.rate_table.labor_categories;

  /*
    Represents the set of labor rates as an
    array of Labor Rate objects.

    Note: each Labor Rate object has the following structure:

      {
        category: CATEGORYNODEID,
        onsite:   BOOLEAN,
        rate:     FLOAT,
        year:     INT
      }
  */
  var LaborRates = drupalSettings.rate_table.labor_rates;

  /*
    Accepts two arguments:

    * laborCategory, a labor category node ID
    * and onsite, a boolean

    and returns the set of labor rates associated
    with the given labor category. This function
    returns a labor rate for each of the years
    that we normally quote values for. If any
    of these years does not have a rate, this
    function returns an "unknown" rate entry.
  */
  function getCategoryRates (laborCategory, onsite) {
    var NumYears   = 10;
    var laborRates = [];
    for (var year = 1; year <= NumYears; year ++) {
      laborRates.push (getLaborRate (laborCategory, onsite, year));
    }
    return laborRates;
  }

  /*
    Accepts three arguments:

    * laborCategory, a labor category node ID
    * onsite, a boolean that indicates whether
      to return onsite or offsite labor rates
    * and year, an integer that represents a year

    and returns a Labor Rate object that
    represents the first labor rate in the
    database that has the given property. If
    none of the entries in the database do,
    this function returns a default "unknown"
    labor rate.
  */
  function getLaborRate (laborCategory, onsite, year) {
    return findLaborRate (laborCategory, onsite, year) ||
           createUnknownRate (laborCategory, onsite, year);
  }

  /*
    Accepts three arguments:

    * laborCategory, a labor category node ID
    * onsite, a boolean that indicates whether
      to return onsite or offsite labor rates
    * and year, an integer that represents a year

    and returns a Labor Rate object that
    represents the first labor rate that
    satisfies the given properties or null if
    none do.
  */
  function findLaborRate (laborCategory, onsite, year) {
    return _.find (LaborRates, function (laborRate) {
      return laborRate.category === laborCategory &&
             laborRate.onsite   === onsite &&
             laborRate.year     === year;
    }); 
  }

  /*
    Accepts three arguments:

    * laborCategory, a labor category node ID
    * onsite, a boolean
    * year, an integer

    and returns an "unknown" labor rate for the
    given category, location, and year.
  */
  function createUnknownRate (laborCategory, onsite, year) {
    return {
        category: laborCategory,
        onsite:   onsite,
        rate:     '',
        year:     year
    };
  }

  /*
    Initialzes the Rate Table block elements
    and registers event handlers.
  */
  $(document).ready (function () {
    getFeatureElements ().each (function (i, featureElement) {
      var feature = new Feature ($(featureElement));
      feature.init ();
    });
  });

  /*
    Accepts no arguments and returns a jQuery
    HTML Element set containing the Rate Table
    feature elements.
  */
  function getFeatureElements () {
    return $('.' + getFeatureClassName ());
  }

  /*
    Accepts a jQuery HTML Element,
    featureElement, that represents a rate table,
    and returns its contract vehicle node ID.
  */
  function getVehicleAttrib (featureElement) {
    return parseInt (featureElement.attr (getVehicleAttribName ()));
  }

  /*
    Returns the class name used to label Rate
    Table feature elements.
  */
  function getFeatureClassName () { return 'rate_table'; }

  /*
    Accepts one argument: featureElement, a
    jQuery HTML Element that represents a table
    feature; and returns a Table element that
    represents the feature.
  */
  function Feature (featureElement) {
    this._categories = [];
    this._currentPage = 0;
    this._location = Onsite;
    this._num = DefaultNum;
    this._query = DefaultQuery;
    this._featureElement = featureElement;
    this._vehicle = getVehicleAttrib (featureElement);
    this._offsiteTabElement = null;
    this._onsiteTabElement = null;
    this._numElement = null;
    this._filterInputElement = null;
    this._tableBodyElement = null;
    this._paginationLinksElement = null;
  }

  /*
    Accepts no arguments and returns the current
    labor categories to display in this table.
  */
  Feature.prototype.getCategories = function () {
    return this._categories;
  }

  /*
    Accepts no arguments and returns the current
    page index.
  */
  Feature.prototype.getCurrentPage = function () {
    return this._currentPage;
  }

  /*
    Accepts no arguments and returns the number
    of labor categories to display in the table.
  */
  Feature.prototype.getNum = function () {
    return this._num;
  }

  /*
    Accepts no arguments and returns this
    feature's current location.
  */
  Feature.prototype.getLocation = function () {
    return this._location;
  }

  /*
    Accepts no arguments and returns this
    feature's query.
  */
  Feature.prototype.getQuery = function () {
    return this._query;
  }

  /*
    Accepts no arguments and returns this
    feature's element.
  */
  Feature.prototype.getFeatureElement = function () {
    return this._featureElement;
  }

  /*
    Accepts no arguments and returns this
    feature's contract vehicle node ID.
  */
  Feature.prototype.getVehicle = function () {
    return this._vehicle;
  }

  /*
    Accepts no arguments and returns this
    feature's offsite tab element.
  */
  Feature.prototype.getOffsiteTabElement = function () {
    return this._offsiteTabElement;
  }

  /*
    Accepts no arguments and returns this
    feature's onsite tab element.
  */
  Feature.prototype.getOnsiteTabElement = function () {
    return this._onsiteTabElement;
  }

  /*
    Accepts no argumetns and returns this
    feature's num element.
  */
  Feature.prototype.getNumElement = function () {
    return this._numElement;
  }

  /*
    Accepts no arguments and returns this
    feature's filter element.
  */
  Feature.prototype.getFilterInputElement = function () {
    return this._filterInputElement;
  }

  /*
    Accepts no arguments and returns this
    feature's table body element.
  */
  Feature.prototype.getTableBodyElement = function () {
    return this._tableBodyElement;
  }

  /*
    Accepts no arguments and returns this
    feature's pagination element.
  */
  Feature.prototype.getPaginationLinksElement = function () {
    return this._paginationLinksElement;
  }

  /*
    Accepts no arguments and initializes this
    feature.
  */
  Feature.prototype.init = function () {
    // I. Set feature elements.
    this._offsiteTabElement      = this._getOffsiteTabElement ();
    this._onsiteTabElement       = this._getOnsiteTabElement ();
    this._tableBodyElement       = this._getTableBodyElement ();
    this._numElement             = this._getNumElement ();
    this._filterInputElement     = this._getFilterInputElement ();
    this._paginationLinksElement = this._getPaginationLinksElement ();

    // II. Initialize the tab elements.
    this.initTabElements ();

    // III. Initialize the num element.
    this.initNumElement ();

    // IV. Initialize the filter input element.
    this.initFilterInputElement ();

    // IV. Initialize the table body elements.
    this.initTableBodyElement ();

    // V. Initialize the pagination element.
    this.initPaginationElement ();
  }

  /*
    Accepts no arguments and initializes the
    tab elements.
  */
  Feature.prototype.initTabElements = function () {
    var self = this;
    this.getOffsiteTabElement ().click (function () {self.setOffsite (); });
    this.getOnsiteTabElement ().click (function () { self.setOnsite (); });
  }

  /*
    Accepts no arguments and initalizes the num
    item elements.
  */
  Feature.prototype.initNumElement = function () {
    var self = this;
    this.getNumItemElements ().each (function (i, _numItemElement) {
      var numItemElement = $(_numItemElement);
      var num = getNumItemAttrib (numItemElement);
      numItemElement.click (function () { self.setNum (num); });
    });
  }

  /*
    Accepts no arguments and initializes the
    filter input element.
  */
  Feature.prototype.initFilterInputElement = function () {
    var self = this;
    var inputElement = this.getFilterInputElement ();
    inputElement.on ('input', function () {
      var query = inputElement.val ();
      self.setQuery (query.trim ());
    });
  }

  /*
    Accepts no arguments and updates the labor
    rates so that they list onsite rates.
  */
  Feature.prototype.setOnsite = function () {
    this._location = Onsite;
    this.updateTable ();
  }

  /*
    Accepts no arguments and updates the labor
    rates so that they list offsite rates.
  */
  Feature.prototype.setOffsite = function () {
    this._location = Offsite;
    this.updateTable ();
  }

  /*
    Accepts one integer, num, and update the
    table so that it shows num rows.
  */
  Feature.prototype.setNum = function (num) {
    this._num = num;
    this._currentPage = 0;
    this.updateTable ();
  }

  /*
    Accepts one integer, page, and updates the
    table so that it shows results starting on
    the given page.
  */
  Feature.prototype.setPage = function (page) {
    this._currentPage = page;
    this.updateTable ();
  }

  /*
    Accepts one string, query, that represents
    a filter query; and filters this table
    using query.
  */
  Feature.prototype.setQuery = function (query) {
    this._query = query;
    this.updateTable ();
  }

  /*
    Accepts no arguments and initializes the
    table body element.
  */
  Feature.prototype.initTableBodyElement = function () {
    this.getTableBodyElement ()
      .append (this.getTableRows ());
  }

  /*
    Accepts no arguments and updates the table
    rows.
  */
  Feature.prototype.updateTable = function () {
    if (this.getCurrentPage () >= this.getNumPages ()) {
      this._currentPage = 0;
    }

    this.getTableBodyElement ()
      .empty ()
      .append (this.getTableRows ());

    this.updatePaginationElement ();
  }

  /*
    Accepts no arguments and returns the set
    of table rows that should be displayed in
    the table.
  */
  Feature.prototype.getTableRows = function () {
    var index = this.getCurrentPage () * this.getNum ();
    this._categories = filterLaborCategories (this.getVehicle (), this.getQuery ());
    return createTableRows (this.getCategories ().slice (index, index + this.getNum ()), this.getLocation ());
  }

  /*
    Accepts two arguments:

    * vehicle, an integer that represents a
      contract vehicle node ID
    * and query, a string that represents a
      filter query

    and returns an array listing the labor
    categories that have the given contract
    vehicle and match query.
  */
  function filterLaborCategories (vehicle, query) {
    return LaborCategories.filter (function (laborCategory) {
      if (laborCategory.vehicle !== vehicle) { return false; }
      if (!query) { return true; }
      var regexp = new RegExp (query, 'ig');
      return regexp.test (laborCategory.name);
    });
  }

  /*
    Accepts two arguments:

    * laborCategories, an array of Labor
      Categories to render
    * onsite, a boolean value that indicates
      whether or not onsite or offsite rates
      should be used

    and returns an array of jQuery HTML Elements
    that represent each labor category as a
    table row.
  */
  function createTableRows (laborCategories, onsite) {
    return laborCategories.map (function (laborCategory) {
      return createTableRow (laborCategory, onsite);
    });
  }

  /*
    Accepts two arguments:

    * laborCategory, a labor category node ID
    * onsite, a boolean

    and returns a jQuery HTML Element that
    represents a table row listing the rates
    for the given labor category.
  */
  function createTableRow (laborCategory, onsite) {
    return $('<tr></tr>')
      .addClass (getTableBodyRowClassName ())
      .append ($('<td></td>')
        .addClass (getTableBodyRowDescriptionFieldClassName ())
        .text (laborCategory.name))
      .append (getCategoryRates (laborCategory.id, onsite).map (function (laborRate) {
          return createRateField (laborRate.rate);
        }))
  }

  /*
    Accepts one argument: rate, a string that
    represents a labor rate; and returns a jQuery
    HTML element that represents the rate as a
    table field.
  */
  function createRateField (rate) {
    return $('<td></td>')
      .addClass (getTableBodyRowRateFieldClassName ())
      .text (rate);
  }

  /*
    Accepts two arguments:
 
    * laborCategory, an integer that represents
      a Labor Category node id
    * onsite, a boolean value that indicates
      whether or not onsite or offsite labor
      rates should be used.

    and returns those labor rates that are
    associated with the given labor category
    and apply to the given location as an array
    of Labor Rate objects.
  */
  function getLaborRatesByCategoryAndLocation (laborCategory, onsite) {
    return LaborRates.filter (function (laborRate) {
      return laborRate.category === laborCategory &&
             laborRate.onsite === onsite;
    }); 
  }

  /*
    Accepts no arguments and initializes the
    pagination element.
  */
  Feature.prototype.initPaginationElement = function () {
    var self = this;
    this.getPaginationFirstElement ().click (function () {
      self.setPage (0);
    });
    this.getPaginationPrevElement ().click (function () {
      self.setPage (Math.max (self.getCurrentPage () - 1, 0));
    });
    this.getPaginationLinksElement ()
      .append (this.createPaginationLinks ());
    this.getPaginationNextElement ().click (function () {
      self.setPage (Math.min (self.getCurrentPage () + 1, self.getNumPages () - 1));
    });
    this.getPaginationLastElement ().click (function () {
      self.setPage (self.getNumPages () - 1);
    });
  }

  /*
    Accepts no arguments and updates the
    pagination links.
  */
  Feature.prototype.updatePaginationElement = function () {
    this.getPaginationLinksElement ()
      .empty ()
      .append (this.createPaginationLinks ());
  }

  /*
    Accepts no arguments and returns an array
    of jQuery HTML Elements that represents
    pagination link elements.
  */
  Feature.prototype.createPaginationLinks = function () {
    var linkElements = [];
    var numPages = this.getNumPages ();
    for (var page = 0; page < numPages; page ++) {
      linkElements.push (this.createPaginationLink (page));
    }
    return linkElements;
  }

  /*
    Accepts no arguments and returns the number
    of pages that should be displayed.
  */
  Feature.prototype.getNumPages = function () {
    return Math.ceil (this.getCategories ().length / this.getNum ());
  }

  /*
    Accepts an integer, page, that represents
    a page index, and returns a jQuery HTML
    Element that represents a pagination link
    element linked to the give page.
  */
  Feature.prototype.createPaginationLink = function (page) {
    var self = this;
    return $('<div></div>')
      .attr (getPageAttribName (), page)
      .addClass (getPaginationLinkClassName ())
      .text (page)
      .click (function () {
          self.setPage (page);
        });
  }

  /*
    Accepts no arguments and returns the
    pagination first element.
  */
  Feature.prototype.getPaginationFirstElement = function () {
    return $('.' + getPaginationFirstClassName (), this.getFeatureElement ());
  }

  /*
    Accepts no arguments and returns the
    pagination previous element.
  */
  Feature.prototype.getPaginationPrevElement = function () {
    return $('.' + getPaginationPrevClassName (), this.getFeatureElement ());
  }

  /*
    Accepts no arguments and returns the
    pagination next element.
  */
  Feature.prototype.getPaginationNextElement = function () {
    return $('.' + getPaginationNextClassName (), this.getFeatureElement ());
  }

  /*
    Accepts no arguments and returns the
    pagination last element.
  */
  Feature.prototype.getPaginationLastElement = function () {
    return $('.' + getPaginationLastClassName (), this.getFeatureElement ());
  }
 
  /*
    Accepts no arguments and returns the
    pagination links element.
  */
  Feature.prototype._getPaginationLinksElement = function () {
    return $('.' + getPaginationLinksClassName (), this.getFeatureElement ());
  }

  /*
    Accepts no arguments and returns the num
    element.
  */
  Feature.prototype._getNumElement = function () {
    return $('.' + getNumClassName (), this.getFeatureElement ());
  }

  /*
    Accepts one argument: numItemElement, a
    jQuery HTML Element that represents a num
    item element; and returns the value of its
    num attribute.
  */
  function getNumItemAttrib (numItemElement) {
    return parseInt (numItemElement.attr (getNumAttribName ()));
  }

  /*
    Accepts no arguments and returns the num
    item elements.
  */
  Feature.prototype.getNumItemElements = function () {
    return $('.' + getNumItemClassName (), this.getNumElement ());
  }

  /*
    Accepts no arguments and returns the offsite
    tab element.
  */
  Feature.prototype._getOffsiteTabElement = function () {
    return $('.' + getOffsiteTabClassName (), this.getFeatureElement ());
  }

  /*
    Accepts no arguments and returns the onsite
    tab element.
  */
  Feature.prototype._getOnsiteTabElement = function () {
    return $('.' + getOnsiteTabClassName (), this.getFeatureElement ());
  }

  /*
    Accepts no arguments and returns the filter
    input element.
  */
  Feature.prototype._getFilterInputElement = function () {
    return $('.' + getFilterInputClassName (), this.getFeatureElement ());
  }

  /*
    Accepts no arguments and returs the table
    body element.
  */
  Feature.prototype._getTableBodyElement = function () {
    return $('.' + getTableBodyClassName (), this.getFeatureElement ());
  }

  // Represents the num data attribute.
  function getNumAttribName () { return getFeatureDataPrefix () + '-num'; }

  // Represents the num item class name.
  function getNumItemClassName () { return 'rate_table_num_item'; }

  // Represents the num class name.
  function getNumClassName () { return 'rate_table_num'; }

  // Represents the table body row description field class name.
  function getTableBodyRowDescriptionFieldClassName () { return getTableBodyRowClassName () + '_description_field'; }

  // Represents the table body row rate field class name.
  function getTableBodyRowRateFieldClassName () { return getTableBodyRowClassName () + '_rate_field'; }

  // Represents the table body row element class name.
  function getTableBodyRowClassName () { return getTableBodyClassName () + '_row'; }

  // Returns the pagination link page attribute name.
  function getPageAttribName () { return getFeatureDataPrefix () + '-page'; }
 
  // Returns the filter input element class name.
  function getFilterInputClassName () { return 'rate_table_filter_input'; }

  // Returns the pagination first element class name.
  function getPaginationFirstClassName () { return 'rate_table_pagination_first'; }

  // Returns the pagination previous element class name.
  function getPaginationPrevClassName () { return 'rate_table_pagination_prev'; }

  // Returns the pagination next element class name.
  function getPaginationNextClassName () { return 'rate_table_pagination_next'; }

  // Returns the pagination last element class name.
  function getPaginationLastClassName () { return 'rate_table_pagination_last'; }

  // Represents the pagination link class name.
  function getPaginationLinkClassName () { return 'rate_table_pagination_link'; }

  // Represents the pagination element class name.
  function getPaginationLinksClassName () { return 'rate_table_pagination_links'; }

  // Represents the offsite tab element class name.
  function getOffsiteTabClassName () { return 'rate_table_header_tab_elucid'; }

  // Represents the onsite tab element class name.
  function getOnsiteTabClassName () { return 'rate_table_header_tab_onsite'; }

  // Represents the table body element class name.
  function getTableBodyClassName () { return 'rate_table_table_body'; }

  // Returns the contract vehichle data attribute name.
  function getVehicleAttribName () { return 'data-rate-table-vehicle-nid'; }

  // Represents the data attribute prefix used by all data attributes.
  function getFeatureDataPrefix () { return 'data-rate-table'; }

}) (jQuery);
