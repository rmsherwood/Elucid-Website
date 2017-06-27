<?php 
namespace Drupal\gavias_blockbuilder\shortcodes;
if(!class_exists('gsc_chart')):
   class gsc_chart{

      public function render_form(){
         $fields = array(
            'type' => 'gsc_chart',
            'title' => ('Chart'),
            'size' => 3,
            'fields' => array(
               array(
                  'id'        => 'title',
                  'type'      => 'text',
                  'title'     => t('Title'),
                  'class'     => 'display-admin'
               ),
               array(
                  'id'        => 'percent',
                  'type'      => 'text',
                  'title'     => t('Percent'),
                  'desc'      => t('Number between 0-100'),
               ),
               array(
                  'id'        => 'icon',
                  'type'      => 'text',
                  'title'     => t('Chart Icon'),
               ),
               array(
                  'id'        => 'content',
                  'type'      => 'textarea',
                  'title'     => t('Chart Content'),
               ),
               array(
                  'id'        => 'color',
                  'type'      => 'text',
                  'title'     => t('Chart color'),
                  'desc'      => t('Use color name ( blue ) or hex ( #2991D6 )'),
               ),
               array(
                  'id'     => 'animate',
                  'type'      => 'select',
                  'title'  => ('Animation'),
                  'desc'  => t('Entrance animation for element'),
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
         print self::sc_chart( $item['fields'],  $item['fields']['content'] );
      }


      public static function sc_chart( $attr, $content = null ){
         extract(shortcode_atts(array(
            'title'     => '',
            'percent'   => '',
            'label'     => '',
            'icon'      => '',
            'color'     => '',
         ), $attr));
         if(!$color) $color = '#008FD5';
         ?>
         <div class="widget gsc-chart">
            <div class="pieChart" data-bar-color="<?php print $color ?>" data-bar-width="150" data-percent="<?php print $percent ?>">
               <span><?php print $percent; ?>%</span>  
            </div>
            <div class="content">
            <?php if($icon){ ?>
               <div class="icon" <?php if($color) print 'style="color:'.$color.';"' ?>><i class="<?php print $icon ?>"></i></div>
            <?php } ?>
            <?php if($title){ ?>   
               <div class="title"><span><?php print $title; ?></span></div>  
            <?php } ?>  
            <?php if($content){ ?>   
               <div class="content"><?php print $content; ?></div>
            <?php } ?>   
            </div>
         </div>      
         <?php
      }

      public function load_shortcode(){
         add_shortcode( 'chart', array('gsc_chart', 'sc_chart') );
      }
   }
 endif;  



