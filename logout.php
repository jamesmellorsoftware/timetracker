<?php
require_once("includes/config.php");
// set user's timers to active = 0 using $session->user_id
$session->logout();

header("Location: login.php");
?>