<?php
$ALLOWED_SERVER_ORIGIN = "http://localhost:5173";

$ADMIN_ID = 123456;
$ADMIN_PASSWORD = "admin";

$BOOKS_TABLE = "books";
$PURCHASES_TABLE = "purchases";
$USERS_TABLE = "users";

$dbhost = "localhost";
$dbuser = "root";
$dbpass = "";
$dbname = "libraria";

define("RANDOM_BYTES_STRING", openssl_random_pseudo_bytes(openssl_cipher_iv_length('AES-256-CBC')));


$FIFTEEN_MINUTES_IN_SECONDS = 60 * 15;
