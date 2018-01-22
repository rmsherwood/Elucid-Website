/*
  This module initializes and controls Rate
  Table blocks
*/

(function ($) {

  /*  
    Represents the base year - i.e. the year
    represented by the first column.
  */
  var BaseYear = 2012;

  /*
    Represents the number of years displayed in
    the table.
  */
  var NumYears = 10;

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
    for (var year = 0; year <= NumYears; year ++) {
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
    return $('.' + featureClassName);
  }

  /*
    Accepts a jQuery HTML Element,
    featureElement, that represents a rate table,
    and returns its contract vehicle node ID.
  */
  function getVehicleAttrib (featureElement) {
    return parseInt (featureElement.attr (vehicleAttribName));
  }

  /*
    Returns the class name used to label Rate
    Table feature elements.
  */
  var featureClassName = 'rate_table';

  /*
  */
  var ACTIVE   = 'active';
  var INACTIVE = 'inactive';

  // 
  var activeClassName = 'rate_table_active';

  /*
    Accepts one argument: featureElement, a
    jQuery HTML Element that represents a table
    feature; and returns a Table element that
    represents the feature.
  */
  function Feature (featureElement) {
    this.categories             = [];
    this.currentPage            = 0;
    this.location               = Onsite;
    this.num                    = DefaultNum;
    this.query                  = DefaultQuery;
    this.featureElement         = featureElement;
    this.vehicle                = getVehicleAttrib (featureElement);

    this.offsiteTabElement      = this.getOffsiteTabElement ();
    this.onsiteTabElement       = this.getOnsiteTabElement ();
    this.numElement             = this.getNumElement ();
    this.numSelectElement       = this.getNumSelectElement ();
    this.filterElement          = this.getFilterElement ();
    this.filterInputElement     = this.getFilterInputElement ();
    this.tableBodyElement       = this.getTableBodyElement ();
    this.paginationLinksElement = this.getPaginationLinksElement ();
    this.indexElement           = this.getIndexElement ();
  }

  /*
    Accepts no arguments and initializes this
    feature.
  */
  Feature.prototype.init = function () {
    // I. Initialize the tab elements.
    this.initTabElements ();

    // II. Initialize the num element.
    this.initNumElement ();

    // III. Initialize the filter input element.
    this.initFilterInputElement ();

    // IV. Initialize the column header elements.
    this.initColumnHeaders ();

    // VI. Initialize the table body elements.
    this.initTableBodyElement ();

    // VII. Initialize the pagination element.
    this.initPaginationElement ();

    // VIII. Initialize the index element.
    this.updateIndexElement ();
  }

  /*
    Accepts no arguments and initializes the
    tab elements.
  */
  Feature.prototype.initTabElements = function () {
    var self = this;
    this.setOffsite ();
    this.offsiteTabElement.click (function () {
      self.setOffsite ();
    });
    this.onsiteTabElement.click (function () {
      self.setOnsite ();
    });
  }

  /*
    Accepts no arguments and initalizes the num
    item elements.
  */
  Feature.prototype.initNumElement = function () {
    var self = this;
    var selectElement = this.numSelectElement;
    selectElement.focusin (function () {
      self.addNumElementFocusClass ();
    });
    selectElement.focusout (function () {
      self.removeNumElementFocusClass ();
    });
    selectElement.change (function () {
      self.setNum (parseInt (selectElement.val ()));
    });
  }

  /*
    Accepts no arguments and initializes the
    filter input element.
  */
  Feature.prototype.initFilterInputElement = function () {
    var self = this;
    var inputElement = this.filterInputElement;
    inputElement.on ('input', function () {
      var query = inputElement.val ();
      self.setQuery (query.trim ());
    });
    this.setFilterInputElementState ();
    inputElement.focusin (function () {
      self.addFilterElementFocusClass ();
      self.activateFilterInputElement ();
    });
    inputElement.focusout (function () {
      self.removeFilterElementFocusClass ();
      self.setFilterInputElementState ();
    });
    inputElement.change (function () {
      self.setFilterInputElementState ();
    });
    inputElement.get (0).addEventListener ('invalid', function () {
      self.filterElement.addClass (invalidClassName);
    });
    inputElement.get (0).addEventListener ('valid', function () {
      self.filterElement.removeClass (invalidClassName);
    });
  }

  /*
  */
  Feature.prototype.addNumElementFocusClass = function () {
    this.numElement.addClass (focusClassName);
  }

  /*
  */
  Feature.prototype.removeNumElementFocusClass = function () {
    this.numElement.removeClass (focusClassName);
  }

  /*
  */
  Feature.prototype.addFilterElementFocusClass = function () {
    this.filterElement.addClass (focusClassName);
  }

  /*
  */
  Feature.prototype.removeFilterElementFocusClass = function () {
    this.filterElement.removeClass (focusClassName);
  }

  /*
  */
  Feature.prototype.setFilterInputElementState = function () {
    this.filterInputElement.val () ?
      this.activateFilterInputElement   ():
      this.deactivateFilterInputElement ();
  }

  /*
  */
  Feature.prototype.activateFilterInputElement = function () {
    if (this.filterInputElementState === ACTIVE) { return; }

    this.filterInputElementState = ACTIVE;
    this.filterElement.addClass (activeClassName);
  }

  /*
  */
  Feature.prototype.deactivateFilterInputElement = function () {
    if (this.filterInputElementState === INACTIVE) { return; }

    this.filterInputElementState = INACTIVE;
    this.filterElement.removeClass (activeClassName);
  }

  // Initializes the column headers.
  Feature.prototype.initColumnHeaders = function () {
    var self = this;
    this.getCurrentHeader ().addClass (activeClassName);
    this.getColumnHeaders ().each (function (index, _columnHeader) {
      var columnHeader = $(_columnHeader);
      for (var radius = getColumnRadius (index); radius >= 0; radius --) {
        columnHeader.addClass (columnHeaderRadiusClassName + '_' + radius);
      }
    });
  }

  /*
    Accepts no arguments and updates the labor
    rates so that they list onsite rates.
  */
  Feature.prototype.setOnsite = function () {
    this.location = Onsite;
    this.updateTable ();
    this.offsiteTabElement.removeClass (materialActiveClassName);
    this.onsiteTabElement.addClass (materialActiveClassName);
  }

  /*
    Accepts no arguments and updates the labor
    rates so that they list offsite rates.
  */
  Feature.prototype.setOffsite = function () {
    this.location = Offsite;
    this.updateTable ();
    this.offsiteTabElement.addClass (materialActiveClassName);
    this.onsiteTabElement.removeClass (materialActiveClassName);
  }

  /*
    Accepts one integer, num, and update the
    table so that it shows num rows.
  */
  Feature.prototype.setNum = function (num) {
    this.num = num;
    this.currentPage = 0;
    this.updateTable ();
  }

  /*
    Accepts one integer, page, and updates the
    table so that it shows results starting on
    the given page.
  */
  Feature.prototype.setPage = function (page) {
    if (this.currentPage === page) { return; }
    this.currentPage = page;
    this.updateTable ();
  }

  /*
    Accepts one string, query, that represents
    a filter query; and filters this table
    using query.
  */
  Feature.prototype.setQuery = function (query) {
    this.query = query;
    this.updateTable ();
  }

  /*
    Accepts no arguments and initializes the
    table body element.
  */
  Feature.prototype.initTableBodyElement = function () {
    this.tableBodyElement
      .append (this.getTableRows ());
  }

  /*
    Accepts no arguments and updates the table
    rows.
  */
  Feature.prototype.updateTable = function () {
    if (this.currentPage >= this.getNumPages ()) {
      this.currentPage = 0;
    }

    this.tableBodyElement
      .empty ()
      .append (this.getTableRows ());

    this.updatePaginationElement ();
    this.updateIndexElement ();
  }

  /*
    Accepts no arguments and returns the set
    of table rows that should be displayed in
    the table.
  */
  Feature.prototype.getTableRows = function () {
    var index = this.currentPage * this.num;
    this.categories = filterLaborCategories (this.vehicle, this.query);
    return createTableRows (this.categories.slice (index, index + this.num), this.location);
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
      .addClass (tableBodyRowClassName)
      .append ($('<td></td>')
        .addClass (tableBodyRowDescriptionFieldClassName)
        .text (laborCategory.name))
      .append (getCategoryRates (laborCategory.id, onsite).map (function (laborRate, index) {
          return createRateField (laborRate.rate, index);
        }))
  }

  /*
    Accepts one argument: rate, a string that
    represents a labor rate; and returns a jQuery
    HTML element that represents the rate as a
    table field.
  */
  function createRateField (rate, index) {
    var currentYear = getCurrentYear ();
    var year = index + BaseYear;
    var field = $('<td></td>')
      .addClass (tableBodyRowRateFieldClassName)
      .addClass (year === currentYear && activeClassName)
      .text (rate);

    for (var radius = getColumnRadius (index); radius >= 0; radius --) {
      field.addClass (fieldRadiusClassName + '_' + radius);
    }

    return field;
  }

  /*
    Accepts one argument, an integer that
    represents a column index; and returns
    its radius.
  */
  function getColumnRadius (index) {
    return getRadius (getCurrentYear () - BaseYear, NumYears - 1, index);
  }

  // Returns the current year.
  function getCurrentYear () { return new Date ().getFullYear (); }

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
      self.setPage (self.getPrevPage ());
    });
    this.getPaginationNextElement ().click (function () {
      self.setPage (self.getNextPage ());
    });
    this.getPaginationLastElement ().click (function () {
      self.setPage (self.getLastPage ());
    });
    this.updatePaginationElement ();
  }

  /*
    Accepts no arguments and updates the
    pagination links.
  */
  Feature.prototype.updatePaginationElement = function () {
    this.paginationLinksElement
      .empty ()
      .append (this.createPaginationLinks ());

    if (this.isFirstPage ()) {
      this.getPaginationFirstElement ().addClass (disabledClassName);
      this.getPaginationPrevElement ().addClass (disabledClassName);
    } else {
      this.getPaginationFirstElement ().removeClass (disabledClassName);
      this.getPaginationPrevElement ().removeClass (disabledClassName);
    }

    if (this.isLastPage ()) {
      this.getPaginationLastElement ().addClass (disabledClassName);
      this.getPaginationNextElement ().addClass (disabledClassName);
    } else {
      this.getPaginationLastElement ().removeClass (disabledClassName);
      this.getPaginationNextElement ().removeClass (disabledClassName);
    }

    this.updateIndexElement ();
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
    Accepts an integer, page, that represents
    a page index, and returns a jQuery HTML
    Element that represents a pagination link
    element linked to the give page.
  */
  Feature.prototype.createPaginationLink = function (page) {
    var self = this;
    return this.addPaginationRadiusClasses (page, $('<div></div>')
      .attr (pageAttribName, page)
      .addClass (paginationLinkClassName)
      .addClass (page === this.currentPage && activeClassName)
      .text (page + 1)
      .click (function () {
          self.setPage (page);
        }));
  }

  /*
    Accepts two arguments:

    * index, an integer that represents the
      pagination link index
    * linkElement, a jQuery HTML Element that
      represents a pagination link

    and adds the pagination radius class and
    data attribute names to the linkElement.
  */
  Feature.prototype.addPaginationRadiusClasses = function (index, linkElement) {
    var maxRadius = 5;
    var radius = this.getPaginationRadius (index);
    linkElement.attr (paginationRadiusAttrib, radius);
    for (; radius >= 0; radius --) {
      linkElement.addClass (paginationRadiusClassName + '_' + radius);
    }
    return linkElement;
  }

  /*
    Accepts one argument: index, an integer that
    represents a pagination link index; and returns
    the minimum bracket radius that includes the
    link at index.
  */
  Feature.prototype.getPaginationRadius = function (index) {
    return getRadius (this.currentPage, this.getLastPage (), index);
  }

  /*
    Accepts three arguments:

      * focus, an integer that represents the
        index of the highlighted element
      * max, an integer that represents the
        index of the last element
      * and index, an integer that represents the
        index of the element that we are returning
        a radius for

    and returns the minimum bracket radius that
    includes the element at index.
  */
  function getRadius (focus, max, index) {
    return index >= focus ?
      Math.min (index - focus, Math.ceil (index/2)):
      Math.min (focus - index, Math.ceil ((max - index)/2));
  }

  /*
    Accepts no arguments and updates the index
    element.
  */
  Feature.prototype.updateIndexElement = function () {
    this.indexElement.text ((this.getStartIndex () + 1) + '-' + this.getEndIndex () + ' of ' + this.getTotalNum () + ' Labor Categories');
  }

  /*
    Accepts no arguments and returns the current
    item index.
  */
  Feature.prototype.getStartIndex = function () {
    return this.currentPage * this.num;
  }

  /*
    Accepts no arguments and returns the index
    of the last item displayed in the table.
  */
  Feature.prototype.getEndIndex = function () {
    return Math.min (this.getStartIndex () + this.num, this.getTotalNum ());
  }

  /*
    Accepts no arguments and returns the number
    of pages that should be displayed.
  */
  Feature.prototype.getNumPages = function () {
    return Math.ceil (this.getTotalNum () / this.num);
  }

  /*
    Accepts no arguments and returns the total
    number of items that can be displayed in
    the table.
  */
  Feature.prototype.getTotalNum = function () {
    return this.categories.length;
  }

  /*
    Returns true iff the component is currently
    on the first page.
  */
  Feature.prototype.isFirstPage = function () {
    return this.currentPage === 0;
  }

  /*
    Returns true iff the component is the
    last page.
  */
  Feature.prototype.isLastPage = function () {
    return this.currentPage === this.getLastPage ();
  }

  // Returns the next page.
  Feature.prototype.getNextPage = function () {
    return Math.min (this.currentPage + 1, this.getLastPage ());
  }

  // Returns the prev page.
  Feature.prototype.getPrevPage = function () {
    return Math.max (this.currentPage - 1, 0);
  }

  // Returns the last page.
  Feature.prototype.getLastPage = function () {
    return this.getNumPages () - 1;
  }

  /*
    Returns the jQuery HTML Element that
    represents the current year's header.
  */
  Feature.prototype.getCurrentHeader = function () {
    return $('[data-rate-table-year="' + getCurrentYear () + '"]', this.featureElement);
  }

  /*
    Returns a jQuery HTML Element Set listing
    this table's headers.
  */
  Feature.prototype.getColumnHeaders = function () {
    return $('.' + columnHeaderClassName, this.featureElement);
  }

  /*
    Accepts no arguments and returns the
    pagination first element.
  */
  Feature.prototype.getPaginationFirstElement = function () {
    return $('.' + paginationFirstClassName, this.featureElement);
  }

  /*
    Accepts no arguments and returns the
    pagination previous element.
  */
  Feature.prototype.getPaginationPrevElement = function () {
    return $('.' + paginationPrevClassName, this.featureElement);
  }

  /*
    Accepts no arguments and returns the
    pagination next element.
  */
  Feature.prototype.getPaginationNextElement = function () {
    return $('.' + paginationNextClassName, this.featureElement);
  }

  /*
    Accepts no arguments and returns the
    pagination last element.
  */
  Feature.prototype.getPaginationLastElement = function () {
    return $('.' + paginationLastClassName, this.featureElement);
  }
 
  /*
    Accepts no arguments and returns the
    pagination links element.
  */
  Feature.prototype.getPaginationLinksElement = function () {
    return $('.' + paginationLinksClassName, this.featureElement);
  }

  /*
    Returns a jQuery Element Set listing the
    table cells.
  */
  Feature.prototype.getFieldElements = function () {
    return $('.' + fieldClassName, this.featureElement);
  }

  /*
    Accepts no arguments and returns the index
    element.
  */
  Feature.prototype.getIndexElement = function () {
    return $('.' + indexClassName, this.featureElement);
  }

  /*
    Accepts no arguments and returns the num
    select element.
  */
  Feature.prototype.getNumSelectElement = function () {
    return $('.' + numSelectClassName, this.featureElement);
  }

  /*
    Accepts no arguments and returns the num
    element.
  */
  Feature.prototype.getNumElement = function () {
    return $('.' + numClassName, this.featureElement);
  }

  /*
    Accepts one argument: numItemElement, a
    jQuery HTML Element that represents a num
    item element; and returns the value of its
    num attribute.
  */
  function getNumItemAttrib (numItemElement) {
    return parseInt (numItemElement.attr (numAttribName));
  }

  /*
    Accepts no arguments and returns the offsite
    tab element.
  */
  Feature.prototype.getOffsiteTabElement = function () {
    return $('.' + offsiteTabClassName, this.featureElement);
  }

  /*
    Accepts no arguments and returns the onsite
    tab element.
  */
  Feature.prototype.getOnsiteTabElement = function () {
    return $('.' + onsiteTabClassName, this.featureElement);
  }

  /*
    Accepts no arguments and returns the filter
    input element.
  */
  Feature.prototype.getFilterInputElement = function () {
    return $('.' + filterInputClassName, this.featureElement);
  }

  /*
  */
  Feature.prototype.getFilterElement = function () {
    return $('.' + filterClassName, this.featureElement);
  }

  /*
    Accepts no arguments and returs the table
    body element.
  */
  Feature.prototype.getTableBodyElement = function () {
    return $('.' + tableBodyClassName, this.featureElement);
  }

  // Represents the num data attribute.
  var numAttribName = 'data-rate-table-num';

  // Represents the num select class name.
  var numSelectClassName = 'rate_table_num_select_select';

  // Represents the num class name.
  var numClassName = 'rate_table_num';

  // Represents the table body element class name.
  var tableBodyClassName = 'rate_table_table_body';

  // The rate table field radius class name.
  var fieldRadiusClassName = 'rate_table_field_radius';

  // Represents the table body row element class name.
  var tableBodyRowClassName = 'rate_table_table_body_row';

  // Represents the table body row description field class name.
  var tableBodyRowDescriptionFieldClassName = 'rate_table_table_body_description_field';

  // Represents the table body row rate field class name.
  var tableBodyRowRateFieldClassName = 'rate_table_table_body_rate_field';

  // Returns the pagination link page attribute name.
  var pageAttribName = 'data-rate-table-page';
 
  // Returns the index element class name.
  var indexClassName = 'rate_table_index';

  // Returns the filter input element class name.
  var filterInputClassName = 'rate_table_filter_input';

  //
  var filterClassName = 'rate_table_filter';

  // Returns the pagination first element class name.
  var paginationFirstClassName = 'rate_table_pagination_first';

  // Returns the pagination previous element class name.
  var paginationPrevClassName = 'rate_table_pagination_prev';

  // Returns the pagination next element class name.
  var paginationNextClassName = 'rate_table_pagination_next';

  // Returns the pagination last element class name.
  var paginationLastClassName = 'rate_table_pagination_last';

  // The pagination link radius attribute name.
  var paginationRadiusAttrib = 'data-rate-pagination-link-radius';

  // The pagination link radius class name.
  var paginationRadiusClassName = 'rate_table_pagination_link_radius';

  // Represents the pagination link class name.
  var paginationLinkClassName = 'rate_table_pagination_link';

  // Represents the pagination element class name.
  var paginationLinksClassName = 'rate_table_pagination_links';

  // The column header radius class name.
  var columnHeaderRadiusClassName = 'rate_table_column_header_radius';

  // The column header class name.
  var columnHeaderClassName = 'rate_table_column_header';

  // Represents the offsite tab element class name.
  var offsiteTabClassName = 'rate_table_header_tab_elucid';

  // Represents the onsite tab element class name.
  var onsiteTabClassName = 'rate_table_header_tab_onsite';

  // Returns the active class name.
  var activeClassName = 'rate_table_active';

  // Returns the focus class name.
  var focusClassName = 'rate_table_focus';

  // Returns the Material active class name.
  var materialActiveClassName = 'mdc-tab--active';

  // Returns the disabled class name.
  var disabledClassName = 'rate_table_disabled';

  // Returns the contract vehichle data attribute name.
  var vehicleAttribName = 'data-rate-table-vehicle-nid';

  // Represents the data attribute prefix used by all data attributes.
  var featureDataPrefix = 'data-rate-table';

}) (jQuery);
