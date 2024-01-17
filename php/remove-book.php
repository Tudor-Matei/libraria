<?php

include_once 'utils/setup.php';
include_once 'utils/constants.php';
include_once 'db/connect.php';
include_once 'utils/clear_cookie.php';
include_once "utils/Key.php";
include_once "db/UserKeys.php";
include_once "utils/is_valid_isbn.php";


if (!isset($_COOKIE['admin_token']) || !UserKeys::exists($_COOKIE['admin_token'], $connection)) {
  http_response_code(401);
  echo json_encode(["error" => "You're not logged in as an admin."]);
  die();
}

$decoded_admin_token_key = Key::decode($_COOKIE['admin_token']);

if (!$decoded_admin_token_key) {
  http_response_code(401);
  clear_cookie("admin_token");
  echo json_encode(["error" => "Admin token decode error."]);
  die();
}

$decoded_admin_token = explode("|", $decoded_admin_token_key);
if (sizeof($decoded_admin_token) != 2) {
  http_response_code(401);
  clear_cookie("admin_token");
  echo json_encode(["error" => "Admin token is malformed."]);
  die();
}

$admin_token_expiration_date = (int) $decoded_admin_token[1];
if ($admin_token_expiration_date < time()) {
  http_response_code(401);
  clear_cookie("admin_token");
  echo json_encode(["error" => "Admin session expired."]);
  die();
}

$isbn = trim(filter_var($_POST['isbn'], FILTER_SANITIZE_STRING));
if (!isset($isbn)) {
  http_response_code(400);
  echo json_encode(["error" => "Bad ISBN input."]);
  die();
}

if (!is_valid_isbn($isbn)) {
  http_response_code(400);
  echo json_encode(["error" => "ISBN format is invalid."]);
  die();
}

try {
  if (!mysqli_execute_query($connection, "DELETE FROM books WHERE isbn = ?", [$isbn])) {
    http_response_code(500);
    echo json_encode(["error" => "There has been an error executing the SQL query to add the book to the database."]);
    die();
  }

  if (mysqli_affected_rows($connection) === 0) {
    http_response_code(403);
    echo json_encode(["error" => "There's no book with that ISBN in the database."]);
    die();
  }
} catch (Exception $ex) {
  http_response_code(500);
  $errorMessage = $ex->getMessage();
  echo json_encode(["error" => "Could not add remove the book from the database. Reason: $errorMessage"]);
  die();
}

echo json_encode(["error" => null, "data" => true]);
