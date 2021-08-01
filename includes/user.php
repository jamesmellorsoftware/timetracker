<?php

class User extends db_objects {

    protected static $db_table = "users";
    protected static $db_table_fields = array("id", "username", "password");

    // Initialise user properties
    public $id;
    public $username;
    public $password;

    public function save(){
        if (!$this->create()) {
            $this->errors["username"] = "Error creating user.";
            $this->errors["password"] = "Error creating user.";
            return false;
        }
        return true;
    }

    public static function retrieve($username) {
        // Login checker - checks if user exists in DB and if password matches
        // If found, returns user details in array, otherwise returns false

        // global $db;

        // $sql = $db->build_select(
        //     self::$db_table,
        //     "*",
        //     ["user_username" => $username],
        //     "" ,
        //     1
        // );

        // $result_set = self::execute_query($sql);

        // return !empty($result_set) ? array_shift($result_set) : false;
    }

    public function exists() {
        $sql = "SELECT * FROM $this->db_table WHERE username = $this->username ";
        $result_set = self::execute_query($sql);
        return !empty($result_set) ? true : false;
    }

    public function verify_registration() {

        // Check empty fields
        if (empty($this->username)) $this->errors['username'] = "Username cannot be empty!";
        if (empty($this->password)) $this->errors['password'] = "Password cannot be empty!";

        // Check field lengths
        if (strlen($this->username) > 30)  $this->errors['username']  = "Username too long";
        if (strlen($this->password) > 30)  $this->errors['password']  = "Password too long";

        if (!empty($this->errors)) return false;

        // Check if user exists
        if ($this->exists()) $this->errors['username'] = "Username already in use.";

        if (!empty($this->errors)) return false;

        return true;

    }

    public function verify_login() {

        // $login_errors = ["username"  => "", "password"  => ""];

        // $login_errors = User::check_empty_inputs($this, $login_errors);
        
        // if (!empty($login_errors)) return $login_errors;

        // if (strlen($this->user_username) > LIMIT_USERNAME) $login_errors['username'] = LOGIN_ERROR_USERNAME_TOO_LONG;

        // if (strlen($this->user_password) > LIMIT_PASSWORD) $login_errors['password'] = LOGIN_ERROR_PASSWORD_TOO_LONG;

        // if (!preg_match(REGEX_USERNAME, $this->user_username)) $login_errors['username'] = LOGIN_ERROR_SYMBOLS_USERNAME;

        // if (!preg_match(REGEX_PASSWORD, $this->user_password)) $login_errors['password'] = LOGIN_ERROR_SYMBOLS_PASSWORD;

        // if (!empty($login_errors)) return $login_errors;

        // $user_retrieved = User::retrieve($this->user_username);

        // if (!$user_retrieved || empty($user_retrieved)) {
        //     $login_errors['username'] = LOGIN_ERROR_USERNAME_NOT_FOUND;
        //     return $login_errors;
        // }

        // if (!password_verify($this->user_password, $user_retrieved->user_password)) {
        //     $login_errors['password'] = LOGIN_ERROR_PASSWORD_INCORRECT;
        //     return $login_errors;
        // }

        // return $login_errors;

    }

} // end of class User

?>