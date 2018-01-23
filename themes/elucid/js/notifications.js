/*
  This script is responsible for controlling
  the system notifications (messages) component.

  This script assumes that these components have
  the following structure:

  <div class="elucid-message">
    <div class="elucid-message-header">
      <div class="elucid-message-close-button">
        ...
      </div>
    </div>
    ...
  </div>
*/
(function ($) {
  /*
    Initializes all of the system notification
    components when the page loads.
  */
  $(document).ready (function () {
    initComponents ();
  });

  /*
    Initializes all of the system notification
    components.
  */
  function initComponents () {
    getComponentElements ().each (
      function (index, componentElement) {
        initComponent ($(componentElement));
    });
  }

  /*
    Accepts a jQuery HTML Element that represents
    a system notification component and
    initializes it.
  */
  function initComponent (componentElement) {
    getCloseButtonElement (componentElement).click (
      function () {
        componentElement.slideUp ();
    });
  }

  /*
    Accepts a jQuery HTML Element that represents
    a system notification component and returns
    its close button element as a jQuery
    Result Set.
  */
  function getCloseButtonElement (componentElement) {
    return $('.' + getCloseButtonClassName (), componentElement);
  }

  /*
    Returns a jQuery Result Set listing the
    system notification elements.
  */
  function getComponentElements () {
    return $('.' + getComponentClassName ());
  }
  
  /*
    Returns the name of the class used to label
    close buttons.
  */
  function getCloseButtonClassName () {
    return 'elucid-message-close-button';
  }

  /*
    Returns the name of the class used to label
    system notification elements.
  */
  function getComponentClassName () {
    return 'elucid-message';
  }
}) (jQuery);
