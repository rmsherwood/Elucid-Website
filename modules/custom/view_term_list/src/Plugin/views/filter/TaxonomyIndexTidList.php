<?php
/**
 * @file
 * This module defines the TaxonomyIndexTidList
 * class which represents a Views filter
 * (taxonomy_index_tid_list) and extends the
 * "Has taxonomy term" View filter provided
 * by the Taxonomy module (taxonomy_index_tid)
 * by adding an additional format (list). This
 * format presents users with an unordered list
 * of taxonomy terms that they can click on to
 * filter views.
 */

namespace Drupal\view_term_list\Plugin\views\filter;

use Drupal\Component\Utility\Html;
use Drupal\Core\Form\FormStateInterface;
use Drupal\taxonomy\Entity\Term;
use Drupal\taxonomy\TermStorageInterface;
use Drupal\taxonomy\VocabularyStorageInterface;
use Drupal\taxonomy\Plugin\views\filter\TaxonomyIndexTid;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Defines a view filter that extends the
 * TaxonomyIndexTid view filter provided by the
 * taxonomy module.
 * 
 * This filter provides a format option
 * labeled "list" that displays terms in a formatted
 * list. Users can select terms from this list by
 * clicking on them. This is similar to the "select"
 * format provided by the TaxonomyIndexTid filter
 * this class extends.
 * 
 * This module's hook_views_data_alter () function
 * sets this filter as the default filter for the
 * taxonomy_term_field_data table's tid column. This
 * filter will be listed under the Views UI as the
 * "Has taxonomy term" filter.
 *
 * Note: the following annotations register this
 * class as a view filter and declares the ID of
 * the filter represented by this class.
 *
 * @ingroup views_filter_handlers
 *
 * @ViewsFilter("taxonomy_index_tid_list")
 */
class TaxonomyIndexTidList extends TaxonomyIndexTid {
  /**
   * Add two fields to the Extra Options
   * Form. The first allows site admins to specify
   * the List format type. The second allows them
   * to specify the number of items to display in
   * collpased lists.
   */
  public function buildExtraOptionsForm (&$form, FormStateInterface $form_state) {
    parent::buildExtraOptionsForm ($form, $form_state);

    // The filter must be exposed or it will have no effect.
    // Additionally, the filter only gets an identifier when exposed.

    $id = $this->options['expose']['identifier'];
    if (!$id) {
      drupal_set_message ('Please expose the View Term List filter.', 'error');
      return;
    }

    $form ['type']['#options']['list'] = $this->t ('List');

    $node_type = \Drupal::config ('view_term_list.settings')->get ('node_type')[$id];
    if (!$node_type) {
      $node_type = '';
    }
    $field_name = \Drupal::config ('view_term_list.settings')->get ('field_name')[$id];
    if (!$field_name) {
      $field_name = '';
    }
    $max_num_terms = \Drupal::config ('view_term_list.settings')->get ('max_num_terms')[$id];
    if (!$max_num_terms) {
      $max_num_terms = '0';
    }
    $reset_label = \Drupal::config ('view_term_list.settings')->get ('reset_label')[$id];
    if (!$reset_label) {
      $reset_label = 'Reset';
    }

    $form ['list']['node_type'] = array (
      '#default_value' => $node_type,
      '#description' => $this->t ('The nodes type that will be filtered.'),
      '#title' => $this->t ('Node Type'),
      '#type' => 'textfield'
    );
    $form ['list']['field_name'] = array (
      '#default_value' => $field_name,
      '#description' => $this->t ('The field name referencing the taxonomy term.'),
      '#title' => $this->t ('Field Name'),
      '#type' => 'textfield'
    );
    $form ['list']['max_num_terms'] = array (
      '#default_value' => $max_num_terms,
      '#description' => $this->t ('Specifies the maximum number of terms that should be displayed in collapsed lists.'),
      '#title' => $this->t ('Max Number of Terms'),
      '#type' => 'number'
    );
    $form ['list']['reset_label'] = array (
      '#default_value' => $reset_label,
      '#description' => $this->t ('Specifies the label shown on the reset button'),
      '#title' => $this->t ('Reset Label'),
      '#type' => 'textfield'
    );
  }

  /**
   * Saves the Max Num Items field value before
   * passing the Extra Options form to the parent
   * for further processing.
   */
  public function submitExtraOptionsForm($form, FormStateInterface $form_state) {
    parent::submitExtraOptionsForm ($form, $form_state);
    $id = $this->options['expose']['identifier'];
    $node_types = \Drupal::config ('view_term_list.settings')->get ('node_type');
    $node_types[$id] = $form ['list']['node_type']['#value'];
    $field_names = \Drupal::config ('view_term_list.settings')->get ('field_name');
    $field_names[$id] = $form ['list']['field_name']['#value'];
    $max_num_terms = \Drupal::config ('view_term_list.settings')->get ('max_num_terms');
    $max_num_terms[$id] = $form ['list']['max_num_terms']['#value'];
    $reset_labels = \Drupal::config ('view_term_list.settings')->get ('reset_label');
    $reset_labels[$id] = $form ['list']['reset_label']['#value'];

    \Drupal::configFactory ()
      ->getEditable ('view_term_list.settings')
      ->set ('node_type', $node_types)
      ->set ('field_name', $field_names)
      ->set ('max_num_terms', $max_num_terms)
      ->set ('reset_label', $reset_labels)
      ->save ();
  }

  /**
   * Creates the form element that allows users
   * to select values for this filter.
   *
   * Note: This function extends
   * TaxonomyIndexTid::valueForm. When this
   * filter's format equals "list", this function
   * creates an unordered list of taxonomy
   * terms. Otherwise, this function calls
   * TaxonomyIndexTid::valueForm to create the
   * form element.
   */
  protected function valueForm(&$form, FormStateInterface $form_state) {
/*
    \Drupal::logger ('view_term_list')->notice ('[TaxonomyIndexTidList::valueForm] identifier: <pre>' . print_r ($this->options['expose'], true) . '</pre>');
    \Drupal::logger ('view_term_list')->notice ('[TaxonomyIndexTidList::valueForm] base ID: ' . $this->getBaseId ());
    \Drupal::logger ('view_term_list')->notice ('[TaxonomyIndexTidList::valueForm] derivative ID: ' . $this->getDerivativeId ());
    \Drupal::logger ('view_term_list')->notice ('[TaxonomyIndexTidList::valueForm] plugin ID: ' . $this->getPluginId ());
*/
    $filter_id = $this->options ['expose']['identifier'];
//    \Drupal::logger ('view_term_list')->notice ('[TaxonomyIndexTidList::valueForm] identifier: ' . $filter_id);

    // I. perform the same initial vocabulary check as performed in the parent function.
    // Note: the following is lifted verbatim from the beginning of TaxonomyIndexTid::valueForm ().
    $vocabulary = $this->vocabularyStorage->load($this->options['vid']);
    if (empty($vocabulary) && $this->options['limit']) {
      $form['markup'] = array(
        '#markup' => '<div class="js-form-item form-item">' . $this->t('An invalid vocabulary is selected. Please change it in the options.') . '</div>',
      );
//      \Drupal::logger ('view_term_list')->notice ('[TaxonomyIndexTidList::valueForm] breakpoint 1');
      return;
    }

    // II. Intercept the case where the user selected the list type.
    if ($this->options ['type'] == 'list') {
      $max_num_terms_settings = \Drupal::config ('view_term_list.settings')->get ('max_num_terms');
      $max_num_terms = ($max_num_terms_settings && array_key_exists ($filter_id, $max_num_terms_settings)) ?
                         $max_num_terms_settings [$filter_id] : 100;

      $reset_label_settings = \Drupal::config ('view_term_list.settings')->get ('reset_label');
      $reset_label = ($reset_label_settings && array_key_exists ($filter_id, $reset_label_settings)) ?
                       $reset_label_settings [$filter_id] : 'Reset';

      $items = array ();
      $options = array ();

      $tree = $this->termStorage->loadTree ($vocabulary->id (), 0, null, true);
//      \Drupal::logger ('view_term_list')->notice ('[TaxonomyIndexTidList::valueForm] breakpoint 2b');
      if ($tree) {
        foreach ($tree as $term) {
//          \Drupal::logger ('view_term_list')->notice ('[TaxonomyIndexTidList::valueForm] term: <pre>' . print_r (get_class ($term), true) . '</pre>');
//          \Drupal::logger ('view_term_list')->notice ('[TaxonomyIndexTidList::valueForm] term: id <pre>' . $term->id () . '</pre>');
          $num_references = $this->getReferencingNodes ($term->id ());
//          \Drupal::logger ('view_term_list')->notice ('[TaxonomyIndexTidList::valueForm] num references: ' . $num_references);
          if ($num_references == 0) { continue; }
//          \Drupal::logger ('view_term_list')->notice ('[TaxonomyIndexTidList::valueForm] breakpoint m');

          $context = \Drupal::entityManager ()->getTranslationFromContext ($term);
//          \Drupal::logger ('view_term_list')->notice ('[TaxonomyIndexTidList::valueForm] context: <pre>' . print_r (get_class ($context), true) . '</pre>');
          $label = \Drupal::entityManager ()->getTranslationFromContext ($term)->label ();
//          \Drupal::logger ('view_term_list')->notice ('[TaxonomyIndexTidList::valueForm] term: <pre>' . print_r ($label, true) . '</pre>');
          $items [] = array (
            '#markup' => '<li class="view_term_list_item" data-view-term-list-item-term-id="' . $term->id () . '" data-term-depth="' . $term->depth . '">' .
              '<div class="view_term_list_item_label">' . $label . ' ('. $num_references . ')</div>' .
            '</li>'
          );
          $options [$term->id ()] = $label;
        }
      }
      // Create the hidden select form element that will be used to store selected term values.
      // Note: this form element is hidden using CSS.
      $form ['value'] = array (
        '#attributes' => array (
          'class' => array ('view_term_list_select'),
          'data-view-term-list-filter' => $filter_id
        ),
        '#type' => 'select',
        '#multiple' => true,
        '#options' => $options,
        '#default_value' => (array) $this->value,
        '#weight' => 0 // ensure that this field item, with its header, appears above the item list.
      );
      // Create the option list that users will use to select values.
      $form ['view_term_list_item_' . $filter_id] = array (
        '#type' => 'item',
        'view_term_list_list' => array (
          '#prefix' => '<ul class="view_term_list_list"' .
            ' data-view-term-list-view="' . $this->view->dom_id . '"' .
            ' data-view-term-list-filter="' . $filter_id . '"' .
            ' data-view-term-list-num-items="' . count ($items) . '"' .
            '>',
          '#suffix' => '</ul>',
          'items' => array_slice ($items, 0, $max_num_terms),
          'overflow_items' => array (
            '#prefix' => '<div class="view_term_list_list_overflow"' .
              ' data-view-term-list-num-overflow-items="' . max (0, count ($items) - $max_num_terms) . '"' .
              '>',
            '#suffix' => '</div>',
            'items' => array_slice ($items, $max_num_terms),
          ),
          'toggle_button' => array (
            '#markup' => '<div class="view_term_list_list_toggle_button"></div>'
          ),
          'reset_button' => array (
            '#markup' => '<div class="view_term_list_list_reset_button">' . $reset_label . '</div>'
          )
        ),
        '#weight' => 1
      );
      $form ['#attached'] = array (
        'library' => array ('view_term_list/view_term_list_library'),
        'drupalSettings' => array (
          'view_term_list' => array (
            'max_num_terms' => $max_num_terms,
            'filter_id' => $filter_id
          )
        )
      );
    } else {
      // let the parent version handle all remaining cases.
      // return parent::valueForm ($form, $form_state);
      parent::valueForm ($form, $form_state);
//      \Drupal::logger ('view_term_list')->notice ('[TaxonomyIndexTidList::valueForm] breakpoint 3');
      return;
    }

    // III. perform the same concluding operation as performed by the parent function after it handled each type case.
    // Note: the following is lifted verbatim from the bottom of TaxonomyIndexTid::valueForm ().
    if (!$form_state->get('exposed')) {
      // Retain the helper option
      $this->helper->buildOptionsForm($form, $form_state);

      // Show help text if not exposed to end users.
      $form['value']['#description'] = t('Leave blank for all. Otherwise, the first selected term will be the default instead of "Any".');

//      \Drupal::logger ('view_term_list')->notice ('[TaxonomyIndexTidList::valueForm] breakpoint 4');
    }
  }

  /**
   * @brief Accepts a term ID and returns an
   * integer that represents the number of nodes
   * that reference the term having tid.
   * @param $tid (integer) a term ID.
   * @return (integer) the number of nodes that
   * reference the referenced term.
   */
  protected function getReferencingNodes ($tid) {
    $node_type = \Drupal::config ('view_term_list.settings')->get ('node_type')[$this->options ['expose']['identifier']];
//    \Drupal::logger ('view_term_list')->notice ('[TaxonomyIndexTidList::getReferencingNodes] node type: ' . $node_type);
    if ($node_type) {
      $query = \Drupal::entityQuery ('node')
        ->condition ('status', 1)
        ->condition ('type', $node_type);
      foreach ($this->getEntityReferenceFields () as $field_name) {
        $query->condition ($field_name . '.target_id', $tid);
      }
      return $query->count ()->execute ();
    }
    return 0;
  }


  /**
   * Accepts no arguments and returns an array
   * listing the names of all of the entity
   * reference fields.
   * @return (array string) the names of the
   * entity reference fields.
   */
  protected function getEntityReferenceFields () {
    $field_name = \Drupal::config ('view_term_list.settings')->get ('field_name')[$this->options ['expose']['identifier']];
    return array ($field_name);
  }
}
