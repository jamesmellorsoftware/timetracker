<?php

require_once("includes/head.php");

if ($session->is_signed_in()) header("Location: index.php");

require_once("subpages/loginreg.php");

require_once("includes/foot.php");

?>