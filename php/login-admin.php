<?php
include_once 'utils/setup.php';
include_once 'utils/constants.php';
include_once 'db/connect.php';
include_once "utils/Key.php";
include_once "db/UserKeys.php";
include_once "utils/clear_cookie.php";

$id = trim(filter_var($_POST['id'], FILTER_SANITIZE_STRING));
$password = trim(filter_var($_POST['password'], FILTER_SANITIZE_STRING));

if (isset($_COOKIE['admin_token'])) {
  clear_cookie("admin_token");
}

if (!isset($id) || !isset($password)) {
  http_response_code(400);
  echo json_encode(["error" => "Bad admin input."]);
  die();
}

if (empty($id) || empty($password)) {
  http_response_code(400);
  echo json_encode(["error" => "ID or password missing."]);
  die();
}

if ($id != $ADMIN_ID || $password != $ADMIN_PASSWORD) {
  http_response_code(401);
  echo json_encode(["error" => "Admin ID or password incorrect."]);
  die();
}

$expiration_date = new DateTime("now");
$expiration_date->modify("+15 minutes");

$logged_admin_token = Key::encode($_SERVER['REMOTE_ADDR'] . "|" . $expiration_date->getTimestamp());

if (!$logged_admin_token) {
  http_response_code(500);
  echo json_encode(["error" => "There has been an internal error creating the admin token."]);
  die();
}

if (!UserKeys::add($logged_admin_token, $connection)) {
  http_response_code(500);
  echo json_encode(["error" => "There has been an internal error adding the admin token to the database."]);
  die();
}

if (
  !setcookie("admin_token", $logged_admin_token, [
    "httponly" => true,
    "path" => "/",
    "expires" => $expiration_date->getTimestamp()
  ])
) {
  Userkeys::delete($logged_admin_token, $connection);
  http_response_code(500);
  echo json_encode([
    "error" => "There has been an internal error regarding the user key (tried setting HttpOnly cookie)."
  ]);
  die();
}

echo json_encode(["error" => null, "data" => $logged_admin_token]);