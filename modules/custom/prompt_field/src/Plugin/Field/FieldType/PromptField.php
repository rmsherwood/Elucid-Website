<?php

namespace Drupal\prompt_field\Plugin\Field\FieldType;

use Drupal\Core\Field\FieldDefinitionInterface;
use Drupal\Core\Field\FieldItemBase;
use Drupal\Core\Field\FieldStorageDefinitionInterface;
use Drupal\Core\TypedData\DataDefinition;

/**
 * Plugin implementation of the 'prompt_field' field type.
 *
 * @FieldType(
 *   id = "prompt_field",
 *   label = @Translation("Prompt Field"),
 *   description = @Translation("Prompt fields can be used to insert HTML into forms."),
 *   category = @Translation("General"),
 *   default_widget = "prompt_field_widget",
 *   default_formatter = "prompt_field_formatter"
 * )  
 */     
class PromptField extends FieldItemBase {

  /**
   * {@inheritdoc}
   */
  public static function schema(FieldStorageDefinitionInterface $field_definition) {
    return ['columns' => [
      'value' => [
        'type' => 'varchar',
        'length' => 256
    ]]];
  }

  /**
   * {@inheritdoc}
   */
  public static function propertyDefinitions(FieldStorageDefinitionInterface $field_definition) {
    $properties['value'] = DataDefinition::create('string')
      ->setLabel(t(''))
      ->setRequired(false);

    return $properties;
  }

  /**
   * {@inheritdoc}
   */
  public function isEmpty() {
    return false;
  }

  /**
   * {@inheritdoc}
   */
  public function getConstraints() {
    $constraint_manager = \Drupal::typedDataManager()->getValidationConstraintManager();
    return parent::getConstraints();
  }

  /**
   * {@inheritdoc}
   */
  public static function generateSampleValue(FieldDefinitionInterface $field_definition) {
    return [];
  }
}
