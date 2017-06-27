<?php 
namespace Drupal\gavias_blockbuilder\shortcodes;
if(!class_exists('gsc_counter')):
   class gsc_counter{
      public function render_form(){
         $fields = array(
            'type' => 'gsc_counter',
            'title' => ('Counter'),
            'size' => 3,
            'fields' => array(
               array(
                  'id'        => 'title',
                  'title'     => t('Title'),
                  'type'      => 'text',
                  'class'     => 'display-admin'
               ),
               array(
                  'id'        => 'icon',
                  'title'     => t('Icon'),
                  'type'      => 'text',
                  'std'       => 'fa fa-thumbs-up',
               ),
               array(
                  'id'        => 'number',
                  'title'     => t('Number'),
                  'type'      => 'text',
               ),
               array(
                  'id'        => 'type',
                  'title'     => t('Style'),
                  'type'      => 'select',
                  'options'   => array(
                     'icon-left'     => 'Icon left',
                     'icon-top'   => 'Icon top',
                  ),
                  'std'    => 'icon-left',
               ),
               array(
                  'id'        => 'style_text',
                  'type'      => 'select',
                  'title'     => t('Skin Text for box'),
                  'options'   => array(
                     'text-dark'   => 'Text dark',
                     'text-light'   => 'Text light'
                  ),
                  'std'       => 'text-dark'
               ),
               array(
                  'id'        => 'el_class',
                  'type'      => 'text',
                  'title'     => t('Extra class name'),
                  'desc'      => t('Style particular content element differently - add a class name and refer to it in custom CSS.'),
               ),
               array(
                  'id'     => 'animate',
                  'type'      => 'select',
                  'title'  => t('Animation'),
                  'sub_desc'  => t('Entrance animation'),
                  'options'   => gavias_blockbuilder_animate(),
               ),
         
            ),                                      
         );
         return $fields;
      }


      public function render_content( $item ) {
         print self::sc_counter( $item['fields'] );
      }


      public function sc_counter( $attr, $content = null ){
         extract(shortcode_atts(array(
            'title'         => '',
            'icon'          => '',
            'number'        => '',
            'type'          => 'vertical',
            'el_class'      => '',
            'style_text'    => 'text-light',
            'animate'       => '',
         ), $attr));
         $class = array();
         $class[] = $el_class;
         $class[] = $type;
         $class[] = $style_text;
         ?>
         <div class="widget milestone-block <?php if(count($class) > 0){ print implode($class, ' '); } ?>">
            <?php if($icon){ ?>
               <div class="milestone-icon"><span class="<?php print $icon; ?>"></span></div>
            <?php } ?>   
            <div class="milestone-right">
               <div class="milestone-number"><?php print $number; ?></div>
               <div class="milestone-text"><?php print $title ?></div>
            </div>
         </div>
         <?php
      }

       public function load_shortcode(){
         add_shortcode( 'counter', array('gsc_counter', 'sc_counter' ));
       }
   }
endif;
   



