<?php
include_once "utils/constants.php";

$connection = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
if ($connection === false) {
  echo json_encode(["error" => "Failed to connect to database."]);
  die();
}