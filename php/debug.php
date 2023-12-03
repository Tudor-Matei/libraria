<?php

include_once "utils/Key.php";
$new_image_file_path = __DIR__ . "/../src/assets/cdn/978-1234567890";


$result = base64_decode(str_replace(' ', '+', $result));
echo "<div style='background-image: url(\'$result\')'></div>";
