<?php
include_once 'utils/setup.php';
include_once 'db/connect.php';
include_once 'utils/email_regex.php';
include_once 'db/UserKeys.php';
include_once 'utils/Key.php';
include_once 'utils/is_logged_in.php';
include_once "utils/constants.php";


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

$email = trim(filter_var($_POST['email'], FILTER_SANITIZE_EMAIL));
$password = trim(filter_var($_POST['password'], FILTER_SANITIZE_STRING));

if (!is_email_valid($email)) {
  http_response_code(400);
  echo json_encode(["error" => "The e-mail is not valid."]);
  die();
}

if (strlen($password) < 8) {
  http_response_code(400);
  echo json_encode(["error" => "The password is too small."]);
  die();
}

$retrieve_user_query = "SELECT * FROM users WHERE email=? LIMIT 1";
$statement = mysqli_prepare($connection, $retrieve_user_query);

if (!mysqli_stmt_bind_param($statement, "s", $email)) {
  http_response_code(500);
  echo json_encode(["error" => "There has been an error binding parameters to the query."]);
  die();
}


if (!mysqli_stmt_execute($statement)) {
  mysqli_stmt_close($statement);
  http_response_code(500);
  echo json_encode(["error" => "There has been an error executing the SQL query to retrieve the user."]);
  die();
}

$user_fetch_result = mysqli_stmt_get_result($statement);
if ($user_fetch_result === false) {
  mysqli_stmt_close($statement);
  http_response_code(500);
  echo json_encode(["error" => "There has been an error getting the user."]);
  die();
}

$user_data = mysqli_fetch_assoc($user_fetch_result);
if ($user_data === false) {
  mysqli_stmt_close($statement);
  http_response_code(500);
  echo json_encode(["error" => "There has been an error fetching the associative array for the user."]);
  die();
}

if ($user_data === null || sizeof($user_data) < 1) {
  mysqli_stmt_close($statement);
  http_response_code(401);
  echo json_encode(["error" => "Incorrect email."]);
  die();
}


if (!password_verify($password, $user_data['password'])) {
  mysqli_stmt_close($statement);
  http_response_code(401);
  echo json_encode(["error" => "Incorrect password."]);
  die();
}

$user_key = hash("sha256", $user_data['id'] . $user_data['fname'] . $user_data['lname'] . $user_data['email']);
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
    ["fname" => $user_data['fname'], "lname" => $user_data['lname'], "email" => $user_data['email'], "user_id" => $user_data['id']]
]);