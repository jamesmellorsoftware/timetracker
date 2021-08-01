<?php
require_once("includes/head.php");
if ($session->is_signed_in()) header("Location: index.php");
?>

<main class="loginreg">

    <h1 class="loginreg_header"><?php echo APP_NAME; ?></h1>

    <form class="loginreg_form" method="post">

        <p id="username_errors" class="loginreg_form_error error-text nodisplay"></p>

        <input id="username" type="text" class="loginreg_form_input"
        maxlength="<?php echo LIMIT_USERNAME; ?>"
        placeholder="<?php echo LOGINREG_USERNAME; ?>">

        <p id="password_errors" class="loginreg_form_error error-text nodisplay"></p>

        <input id="password" type="password" class="loginreg_form_input"
        maxlength="<?php echo LIMIT_PASSWORD; ?>"
        placeholder="<?php echo LOGINREG_PASSWORD; ?>">

        <a class="loginreg_form_submit btn-1 login" id="login_register">
            <?php echo LOGINREG_LOGIN; ?>
        </a>

        <a class="loginreg_form_change" href="register.php">
            <?php echo LOGINREG_CHANGE_LOGIN; ?>
        </a>
    </form>

    <footer class="loginreg_footer">
<pre class="loginreg_footer_logo loginreg_footer_logo-normalheight">
░░█ ▄▀█ █▀▄▀█ █▀▀ █▀
█▄█ █▀█ █░▀░█ ██▄ ▄█

█▀▄▀█ █▀▀ █░░ █░░ █▀█ █▀█
█░▀░█ ██▄ █▄▄ █▄▄ █▄█ █▀▄
</pre>
<pre class="loginreg_footer_logo loginreg_footer_logo-smallheight">
░░█ ▄▀█ █▀▄▀█ █▀▀ █▀   █▀▄▀█ █▀▀ █░░ █░░ █▀█ █▀█
█▄█ █▀█ █░▀░█ ██▄ ▄█   █░▀░█ ██▄ █▄▄ █▄▄ █▄█ █▀▄
</pre>
    </footer>

</main>

<?php require_once("includes/foot.php"); ?>