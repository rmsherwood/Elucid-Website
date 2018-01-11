<?php
namespace Drupal\banner_block\Plugin\Block;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
/**
 * The Banner Block module defines a block type
 * thatcan be configured to display banner images.
 *
 * @Block(
 *   id = "banner_block",
 *   admin_label = @Translation("Banner block")
 * )
 */
class BannerBlock extends BlockBase {
  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'banner_block_form';
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration () {
    return [
      'banner_block_image' => '',
      'banner_block_overlay' => ''
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm ($form, FormStateInterface $form_state) {
    $validators = [
      'file_validate_extensions' => ['png jpg jpeg'],
      'file_validate_is_image'   => []
    ];
    $form ['banner_block_image'] = array (
      '#type' => 'managed_file',
      '#title' => $this->t ('Banner Background Image'),
      '#upload_location' => 'public://upload/banner_block/image',
      '#upload_validators' => $validators,
      '#default_value' => $this->configuration ['banner_block_image'],
      '#description' => $this->t ('The background image that will be displayed in this banner block.'),
      '#required'    => true
    );
    $form ['banner_block_overlay'] = array (
      '#type' => 'textarea',
      '#title' => $this->t ('Overlay'),
      '#default_value' => $this->configuration ['banner_block_overlay'],
      '#description' => $this->t ('The text that will be displayed in the banner block.')
    );
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit ($form, FormStateInterface $form_state) {
    $this->configuration ['banner_block_overlay'] = $form_state->getValue ('banner_block_overlay');
    $this->configuration ['banner_block_image'] = $form_state->getValue ('banner_block_image');
    $fid = empty ($form_state->getValue ('banner_block_image')) ? null : $form_state->getValue ('banner_block_image')[0];
    $this->configuration ['banner_block_image_fid'] = $fid;
    $file = \Drupal::entityManager()->getStorage ('file')->load ($fid);
    if ($file) {
      $file->setPermanent ();
      $file->save ();
    }
  }

  /**
   * {@inheritdoc}
   */
  public function build () {
    $fid = $this->configuration ['banner_block_image_fid'];
    $file = \Drupal::entityManager()->getStorage ('file')->load ($fid);
    $file_url = $file ? $file->url() : '';
    return [
      '#attached' => [
        'library' => ['banner_block/banner_block_library'],
        'drupalSettings' => []
      ],
      '#cache' => array ('max-age' => 0),
      '#theme' => 'banner_block',
      '#banner_block_image' => $file_url,
      '#banner_block_overlay' => $this->configuration ['banner_block_overlay']
    ];
  }
}
