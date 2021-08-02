<?php

require_once("../config.php");
require_once("../variables.php");

if (isset($_POST['login'])) {
    $new_user = new User;
    $new_user->username  = trim($_POST['username']);
    $new_user->password  = trim($_POST['password']);

    if (!$user_retrieved = $new_user->verify_login()) {
        echo json_encode($new_user->errors);
    } else {
        $session->login($user_retrieved);
        echo true;
    }
}

?>