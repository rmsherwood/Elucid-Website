<?php 
namespace Drupal\gavias_blockbuilder\shortcodes;
if(!class_exists('gsc_icon_box')):
   class gsc_icon_box{

      public function render_form(){
         $fields = array(
            'type' => 'gsc_icon_box',
            'title' => ('Icon Box'), 
            'size' => 3,'fields' => array(
         
               array(
                  'id'        => 'title',
                  'type'      => 'text',
                  'title'     => t('Title'),
                  'class'     => 'display-admin'
               ),
               array(
                  'id'        => 'content',
                  'type'      => 'textarea',
                  'title'     => t('Content'),
                  'desc'      => t('Some Shortcodes and HTML tags allowed'),
               ),
         
               array(
                  'id'        => 'icon',
                  'type'      => 'text',
                  'title'     => t('Icon class'),
                  'std'       => '',
               ),
               array(
                  'id'        => 'icon_size',
                  'type'      => 'select',
                  'title'     => 'Icon font size',
                  'options'   => array(''=>'Default', 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60)
               ),
               array(
                  'id'        => 'icon_color',
                  'type'      => 'text',
                  'title'     => t('Icon Color'),
                  'desc'      => t('Color for icon, e.g: #000'),
                  'std'       => '',
               ),
               array(
                  'id'        => 'image',
                  'type'      => 'upload',
                  'title'     => t('Icon image'),
               ),
               
               array(
                  'id'            => 'icon_position',
                  'type'          => 'select',
                  'options'       => array(
                     'top-center'      => 'Top Center',
                     'top-left'        => 'Top Left',
                     'top-right'       => 'Top Right',
                     'right'           => 'Right',
                     'left'            => 'Left',
                     'top-left-title'  => 'Top Left Title',
                     'top-right-title' => 'Top Right Title',
                  ),
                  'title'  => t('Icon Position'),
                  'std'    => 'top',
               ),
               
               array(
                  'id'        => 'link',
                  'type'      => 'text',
                  'title'     => t('Link'),
                  'desc'      => t('Link for text')
               ),

               array(
                  'id'        => 'bg_color',
                  'type'      => 'text',
                  'title'     => t('Background color'),
                  'desc'      => t('Background for icon box, e.g: #f5f5f5')
               ),

               array(
                  'id'        => 'skin_text',
                  'type'      => 'select',
                  'title'     => 'Skin Text for box',
                  'options'   => array(
                     'text-dark'  => t('Text Dark'), 
                     'text-light' => t('Text Light')
                  ) 
               ),
               
               array(
                  'id'        => 'target',
                  'type'      => 'select',
                  'options'   => array( 'on' => 'No', 'off' => 'Yes' ),
                  'title'     => t('Open in new window'),
                  'desc'      => t('Adds a target="_blank" attribute to the link.'),
               ),
               
               array(
                  'id'        => 'animate',
                  'type'      => 'select',
                  'title'     => t('Animation'),
                  'desc'      => t('Entrance animation for element'),
                  'options'   => gavias_blockbuilder_animate(),
               ),
               
               array(
                  'id'     => 'el_class',
                  'type'      => 'text',
                  'title'  => t('Extra class name'),
                  'desc'      => t('Style particular content element differently - add a class name and refer to it in custom CSS.'),
               ),

            ),                                       
         );
         return $fields;
      }

      public function render_content( $item ) {
         if( ! key_exists('content', $item['fields']) ) $item['fields']['content'] = '';
         print self::sc_icon_box( $item['fields'], $item['fields']['content'] );
      }


      public static function sc_icon_box( $attr, $content = null ){
         global $base_url;
         extract(shortcode_atts(array(
            'title'           => '',
            'subtitle'        => '',
            'icon'            => '',
            'icon_size'       => '',
            'icon_color'      => '',
            'image'           => '',
            'icon_position'   => 'top',
            'link'            => '',
            'skin_text'       => '',
            'target'          => '',
            'animate'         => '',
            'el_class'        => '',
            'bg_color'        => ''
         ), $attr));


         // target
         if( $target ){
            $target = 'target="_blank"';
         } else {
            $target = false;
         }

         if($image){
            $image = $base_url . '/' .$image; 
         }

         $class = array();
         if($el_class){ $class[] = $el_class; }
         $class[] = $icon_position;
         if($skin_text){$class[] = $skin_text;}

         //Background color
         $style = array();
         if($bg_color){
            $style[] = 'background-color: ' . $bg_color;
         }
         $style_icon = array();
         if($icon_size){
            $style_icon[] = 'font-size: ' . (14 + 2*$icon_size) .'px';
         }
         if($icon_color){
            $style_icon[] = 'color: ' . $icon_color;
         }

         ?>

         <div class="widget gsc-icon-box <?php if(count($class)>0) print implode($class, ' ') ?>" <?php if(count($style) > 0) print 'style="'.implode($style, ';').'"' ?>>
            
            <?php if($image){ ?>
               <div class="highlight-image"><img src="<?php print $image ?>" alt=""/></div>
            <?php }?>

            <?php if($icon){ ?>
               <div class="highlight-icon"><span class="icon <?php print $icon ?>"<?php if(count($style_icon) > 0) print ' style="'.implode($style_icon, ';').'"' ?>>&nbsp;</span></div>
            <?php }?>

            <div class="highlight_content">
               <h4><?php print $title; ?></h4>
               <?php if($subtitle){ ?>
                  <div class="subtitle"><?php print $subtitle; ?></div>
               <?php } ?>
               <div class="desc"><?php print do_shortcode($content); ?></div>
            </div>
         </div>

       <?php
      }

      public function load_shortcode(){
         add_shortcode( 'icon_box', array('gsc_icon_box', 'sc_icon_box') );
      }
   }
endif;   




