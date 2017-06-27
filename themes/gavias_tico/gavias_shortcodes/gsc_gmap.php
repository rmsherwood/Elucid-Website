<?php 
namespace Drupal\gavias_blockbuilder\shortcodes;
if(!class_exists('gsc_gmap')):
   class gsc_gmap{

      public function render_form(){
         $fields = array(
            'type' => 'gsc_gmap',
            'title' => t('Google Map'),
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
                  'type'         => 'textarea_no_html',
                  'title'        => t('Map embed iframe'),
                  'desc'         => 'Visit <a target="_blank" href="https://www.google.com/maps">Google maps</a> to create your map (Step by step: 1) Find location 2) Click the cog symbol in the lower right corner and select "Share or embed map" 3) On modal window select "Embed map" 4) Copy iframe code and paste it).',
               ), 
               array(
                  'id'           => 'info',
                  'type'         => 'textarea',
                  'title'        => t('Text Information')    
               ),
               array(
                  'id'           => 'height',
                  'type'         => 'text',
                  'title'        => 'Map height',
                  'desc'         => 'Enter map height (in pixels or leave empty for responsive map), eg: 400px',
                  'std'          => 'standard'
               ),
               array(
                  'id'        => 'style',
                  'type'      => 'select',
                  'title'     => t('Style display'),
                  'options'   => array(
                        'style-1'   => 'Style v1',
                        'style-2'   => 'Style v2'
                  )
               ),
               array(
                  'id'        => 'el_class',
                  'type'      => 'text',
                  'title'     => t('Extra class name'),
                  'desc'      => t('Style particular content element differently - add a class name and refer to it in custom CSS.'),
               ),   
               array(
                  'id'        => 'animate',
                  'type'      => 'select',
                  'title'     => t('Animation'),
                  'desc'      => t('Entrance animation'),
                  'options'   => gavias_blockbuilder_animate(),
               ),
            ),                                     
         );
         return $fields;
      }


      public function render_content( $item ) {
         print self::sc_gmap( $item['fields'] );
      }


      public static function sc_gmap( $attr, $content = null ){
         extract(shortcode_atts(array(
            'title'      => '',
            'content'    => '',
            'height'     => '',
            'style'      => 'style-1',
            'info'       =>  '',
            'el_class'   => '',
            'animate'    => ''
         ), $attr));
         if($animate){
            $el_class .= ' wow';
            $el_class .= ' ' . $animate;
         }
         $output = '';
         $zoom = 14; 
         $type = 'm'; 
         $bubble = '';
         $bubble = ( '' !== $bubble && '0' !== $bubble ) ? '&amp;iwloc=near' : '';
         $size = str_replace( array( 'px', ' ' ), array( '', '' ), $height );
         $content = preg_match( '/^#E\-8_/', $content ) ? rawurldecode( base64_decode( preg_replace( '/^#E\-8_/', '', $content ) ) ) : $content;
         if ( is_numeric( $size ) ) {
            $content = preg_replace( '/height="[0-9]*"/', 'height="' . $size . '"', $content );
         }
         $output .= '<div class="gsc-gmap clearfix ' . $el_class . ' ' . $style . '"><div class="widget-inner">';
            if ( preg_match( '/^\<iframe/', $content ) ) {
               $output .= '<div class="map-content">' . $content . '</div>';
            } else {
               $output .= '<div class="map-content"><iframe width="100%" height="' . $size . '"  scrolling="no" marginheight="0" marginwidth="0" src="' . $content . '&amp;t=' . $type . '&amp;z=' . $zoom . '&amp;output=embed' . $bubble . '"></iframe></div>';
            }
            if($info){
               $output .= '<div class="info-inner"><div class="info">' . $info . '</div></div>';
            }
         $output .= '</div></div>';
         return $output;
      }

      public function load_shortcode(){
         add_shortcode( 'gmap', array('gsc_gmap', 'sc_gmap') );
      }
   }
 endif;  



