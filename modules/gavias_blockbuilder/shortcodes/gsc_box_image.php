<?php 
namespace Drupal\gavias_blockbuilder\shortcodes;
if(!class_exists('gsc_box_color')):
   class gsc_box_color{
      public function render_form(){
         return array(
           'type'          => 'gsc_box_image',
            'title'        => t('Box Image'),
            'size'         => 3,
            'fields' => array(
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
                  'desc'      => t('Content for box color'),
               ),
               array(
                  'id'        => 'color',
                  'type'      => 'text',
                  'title'     => t('Color for box'),
                  'desc'      => t('Use color name ( blue ) or hex ( #f5f5f5 )')
               ),
               array(
                  'id'        => 'image',
                  'type'      => 'upload',
                  'title'     => t(' Background image'),
                  'desc'      => t('Background image for box color'),
               ),
               array(
                  'id'        => 'icon',
                  'type'      => 'text',
                  'title'     => t('Icon'),
               ),
               array(
                  'id'        => 'link',
                  'type'      => 'text',
                  'title'     => t('Link'),
               ),
               array(
                  'id'        => 'link_title',
                  'type'      => 'text',
                  'title'     => t('Link Title'),
                  'std'       => 'Read more'
               ),
               array(
                  'id'        => 'target',
                  'type'      => 'select',
                  'title'     => t('Open in new window'),
                  'desc'      => t('Adds a target="_blank" attribute to the link'),
                  'options'   => array( 'off' => 'No', 'on' => 'Yes' ),
                  'std'       => 'on'
               ),
               array(
                  'id'        => 'el_class',
                  'type'      => 'text',
                  'title'     => t('Extra class name'),
                  'desc'      => t('Style particular content element differently - add a class name and refer to it in custom CSS.'),
               ),
            ),                                     
         );
      }

      public function render_content( $item ) {
         if( ! key_exists('content', $item['fields']) ) $item['fields']['content'] = '';
            print self::sc_box_image( $item['fields'], $item['fields']['content'] );
      }

      public static function sc_box_image( $attr, $content = null ){
         global $base_url, $base_path;
         extract(shortcode_atts(array(
            'title'              => '',
            'color'              => '',
            'image'              => '',
            'icon'               => '',
            'link'               => '',
            'link_title'         => 'Readmore',
            'target'             => '',
            'el_class'           => ''
         ), $attr));

         // target
         if( $target ){
            $target = 'target="_blank"';
         } else {
            $target = false;
         }
         if($image) $image = substr($base_path, 0, -1) . $image;
        
         ?>
            <div class="widget gsc-box-image<?php if($el_class) print (' '.$el_class) ?>">
              <div class="image text-center">
                  <img src="<?php print $image ?>" alt="<?php print $title ?>"/>
              </div>
              <div class="body text-center"<?php if($color) print ' style="border-top-color:'.$color.';"' ?>>
                  <?php if($icon){ ?>
                     <div class="icon"<?php if($color) print ' style="background-color:'.$color.';"' ?>><i class="<?php print $icon; ?>"></i></div>
                  <?php } ?>
                  <div class="content">
                     <div class="title"><h3><?php print $title ?></h3></div>
                     <div class="desc"><?php print $content ?></div>
                     <?php if($link){ ?>
                        <div class="readmore"><a class="btn-theme" href="<?php print $link ?>"><?php print $link_title ?></a></div>
                     <?php } ?>
                  </div>
              </div>
           </div>
      <?php
      } 

      public function load_shortcode(){
         add_shortcode( 'box_image', array('gsc_box_image', 'sc_box_image'));
      }
   }
endif;   
