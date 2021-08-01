<?php

if (isset($_POST['register'])) {

    $new_user = new User;

    $new_user->username  = $_POST['username'];
    $new_user->password  = $_POST['password'];

    if ($new_user->verify_registration()) {

        $new_user->password = password_hash($new_user->password, PASSWORD_BCRYPT, array('cost' => 12) );

        if (!$new_user->save()) { return $new_user->errors; }

    } else {

        return $new_user->errors;

    }

    return $new_user;

}

?>