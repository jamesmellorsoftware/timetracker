<?php
require_once("includes/head.php");
if ($session->is_signed_in()) header("Location: index.php");
?>

<main class="loginreg">

    <h1 class="loginreg_header"><?php echo APP_NAME; ?></h1>

    <div class="loginreg_form" method="post">

        <p id="username_errors" class="loginreg_form_error error-text nodisplay">some error</p>

        <input id="username" type="text" class="loginreg_form_input" name=""
        placeholder="<?php echo LOGINREG_USERNAME; ?>">

        <p id="password_errors" class="loginreg_form_error error-text nodisplay">some error</p>

        <input id="password" type="password" class="loginreg_form_input" name=""
        placeholder="<?php echo LOGINREG_PASSWORD; ?>">

        <a class="loginreg_form_submit btn-1 register" id="login_register">
            <?php echo LOGINREG_REGISTER; ?>
        </a>

        <a class="loginreg_form_change" href="login.php" >
            <?php echo LOGINREG_CHANGE_REGISTER; ?>
        </a>

    </div>

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