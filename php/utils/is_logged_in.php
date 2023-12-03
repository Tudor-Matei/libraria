<?php
function is_logged_in(mysqli $connection)
{
  if (!isset($_COOKIE['user_key']))
    return false;

  $existance_result = UserKeys::exists($_COOKIE['user_key'], $connection);
  if (isset($existance_result['error']))
    return $existance_result;

  return $existance_result === true;
}