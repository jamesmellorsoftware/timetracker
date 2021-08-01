<?php
$page = basename($_SERVER['PHP_SELF']);

$register = ($page === "register.php") ? true : false;
$login    = ($page === "login.php")    ? true : false;

?>

<main class="loginreg">

    <h1 class="loginreg_header"><?php echo APP_NAME; ?></h1>

    <div class="loginreg_form" method="post">

        <p id="username_errors" class="loginreg_form_error error-text nodisplay">&nbsp;</p>

        <input id="username" type="text" class="loginreg_form_input"
        maxlength="<?php echo LIMIT_USERNAME; ?>"
        placeholder="<?php echo LOGINREG_USERNAME; ?>">

        <p id="password_errors" class="loginreg_form_error error-text nodisplay">&nbsp;</p>

        <input id="password" type="password" class="loginreg_form_input"
        maxlength="<?php echo LIMIT_PASSWORD; ?>"
        placeholder="<?php echo LOGINREG_PASSWORD; ?>">

        <a id="login_register" class="loginreg_form_submit btn-1
        <?php if ($register) echo "register"; if ($login) echo "login"; ?>">
            <?php if ($register) echo LOGINREG_REGISTER; ?>
            <?php if ($login)    echo LOGINREG_LOGIN; ?>
        </a>

        <a class="loginreg_form_change"
        href="<?php if ($register) echo "login.php"; if ($login) echo "register.php";?>">
            <?php if ($register) echo LOGINREG_CHANGE_REGISTER; ?>
            <?php if ($login)    echo LOGINREG_CHANGE_LOGIN; ?>
        </a>

    </div>

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