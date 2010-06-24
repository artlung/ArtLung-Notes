<?php
if ($handle = opendir('notes/')) {

    while (false !== ($file = readdir($handle))) {
        $item = json_decode(file_get_contents('notes/' . $file), true);
		if ($item) {
			print "<div class=\"instance savedNote\" id=\"{$item['guid']}\" style=\"top:{$item['top']}px;left:{$item['left']}px;/*height:{$item['height']}px;*/\">";
			print htmlentities($item['content']);
			print "</div>\n";
		}
    }


    closedir($handle);
}
?>