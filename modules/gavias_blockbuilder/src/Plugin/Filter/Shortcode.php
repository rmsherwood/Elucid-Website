<?php
/**
 * @file
 * Contains \Drupal\insert_view\Plugin\Filter\Shortcode.
 */

namespace Drupal\gavias_blockbuilder\Plugin\Filter;

use Drupal\Core\Form\FormStateInterface;
use Drupal\filter\FilterProcessResult;
use Drupal\filter\Plugin\FilterBase;
use Drupal\Core\Url;
use Drupal\gavias_blockbuilder\Plugin\ShortcodeInterface;

/**
 * Provides a filter for insert view.
 *
 * @Filter(
 *   id = "shortcode",
 *   module = "shortcode",
 *   title = @Translation("Shortcodes"),
 *   description = @Translation("Provides gavias shortcodes to text formats."),
 *   type = Drupal\filter\Plugin\FilterInterface::TYPE_MARKUP_LANGUAGE,
 * )
 */
class Shortcode extends FilterBase {

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {

    $settings = array();
    //$this->settings += $defaults;

    /** @var \Drupal\shortcode\Shortcode\ShortcodeService $shortcodeService */
    $shortcodeService = \Drupal::service('gbbshortcode');
    $shortcodes = $shortcodeService->getShortcodePlugins();

    /** @var \Drupal\Core\Plugin\DefaultPluginManager $type */
    $type = \Drupal::service('plugin.manager.gbbshortcode');

    /** @var ShortcodeInterface $shortcode */
    foreach ($shortcodes as $plugin_id => $shortcode_info) {

      $shortcode = $type->createInstance($plugin_id);

      $description = $shortcode->getDescription();

      $settings[$plugin_id] = array(
        '#type' => 'checkbox',
        '#title' => $this->t('Enable %name shortcode', array('%name' => $shortcode->getLabel())),
        '#default_value' => NULL,
        '#description' => isset($description) ? $description : $this->t('Enable or disable this gavias shortcode in this input format'),
      );

      if (!empty($this->settings[$plugin_id])) {
        $settings[$plugin_id]['#default_value'] = $this->settings[$plugin_id];
      }

    }

    return $settings;

  }

  /**
   * {@inheritdoc}
   */
  public function process($text, $langcode) {
    if (!empty($text)) {
      $text = do_shortcode( $text );
    }

    return new FilterProcessResult($text);
  }

  /**
   * {@inheritdoc}
   */
  public function tips($long = FALSE) {

    $output = '<div>You can use shortcode for block builder module. You can visit admin/structure/gavias_blockbuilder and get shortcode, sample [gbb name="page_home_1"].<div>';
  
    return $output;
  }

}

