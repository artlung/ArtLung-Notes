<?php

$stuff = array(
	'guid' => '',
	'top' => '',
	'left' => '',
	'height' => '',
	'content' => '',
);
$save = array();
foreach($stuff as $key => $value) {
	$save[$key] = strip_tags(trim($_POST[$key]));
}

$json_save = json_encode($save);

$filename = 'notes/' . $save['guid'].'.json';
$fp = fopen($filename, 'w');
fwrite($fp, $json_save);
fclose($fp);
print 'ok';

?>