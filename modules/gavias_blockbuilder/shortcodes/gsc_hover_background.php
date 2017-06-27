<?php 
namespace Drupal\gavias_blockbuilder\shortcodes;
if(!class_exists('gsc_hover_background')):
   class gsc_hover_background{
      public function render_form(){
         return array(
           'type'          => 'gsc_hover_background',
            'title'        => t('Hover Background'),
            'size'         => 3,
            'icon'         => 'fa fa-bars',
            'fields' => array(
            
               array(
                  'id'        => 'title',
                  'type'      => 'text',
                  'title'     => t('Title'),
                  'class'     => 'display-admin',
               ),

                array(
                  'id'        => 'icon',
                  'type'      => 'text',
                  'title'     => t('Icon'),
                  'class'     => 'display-admin',
               ),

               array(
                  'id'        => 'background',
                  'type'      => 'upload',
                  'title'     => t('Background images')
               ),
         
               array(
                  'id'        => 'background_color',
                  'type'      => 'text',
                  'title'     => t('Background color'),
                  'desc'      => t('Use color name ( blue ) or hex ( #2991D6 )'),
                  'class'     => 'small-text',
                  'std'       => '#2991D6',
               ),
            

               array(
                  'id'        => 'content',
                  'type'      => 'textarea',
                  'title'     => t('Content'),
                  'desc'      => t('Some Shortcodes and HTML tags allowed'),
                  'class'     => 'full-width sc',
               ),

               array(
                  'id'        => 'link',
                  'type'      => 'text',
                  'title'     => t('Link'),
               ),

               array(
                  'id'        => 'text_link',
                  'type'      => 'text',
                  'title'     => t('Text Link'),
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
            print self::sc_hover_background( $item['fields'], $item['fields']['content'] );
      }

      public static function sc_hover_background( $attr, $content = null ){
         global $base_url, $base_path;
         extract(shortcode_atts(array(
            'title'              => '',
            'icon'               => '',
            'background'         => '',
            'background_color'   => '',
            'link'               => '',
            'text_link'          => '',
            'target'             => '',
            'el_class'           => ''
         ), $attr));

         // target
         if( $target ){
            $target = 'target="_blank"';
         } else {
            $target = false;
         }
         
         if($background){
            $background = substr($base_path, 0, -1) . $background; 
         }

         $style = '';
          if($background_color){
            $style = 'style="background: ' . $background_color . '"';
         }

         $style_hover = '';
         if($background){
            $style_hover = 'style="background: url(\''.$background.'\') no-repeat center center"';
         }

         ?>

         <div class="gsc-hover-background clearfix <?php print $el_class; ?>">
            <div class="front" <?php print $style; ?>>
               <?php if($icon){ ?>
                  <div class="icon"><i class="<?php print $icon ?>"></i></div>
               <?php } ?>   
               <?php if($title){ ?>
                  <h2><?php print $title ?></h2>
               <?php } ?>  
            </div>  

            <div <?php print $style_hover; ?> class="back">
               <div class="content">
                  <div class="content-text"><?php print $content; ?></div>
                  <?php if($link){ ?>
                     <div class="readmore"><a class="btn-theme btn btn-sm" href="<?php print $link ?>"><?php print $text_link ?></a></div>
                  <?php } ?>
               </div>
            </div>   
         </div>

        <?php            
      } 

      public function load_shortcode(){
         add_shortcode( 'hover_background', array('gsc_hover_background', 'sc_hover_background'));
      }
   }
endif;   
