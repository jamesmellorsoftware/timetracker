<?php
require_once("includes/config.php");
$session->logout();
header("Location: login.php");
?>