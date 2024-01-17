<?php
function is_valid_isbn(string $isbn): bool
{
  return strlen($isbn) === 14 && preg_match("/(978|979)-[0-9]{10}/", $isbn);
}