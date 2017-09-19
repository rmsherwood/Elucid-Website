/**
 * @file
 * This file provides webfontloader with the appropriate font definitions.
 */
  if (typeof drupalSettings.google_webfont_loader_api.font_config !== 'undefined') {
    WebFont.load(drupalSettings.google_webfont_loader_api.font_config);
  }
