<?php 
namespace Drupal\gavias_blockbuilder\shortcodes;
if(!class_exists('gsc_quote')):
   class gsc_quote{
      
      public function render_form(){
         $fields =array(
            'type' => 'gsc_quote',
            'title' => ('Box Info Quote'), 
            'size' => 3,
            'fields' => array(
               array(
                  'id'        => 'content',
                  'type'      => 'textarea',
                  'title'     => t('Content'),
               ),
               array(
                  'id'        => 'position',
                  'type'      => 'text',
                  'title'     => t('Position'),
                  'desc'      => 'Sample: Ceo Pictor'
               ),
               array(
                  'id'        => 'image',
                  'type'      => 'upload',
                  'title'     => t('Signature'),
               ),
               array(
                  'id'        => 'animate',
                  'type'      => 'select',
                  'title'     => t('Animation'),
                  'sub_desc'  => t('Entrance animation'),
                  'options'   => gavias_blockbuilder_animate(),
               ),
               array(
                  'id'        => 'el_class',
                  'type'      => 'text',
                  'title'     => t('Extra class name'),
                  'desc'      => t('Style particular content element differently - add a class name and refer to it in custom CSS.'),
               ),
            ),                                       
         );
         return $fields;
      }

      public function render_content( $item ) {
         print self::sc_quote( $item['fields'] );
      }

      public static function sc_quote( $attr, $content = null ){
         global $base_url;
         extract(shortcode_atts(array(
            'content'      => '',
            'image'        => '',
            'position'     => '',
            'animate'      => '',
            'el_class'     => ''
         ), $attr));
            
         $image = substr(base_path(), 0, -1) . $image; 
         if($animate){
            $class .= ' wow';
            $class .= ' '. $animate;
         }
         ?>
            <div class="widget gsc-quote <?php print $el_class ?>">
               <div class="widget-content">
                  <div class="content"><?php print $content ?></div>
                  <?php if($image){ ?>
                     <div class="signature">
                        <img src="<?php print $image ?>" alt="" />
                     </div> 
                  <?php } ?>   
                  <?php if($position){ ?>
                     <div class="position"><?php print $position ?></div>
                  <?php } ?>
               </div>
            </div>      
         <?php       
      }

      public function load_shortcode(){
         add_shortcode( 'gsc_quote', array($this, 'sc_quote') );
      }
   }
endif;   




