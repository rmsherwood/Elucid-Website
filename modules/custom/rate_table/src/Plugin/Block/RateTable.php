<?php
/**
 * Defines the Rate Table block.
 *
 * @Block(
 *   id = "rate_table_block",
 *   admin_label = @Translation("Rate Table block")
 * )
 */
namespace Drupal\rate_table\Plugin\Block;
use Drupal\Core\Block\BlockBase;

class RateTable extends BlockBase {
  /**
   * {@inheritdoc}
   */
  public function build () {
    $labor_categories  = $this->getLaborCategories ();
    $labor_rates       = $this->getLaborRates ();

    return array (
      '#attached' => array (
        'library' => array ('rate_table/rate_table_library'),
        'drupalSettings' => array (
          'rate_table' => array (
            'labor_categories' => $labor_categories,
            'labor_rates'      => $labor_rates
        ))
      ),
      '#cache' => array ('max-age' => 0),
      '#theme' => 'rate_table'
    );
  }

  /**
   * Accepts no arguments and returns an
   * associative array representing the set of
   * available labor categories.
   *
   * Note: this function assumes that there
   * is a content type named "labor_category"
   * and that it has certain fields.
   */
  private function getLaborCategories () {
    $labor_categories = [];
    $query = \Drupal::entityQuery ('node')
      ->condition ('type', 'labor_category');

    $result = array_values ($query->execute ());
    foreach ($result as $nid) {
      $node = \Drupal\node\Entity\Node::load ($nid);
      $labor_categories [] = [
        'id' => (int) $nid,
        'name' => $node->getTitle (),
        'vehicle' => (int) $node->get ('field_labor_category_vehicle')->target_id, 
      ];
    }
    return $labor_categories;
  }

  /**
   * Accepts no arguments and returns an
   * associative array listing the set of
   * labor rates.
   *
   * Note: this function assumes that there is
   * a content type named "labor_rate" and that
   * is has certain fields.
   */
  private function getLaborRates () {
    $labor_rates = [];
    $query = \Drupal::entityQuery ('node')
      ->condition ('type', 'labor_rate');

    $result = array_values ($query->execute ());
    foreach ($result as $nid) {
      $node = \Drupal\node\Entity\Node::load ($nid);
      $labor_rates [] = [
        'category' => (int) $node->get ('field_rate_category')->target_id, 
        'onsite'   => $node->get ('field_rate_government_site')->value === "1",
        'rate'     => (float) $node->get ('field_rate_rate')->value,
        'year'     => (int) $node->get ('field_rate_year')->value
      ];
    }
    return $labor_rates;
  }
}
