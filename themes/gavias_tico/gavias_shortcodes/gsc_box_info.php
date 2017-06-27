<?php 
namespace Drupal\gavias_blockbuilder\shortcodes;
if(!class_exists('gsc_box_info')):
   class gsc_box_info{
      public function render_form(){
         return array(
           'type'          => 'gsc_box_info',
            'title'        => t('Box Info Background'),
            'size'         => 3,
            'fields' => array(
               array(
                  'id'        => 'title',
                  'type'      => 'text',
                  'title'     => t('Title'),
                  'class'     => 'display-admin'
               ),
                array(
                  'id'        => 'subtitle',
                  'type'      => 'text',
                  'title'     => t('Sub Title')
               ),
               array(
                  'id'        => 'image',
                  'type'      => 'upload',
                  'title'     => t('Image'),
                  'desc'      => t('Image for box info'),
               ),
               array(
                  'id'        => 'content',
                  'type'      => 'textarea',
                  'title'     => t('Content'),
                  'desc'      => t('Content for box info'),
               ),
               array(
                  'id'        => 'height',
                  'type'      => 'text',
                  'title'     => t('Min height'),
                  'desc'      => t('Min height for content info box. e.g. 300px'),
               ),
               array(
                  'id'        => 'content_align',
                  'type'      => 'select',
                  'title'     => t('Content Align'),
                  'desc'      => t('Align Content for box info'),
                  'options'   => array( 'left' => 'Left', 'right' => 'Right' ),
                  'std'       => 'left'
               ),
               array(
                  'id'        => 'content_bg',
                  'type'      => 'text',
                  'title'     => t('Background content'),
                  'desc'      => t('Background color for content. e.g. #f5f5f5'),
               ),
               array(
                  'id'        => 'content_color',
                  'type'      => 'select',
                  'title'     => t('Skin content'),
                  'desc'      => t('Skin color for text content'),
                  'options'   => array( 'dark' => 'Dark', 'light' => 'Light'  ),
                  'std'       => 'left'
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
            print self::sc_box_info( $item['fields'], $item['fields']['content'] );
      }

      public static function sc_box_info( $attr, $content = null ){
         global $base_url;
         extract(shortcode_atts(array(
            'title'              => '',
            'subtitle'           => '',
            'image'              => '',
            'height'             => '1px',
            'content_align'      => '',
            'content_bg'         => '',
            'content_color'      => 'dark',
            'link'               => '',
            'link_title'         => 'Readmore',
            'target'             => '',
            'el_class'           => '',
            'animate'            => ''
         ), $attr));

         // target
         if( $target ){
            $target = 'target="_blank"';
         } else {
            $target = false;
         }
         if($image) $image = $base_url . $image;

         $style_content = '';
         if($content_bg){
            $style_content = 'style="background-color: ' . $content_bg . '"';
         }
         if($animate){
            $el_class .= ' wow';
            $el_class .= ' '. $animate;
         }

         ?>
            <?php ob_start() ?>
            <div class="widget gsc-box-info <?php print $el_class ?> content-align-<?php print $content_align ?>" style="min-height: <?php print $height; ?>">
               <div class="clearfix">
                  <div class="image" style="background-image:url('<?php print $image ?>')"></div>   
                  <div class="content text-<?php print $content_color ?>" <?php print $style_content ?>>
                     <div class="content-bg" <?php print $style_content ?>></div>
                     <div class="content-inner">
                        <?php if($subtitle){ ?>
                           <div class="subtitle"><span><?php print $subtitle; ?></span></div>
                        <?php } ?>  

                        <?php if($title){ ?>
                           <div class="title"><h2><?php print $title; ?></h2></div>
                         <?php } ?>      

                        <?php if($content){ ?>
                           <div class="desc"><?php print $content; ?></div>
                        <?php } ?>   

                        <?php if($link){ ?>
                           <div class="readmore"><a class="btn-theme btn btn-sm" href="<?php print $link ?>"><?php print $link_title ?></a></div>
                        <?php } ?>
                     </div>
                  </div>
               </div>   
           </div>
           <?php return ob_get_clean() ?>
      <?php
      } 

      public function load_shortcode(){
         add_shortcode( 'box_info', array('gsc_box_info', 'sc_box_info'));
      }
   }
endif;   
