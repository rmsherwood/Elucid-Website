View Term List Readme
=====================

The View Term List module adds an additional format option to the
"Has taxonomy term" Views filter provided by the Taxonomy module.

This format lists taxonomy terms from a selected set of vocabularies
in an unsorted list. Users can then filter the nodes displayed in
a view by clicking on the terms displayed within this list.

This module does this by defining a new Views filter
(taxonomy_index_tid_list) that extends the "Has taxonomy term"
(taxonomy_index_tid) Views filter provided by the Taxonomy
module (see: src/Plugin/views/filter/TaxonomyIndexTidList.php)
and then replaces all uses of the extended filter (see:
view_term_list.views.inc).
