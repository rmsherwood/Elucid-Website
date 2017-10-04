<?php

namespace Drupal\prompt_field\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Plugin implementation of the 'prompt_field' widget.
 *
 * @FieldWidget(
 *   id = "prompt_field_widget",
 *   label = @Translation("Prompt Field"),
 *   field_types = {
 *     "prompt_field"
 *   }
 * )
 */
class PromptFieldWidget extends WidgetBase {

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return array(
      'description' => '',
      'html' => '',
    ) + parent::defaultSettings();
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    \Drupal::logger ('prompt_field')->notice ('[settingsForm]');
    $element['description'] = array (
      '#type' => 'textfield',
      '#title' => t('Description'),
      '#default_value' => $this->getSetting('description'),
      '#description' => t('This is the description used to summarize this content.')
    );
    $element['html'] = array(
      '#type' => 'textarea',
      '#title' => t('HTML'),
      '#default_value' => $this->getSetting('html'),
      '#description' => t('This is the HTML that will be inserted into the form.')
    );
    return $element;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    \Drupal::logger ('prompt_field')->notice ('[settingSummary]');
    $summary = array();

    $description = $this->getSetting('description');
    if (!empty($description)) {
      $summary[] = t('Description: @description', array('@description' => $description));
    }
    else {
      $summary[] = t('No description');
    }

    return $summary;
  }

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
    \Drupal::logger ('prompt_field')->notice ('[formElement] html: <pre>' . $this->getSetting ('html') . '</pre>');
    $element['html'] = $element + array(
      '#markup' => $this->getSetting ('html')
    );
    return $element;
  }
}
