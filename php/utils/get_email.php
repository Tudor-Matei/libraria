<?php
include_once 'setup.php';
function get_email(string $email, mysqli $connection): array
{
  $existing_email_query = "SELECT email FROM users WHERE email=?";
  $statement = mysqli_prepare($connection, $existing_email_query);
  if (!$statement || !mysqli_stmt_bind_param($statement, "s", $email)) {
    mysqli_stmt_close($statement);
    return ["error" => "There has been an error binding parameters to the e-mail query."];
  }

  if (!mysqli_stmt_execute($statement)) {
    mysqli_stmt_close($statement);
    return ["error" => "There has been an error executing the SQL query."];
  }

  $email_fetch_result = mysqli_stmt_get_result($statement);
  if ($email_fetch_result === false) {
    mysqli_stmt_close($statement);
    return ["error" => "There has been an error getting the results about the e-mail."];
  }

  $email_fetch_result_rows = mysqli_fetch_assoc($email_fetch_result);
  if ($email_fetch_result_rows === false) {
    mysqli_stmt_close($statement);
    return ["error" => "There has been fetching the associative array for the e-mail"];
  }

  mysqli_stmt_close($statement);
  return (array) $email_fetch_result_rows;
}