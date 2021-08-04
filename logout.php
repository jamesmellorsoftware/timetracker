<?php

require_once("includes/config.php");

Timer::stop_all_timers($session->user_id);

$session->logout();

header("Location: login.php");

?>