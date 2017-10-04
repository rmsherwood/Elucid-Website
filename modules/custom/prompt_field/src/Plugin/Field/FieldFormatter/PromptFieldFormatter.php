<?php

namespace Drupal\prompt_field\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;

/**
 * Plugin implementation of the 'prompt_field' formatter.
 *
 * @FieldFormatter(
 *   id = "prompt_field_formatter",
 *   label = @Translation("Prompt Field"),
 *   field_types = {
 *     "prompt_field"
 *   }
 * )  
 */ 
class PromptFieldFormatter extends FormatterBase {
      
  /** 
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return parent::defaultSettings();
  } 

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    return [];
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    return [];
  }

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    return [];
  }
}
