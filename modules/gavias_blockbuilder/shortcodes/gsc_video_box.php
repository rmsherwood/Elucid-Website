<?php 
namespace Drupal\gavias_blockbuilder\shortcodes;

use Drupal\gavias_blockbuilder\includes\gavias_blockbuilder_embed;
if(!class_exists('gsc_video_box')):
   class gsc_video_box{

      public function render_form(){
         $fields = array(
            'type' => 'gsc_video_box',
            'title' => ('Video Box'), 
            'size' => 3,
            'fields' => array(
         
               array(
                  'id'        => 'title',
                  'type'      => 'text',
                  'title'     => t('Title'),
                  'class'     => 'display-admin'
               ),
                  
               array(
                  'id'        => 'content',
                  'type'      => 'text',
                  'title'     => t('Data Url'),
                  'desc'      => t('example: //player.vimeo.com/video/88558878?color=ffffff&title=0&byline=0&portrait=0'),
               ),
               array(
                  'id'        => 'height',
                  'type'      => 'text',
                  'title'     => t('Data Height box'),
                  'std'       => '800',
                  'desc'      => 'example: 800'
               ),

               array(
                  'id'        => 'image',
                  'type'      => 'upload',
                  'title'     => t('Image Background'),
               ),
               
               array(
                  'id'        => 'animate',
                  'type'      => 'select',
                  'title'     => t('Animation'),
                  'desc'      => t('Entrance animation for element'),
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
         if( ! key_exists('content', $item['fields']) ) $item['fields']['content'] = '';
         print self::sc_video_box( $item['fields'], $item['fields']['content'] );
      }


      public static function sc_video_box( $attr, $content = null ){
         global $base_url;
         extract(shortcode_atts(array(
            'title'           => '',
            'width'           => '100%',
            'height'          => '800',
            'image'           => '',
            'animate'         => '',
            'el_class'        => '',
         ), $attr));

         $style='width:100%; height:'.$height.'px; max-width:100%;';
         $_id = gavias_blockbuilder_makeid();
         if($image){
            $image = $base_url . '/' .$image; 
         }
         $autoembed = new gavias_blockbuilder_embed();
         $video = trim($autoembed->parse($content));
      ?>

      <div class="widget gsc-video-box <?php print $el_class;?> clearfix" style="background-image: url('<?php print $image ?>');<?php print $style; ?>">
         <div class="video-inner">
            <div class="video-body">

               <a class="gsc-video-link" data-toggle="modal" data-target="#<?php print $_id ?>"  data-height="<?php print $height ?>" href="#">
                  <i class="icon-play space-40"></i>
               </a>

               <!-- Modal -->
               <div class="modal fade modal-video-box" id="<?php print $_id ?>" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                 <div class="modal-dialog" role="document">
                   <div class="modal-content">
                     <div class="modal-header">
                       <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                       <h4 class="modal-title" id="myModalLabel"><?php if($title) print $title ; ?></h4>
                     </div>
                     <div class="modal-body">
                        <?php print $video ?>
                     </div>
                     
                   </div>
                 </div>
               </div>

            </div> 
         </div>    
      </div>   

       <?php
      }

      public function load_shortcode(){
         add_shortcode( 'video_box', array('gsc_video_box', 'sc_video_box') );
      }
   }
endif;   




