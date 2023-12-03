<?php
function generate_random_id(int $length): string
{
  $random_id = "";
  if ($length < 5)
    $length = 5;

  while ($length > 0) {
    $random_id .= rand(0, 9);
    $length--;
  }


  return $random_id;
}