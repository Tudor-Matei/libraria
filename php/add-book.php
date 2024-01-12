<?php

include_once 'utils/setup.php';
include_once 'utils/constants.php';
include_once 'db/connect.php';
include_once 'utils/clear_cookie.php';
include_once "utils/Key.php";
include_once "db/UserKeys.php";


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
$name = trim(filter_var($_POST['name'], FILTER_SANITIZE_STRING));
$author = trim(filter_var($_POST['author'], FILTER_SANITIZE_STRING));
$genre = trim(filter_var($_POST['genre'], FILTER_SANITIZE_STRING));
$published_at = trim(filter_var($_POST['published_at'], FILTER_SANITIZE_STRING));
$pages = trim(filter_var($_POST['pages'], FILTER_SANITIZE_STRING));
$quantity = trim(filter_var($_POST['quantity'], FILTER_SANITIZE_STRING));
$price = trim(filter_var($_POST['price'], FILTER_SANITIZE_STRING));
$image = trim(filter_var($_POST['image'], FILTER_SANITIZE_STRING));

if (
  !isset($isbn) || !isset($name) || !isset($genre) ||
  !isset($pages) || !isset($quantity) || !isset($price) ||
  !isset($image)
) {
  http_response_code(400);
  echo json_encode(["error" => "Bad book input."]);
  die();
}

if (!preg_match("/(978|979)-[0-9]{10}/", $isbn)) {
  http_response_code(400);
  echo json_encode(["error" => "ISBN format is invalid."]);
  die();
}

if (intval($pages) == 0 && $pages != "0") {
  http_response_code(400);
  echo json_encode(["error" => "Invalid pages number."]);
  die();
}

$pages = intval($pages);


if (intval($quantity) == 0 && $quantity != "0") {
  http_response_code(400);
  echo json_encode(["error" => "Invalid quantity number."]);
  die();
}

$quantity = intval($quantity);


if (floatval($price) == 0 && $price != "0") {
  http_response_code(400);
  echo json_encode(["error" => "Invalid price number."]);
  die();
}

$price = floatval($price);

$author = $author == "" ? null : $author;

$relative_image_file_path = "src/assets/cdn/$isbn.jpg";

if (!$published_at)
  $published_at = null;

$insert_book_query = "INSERT INTO books (isbn, name, author, genre, published_at, pages, quantity, price, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
$statement = mysqli_prepare($connection, $insert_book_query);

if (!mysqli_stmt_bind_param($statement, "sssssiids", $isbn, $name, $author, $genre, $published_at, $pages, $quantity, $price, $relative_image_file_path)) {
  http_response_code(500);
  echo json_encode(["error" => "There has been an error binding parameters to the query."]);
  die();
}

try {
  if (!mysqli_stmt_execute($statement)) {
    mysqli_stmt_close($statement);
    http_response_code(500);
    echo json_encode(["error" => "There has been an error executing the SQL query to add the book to the database."]);
    die();
  }

  $new_image_file_path = __DIR__ . "/../$relative_image_file_path";
  $image = str_replace(' ', '+', $image);
  file_put_contents($new_image_file_path, base64_decode(substr($image, strpos($image, ",") + 1)));

} catch (Exception $ex) {
  mysqli_stmt_close($statement);
  http_response_code(500);
  $errorMessage = $ex->getMessage();
  echo json_encode(["error" => "Could not add the book to the database. Reason: $errorMessage"]);
  die();
}

mysqli_stmt_close($statement);
echo json_encode(["error" => null, "data" => true]);
