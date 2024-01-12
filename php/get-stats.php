<?php
include_once 'utils/setup.php';
include_once 'db/connect.php';
include_once "utils/constants.php";

$books_count_query = "SELECT COUNT(*) FROM books";
$genres_count_query = "SELECT COUNT(DISTINCT genre) FROM books";
$transactions_count_query = "SELECT COUNT(*) FROM transactions";
if (
  !($books_count_result = mysqli_execute_query($connection, $books_count_query)) ||
  !($genres_count_result = mysqli_execute_query($connection, $genres_count_query)) ||
  !($transactions_count_result = mysqli_execute_query($connection, $transactions_count_query))
) {
  http_response_code(500);
  echo json_encode(["error" => "There has been an error executing the SQL query to retrieve the stats.", "data" => []]);
  die();
}

echo json_encode([
  "error" => null,
  "data" => [
    "bookCount" => mysqli_fetch_assoc($books_count_result)["COUNT(*)"],
    "genreCount" => mysqli_fetch_assoc($genres_count_result)["COUNT(DISTINCT genre)"],
    "transactionCount" => mysqli_fetch_assoc($transactions_count_result)["COUNT(*)"],
  ]
]);