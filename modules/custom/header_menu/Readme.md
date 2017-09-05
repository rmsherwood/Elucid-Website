Header Menu Readme
==================

The Header Menu module takes one or more Drupal menus and creates
a dropdown nav menu for each Drupal Menu that contains the same
items as the given menu.

Usage
-----

To use this module, add "header_menu_drupal_menu" as an HTML class
to the list element representing the drupal menu.

Given a menu ID, MENUID, you can add HTML classes to the HTML
element that will represent the menu by creating/modifying
menu--MENUID.html.twig.

For example, the following template adds the necessary classes and
data attributes:

```html
{#
  We call a macro which calls itself to render the full tree.
  @see http://twig.sensiolabs.org/doc/tags/macro.html
#}
{{ menus.menu_links(items, attributes, 0) }}

{% macro menu_links(items, attributes, menu_level) %}
  {% import _self as menus %}
  {% if items %}
    {% if menu_level == 0 %}
      <ul class="header_menu_drupal_menu" data-header-menu-menu-id="main" data-menu-level="{{ menu_level }}" {{ attributes }}> 
    {% else %}
      <ul data-menu-level="{{ menu_level }}">
    {% endif %}
    {% for item in items %}
      <li data-menu-level="{{ menu_level }}" {{ item.attributes }}> 
        {{ link(item.title, item.url) }}
        {% if item.below %}
          {{ menus.menu_links(item.below, attributes, menu_level + 1) }}
        {% endif %}
      </li>
    {% endfor %}
    </ul>
  {% endif %}
{% endmacro %}
```

When the page loads, this module will scan the page document for
list elements having the "header_menu_drupal_menu" class, will
create an HTML element that represents a dropdown menu having the
same items as the tagged Drupal menu, and adds the dropdown menu
element after the Drupal menu element.

Additionally you must provide two container DIV elements. The first
will contain the widescreen version of the generated menu and must
possess the class "header_menu_widescreen_view_container" and a
"data-header-menu-menu-id" attribute that matches the menu ID given
to the list element.

The second must have the "header_menu_mobile_view_container"
class and will contain the mobile version of the generated
menu. It must also have the same menu ID attribute value in
"data-header-menu-menu-id".

Troubleshooting
---------------

### Dropdowns not appearing

Note: you will also want to ensure that the "Number of levels to
display" option for the menu block is set to "Unlimited" to enable
the dropdowns provided by this module.

You will also need to go to each item listed in the Menu
Configuration page and check the "Show as expanded" box or dropdown
items will not appear.
