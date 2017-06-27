<?php 
namespace Drupal\gavias_blockbuilder\shortcodes;
if(!class_exists('gsc_tabs')):
   global $tabs_array, $tabs_count;
   class gsc_tabs{

      public function render_form(){
         $fields = array(
            'type'   => 'gsc_tabs',
            'title'  => t('Tabs'), 
            'size'   => 3, 
            
            'fields' => array(
         
               array(
                  'id'        => 'title',
                  'type'      => 'text',
                  'title'     => t('Title'),
                  'class'     => 'display-admin'
               ),
            
               array(
                  'id'        => 'tabs',
                  'type'      => 'tabs',
                  'title'     => t('Tabs'),
                  'sub_desc'  => t('To add an <strong>icon</strong> in Title field, please use the following code:<br/><br/>&lt;i class=" icon-lamp"&gt;&lt;/i&gt; Tab Title'),
                  'desc'      => t('You can use Drag & Drop to set the order.'),
               ),
               
               array(
                  'id'        => 'type',
                  'type'      => 'select',
                  'options'   => array(
                     'horizontal'   => 'Horizontal',
                     'vertical'     => 'Vertical', 
                  ),
                  'title'  => t('Style'),
                  'desc'      => t('Vertical tabs works only for column widths: 1/2, 3/4 & 1/1'),
               ),
               
            ),                                          
         );
         return $fields;
      }

      public function render_content( $item ) {
         print self::sc_tabs( $item['fields'] );
      }


      public static function sc_tabs( $attr, $content = null ){
         global $tabs_array, $tabs_count;
         
         extract(shortcode_atts(array(
            'title'  => '',
            'uid' => 'tab-',
            'tabs'   => '',
            'type'   => '',
         ), $attr)); 
         do_shortcode( $content );
         $_id = gavias_blockbuilder_makeid();
         $uid .= $_id;
         // content builder
         if( $tabs ){
            $tabs_array = $tabs;
         }
         
         $output = '<div class="gsc-tabs">';
         if( is_array( $tabs_array ) )
         {
            if( $title ) $output .= '<h4 class="title">'. $title .'</h4>';
            
            $output .= '<div class="tabs_wrapper tabs_'. $type .'">';
     
               // content
               $output .= '<ul class="nav nav-tabs">';
                  $i = 1;
                  $output_tabs = '';
                  foreach( $tabs_array as $tab )
                  {
                     $icon = '';
                     if(isset($tab['icon']) && $tab['icon']){
                        $icon = '<i class="fa ' . $tab['icon'] . '"></i>';
                     }
                     $output .= '<li '.($i==1?'class="active"':'').'><a data-toggle="tab" href="#'. $uid .'-'. $i .'">' . $icon . $tab['title'] .'</a></li>';
                     $output_tabs .= '<div id="'. $uid .'-'. $i .'" class="tab-pane fade in '.($i==1?'active':'').'">'. do_shortcode( $tab['content'] ) .'</div>';
                     $i++;
                  }
               $output .= '</ul>';
               
               // titles
               $output .= '<div class="tab-content">';
                  $output .= $output_tabs;
               $output .= '</div>';
            $output .= '</div>';
            
            $tabs_array = '';
            $tabs_count = 0;  
         }
         $output .= '</div>';
         print $output;
      }



      public static function sc_tab( $attr, $content = null ){
         global $tabs_array, $tabs_count;
         
         extract(shortcode_atts(array(
            'title' => 'Tab title',
         ), $attr));
         
         $tabs_array[] = array(
            'title' => $title,
            'content' => do_shortcode( $content )
         ); 
         $tabs_count++;
      
         return true;
      }

      public function load_shortcode(){
         add_shortcode( 'tabs', array('gsc_tabs', 'sc_tabs') );
         add_shortcode( 'tab', array('gsc_tabs', 'sc_tab') );
      }
   }
endif;


