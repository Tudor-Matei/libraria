<?php
$ALLOWED_SERVER_ORIGIN = "http://localhost:5173";

$ADMIN_ID = 123456;
$ADMIN_PASSWORD = "admin";

$BOOKS_TABLE = "books";
$TRANSACTIONS_TABLE = "transactions";
$USERS_TABLE = "users";

$dbhost = "localhost";
$dbuser = "root";
$dbpass = "admin";
$dbname = "libraria";

define("RANDOM_BYTES_STRING", openssl_random_pseudo_bytes(openssl_cipher_iv_length('AES-256-CBC')));


$FIFTEEN_MINUTES_IN_SECONDS = 60 * 15;
