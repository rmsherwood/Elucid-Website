<?php 
namespace Drupal\gavias_blockbuilder\shortcodes;
if(!class_exists('gsc_quote_text')):
   class gsc_quote_text{
      
      public function render_form(){
         $fields =array(
            'type' => 'gsc_quote_text',
            'title' => ('Box Quote Text'), 
            'size' => 3,
            'fields' => array(
               array(
                  'id'        => 'title',
                  'type'      => 'text',
                  'title'     => t('Title for Admin'),
                  'class'     => 'display-admin'
               ),
               array(
                  'id'        => 'content',
                  'type'      => 'textarea',
                  'title'     => t('Content'),
               ),
               array(
                  'id'        => 'width',
                  'type'      => 'text',
                  'title'     => t('Width'),
                  'desc'      => 'Sample: 80%'
               ),
               array(
                  'id'        => 'background',
                  'type'      => 'text',
                  'title'     => t('Background color'),
                  'desc'      => 'Sample: #f5f5f5'
               ),
               array(
                  'id'        => 'color',
                  'type'      => 'text',
                  'title'     => t('Text color'),
                  'desc'      => 'Sample: #ccc'
               ),
               array(
                  'id'        => 'border',
                  'type'      => 'select',
                  'title'     => t('border'),
                  'options'   => array(
                     'has-border'   => 'Enable',
                     'no-border'    => 'Disble',
                  )
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
         print self::sc_quote_text( $item['fields'] );
      }

      public static function sc_quote_text( $attr, $content = null ){
         global $base_url;
         extract(shortcode_atts(array(
            'content'      => '',
            'width'        => '',
            'background'   => '',
            'color'        => '',
            'border'       => '',
            'animate'      => '',
            'el_class'     => ''
         ), $attr));
            
         if($animate){
            $el_class .= ' wow';
            $el_class .= ' '. $animate;
         }

         $el_class .= ' ' . $border;

         $styles = array();

         if($width){
            $styles[] = "width:{$width};";
         }
         if($color){
            $styles[] = "color:{$color};";
         }

         ?>
            <?php ob_start() ?>
            <div class="widget gsc-quote-text <?php print $el_class ?>" <?php print ($background ? "style=\"background:{$background};\"" : '') ?>>
               <div class="widget-content">
                  <div class="content" style="<?php print(implode('', $styles)) ?>"><i <?php print ($color ? "style=\"color:{$color};\"" : '') ?> class="icon fa fa-quote-left"></i><?php print $content ?></div>
               </div>
            </div>  
            <?php return ob_get_clean() ?>    
         <?php       
      }

      public function load_shortcode(){
         add_shortcode( 'quote', array('gsc_quote_text', 'sc_quote_text') );
      }
   }
endif;   




