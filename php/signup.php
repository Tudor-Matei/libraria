<?php
include_once 'utils/setup.php';
include_once 'db/connect.php';
include_once 'utils/email_regex.php';
include_once 'utils/generate_random_id.php';
include_once 'utils/get_email.php';
include_once 'db/UserKeys.php';
include_once 'utils/Key.php';
include_once 'utils/is_logged_in.php';


$log_in_state = is_logged_in($connection);
if (isset($log_in_state['error'])) {
  http_response_code(500);
  echo json_encode(["error" => "There's been an error trying to check if the user is logged in."]);
  die();
}

if ($log_in_state === true) {
  http_response_code(401);
  echo json_encode(["error" => "User is logged in."]);
  die();
}

if (!isset($_POST['fname']) || !isset($_POST['lname']) || !isset($_POST['email']) || !isset($_POST['password'])) {
  http_response_code(400);
  echo json_encode(["error" => "Bad user input."]);
  die();
}

$fname = trim(filter_var($_POST['fname'], FILTER_SANITIZE_STRING));
$lname = trim(filter_var($_POST['lname'], FILTER_SANITIZE_STRING));
$email = trim(filter_var($_POST['email'], FILTER_SANITIZE_EMAIL));
$password = trim(filter_var($_POST['password'], FILTER_SANITIZE_STRING));

if (strlen($fname) < 2) {
  http_response_code(400);
  echo json_encode(["error" => "First name length is too small."]);
  die();
} else if (strlen($lname) < 2) {
  http_response_code(400);
  echo json_encode(["error" => "Last name length is too small."]);
  die();
} else if (!is_email_valid($email)) {
  http_response_code(400);
  echo json_encode(["error" => "E-mail is invalid."]);
  die();
} else if (strlen($password) < 8) {
  http_response_code(400);
  echo json_encode(["error" => "Password length is too small."]);
  die();
}

$existing_email = get_email($email, $connection);
if (isset($existing_email['error'])) {
  http_response_code(500);
  echo json_encode($existing_email);
  die();
}

if (sizeof($existing_email) !== 0) {
  http_response_code(401);
  echo json_encode(["error" => "That e-mail already exists."]);
  die();
}

$user_id = generate_random_id(6);
$password = password_hash($password, PASSWORD_BCRYPT);
$sql_query = "INSERT INTO users (id, fname, lname, email, password) VALUES (?,?,?,?,?)";

$statement = mysqli_prepare($connection, $sql_query);
if (!mysqli_stmt_bind_param($statement, "sssss", $user_id, $fname, $lname, $email, $password)) {
  http_response_code(500);
  echo json_encode(["error" => "There has been an error binding parameters to the query."]);
  die();
}

$did_insert_into_db = mysqli_stmt_execute($statement);
$did_close_statement_successfully = mysqli_stmt_close($statement);
if (!$did_close_statement_successfully) {
  http_response_code(500);
  echo json_encode(["error" => "There has been an error closing the statement."]);
  die();
}

if (!$did_insert_into_db) {
  http_response_code(500);
  echo json_encode(["error" => "There has been an error inserting the user into the database."]);
  die();
}

$user_key = hash("sha256", $user_id . $fname . $lname . $email);
$did_add_user_key = UserKeys::add($user_key, $connection);



if (!$did_add_user_key) {
  http_response_code(500);
  echo json_encode(["error" => "There has been an internal error regarding the user key (tried adding it to db)."]);
  die();
}

if (!setcookie("user_key", $user_key, ["httponly" => true, "path" => "/"])) {
  UserKeys::delete($user_key, $connection);
  http_response_code(500);
  echo json_encode(["error" => "There has been an internal error regarding the user key (tried setting HttpOnly cookie)."]);
  die();
}

echo json_encode([
  "error" => null,
  "data" =>
    ["fname" => $fname, "lname" => $lname, "email" => $email, "user_id" => $user_id]
]);