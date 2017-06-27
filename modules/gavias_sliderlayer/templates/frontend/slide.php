<li <?php print $attributes;?>>
   <?php if(isset($slide->video_source) && (isset($slide->youtube_video) || isset($slide->vimeo_video)) && $slide->video_source && ($slide->youtube_video || $slide->vimeo_video)){ ?>
      <div <?php print $attributes_video;?>></div>
   <?php } ?>
	<?php print $content;?>
</li>