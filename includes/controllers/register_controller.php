<?php

require_once("../config.php");
require_once("../variables.php");

if (isset($_POST['register'])) {
    $new_user = User::initialise_new($_POST['username'], $_POST['password']);

    if (!$new_user->verify_registration()) {
        echo json_encode($new_user->errors);
    } else {
        $new_user->password = password_hash($new_user->password, PASSWORD_BCRYPT, array('cost' => 12) );
        if ($new_user->save()) {
            $session->login($new_user);
            echo true;
        } else {
            json_encode($new_user->errors);
        }
    }
}

?>