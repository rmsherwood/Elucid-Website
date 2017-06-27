<?php 
namespace Drupal\gavias_blockbuilder\shortcodes;
if(!class_exists('gsc_hover_box')):
   class gsc_hover_box{
      
      public function render_form(){
         $fields = array(
            'type'            => 'gsc_hover_box',
            'title'           => t('Hover Box'),
            'size'            => 3,
            'icon'            => 'fa fa-bars',
            'fields' => array(
               array(
                  'id'        => 'title',
                  'type'      => 'text',
                  'title'     => 'Title for box',
                  'class'     => 'display-admin'
               ),
               array(
                  'id'        => 'icon',
                  'type'      => 'text',
                  'title'     => t('Icon'),
               ),
               array(
                  'id'        => 'icon_image',
                  'type'      => 'upload',
                  'title'     => t('Icon Image'),
               ),
               array(
                  'id'        => 'content',
                  'type'      => 'textarea',
                  'title'     => t('Content for box'),
               ),
               array(
                  'id'        => 'text_link',
                  'type'      => 'text',
                  'title'     => t('Text Link'),
                  'std'       => 'Read more'
               ),
               array(
                  'id'        => 'link',
                  'type'      => 'text',
                  'title'     => t('Link'),
               ),
               array(
                  'id'        => 'target',
                  'type'      => 'select',
                  'title'     => t('Open in new window'),
                  'desc'      => t('Adds a target="_blank" attribute to the link'),
                  'options'   => array( 0 => 'No', 1 => 'Yes' ),
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
         print self::sc_hover_box( $item['fields'] );
      }

      public static function sc_hover_box( $attr, $content = null ){
         global $base_url;
         extract(shortcode_atts(array(
            'icon'                  => 'fa fa-bars',
            'icon_image'            => '',
            'title'                 => '',
            'content'               => '',
            'text_link'             => '',
            'link'                  => '',
            'target'                => '',
            'el_class'              => ''
         ), $attr));

         if($icon_image){
            $icon_image = $base_url . '/' .$icon_image; 
         }

         // target
         if( $target ){
            $target = 'target="_blank"';
         } else {
            $target = false;
         }

         ?>
         <div class="widget gsc-hover-box gavias-metro-box clearfix <?php print $el_class; ?>">
            <div class="icon">
               <?php if($icon_image){ ?><img src="<?php print $icon_image ?>" alt="<?php print strip_tags($title) ?>" /> <?php } ?>
               <?php if($icon){ ?><span class="<?php print $icon ?>"></span> <?php } ?>
            </div>
            <div class="box-title"><?php print $title ?></div>
            <div class="content"><?php print $content ?></div>
            <div class="link">
               <a <?php if($link) print 'href="'. $link .'"' ?> <?php print $target ?> ><?php print $text_link ?></a>
            </div>
         </div>
         <?php
      }

      public function load_shortcode(){
         add_shortcode( 'hover_box', array('gsc_hover_box', 'sc_hover_box') );
      }
   }
endif;   




