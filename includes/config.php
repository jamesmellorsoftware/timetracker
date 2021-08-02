<?php

// Database connection constants
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'timetracker');

// require_onces for all created classes
require_once('db.php');
require_once('session.php');
require_once('db_objects.php');
require_once('user.php');

// Lengths for inputs based on DB maximums
defined("LIMIT_PASSWORD") ? null : define("LIMIT_PASSWORD", 30);
defined("LIMIT_TASKNAME") ? null : define("LIMIT_TASKNAME", 30);
defined("LIMIT_USERNAME") ? null : define("LIMIT_USERNAME", 30);
defined("LIMIT_TIMER_NAME") ? null : define("LIMIT_TIMER_NAME", 30);

?>