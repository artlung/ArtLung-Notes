<html>
<head>
<title>ArtLung Notes v2</title>
<!-- Sencha CSS -->
<link rel="stylesheet" href="sencha/resources/css/ext-touch.css" type="text/css">
<!-- Custom CSS -->
<link rel="stylesheet" href="style.css" type="text/css">
<!-- Ext Touch JS -->
<script type="text/javascript" src="sencha/ext-touch-debug.js"> </script>
<!-- Application JS -->
<script type="text/javascript" src="index.js"></script>
</head>
<body>
<div id="everything">
<script>
	document.write(STATE.getSavedNotes());
</script>
<?php
// if ($handle = opendir('notes/')) {
// 
//     /* This is the correct way to loop over the directory. */
//     while (false !== ($file = readdir($handle))) {
//         $item = json_decode(file_get_contents('notes/' . $file), true);
// 		if ($item) {
// 			print "<div class=\"instance savedNote\" id=\"{$item['guid']}\" style=\"top:{$item['top']}px;left:{$item['left']}px;/*height:{$item['height']}px;*/\">";
// 			print htmlentities($item['content']);
// 			print "</div>\n";
// 		}
//     }
// 
// 
//     closedir($handle);
// }
?></div>
</body>
</html>