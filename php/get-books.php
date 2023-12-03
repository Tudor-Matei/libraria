<?php
include_once 'utils/setup.php';
include_once 'db/connect.php';
include_once "utils/constants.php";

$filter = trim(filter_var($_POST['filter'], FILTER_SANITIZE_STRING));
$count = trim(filter_var($_POST['count'], FILTER_SANITIZE_STRING));

if (!isset($filter) || !isset($count)) {
  http_response_code(400);
  echo json_encode(["error" => "Bad book fetch input.", "data" => []]);
  die();
}

if ($count !== "*" && intval($count) <= 0) {
  http_response_code(400);
  echo json_encode(["error" => "Bad count input.", "data" => []]);
  die();
}

$filter = $filter === "none" ? "%" : "%" . $filter . "%";
$count = $count == "*" ? 10000 : intval($count);

$retrieve_books_query = "SELECT * FROM books WHERE name LIKE ? LIMIT ?";
$statement = mysqli_prepare($connection, $retrieve_books_query);

if (!mysqli_stmt_bind_param($statement, "si", $filter, $count)) {
  http_response_code(500);
  echo json_encode(["error" => "There has been an error binding parameters to the query.", "data" => []]);
  die();
}

if (!mysqli_stmt_execute($statement)) {
  mysqli_stmt_close($statement);
  http_response_code(500);
  echo json_encode(["error" => "There has been an error executing the SQL query to retrieve the books.", "data" => []]);
  die();
}

$book_fetch_result = mysqli_stmt_get_result($statement);
if ($book_fetch_result === false) {
  mysqli_stmt_close($statement);
  http_response_code(500);
  echo json_encode(["error" => "There has been an error getting the books.", "data" => []]);
  die();
}

$book_data = [];
$index = 0;
while ($row = mysqli_fetch_assoc($book_fetch_result)) {
  if ($row === false) {
    mysqli_stmt_close($statement);
    http_response_code(500);
    echo json_encode(["error" => "There has been an error fetching a book row.", "data" => []]);
    die();
  }

  $book_data[$index++] = $row;
}

if ($book_data === null || sizeof($book_data) < 1) {
  mysqli_stmt_close($statement);
  echo json_encode(["error" => null, "data" => []]);
  die();
}


echo json_encode([
  "error" => null,
  "data" => $book_data
]);