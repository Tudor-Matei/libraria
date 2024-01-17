<?php
include_once 'utils/setup.php';
include_once 'db/connect.php';
include_once "utils/constants.php";
include_once "utils/generate_random_id.php";
include_once "utils/is_valid_isbn.php";

$user_id = trim(filter_var($_POST['user_id'], FILTER_SANITIZE_STRING));
$country = trim(filter_var($_POST['country'], FILTER_SANITIZE_STRING));
$city = trim(filter_var($_POST['city'], FILTER_SANITIZE_STRING));
$street = trim(filter_var($_POST['street'], FILTER_SANITIZE_STRING));
$street_number = trim(filter_var($_POST['streetNumber'], FILTER_SANITIZE_STRING));
$books = trim($_POST['books']);

if (
  !isset($user_id) || !isset($country) || !isset($city) ||
  !isset($street) || !isset($street_number) || !isset($books)
) {
  http_response_code(400);
  echo json_encode(["error" => "Bad order placement input.", "data" => false]);
  die();
}

$books = json_decode($books, associative: true);
if (is_null($books)) {
  http_response_code(400);
  echo json_encode(["error" => "Bad books JSON data.", "data" => false]);
  die();
}

$isbn_in_clause_list = "(";
for ($i = 0; $i < sizeof($books); $i++) {
  $book = $books[$i];
  if (!is_valid_isbn($book["isbn"])) {
    http_response_code(400);
    echo json_encode(["error" => "Did you tamper with the books' ISBNs?", "data" => false]);
    die();
  }

  $isbn_in_clause_list .= "'{$book["isbn"]}'" . ($i !== sizeof($books) - 1 ? ", " : ")");
}

$wanted_books_quantities_query = "SELECT isbn, quantity FROM books WHERE isbn IN ";
$wanted_books_quantities_query .= $isbn_in_clause_list;

try {
  $found_names_and_quantities = mysqli_execute_query($connection, $wanted_books_quantities_query);
  if (!$found_names_and_quantities) {
    http_response_code(500);
    echo json_encode([
      "error" => "There's been an error getting information about the wanted books.",
      "data" => false
    ]);
    die();
  }

  // There should be as many books returned as there are books in the request.
  while ($row = mysqli_fetch_assoc($found_names_and_quantities)) {
    foreach ($books as $book) {

      if ($book["isbn"] === $row["isbn"] && intval($row["quantity"]) - intval($book["quantity"]) < 0) {
        http_response_code(401);
        echo json_encode([
          "error" => "There are not enough books in stock for '{$book['name']}'. (Only {$row['quantity']})",
          "data" => false
        ]);
        die();
      }
    }
  }
} catch (Exception $error) {
  http_response_code(500);
  echo json_encode([
    "error" => "There's been an error getting information about the wanted books. " . $error->getMessage(),
    "data" => false
  ]);
  die();

}

$transaction_query = "INSERT INTO transactions (id, book_isbn, user_id, price, quantity, date) VALUES ";
for ($i = 0; $i < sizeof($books); $i++) {
  $book = $books[$i];

  $this_transaction_id = generate_random_id(6);
  $this_transaction_date = date('Y-m-d H:i:s');

  $book["price"] = floatval(trim($book["price"]));
  $book["quantity"] = intval(trim($book["quantity"]));

  if ($book["price"] === 0 || $book["quantity"] === 0) {
    http_response_code(400);
    echo json_encode(["error" => "Did you tamper with the books?", "data" => false]);
    die();
  }

  $current_book_values =
    "('{$this_transaction_id}', '{$book["isbn"]}', '{$user_id}', {$book["price"]}, {$book["quantity"]}, '{$this_transaction_date}')"
    . ($i !== sizeof($books) - 1 ? ", " : "");

  $transaction_query .= $current_book_values;
}

try {
  $did_execute_transaction_query = mysqli_execute_query($connection, $transaction_query);
  if (!$did_execute_transaction_query) {
    http_response_code(500);
    echo json_encode(["error" => "There's been an error placing the order.", "data" => false]);
    die();
  }

} catch (Exception $exception) {
  http_response_code(500);
  echo json_encode(["error" => "There's been an error placing the order. " . $exception, "query" => $transaction_query, "data" => false]);
  die();
}

echo json_encode([
  "error" => null,
  "data" => true,
]);


// Try to silently update quantities.
/*
UPDATE books 
SET quantity = CASE WHEN isbn = '979-1234567890' AND books.quantity - 1 < 0 THEN 0
				    WHEN isbn = '978-0061140983' AND books.quantity - 1 < 0 THEN 0
                    WHEN isbn = '978-1234567891' AND books.quantity - 1 < 0 THEN 0
                    ELSE books.quantity - 1 END
WHERE isbn IN ('979-1234567890', '978-1234567891', '978-0061140983');
*/
$quantity_update_query = "UPDATE books SET quantity = CASE ";
try {
  foreach ($books as $book)
    $quantity_update_query .= "WHEN isbn = '{$book["isbn"]}' AND books.quantity - {$book["quantity"]} < 0 THEN 0 ";

  $quantity_update_query .= "ELSE books.quantity - {$book["quantity"]} END WHERE isbn IN " . $isbn_in_clause_list;
  mysqli_execute_query($connection, $quantity_update_query);

} catch (Exception $error) {
  echo json_encode(["error" => $error->getMessage(), "query" => $quantity_update_query]);
}