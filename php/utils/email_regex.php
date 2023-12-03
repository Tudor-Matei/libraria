<?php
// https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
function is_email_valid(string $email): bool
{
  return preg_match("/^[^\s@]+@[^\s@]+\.[^\s@]+$/", $email);
}