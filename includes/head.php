<?php
require_once("includes/variables.php");
require_once("includes/config.php");
$page = basename($_SERVER['PHP_SELF']);
?>

<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title><?php echo PAGE_TITLE; ?></title>

    <link rel="stylesheet" href="css/main.css">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>

    <?php if ($page === "register.php" || $page === "login.php") { ?>
        <script src="js/loginreg.js"></script>
    <?php } ?>
    
    <?php if ($page == "index.php") { ?>
        <script src="js/main.js"></script>
    <?php } ?>

</head>

<body>
<?php require_once("subpages/loading.php"); ?>