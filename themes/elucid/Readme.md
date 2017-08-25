Elucid Theme Readme
===================

The Elucid theme defines the default theme for Elucid Solution's
website.

This theme extends the Classy theme and uses the Bootstrap library.

The Elucid theme relies heavily on the Twig Blocks module
which allows Twig templates to embed blocks. By transferring
the responsibility for block placement to twig templates we can
fine-tune placement and consolidate this critical configuration
aspect. Doing so, also simplifies deployment across sites. This
theme defines a region named Template that should contain all
of those blocks that are positioned by templates. By convention,
these block's ids should be prefixed by 'template-'.

Requirements
------------

* Twig Blocks (twig_blocks)
  The Twig Blocks module is required.
