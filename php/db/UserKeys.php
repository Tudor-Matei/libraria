<?php
// when user hits /auth -> get key from http header
// check if key in dict
// if it isn't -> not logged in
// if it is -> decode to get info 
include_once 'connect.php';
class UserKeys
{
  private static function perform_prepared_query(string $key_query, string $received_key, mysqli $connection)
  {
    $statement = mysqli_prepare($connection, $key_query);
    if (!$statement || !mysqli_stmt_bind_param($statement, "s", $received_key)) {
      mysqli_stmt_close($statement);
      return ["error" => "There has been an error binding parameters to the key query."];
    }

    if (!mysqli_stmt_execute($statement)) {
      mysqli_stmt_close($statement);
      return ["error" => "There has been an error executing the SQL query for the key."];
    }

    $key_fetch_result = mysqli_stmt_get_result($statement);
    if ($key_fetch_result === false) {
      // for other successful queries, mysqli_stmt_get_result returns false.
      if (mysqli_stmt_errno($statement) === 0)
        return [];

      mysqli_stmt_close($statement);
      return ["error" => "There has been an error getting results about the key."];
    }

    $key_fetch_result_rows = mysqli_fetch_assoc($key_fetch_result);
    if ($key_fetch_result_rows === false) {
      mysqli_stmt_close($statement);
      return ["error" => "There has been fetching the associative array for the key."];
    }

    mysqli_stmt_close($statement);
    return $key_fetch_result_rows ?? [];
  }


  // $new_key comes from server.
  public static function add(string $new_key, mysqli $connection): bool
  {
    $sql_query = "INSERT INTO user_keys (user_key) VALUES ('{$new_key}')";
    $statement = mysqli_prepare($connection, $sql_query);
    return mysqli_execute($statement);
  }

  public static function get(string $received_key, mysqli $connection): array
  {
    return UserKeys::perform_prepared_query("SELECT user_key FROM user_keys WHERE user_key=?", $received_key, $connection);
  }

  public static function exists(string $received_key, mysqli $connection)
  {
    $result = UserKeys::get($received_key, $connection);
    return isset($result['error']) ? $result : sizeof($result) > 0;
  }

  public static function delete(string $received_key, mysqli $connection)
  {
    return UserKeys::perform_prepared_query("DELETE FROM user_keys WHERE user_key=? LIMIT 1", $received_key, $connection);
  }
}