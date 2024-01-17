<?php
include_once "constants.php";


mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
header("Access-Control-Allow-Origin: {$ALLOWED_SERVER_ORIGIN}");
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: "application/json"');

// sending JSON does not work as expected with $_POST.
$_POST = json_decode(file_get_contents('php://input'), associative: true);