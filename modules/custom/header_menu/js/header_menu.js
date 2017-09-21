/*
  This module defines the behavior of dropdown
  header menus.

  This module renders exiting Drupal menus as
  dropdowns with mobile slide menus.
*/
(function ($) {

  // I. INITIALIZATION.

  /*
    Creates the widescreen and mobile menu
    elements and adds them to the view container
    elements.
  */
  $(document).ready (function () {
    getDrupalMenuElements ().each (
      function (i, _drupalMenuListElement) {
        var drupalMenuListElement = $(_drupalMenuListElement);

        // Create the dropdown menu component.
        var menu = new Menu (createMenuListElement (drupalMenuListElement));

        // Attach the dropdown menu element.
        var menuId = getMenuId (drupalMenuListElement);

        var widescreenViewContainerElement = getWidescreenViewContainerElement (menuId);
        widescreenViewContainerElement && widescreenViewContainerElement.append (menu.getWidescreenViewElement ());

        var mobileViewContainerElement = getMobileViewContainerElement (menuId);
        mobileViewContainerElement && mobileViewContainerElement.append (menu.getMobileViewElement ());

        // Initialize the dropdown menu elements.
        menu.init ();

        // BLM-specific
        copySearchIntoDropdown (menu);

        $('#header_search_toggle_button', widescreenViewContainerElement).click (function (e) {
          toggleSearch ();
        });
    });
  });

  /*
  */
  function copySearchIntoDropdown (menu) {
    var searchBlockElement = getSearchBlockElement ();
    var searchBlockInputElement = $('input[type="search"]', searchBlockElement);

    var mobileSearchBlockElement = searchBlockElement.clone ();
    var mobileSearchBlockInputElement = $('input[type="search"]', mobileSearchBlockElement);

    menu.getMobileViewSearchContainerElement ().append (mobileSearchBlockElement);

    searchBlockInputElement.change (function () {
      mobileSearchBlockInputElement.val (searchBlockInputElement.val ());
    });
    mobileSearchBlockInputElement.change (function () {
      searchBlockInputElement.val (mobileSearchBlockInputElement.val ());
    });
  }

  /*
  */
  function getWidescreenViewContainerElement (menuId) {
    return $('.' + getWidescreenViewContainerElementClassName () + '[' + getMenuIdAttribute () + '="' + menuId + '"]');
  }

  /*
  */
  function getMobileViewContainerElement (menuId) {
    return $('.' + getMobileViewContainerElementClassName () + '[' + getMenuIdAttribute () + '="' + menuId + '"]');
  }

  /*
  */
  function getWidescreenViewContainerElementClassName () {
    return getWidescreenViewElementClassName () + '_container';
  }

  /*
  */
  function getMobileViewContainerElementClassName () {
    return getMobileViewElementClassName () + '_container';
  }

  /*
  */
  function getMenuId (menuListElement) {
    return $(menuListElement).attr (getMenuIdAttribute ());
  }

  /*
  */
  function getMenuIdAttribute () {
    return getModuleAttributePrefix () + '-menu-id';
  }

  // II. THE MENU COMPONENT

  /*
  */
  function Menu (menuListElement) {
    this._widescreenView  = new WidescreenView (menuListElement);
    this._mobileView      = new MobileView (menuListElement);
  }

  /*
  */
  Menu.prototype.getWidescreenView = function () { return this._widescreenView; }

  /*
  */
  Menu.prototype.getMobileView = function () { return this._mobileView; }

  /*
  */
  Menu.prototype.init = function () {
    var self = this;
    this.getWidescreenView ().init();
  }

  /*
  */
  Menu.prototype.showWidescreenView = function () {
    this.getWidescreenView ().show ();
    this.getMobileView ().hide ();
  }

  /*
  */
  Menu.prototype.showMobileView = function () {
    this.getWidescreenView ().hide ();
    this.getMobileView ().show ();
  }

  /*
  */
  Menu.prototype.getWidescreenViewElement = function () {
    return this.getWidescreenView ().getElement ();
  }

  /*
  */
  Menu.prototype.getMobileViewElement = function () {
    return this.getMobileView ().getElement ();
  }

  /*
  */
  Menu.prototype.getMobileViewSearchContainerElement = function () {
    return this.getMobileView ().getSearchContainerElement ();
  }

  // III. THE WIDESCREEN VIEW COMPONENT

  //
  var WIDESCREEN_VIEW_DEFAULT = 0;
  var WIDESCREEN_VIEW_EXPANDED = 1;

  /*
  */
  function WidescreenView (menuListElement) {
    this._state                      = WIDESCREEN_VIEW_DEFAULT;
    this._menuListElement            = this._createWidescreenMenuListElement (menuListElement);
    this._menuComponentElement       = this._createMenuComponentElement ();
    this._dropdowns                  = this._createMenuListDropdowns (menuListElement);
    this._dropdownComponentElement   = this._createDropdownComponentElement ();
    this._element                    = this._createElement ();
  }

  /*
  */
  WidescreenView.prototype.getState = function () { return this._state; }

  /*
  */
  WidescreenView.prototype.getIndex = function () { return this._index; }

  /*
  */
  WidescreenView.prototype.getMenuListElement = function () { return this._menuListElement; }

  /*
  */
  WidescreenView.prototype.getMenuComponentElement = function () { return this._menuComponentElement; }

  /*
  */
  WidescreenView.prototype.getDropdowns = function () { return this._dropdowns; }

  /*
  */
  WidescreenView.prototype.getDropdownComponentElement = function () { return this._dropdownComponentElement; }

  /*
  */
  WidescreenView.prototype.getElement = function () { return this._element; }

  /*
  */
  WidescreenView.prototype.init = function () {
    this.initDropdowns ();
  }

  /*
  */
  WidescreenView.prototype.show = function () {
    this.getMenuComponentElement ().show ();
    this.getDropdownComponentElement ().show ();
  }

  /*
  */
  WidescreenView.prototype.hide = function () {
    this.getMenuComponentElement ().hide ();
    this.getDropdownComponentElement ().hide ();
  }

  /*
  */
  WidescreenView.prototype.getMenuItemElement = function (index) {
    return getMenuListItemElement (this.getMenuListElement (), index);
  }

  /*
  */
  WidescreenView.prototype._createElement = function () {
    return $('<div></div>')
      .addClass (getWidescreenViewElementClassName ())
      .append (this.getMenuComponentElement ())
      .append (this.getDropdownComponentElement ());
  }

  /*
  */
  WidescreenView.prototype._createMenuComponentElement = function () {
    return $('<div></div>')
      .addClass (getWidescreenViewMenuComponentElementClassName ())
      .append (this.getMenuListElement ());
  }

  /*
  */
  WidescreenView.prototype._createWidescreenMenuListElement = function (menuListElement) {
    var self = this;
    var widescreenMenuListElement = menuListElement.clone ();
    
    getMenuListItemElements (widescreenMenuListElement).each (
      function (i, _menuItemElement) {
        var menuItemElement = $(_menuItemElement);

        menuItemElement.mouseover (
          function () {
            var index = getMenuItemIndex (menuItemElement);
            self.showDropdown (index);
            var dropdown = self.getDropdown (index);
            if (dropdown) { dropdown.lastMouseoverEventTimestamp = Date.now (); }
        });
        menuItemElement.mouseleave (
          function () {
            var index = getMenuItemIndex (menuItemElement);
            var dropdown = self.getDropdown (index);
            if (dropdown) { dropdown.lastMouseleaveEventTimestamp = Date.now (); }
        });

        var linkElement = getMenuItemLink (menuItemElement);
        linkElement.html (linkElement.html ());

        if (getMenuItemListElement (menuItemElement).length) {
          // disable top level link elements:
          linkElement.removeAttr ('href');
        }
    });
    return widescreenMenuListElement;
  }

  /*
  */
  WidescreenView.prototype._createDropdownComponentElement = function () {
    return $('<div></div>')
      .addClass (getWidescreenViewDropdownComponentElementClassName ())
      .append (this.getDropdownElements ());
  }

  /*
  */
  WidescreenView.prototype.initDropdowns = function () {
    this.getDropdowns ().forEach (
      function (dropdown) {
        dropdown.init ();
    });
  }

  /*
  */
  WidescreenView.prototype.showDropdown = function (parentIndex) {
    this.hideDropdowns ();
    var dropdown = this.getDropdown (parentIndex);
    dropdown && dropdown.show ();
  }

  /*
  */
  WidescreenView.prototype.hideDropdowns = function () {
    this.getDropdowns ().forEach (
      function (dropdown) {
        dropdown.hide ();
    });
  }

  /*
  */
  WidescreenView.prototype.getDropdown = function (parentIndex) {
    return _.find (this.getDropdowns (),
      function (dropdown) {
        return dropdown.getParentIndex () === parentIndex;
    });
  }

  /*
  */
  WidescreenView.prototype.getDropdownElements = function () {
    return this.getDropdowns ().map (
      function (dropdown) {
        return dropdown.getElement ();
    });
  }

  /*
  */
  WidescreenView.prototype._createMenuListDropdowns = function (menuListElement) {
    var self = this;
    var dropdowns = [];
    getMenuListItemElements (menuListElement).map (
      function (i, _menuItemElement) {
        var menuItemElement = $(_menuItemElement);
        var menuListElement = getMenuItemListElement (menuItemElement);
        if (menuListElement.length > 0) {
          dropdowns.push (new WidescreenViewDropdown (self, menuListElement));
        }
    });
    return dropdowns;
  }

  /*
  */
  function getWidescreenViewElementClassName () {
    return getModuleClassPrefix () + '_widescreen_view';
  }

  /*
  */
  function getWidescreenViewMenuComponentElementClassName () {
    return getWidescreenViewElementClassName () + '_menu_component';
  }

  /*
  */
  function getWidescreenViewDropdownComponentElementClassName () {
    return getWidescreenViewElementClassName () + '_dropdown_component';
  }

  // IV. THE WIDESCREEN VIEW DROPDOWN INTERFACE

  /*
  */
  function WidescreenViewDropdown (view, menuListElement) {
    this._view = view;
    this.lastMouseoverEventTimestamp = 0;
    this.lastMouseleaveEventTimestamp = 0;
    this.menuListElement = menuListElement;
    this._parentIndex = getMenuListParentIndex (menuListElement);
    this._element = this._createElement (menuListElement);
  }

  /*
  */
  WidescreenViewDropdown.prototype.getView = function () { return this._view; }

  /*
  */
  WidescreenViewDropdown.prototype.getParentIndex = function () { return this._parentIndex; }

  /*
  */
  WidescreenViewDropdown.prototype.getElement = function () { return this._element; }

  /*
  */
  WidescreenViewDropdown.prototype.init = function () {
    var self = this;
    var delay = 2000;
    window.setInterval (function () {
      self.lastMouseleaveEventTimestamp > self.lastMouseoverEventTimestamp && self.hide ();
    }, delay);
  }

  /*
  */
  WidescreenViewDropdown.prototype.show = function () {
    this.positionElement ();
    this.getElement ().show ();
    selectMenuItem (this.getParentMenuItemElement ());
  }

  /*
  */
  WidescreenViewDropdown.prototype.hide = function () {
    this.getElement ().hide ();
    deselectMenuItem (this.getParentMenuItemElement ());
  }

  /*
  */
  WidescreenViewDropdown.prototype._createElement = function (menuListElement) {
    var self = this;
    return menuListElement.clone ()
      .prepend ($('<div></div>')
        .addClass (getWidescreenViewElementClassName () + '_dropdown_arrow'))
      .hide ()
      .mouseover (function (event) {
        self.lastMouseoverEventTimestamp = Date.now ();
      })
      .mouseleave (function (event) {
        self.lastMouseleaveEventTimestamp = Date.now ();
      });
  }

  /*
    Dynamically calculates the position of this
    dropdown element with respect to its parent
    menu item and dropdown container element.

    Note: this function assumes that the dropdown
    element is absolutely positioned with respect
    to its dropdown container element.
  */
  WidescreenViewDropdown.prototype.positionElement = function () {
    var elementWidth = this.getElement ().width ();
    var menuComponentElement = this.getView ().getMenuComponentElement ();
    var parentElement = this.getParentMenuItemElement ();
    var parentElementOffset = parentElement.offset ().left;
    var dropdownComponentElement = this.getView ().getDropdownComponentElement ();
    var dropdownComponentElementOffset = dropdownComponentElement.offset ().left;
    var offset = parentElementOffset - dropdownComponentElementOffset;
    var remainingWidth = $(document).width () - offset;

    this.getElement ().css ('left',
      (remainingWidth < (elementWidth / 2) ?
        offset - ((elementWidth / 2) - remainingWidth) :
        offset) -
      (elementWidth / 2)
    );
  }

  /*
  */
  WidescreenViewDropdown.prototype.getParentMenuItemElement = function () {
    return this.getView ().getMenuItemElement (this.getParentIndex ());
  }

  // V. THE MOBILE VIEW COMPONENT

  //
  var MOBILE_VIEW_DEFAULT  = 0;
  var MOBILE_VIEW_EXPANDED = 1;

  /*
  */
  function MobileView (menuListElement) {
    this._state                  = MOBILE_VIEW_DEFAULT;
    this._index                  = 0;
    this._menuListElement        = menuListElement;
    this._slides                 = this._createSlides ();
    this._searchContainerElement = this._createSearchContainerElement ();
    this._slideContainerElement  = this._createSlideContainerElement ();
    this._collapsibleElement     = this._createCollapsibleElement ();
    this._element                = this._createElement ();
  }

  /*
  */
  MobileView.prototype.getState = function () { return this._state; }

  /*
  */
  MobileView.prototype.getIndex = function () { return this._index; }

  /*
  */
  MobileView.prototype.getMenuListElement = function () { return this._menuListElement; }

  /*
  */
  MobileView.prototype.getSlides = function () { return this._slides; }

  /*
  */
  MobileView.prototype.getSearchContainerElement = function () { return this._searchContainerElement; }

  /*
  */
  MobileView.prototype.getSlideContainerElement = function () { return this._slideContainerElement; }

  /*
  */
  MobileView.prototype.getCollapsibleElement = function () { return this._collapsibleElement; }

  /*
  */
  MobileView.prototype.getElement = function () { return this._element; }

  /*
  */
  MobileView.prototype.slideTo = function (index) {
    var currentIndex = this.getIndex ();
    if (currentIndex === index) { return; }

    var currentSlide = this.getSlide (currentIndex);
    var nextSlide = this.getSlide (index);
    this._index = index;

    if (currentIndex < index) {
      currentSlide.slideOutToLeft ();
      nextSlide.slideInFromRight ();
    } else if (currentIndex > index) {
      currentSlide.slideOutToRight ();
      nextSlide.slideInFromLeft ();
    }
    this.updateHeight ();
  }

  /*
  */
  MobileView.prototype.toggle = function () {
    switch (this.getState ()) {
      case MOBILE_VIEW_EXPANDED:
        this.collapse ();
        break;
      case MOBILE_VIEW_DEFAULT:
        this.show ();
        this.expand ();
        break;
      default:
        console.log('[achp_theme][MobileView.toggle] Warning: unrecognized header menu state "' + this.getState () + '".');
    }
  }

  /*
  */
  MobileView.prototype.show = function () {
    this.hideSlides ();
    this.getSlide (this.getIndex ()).show ();
    this.getElement ().show ();
  }

  /*
  */
  MobileView.prototype.hide = function () {
    this.getElement ().hide ();
    this.hideSlides ();
  }

  /*
  */
  MobileView.prototype.hideSlides = function () {
    this.getSlides ().map (function (slide) {
      slide.hide ();
    });
  }

  /*
  */
  MobileView.prototype.collapse = function () {
    this._state = MOBILE_VIEW_DEFAULT;
    this.getCollapsibleElement ().slideUp ();
  }

  /*
  */
  MobileView.prototype.expand = function () {
    this._state = MOBILE_VIEW_EXPANDED;
    this.getCollapsibleElement ().slideDown ();
    this.updateHeight ();
  }

  /*
  */
  MobileView.prototype.updateHeight = function () {
    this.getSlideContainerElement ().animate ({height: this.getSlide (this.getIndex ()).getElement ().height ()});
  }

  /*
  */
  MobileView.prototype._createElement = function () {
    return $('<div></div>')
      .addClass (getMobileViewElementClassName ())
      .append ($('<div></div>')
        .addClass (getMobileViewElementClassName () + '_header')
        .append ($('<h3></h3>')
          .addClass (getMobileViewElementClassName () + '_title')
          .text ('MENU'))
        .click (_.bind (this.toggle, this)))
      .append (this.getCollapsibleElement ());
  }

  /*
  */
  MobileView.prototype._createCollapsibleElement = function () {
    return $('<div></div>')
        .addClass (getMobileViewElementClassName () + '_collapsible')
        .append (this.getSearchContainerElement ())
        .append ($('<div></div>')
          .addClass (getMobileViewElementClassName () + '_body')
          .append (this.getSlideContainerElement ()))
        .append ($('<div></div>')
          .addClass (getMobileViewElementClassName () + '_footer')
          .append ($('<div></div>')
            .addClass (getMobileViewElementClassName () + '_close_button')
            .text ('CLOSE')
            .click (_.bind (this.collapse, this))));
  }

  /*
  */
  MobileView.prototype._createSlideContainerElement = function () {
    return $('<div></div>')
      .addClass (getMobileViewElementClassName () + '_slide_container')
      .append (this.getSlideElements ());
  }

  /*
  */
  MobileView.prototype._createSearchContainerElement = function () {
    return $('<div></div>')
      .addClass (getMobileViewElementClassName () + '_search');
  }

  /*
  */
  function getMobileViewElementClassName () {
    return getModuleClassPrefix () + '_mobile_view';
  }

  /*
  */
  MobileView.prototype.getSlideElements = function () {
    return this.getSlides ().map (
      function (slide) {
        return slide.getElement ();
    });
  }

  /*
  */
  MobileView.prototype.getSlide = function (index) {
    return _.find (this.getSlides (),
      function (slide) {
        return slide.getIndex () == index;
    });
  }

  /*
  */
  MobileView.prototype._createSlides = function () {
    var slides = this._createMenuListSlides (this.getMenuListElement ());
    slides.unshift (this._createFirstSlide ());
    return slides;
  }

  /*
  */
  MobileView.prototype._createFirstSlide = function () {
    var slide = new MobileViewSlide (this, 0, null, null,
      this._createMenuListSlideItemElements (this.getMenuListElement ()));

    appendExtraMenuItems (slide.getElement ());

    return slide;
  }

  /*
    Accepts one argument: slide, an object
    representing a single menu screen; attaches
    additional list items to the screen; and
    returns undefined.
  */
  function appendExtraMenuItems(slide) {
    slide = $(slide);
    slide.find('.header_menu_mobile_view_slide_body')
         .append($('<ul></ul>')
           .addClass('menu_slide_extras')
           .append ($('<li></li>')
             .addClass ('menu_slide_extra_item')
             .html (drupalSettings.user.uid === 0 ?
               ('<a class="header_menu_sign_in_link" href="/user/login">SIGN IN</a>') :
               ('<a class="header_menu_sign_out_link" href="/user/logout">SIGN OUT</a>')
             ))
          );
  }

  /*
  */
  MobileView.prototype._createMenuListSlides = function (menuListElement) {
    var self = this;
    var slides = [];
    getMenuListItemElements (menuListElement).each (
      function (i, menuItemElement) {
        var menuItemSlides = self._createMenuItemSlides ($(menuItemElement));
        Array.prototype.push.apply (slides, menuItemSlides);
    });
    return slides;
  }

  /*
  */
  MobileView.prototype._createMenuItemSlides = function (menuItemElement) {
    var menuListElement = getMenuItemListElement (menuItemElement);
    var slides = this._createMenuListSlides (menuListElement);
    slides.unshift (new MobileViewSlide (this,
      getMenuItemIndex (menuItemElement),
      getMenuItemParentIndex (menuItemElement),
      getMenuItemLabel (menuItemElement),
      this._createMenuListSlideItemElements (menuListElement)));
    return slides;      
  }

  /*
  */
  MobileView.prototype._createMenuListSlideItemElements = function (menuListElement) {
    return this._createMenuItemSlideItemElements (getMenuListItemElements (menuListElement));
  }

  /*
  */
  MobileView.prototype._createMenuItemSlideItemElements = function (menuItemElements) {
    var self = this;
    return menuItemElements.map (
      function (i, menuItemElement) {
        return self._createMenuItemSlideItemElement ($(menuItemElement));
    }).toArray ();
  }

  /*
  */
  MobileView.prototype._createMenuItemSlideItemElement = function (menuItemElement) {
    return getMenuItemListElement (menuItemElement).length === 0 ?
      createMobileViewSlideLinkItemElement (getMenuItemLink (menuItemElement).clone ()):
      createMobileViewSlideLabelItemElement (
        getMenuItemLabel (menuItemElement),
        this, 
        getMenuItemIndex (menuItemElement));
  }

  /*
  */
  function createMobileViewSlideLabelItemElement (label, view, index) {
    return $('<li></li>')
      .addClass (getMobileViewSlideItemClassName ())
      .text (label)
      .click (function () {
        view.slideTo (index);
      });
  }

  /*
  */
  function createMobileViewSlideLinkItemElement (linkElement) {
    return $('<li></li>')
      .addClass (getMobileViewSlideItemClassName ())
      .append (linkElement);
  }

  // VI. THE MOBILE VIEW SLIDE INTERFACE

  /*
  */
  function MobileViewSlide (view, index, parentIndex, title, slideItemElements) {
    this._view        = view;
    this._index       = index;
    this._parentIndex = parentIndex;
    this._element     = this._createElement (title, slideItemElements);
  }

  /*
  */
  MobileViewSlide.prototype.getView = function () { return this._view; }

  /*
  */
  MobileViewSlide.prototype.getIndex = function () { return this._index; }

  /*
  */
  MobileViewSlide.prototype.getParentIndex = function () { return this._parentIndex; }

  /*
  */
  MobileViewSlide.prototype.getElement = function () { return this._element; }

  /*
  */
  MobileViewSlide.prototype._createElement = function (title, itemElements) {
    var self = this;
    var parentIndex = self.getParentIndex ();
    return $('<div></div>')
      .addClass (getMobileViewSlideElementClassName ())
      .attr (getMobileViewSlideIndexAttribute (), this.getIndex ())
      .append ($('<div></div>')
        .addClass (getMobileViewSlideElementClassName () + '_header')
        .append (parentIndex === null ? null :
          $('<div></div>')
            .addClass (getMobileViewSlideElementClassName () + '_back_button')
            .text ('BACK')
            .click (function () {
              self.getView ().slideTo (parentIndex);
            }))
        .append (title === null ? null : 
          $('<div></div>')
            .addClass (getMobileViewSlideElementClassName () + '_header_title')
            .append ($('<h3></h3>')
              .text (title))))
      .append ($('<div></div>')
        .addClass (getMobileViewSlideElementClassName () + '_body')
        .append ($('<ul></ul>')
          .addClass (getMobileViewSlideElementClassName () + '_body_items')
          .append (itemElements)))
      .append ($('<div></div>')
        .addClass (getMobileViewSlideElementClassName () + '_footer'));
  } 

  /*
  */
  MobileViewSlide.prototype.show = function () {
    this.getElement ().show ();
  }

  /*
  */
  MobileViewSlide.prototype.hide = function () {
    this.getElement ().hide ();
  }

  /*
  */
  MobileViewSlide.prototype.slideInFromLeft = function () {
    this.getElement ()
      .css ('right', '100vw')
      .delay (0) /* This seems to fix a Safari bug */
      .animate ({right: '0', left: '0'}, 250, 'linear')
      .show ();
  }

  /*
  */
  MobileViewSlide.prototype.slideInFromRight = function () {
    this.getElement ()
      .css ('left', '100vw')
      .delay (0) /* This seems to fix a Safari bug */
      .animate ({left: '0', right: '0'}, 250, 'linear')
      .show ();
  }

  /*
  */
  MobileViewSlide.prototype.slideOutToLeft = function () {
    this.getElement ().animate ({left: '-100vw'}, 250, 'linear');
  }

  /*
  */
  MobileViewSlide.prototype.slideOutToRight = function () {
    this.getElement ().animate ({left: '100vw'}, 250, 'linear');
  } 

  /*
  */
  function getMobileViewSlideIndexAttribute () {
    return getMobileViewSlideAttributePrefix () + '-index';
  }

  /*
  */
  function getMobileViewSlideAttributePrefix () {
    return getModuleAttributePrefix () + '-mobile-view-slide';
  }

  /*
  */
  function getMobileViewSlideItemClassName () {
    return getMobileViewSlideElementClassName () + '_item';
  }

  /*
  */
  function getMobileViewSlideElementClassName () {
    return getMobileViewElementClassName () + '_slide';
  }

  // VII. THE MENU LIST ELEMENT INTERFACE

  /*
  */
  function createMenuListElement (drupalMenuListElement) {
    var menuListElement = drupalMenuListElement.clone ();
    menuListElement.removeClass (getDrupalMenuElementClassName ());
    initMenuListElement (0, menuListElement);
    return menuListElement;
  }

  /* 
    Accepts two arguments:

    * menuListItemIndex, an integer
    * and menuListElement, a jQuery HTML
      Element that represents a Drupal list of
      menu items.

    If menuListElement is a nested list,
    menuListItemIndex is the index of
    menuListElement's parent. Otherwise
    menuListItemIndex should equal -1.

    Assigns a menu item index attribute to each
    list item in menuListElement, starting with
    menuListItemIndex; and returns an integer
    that represents the next available menu item
    index value.
  */
  function initMenuListElement (menuListItemIndex, menuListElement) {
    var parentIndex = menuListItemIndex;
    var nestedListItems = getMenuListItemElements (menuListElement);
    menuListElement
      .addClass (getMenuListClassName ())
      .attr (getMenuListParentIndexAttribute (), parentIndex)
      .attr (getMenuListNumChildrenAttribute (), nestedListItems.length);
    nestedListItems.each (function (i, menuListItem) {
      var nestedList = $('>ul', menuListItem);
      var numChildren = $('>li', nestedList).length;
      $(menuListItem)
        .addClass (getMenuItemClassName ())
        .attr (getMenuItemIndexAttribute (), ++menuListItemIndex)
        .attr (getMenuItemLocalIndexAttribute (), i)
        .attr (getMenuItemParentIndexAttribute (), parentIndex)
        .attr (getMenuItemNumChildrenAttribute (), numChildren);
      menuListItemIndex = initMenuListElement (menuListItemIndex, nestedList);
    });
    return menuListItemIndex;
  }

  /*
    Accepts two arguments:

    * menuListElement, a jQuery HTML Element
      that represents a Drupal list of menu items
    * and itemIndex, an integer that represents
      a menu item index

    and returns a jQuery HTML Set that represents
    the menu list items in menuListElement that
    have itemIndex.

    Note: setMenuItemIndices sets the data
    attribute that this function uses on menu
    list elements.

    Note: only one menu list item should have
    a given itemIndex.
  */
  function getMenuListItemElement (menuListElement, itemIndex) {
    return $('li[' + getMenuItemIndexAttribute () + '="' + itemIndex + '"]', menuListElement);
  }

  /*
    Accepts one argument: menuList, a jQuery
    HTML Element that represents a Drupal list
    of menu items; and returns a jQuery HTML
    Set that represents menuList's item elements.
  */
  function getMenuListItemElements (menuListElement) {
    return $('>li', menuListElement);
  }

  /*
  */
  function getMenuListParentIndex (menuListElement) {
    return menuListElement.attr (getMenuListParentIndexAttribute ());
  }

  /*
  */
  function getMenuListNumChildren (menuListElement) {
    return menuListElement.attr (getMenuListNumChildrenAttribute ());
  }

  /*
  */
  function getMenuListParentIndexAttribute (){
    return getMenuListAttributePrefix () + '-parent-index';
  }

  /*
  */
  function getMenuListNumChildrenAttribute () {
    return getMenuListAttributePrefix () + '-num-children';
  }

  /*
  */
  function getMenuListAttributePrefix () {
    return getModuleAttributePrefix () + '-menu-list';
  }

  /*
  */
  function getMenuListClassName () {
    return getModuleClassPrefix () + '_menu_list';
  }

  // VIII. THE MENU ITEM ELEMENT INTERFACE

  /*
  */
  function selectMenuItem (menuItemElement) {
    menuItemElement.addClass (getSelectedMenuItemClassName ());
  }

  /*
  */
  function deselectMenuItem (menuItemElement) {
    menuItemElement.removeClass (getSelectedMenuItemClassName ());
  }

  /*
  */
  function getSelectedMenuItemClassName () {
    return getModuleClassPrefix () + '_selected';
  }

  /*
  */
  function getMenuItemLabel (menuItemElement) {
    return getMenuItemLink (menuItemElement).text ();
  }

  /*
  */
  function getMenuItemLink (menuItemElement) {
    return $('>a', menuItemElement);
  }

  /*
  */
  function getMenuItemListElement (menuItemElement) {
    return $('>ul', menuItemElement);
  }

  /*
  */
  function getMenuItemIndex (menuItemElement) {
    return menuItemElement.attr (getMenuItemIndexAttribute ());
  }

  /*
  */
  function getMenuItemLocalIndex (menuItemElement) {
    return menuItemElement.attr (getMenuItemLocalIndexAttribute ());
  }

  /*
  */
  function getMenuItemParentIndex (menuItemElement) {
    return menuItemElement.attr (getMenuItemParentIndexAttribute ());
  }

  /*
  */
  function getMenuItemNumChildren (menuItemElement) {
    return menuItemElement.attr (getMenuItemNumChildrenAttribute ());
  }

  /*
  */
  function getMenuItemIndexAttribute () {
    return getMenuItemAttributePrefix () + '-index';
  }

  /*
  */
  function getMenuItemLocalIndexAttribute () {
    return getMenuItemAttributePrefix () + '-local-index';
  }

  /*
  */
  function getMenuItemParentIndexAttribute () {
    return getMenuItemAttributePrefix () + '-parent-index';
  }

  /*
  */
  function getMenuItemNumChildrenAttribute () {
    return getMenuItemAttributePrefix () + '-num-children';
  }

  /*
  */
  function getMenuItemAttributePrefix () {
    return getModuleAttributePrefix () + '-menu-item';
  }

  /*
  */
  function getMenuItemClassName () {
    return getModuleClassPrefix () + '_menu_item';
  }

  // IX. DRUPAL MENU ELEMENT INTERFACE

  /*
  */
  function getDrupalMenuElements () {
    return $('.' + getDrupalMenuElementClassName ());
  }

  /*
  */
  function getDrupalMenuElementClassName () {
    return getModuleClassPrefix () + '_drupal_menu';
  }


  // X. AUXILIARY FUNCTIONS

  /*
  */
  function getModuleAttributePrefix () { return 'data-header-menu'; }

  /*
  */
  function getModuleClassPrefix () { return 'header_menu'; }

  // XI. BLM SPECIFIC

  // Represents the three header states.
  var SUBHEADER_DEFAULT_STATE = 0;
  var SUBHEADER_EXPANDED_STATE = 1;
  var SUBHEADER_SEARCH_STATE = 2;

  // Represents the current header state.
  var subheaderState = SUBHEADER_DEFAULT_STATE;

  /*
    Accepts no arguments, hides the header menu,
    and returns undefined.
  */
  function hideHeaderMenu () {
    $('#header_menu').hide ();
  }

  /*
    Accepts no arguments, displays the header
    menu by removing CSS added by JS, and
    returns undefined.
  */
  function showHeaderMenu () {
    $('#header_menu').removeAttr ('style');
  }

  /*
    Accepts no arguments and returns the Search
    Block element as a JQuery HTML Element.
  */
  function getSearchBlockElement () {
    return $('#block-elucid-search');
  }

  /*
    Accepts no arguments, displays the search
    header, and returns undefined.
  */
  function displaySearch () {
    if (subheaderState === SUBHEADER_DEFAULT_STATE) {
      $('#header_search_region').slideDown (150);
      $('#header_search_toggle_button').addClass ('search_dropdown_active');
      subheaderState = SUBHEADER_SEARCH_STATE;
    }
  }

  /*
    Accepts no arguments, hides the search header
    by removing the CSS attributes added by JS,
    and returns undefined.
  */
  function hideSearch () {
    if (subheaderState === SUBHEADER_SEARCH_STATE) {
      $('#header_search_region').slideUp (150,
        function () {
          $('#header_search_region').removeAttr ('style');
      });
      $('#header_search_toggle_button').removeClass ('search_dropdown_active');      
      subheaderState = SUBHEADER_DEFAULT_STATE;
    }
  }

  /*
    Accepts no arguments, displays/hides the
    subheader based on the current header state,
    and returns undefined.
  */
  function toggleSearch () {
    switch (subheaderState) {
      case SUBHEADER_DEFAULT_STATE:
        return displaySearch ();
      case SUBHEADER_SEARCH_STATE:
        return hideSearch ();
    }
  }
}) (jQuery);

