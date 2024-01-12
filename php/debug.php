<?php
include_once "db/connect.php";

// echo phpinfo();
echo var_dump(mysqli_execute_query($connection, "SELECT COUNT(*) FROM books"));
