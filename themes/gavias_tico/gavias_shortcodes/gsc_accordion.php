<?php 
namespace Drupal\gavias_blockbuilder\shortcodes;
if(!class_exists('gsc_accordion')):
   class gsc_accordion{
      public function render_form(){
         $fields = array(
            'type'      => 'gsc_accordion',
            'title'  => t('Accordion'), 
            'size'      => 3, 
            
            'fields' => array(
               array(
                  'id'     => 'title',
                  'type'      => 'text',
                  'title'  => t('Title'),
                  'class'     => 'display-admin'
               ),
               array(
                  'id'     => 'tabs',
                  'type'      => 'tabs',
                  'title'  => t('Accordion'),
                  'desc'      => t('You can use Drag & Drop to set the order.'),
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
         print self::sc_accordion( $item['fields'] );
      }

      public static function sc_accordion( $attr, $content = null ){
         extract(shortcode_atts(array(
            'title'     => '',
            'tabs'      => '',
            'animate'   => '',
            'el_class'  => ''
         ), $attr));
         $_id = 'accordion-' . gavias_blockbuilder_makeid();
         $classes = $el_class;
         if($animate){
            $classes .= ' wow';
            $classes .= ' '. $animate;
         }
         ?>
          <?php ob_start() ?>
         <div class="panel-group <?php print $classes ?>" id="<?php print $_id; ?>" role="tablist" aria-multiselectable="true">
           <?php
            if( is_array( $tabs ) ){ 
               $i=0;
               foreach( $tabs as $tab ){ $i++;
            ?>
               <div class="panel panel-default">
                  <div class="panel-heading" role="tab">
                     <h4 class="panel-title">
                       <a role="button" data-toggle="collapse" class="<?php print ($i == 1) ? '' : 'collapsed' ?>" data-parent="#<?php print $_id; ?>" href="#<?php print ($_id . '-' . $i) ?>" aria-expanded="true" aria-controls="collapseOne">
                         <?php print $tab['title'] ?>
                       </a>
                     </h4>
                  </div>
                  <div id="<?php print ($_id . '-' . $i) ?>" class="panel-collapse collapse<?php if($i==1) print ' in' ?>" role="tabpanel">
                     <div class="panel-body">
                        <?php print do_shortcode($tab['content']) ?>
                     </div>
                  </div>
               </div>
            <?php }
            } 
          ?>   
         </div>
         <?php return ob_get_clean() ?>
      <?php    
      }
      
      public static function sc_accordion_item( $attr, $content = null ){
         extract(shortcode_atts(array(
            'title'  => '',
         ), $attr));

         $output = '<div class="question">';
            $output .= '<div class="title"><i class="icon-plus acc-icon-plus"></i><i class="icon-minus acc-icon-minus"></i>'. $title .'</div>';
            $output .= '<div class="answer">';
               $output .= do_shortcode( $content );   
            $output .= '</div>';
         $output .= '</div>'."\n";
      
         print $output;
      }

      public function load_shortcode(){
         add_shortcode( 'accordion', array($this, 'sc_accordion'));
         add_shortcode( 'accordion_item', array($this, 'sc_accordion_item') );
      }
      
   }

endif;