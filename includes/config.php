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

?>