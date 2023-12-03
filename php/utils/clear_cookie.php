<?php

include_once "constants.php";

function clear_cookie(string $cookieName): bool
{
  return setcookie($cookieName, "", [
    "httponly" => true,
    "path" => "/",
    "expires" => time() - (60 * 15)
  ]);
}