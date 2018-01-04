<?php
/**
 * @file
 * This file defines the hook_views_data_alter ()
 * function which replaces every use of the
 * taxonomy_index_tid Views filter (the default
 * filter for the "Has taxonomy term" filter
 * option) with taxonomy_term_tid_list (see:
 * src/Plugin/views/filter/TaxonomyIndexTidList.php)
 * a Views filter that extends taxonomy_index_tid
 * by providing an additional filter format.
 */

/**
 * Implements hook_views_data_alter ().
 *
 * Replace the taxonomy_index_tid view
 * filter provided by the View module by
 * taxonomy_index_tid_list.
 */
function view_term_list_views_data_alter (&$data) {
  $data ['taxonomy_term_field_data']['tid']['filter']['id'] = 'taxonomy_index_tid_list';

  $data ['taxonomy_index']['tid']['argument']['id'] = 'taxonomy_index_tid_list';
  $data ['taxonomy_index']['tid']['filter']['id'] = 'taxonomy_index_tid_list';
}
