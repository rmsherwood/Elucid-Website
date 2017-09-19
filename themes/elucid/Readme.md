Elucid Theme Readme
===================

The Elucid theme defines the default theme for Elucid Solution's
website.

This theme extends the Classy theme and uses the Bootstrap library.

Dependencies
------------

* Classy theme
* Twig Tweaks module
* Bootstrap Library module
* Header Menu module

The Elucid theme relies heavily on the Twig Tweaks module
which allows Twig templates to embed blocks. By transferring
the responsibility for block placement to twig templates we can
fine-tune placement and consolidate this critical configuration
aspect. Doing so, also simplifies deployment across sites. This
theme defines a region named Template that should contain all
of those blocks that are positioned by templates. By convention,
these block's ids should be prefixed by 'template-'.

A complete list of all modules embedded within templates can be
found by executing 'grep --recursive drupal_block themes/elucid'.

The Elucid theme also relies on the Bootstrap Library module
(https://www.drupal.org/project/bootstrap_library). This module
loads the Bootstrap library and exposes it to other themes. Install
this module and configure it so that it loads both JS and CSS files
for the Elucid Theme.

Installation and Configuration
------------------------------

Once the dependencies listed above have been installed you will
need to complete the following steps:

1. Configure the Bootstrap Library module to load the Bootstrap
   library for the Elucid theme.
2. Configure the Elucid theme to use the logo provided with the
   theme. Go to Appearance > Elucid Theme > Logo Image. Uncheck
   "Use the logo supplied by the theme". Set the custom logo path
   to "themes/elucid/logo.png". This is necesary, because Drupal
   8 does not allow us to list PNG files as logos using the YML
   files.
3. Configure Blocks:
   Configure the Site Branding block by unchecking the "Site name"
   and "Site slogan" options.
