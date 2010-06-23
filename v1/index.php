<html>
<head>
<title>Board</title>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js" type="text/javascript"></script>
<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.1/jquery-ui.min.js" type="text/javascript"></script>
<!-- <link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/themes/ui-lightness/jquery-ui.css" type="text/css" media="screen"> -->
<link rel="stylesheet" href="style.css" type="text/css" media="screen">
<script type="text/javascript" src="javascript.js"></script>
<script type="text/javascript" src="jquery.touch.js"></script>
<script type="text/javascript">
$(document).ready(function() {

	$('#everything').bind('click', function(e){
		
		if ($('textarea').length > 0) {
			$('textarea').parents('div.instance').remove();
		}
		var elem = document.createElement('DIV');
		STATE.top = e.pageY;
		STATE.left = e.pageX;
		var e = $(elem).css({
			top: STATE.top,
			left: STATE.left
		}).html('<textarea></textarea>')
		.addClass('instance')
		.bind('click', function(event){
			return false;
		});
		$(this).append(e);
	});
		
	$('textarea').live('mouseleave', function(){
		var val = jQuery.trim($(this).val());
		STATE.content = val;
		if (val == '') {
			$(this).parent().remove();
		} else {
			var div  = $(this).parent();
			div.text(val).css({
				height: '30px'
			});
			STATE.height = 30;
			if ( div.width() !== div[0].clientWidth || div.height () !== div[0].clientHeight ) {
				while (div.width() !== div[0].clientWidth || div.height () !== div[0].clientHeight) {
					var h = div.height() + 10;
					STATE.height = h;
					div.css({
						height: (h) + 'px'
					});     // element just got scrollbars
				}
			}
			STATE.guid = uniqueID()
			div.addClass('savedNote').attr('id', STATE.guid).draggable({
				stop: function() {
					var offset = $(this).offset();
					STATE.guid = $(this).attr('id');
					STATE.top = offset.top;
					STATE.left = offset.left;
					STATE.content = $(this).text();
					STATE.height = $(this).height();
					STATE.save();
				}
			}).touch({
				animate: false,
				sticky: false,
				dragx: true,
				dragy: true,
				rotate: false,
				resort: true,
				scale: false
			});
			STATE.save();
			$(this).remove();
		}
	});
	
	$('.instance a').live('click', function(){
		// alert(1);
		// why doesn't this work?
		var val = jQuery.trim($(this).siblings('textarea').val());
		if (val == '') {
			alert('empty');
			$(this).parent().remove();
		} else {
			$(this).parent().text(val);
			$(this).remove();
		}
	});
	
	$('.savedNote').draggable({
		stop: function() {
			STATE.guid = $(this).attr('id');
			var offset = $(this).offset();
			STATE.top = offset.top;
			STATE.left = offset.left;
			STATE.content = $(this).text();
			STATE.height = $(this).height();
			STATE.save();
		}
	});
	
	// .each(function(){
	// 	var div = $(this);
	// 	// div.css({'height':'10px'});
	// 	if ( div.width() !== div[0].clientWidth || div.height () !== div[0].clientHeight ) {
	// 		while (div.width() !== div[0].clientWidth || div.height () !== div[0].clientHeight) {
	// 			var h = div.height() + 10;
	// 			STATE.height = h;
	// 			div.css({
	// 				height: (h) + 'px'
	// 			});     // element just got scrollbars
	// 		}
	// 	}
	// })
	
	// .touch({
	// 		animate: false,
	// 		sticky: false,
	// 		dragx: true,
	// 		dragy: true,
	// 		rotate: false,
	// 		resort: true,
	// 		scale: false
	// });

});
</script>
</head>
<body>
	<div id="everything"></div>
<?php
if ($handle = opendir('notes/')) {

    /* This is the correct way to loop over the directory. */
    while (false !== ($file = readdir($handle))) {
        $item = json_decode(file_get_contents('notes/' . $file), true);
		if ($item) {
			print "<div class=\"instance savedNote\" id=\"{$item['guid']}\" style=\"top:{$item['top']}px;left:{$item['left']}px;height:{$item['height']}px;\">";
			print htmlentities($item['content']);
			print "</div>\n";
		}
    }


    closedir($handle);
}
?>

</body>
</html>