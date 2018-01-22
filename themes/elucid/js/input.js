/*
  Defines the interactive behavior of textfield
  form elements.
*/
(function ($) {
  /*
    Creates a textfield component controller for
    each textfield element and initializes them.
  */
  $(document).ready (function () {
    getFormComponentElements ().each (
      function (i, formElement) {
        (new FormComponent ($(formElement))).init ();
    });
  });

  /*
  */
  function getFormComponentElements () {
    return $('form');
  }

  /*
  */
  function FormComponent (formElement) {
    this.formElement = formElement;
    this.submitted   = false;
  }

  /*
  */
  FormComponent.prototype.init = function () {
    var self = this;
    this.formElement.submit (function () {
      self.submitted = true;
      self.formElement.addClass (submittedClassName);
    });
    this.getInputComponentElements ().each (
      function (i, formItemElement) {
        (new InputComponent ($(formItemElement))).init ();
    });
  }

  /*
  */
  FormComponent.prototype.getInputComponentElements = function () {
    return $('.form-item.js-form-type-textfield,\
      .form-item.js-form-type-url,\
      .form-item.js-form-type-email,\
      .form-item.js-form-type-password,\
      .form-item.js-form-type-tel,\
      .form-item.js-form-type-textarea', this.formElement);
  }

  //
  var submittedClassName = 'elucid_submitted';

  /*
  */
  var ACTIVE   = 'active';
  var INACTIVE = 'inactive';

  /*
  */
  function InputComponent (formItemElement) {
    this.state = INACTIVE;
    this.formItemElement = formItemElement;
    this.inputElement = this.getInputElement ();
  }

  /*
  */
  InputComponent.prototype.init = function () {
    var self = this;
    this.setState ();
    this.inputElement.focusin (function () {
      self.activate ();
      self.addFocusClass ();
    });
    this.inputElement.focusout (function () {
      self.setState ();
      self.removeFocusClass ();
    });
    this.inputElement.change (function () {
      self.setState ();
    });
    this.inputElement.get (0).addEventListener ('invalid', function () {
      self.formItemElement.addClass (invalidClassName);
    });
    this.inputElement.get (0).addEventListener ('valid', function () {
      self.formItemElement.removeClass (invalidClassName);
    });
    this.formItemElement.addClass (textfieldClassName);
  }

  /*
  */
  InputComponent.prototype.setState = function () {
    this.inputElement.val () ?
      this.activate   ():
      this.deactivate ();
  }

  /*
  */
  InputComponent.prototype.addFocusClass = function () { 
    this.formItemElement.addClass (focusClassName);
  }

  /*
  */
  InputComponent.prototype.removeFocusClass = function () {
    this.formItemElement.removeClass (focusClassName);
  }

  /*
  */
  InputComponent.prototype.activate = function () {
    if (this.state === ACTIVE) { return; }

    this.state = ACTIVE;
    this.formItemElement.addClass (activeClassName);
  }

  /*
  */
  InputComponent.prototype.deactivate = function () {
    if (this.state === INACTIVE) { return; }

    this.state = INACTIVE;
    this.formItemElement.removeClass (activeClassName);
  }

  /*
  */
  InputComponent.prototype.getInputElement = function () {
    return $('input,textarea', this.formItemElement);
  }

  //
  var focusClassName = 'elucid_focus';

  //
  var activeClassName = 'elucid_active';

  //
  var invalidClassName = 'elucid_invalid';

  //
  var textfieldClassName = 'elucid_textfield';
}) (jQuery);
