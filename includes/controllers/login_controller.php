<?php

require_once("../config.php");
require_once("../variables.php");

if (isset($_POST['login'])) {
    $new_user = User::initialise_new($_POST['username'], $_POST['password']);

    if (!$user_retrieved = $new_user->verify_login()) {
        echo json_encode($new_user->errors);
    } else {
        $session->login($user_retrieved);
        echo true;
    }
}

?>