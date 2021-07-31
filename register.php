<?php

require_once("includes/head.php");

// if user is logged in, redirect to index.php

?>

<main class="loginreg">

    <h1 class="loginreg_header"><?php echo APP_NAME; ?></h1>

    <form class="loginreg_form" method="post">
        <input type="text" class="loginreg_form_input" name=""
        placeholder="<?php echo LOGINREG_USERNAME; ?>">
        <input type="password" class="loginreg_form_input" name=""
        placeholder="<?php echo LOGINREG_PASSWORD; ?>">
        <input type="submit" class="loginreg_form_submit"
        value="<?php echo LOGINREG_REGISTER; ?>">
        <a class="loginreg_form_change" href="login.php">
            <?php echo LOGINREG_CHANGE_REGISTER; ?>
        </a>
    </form>

    <footer class="loginreg_footer">
<pre class="loginreg_footer_logo">
░░█ ▄▀█ █▀▄▀█ █▀▀ █▀
█▄█ █▀█ █░▀░█ ██▄ ▄█

█▀▄▀█ █▀▀ █░░ █░░ █▀█ █▀█
█░▀░█ ██▄ █▄▄ █▄▄ █▄█ █▀▄
</pre>
    </footer>

</main>

<?php require_once("includes/foot.php"); ?>