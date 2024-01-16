<?php
include_once 'utils/setup.php';
include_once 'db/connect.php';
include_once "utils/constants.php";

$user_id = trim(filter_var($_POST['user_id'], FILTER_SANITIZE_STRING));

if (!isset($user_id)) {
  http_response_code(400);
  echo json_encode(["error" => "Bad user id input."]);
  die();
}

$user_stats_query = "SELECT
  (SELECT COUNT(*) FROM transactions WHERE user_id = ? AND EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_DATE)) as books_bought_this_month,
  (SELECT COUNT(*) FROM transactions WHERE user_id = ?) as books_bought_in_total,
  (SELECT MAX(price) FROM transactions WHERE user_id = ?) as most_expensive_book_bought,
  (SELECT ROUND(SUM(price), 2) FROM transactions WHERE user_id = ?) as total_money_spent_books
from DUAL;";

$user_transactions_query = "SELECT 
  transactions.id, books.name, books.price, transactions.date 
  FROM transactions, books WHERE transactions.book_isbn = books.isbn AND transactions.user_id = ?;";

if (
  !($user_stats_result = mysqli_execute_query($connection, $user_stats_query, [$user_id, $user_id, $user_id, $user_id])) ||
  !($user_transactions_result = mysqli_execute_query($connection, $user_transactions_query, [$user_id]))
) {
  http_response_code(500);
  echo json_encode(["error" => "There has been an error executing the SQL query to retrieve the stats.", "data" => []]);
  die();
}

$user_transactions = [];
while ($row = mysqli_fetch_assoc($user_transactions_result)) {
  array_push($user_transactions, $row);
}

$user_stats_result_object = mysqli_fetch_assoc($user_stats_result);
if (
  $user_stats_result_object["books_bought_this_month"] === 0 && $user_stats_result_object["books_bought_in_total"] === 0 &&
  is_null($user_stats_result_object["most_expensive_book_bought"]) && is_null($user_stats_result_object["total_money_spent_books"])
)
  $user_stats_result_object = (object) [];


echo json_encode([
  "error" => null,
  "data" => [
    "userStats" => $user_stats_result_object,
    "userTransactions" => $user_transactions
  ]
]);
