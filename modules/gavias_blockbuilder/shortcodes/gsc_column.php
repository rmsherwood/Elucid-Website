<?php 
namespace Drupal\gavias_blockbuilder\shortcodes;
if(!class_exists('gsc_column')):
   class gsc_column{

      public function render_form(){
         $fields = array(
            'type' => 'gsc_column',
            'title' => t('Text - Shortcode'),
            'size' => 3,
            'fields' => array(
               
               array(
                  'id'     => 'title',
                  'type'      => 'text',
                  'title'  => t('Title'),
                   'class'     => 'display-admin'
               ),

               array(
                  'id'           => 'content',
                  'type'         => 'textarea',
                  'title'        => t('Column content'),
                  'desc'         => t('Shortcodes and HTML tags allowed.'),
                  'shortcodes'   => 'on'
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
         print self::sc_column( $item['fields'] );
      }


      public static function sc_column( $attr, $content = null ){
         extract(shortcode_atts(array(
            'title'      => '',
            'content'    => '',
            'el_class'    => ''
         ), $attr));
         print '<div class="column-content '.$el_class.'">';
         print do_shortcode( $content );
         print '</div>';
      }

      public function load_shortcode(){
         add_shortcode( 'column', array('gsc_column', 'sc_column') );
      }
   }
 endif;  



