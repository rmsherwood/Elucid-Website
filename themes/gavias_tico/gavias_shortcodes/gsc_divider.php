<?php 
namespace Drupal\gavias_blockbuilder\shortcodes;
if(!class_exists('gsc_divider')):
  class gsc_divider{
    
     public function render_form(){
        $fields = array(
           'type'  => 'gsc_divider',
           'title' => ('Divider'), 
           'size'  => 12,
           'fields'   => array(
              array(
                'id'         => 'height',
                'type'       => 'text',
                'title'      => t('Divider height'),
                'desc'       => t('example: 30'),
                'class'     => 'display-admin'
              ),
              array(
                'id'         => 'border',
                'type'       => 'select',
                'title'      => t('Style Border'),
                'options'    => array( 
                  ''                  => '--None--',
                  'default'           => 'Default',
                  'hr-dashed'         => 'Dashed',
                  'hr-dotted'         => 'Dotted',
                  'hr-double'         => 'Double',
                  'hr-double-dashed'  => 'Double Dashed',
                  'hr-double-dotted'  => 'Double Dotted'
                 ),
              ),
              array(
                'id'         => 'shadow',
                'type'       => 'select',
                'title'      => t('Style Shadow'),
                'options'    => array( 
                  'default-shadow'    => 'Default',
                  'middle-shadow'     => 'Middle Shadow',
                  'rect-shadow'       => 'Rect Shadow',
                  'doubleside-shadow' => 'Doubleside Shadow'
                 ),
              ),
              array(
                'id'         => 'bg_color',
                'type'       => 'text',
                'title'      => t('Background color')
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
       print self::sc_divider( $item['fields'] );
    }

     public static function sc_divider( $attr, $content = null ){
        extract(shortcode_atts(array(
          'height'        => 0,
          'border'        => '',   
          'shadow'        => '',
          'bg_color'      => '',
          'el_class'      => '' 
        ), $attr));
         
        $style_array = array();
        $class_array = array();
        $hr = '';

        if( $height ){
           $style_array[] = 'margin: 0 auto; height:'. intval( $height ) .'px;"';
        } 
        if($bg_color){
          $style_array[] = 'background_color: ' . $bg_color;
        }
        if($el_class){
          $class_array[] = $el_class;
        }
        if($shadow){
          $class_array[] = $shadow;
        }
        switch( $border ){
          case 'default':
            $hr = '<hr>';
            break;
          case '':
            break;
          default:
            $hr = '<hr class="'.$border.'">';
            break;
        }
        
        ?>
        <?php ob_start() ?>
          <div class="widget clearfix gsc-divider<?php if(count($class_array)>0) print (' '.implode($class_array, ' ')); ?>"<?php if(count($style_array)>0) print ('style="'.implode($style_array, ';') .'"'); ?>>
              <?php if($hr) print $hr; ?>
          </div>
          <?php return ob_get_clean() ?>    
        <?php 
     }

     public function load_shortcode(){
      add_shortcode( 'divider', 'gsc_divider', 'sc_divider' );
     }
  }
endif;  



