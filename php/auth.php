<?php
include_once 'utils/setup.php';
include_once 'db/connect.php';
include_once 'utils/is_logged_in.php';
include_once 'db/UserKeys.php';


$log_in_state = is_logged_in($connection);

if (isset($log_in_state['error'])) {
  http_response_code(500);
  echo json_encode(["error" => "There's been an error trying to check if the user is logged in."]);
  die();
}

echo json_encode(["error" => null, "data" => $log_in_state === true]);