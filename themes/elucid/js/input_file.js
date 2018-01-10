/*
  Defines the interactive behavior of file input
  form elements.

  We have overrided the input file template
  so that instead of showing browse buttons,
  we show a link called "Attach". We register
  a click handler for the link that clicks the
  hidden button.
*/
(function ($) {
  
  /*
    Initialize all of the attach file links on
    page loads.
  */
  $(document).ready (function () {
    initFileElements ();
  });

  /*
    Initialize all of the attach file links
    following AJAX page loads.
  */
  Drupal.behaviors.elucid_input_file = {
    attach: function (context, settings) {
      $(document).once ('elucid_input_file').ajaxComplete (
        function (event, xhr, settings) {
          initFileElements ();
      })
    }
  };

  /*
  */
  function initFileElements () {
    getFileElements ().each (
      function (index, fileElement) {
        initFileElement ($(fileElement));
    });
  }

  /*
  */
  function initFileElement (fileElement) {
    if (isInitialized (fileElement)) { return; }

    fileElement.addClass (getInitializedClassName ());
    getLinkElement (fileElement)
      .click (function () {
        getButtonElement (fileElement).click ();
      });
  }

  /*
  */
  function isInitialized (fileElement) {
    return fileElement.hasClass (getInitializedClassName ());
  }

  /*
  */
  function getLinkElement (fileElement) {
    return $('.' + getLinkElementClassName (), fileElement); 
  }

  /*
  */
  function getButtonElement (fileElement) {
    return $('.' + getButtonElementClassName (), fileElement);
  }

  /*
  */
  function getFileElements () {
    return $('.' + getFileElementClassName ());
  }

  /*
  */
  function getFileElementClassName () { return 'elucid-input-file'; }

  /*
  */
  function getLinkElementClassName () { return 'elucid-input-file-link'; }

  /*
  */
  function getButtonElementClassName () { return 'elucid-input-file-button'; }

  /*
  */
  function getInitializedClassName () { return 'elucid-initialized'; }

}) (jQuery);

