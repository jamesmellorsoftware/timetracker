<?php

require_once("includes/head.php");

// if user is logged in, redirect to index.php

?>

<main class="loginreg">

    <h1 class="loginreg_header">
        Time Tracker
    </h1>

    <form class="loginreg_form" method="post">
        <input type="text" class="loginreg_form_input" name="" placeholder="Username">
        <input type="password" class="loginreg_form_input" name="" placeholder="Password">
        <input type="submit" class="loginreg_form_submit" value="Register">
        <a class="loginreg_form_change">Already have an account? Log in</a>
    </form>

    <footer class="loginreg_footer">
        <pre>
MY LOGO HERE
        </pre>
    </footer>

</main>

<?php require_once("includes/foot.php"); ?>