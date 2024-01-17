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
  echo json_encode(["error" => "You're not logged in as an admin.", "data" => false]);
  die();
}

$decoded_admin_token_key = Key::decode($_COOKIE['admin_token']);

if (!$decoded_admin_token_key) {
  http_response_code(401);
  clear_cookie("admin_token");
  echo json_encode(["error" => "Admin token decode error.", "data" => false]);
  die();
}

$decoded_admin_token = explode("|", $decoded_admin_token_key);
if (sizeof($decoded_admin_token) != 2) {
  http_response_code(401);
  clear_cookie("admin_token");
  echo json_encode(["error" => "Admin token is malformed.", "data" => false]);
  die();
}

$admin_token_expiration_date = (int) $decoded_admin_token[1];
if ($admin_token_expiration_date < time()) {
  http_response_code(401);
  clear_cookie("admin_token");
  echo json_encode(["error" => "Admin session expired.", "data" => false]);
  die();
}

$target_isbn = trim(filter_var($_POST['target_isbn'], FILTER_SANITIZE_STRING));
$name = trim(filter_var($_POST['name'], FILTER_SANITIZE_STRING));
$author = trim(filter_var($_POST['author'], FILTER_SANITIZE_STRING));
$genre = trim(filter_var($_POST['genre'], FILTER_SANITIZE_STRING));
$published_at = trim(filter_var($_POST['published_at'], FILTER_SANITIZE_STRING));
$pages = trim(filter_var($_POST['pages'], FILTER_SANITIZE_STRING));
$quantity = trim(filter_var($_POST['quantity'], FILTER_SANITIZE_STRING));
$price = trim(filter_var($_POST['price'], FILTER_SANITIZE_STRING));
$image = trim(filter_var($_POST['image'], FILTER_SANITIZE_STRING));

if (
  !isset($target_isbn)
) {
  http_response_code(400);
  echo json_encode(["error" => "Bad book input.", "data" => false]);
  die();
}

if (!is_valid_isbn($target_isbn)) {
  http_response_code(400);
  echo json_encode(["error" => "Target ISBN format is invalid.", "data" => false]);
  die();
}

$relative_image_file_path = "src/assets/cdn/$target_isbn.jpg";

$update_book_query = "UPDATE books SET ";
$parameters = [];

if (!empty($name)) {
  $update_book_query .= "name = ?, ";
  array_push($parameters, $name);
}

if (!empty($author)) {
  $update_book_query .= "author = ?, ";
  array_push($parameters, $author);
}

if (!empty($genre)) {
  $update_book_query .= "genre = ?, ";
  array_push($parameters, $genre);
}

if (!empty($published_at)) {
  $update_book_query .= "published_at = ?, ";
  array_push($parameters, $published_at);
}

if (!empty($pages) && intval($pages) != 0 || $pages == "0") {
  $update_book_query .= "pages = ?, ";
  array_push($parameters, $pages);
}

if (!empty($quantity) && intval($quantity) != 0 || $quantity == "0") {
  $update_book_query .= "quantity = ?, ";
  array_push($parameters, $quantity);
}

if (!empty($price) && floatval($price) != 0 || $price == "0") {
  $update_book_query .= "pages = ?, ";
  array_push($parameters, $price);
}

// Remove last comma
$update_book_query = substr($update_book_query, 0, strlen($update_book_query) - 2);
$update_book_query .= " WHERE isbn = ?";
array_push($parameters, $target_isbn);

try {
  if (sizeof($parameters) > 1) {
    $update_query_result = mysqli_execute_query($connection, $update_book_query, $parameters);
    if (!$update_query_result) {
      http_response_code(500);
      echo json_encode(["error" => "There has been an error executing the SQL query to add the book to the database.", "data" => false]);
      die();
    }

    if (mysqli_affected_rows($connection) == 0) {
      http_response_code(400);
      echo json_encode(["error" => "There's no book with that ISBN, or nothing was changed.", "data" => false]);
      die();
    }
  }

  // If the size is <= 1 then it's possible that the admin chose to edit the image.
  $new_image_file_path = __DIR__ . "/../$relative_image_file_path";
  if (!empty($image)) {
    $image = str_replace(' ', '+', $image);
    file_put_contents($new_image_file_path, base64_decode(substr($image, strpos($image, ",") + 1)));
  }
} catch (Exception $ex) {
  http_response_code(500);
  $errorMessage = $ex->getMessage();
  echo json_encode(["error" => "Could not add the book to the database. Reason: $errorMessage", "data" => false]);
  die();
}

echo json_encode(["error" => null, "data" => true]);
