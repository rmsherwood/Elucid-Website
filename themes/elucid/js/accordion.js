/*
  This script is responsible for controlling
  accordion components.

  Accordion elements must have the following structure.

  <div class="accordion">
    <div class="accordion_item">
      <div class="accordion_item_header">
        <div class="accordion_item_header_left">Step 3.A.2</div>
        <div class="accordion_item_header_middle">
          <div class="accordion_item_title">Downloading Your Template</div>
        </div>
        <div class="accordion_item_header_right"></div>
      </div>
      <div class="accordion_item_body accordion_expanded">
        SAMPLE CONTENT
      </div>
    </div>
  </div>
*/
(function ($) {
  /*
    Initializes all of the accordion web
    components when the page loads.
  */
  $(document).ready (function () {
    initAccordions ();
  });

  /*
    Initializes all of the accordions in the
    current document.
  */
  function initAccordions () {
    getAccordionElements ().each (
      function (index, accordionElement) {
        var accordion = new Accordion (accordionElement);
        accordion.init ();
    });
  }

  /*
    Returns a jQuery Result Set listing all
    of the accordion elements in the current
    document.
  */
  function getAccordionElements () {
    return $('.' + getAccordionClass ());
  }

  /*
    Returns the name of the class used to label
    accordion component elements.
  */
  function getAccordionClass () {
    return 'accordion';
  }

  /*
    Accepts a jQuery HTML Element that represents
    an accordion component and returns an Accordion 
    class instance that controls the component.
  */
  function Accordion (accordionElement) {
    this.accordionElement = accordionElement;
  }

  // Initializes this accordion.
  Accordion.prototype.init = function () {
    return this.initItems ();
  }

  /*
    Initializes all of this accordion's item
    elements.
  */
  Accordion.prototype.initItems = function () {
    this.getItemElements ().map (
      function (index, itemElement) {
        var item = new AccordionItem ($(itemElement));
        item.init ();
    });
  }

  /*
    Returns a jQuery Result Set listing all of
    this accordion's item elements.
  */
  Accordion.prototype.getItemElements = function () {
    return $('.' + getAccordionItemClass (), this.accordionElement);
  }

  /*
    Returns the name of the class used to label
    accordion item elements.
  */
  function getAccordionItemClass () {
    return 'accordion_item';
  }

  /*
    Accepts a jQuery HTML Element that represents
    an accordion item component and returns an
    Accordion Item class instance that controls
    the component.
  */
  function AccordionItem (itemElement) {
    this.itemElement = itemElement;
  }

  // Initializes this item's element.
  AccordionItem.prototype.init = function () {
    this.isCollapsed () && this.getBody ().hide ();
    this.initHeader ();
  }

  // Initializes this item's header element.
  AccordionItem.prototype.initHeader = function () {
    var self = this;
    this.getHeader ().click (function () { self.toggle (); });
  }

  /*
    Returns true iff this item should be
    expanded.
  */
  AccordionItem.prototype.isExpanded = function () {
    return this.itemElement.hasClass (getAccordionItemExpandedClass ());
  }

  /*
    Returns true iff this item should be
    collapsed.
  */
  AccordionItem.prototype.isCollapsed = function () {
    return !this.isExpanded ();
  }

  // Expands/collapses (toggles) this item element.
  AccordionItem.prototype.toggle = function () {
    this.isExpanded () ? this.collapse () : this.expand ();
  }

  // Expands this item element.
  AccordionItem.prototype.expand = function () {
    if (this.isExpanded ()) { return; }
    this.getBody ().slideDown ();
    this.itemElement.addClass (getAccordionItemExpandedClass ());
  }

  // Collapses this item element.
  AccordionItem.prototype.collapse = function () {
    if (this.isCollapsed ()) { return; }
    this.getBody ().slideUp ();
    this.itemElement.removeClass (getAccordionItemExpandedClass ());
  }

  /*
    Returns this item's header element as a
    jQuery HTML Element.
  */
  AccordionItem.prototype.getHeader = function () {
    return $('.' + getAccordionItemHeaderClass (), this.itemElement);
  }

  /*
    Returns this item's body element as a
    jQuery HTML Element.
  */
  AccordionItem.prototype.getBody = function () {
    return $('.' + getAccordionItemBodyClass (), this.itemElement);
  }

  /*
    Returns the name of the class used to label
    expanded accordion items.
  */
  function getAccordionItemExpandedClass () {
    return 'accordion_expanded';
  }

  /*
    Returns the name of the class used to label
    accordion item body elements.
  */
  function getAccordionItemBodyClass () {
    return 'accordion_item_body';
  }

  /*
    Returns the name of the class used to label
    accordion item header elements.
  */
  function getAccordionItemHeaderClass () {
    return 'accordion_item_header';
  }
}) (jQuery);
