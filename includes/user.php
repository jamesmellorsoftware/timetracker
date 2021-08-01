<?php

class User extends db_objects {

    protected static $db_table = "users";
    protected static $db_table_fields = array("id", "username", "password");

    public $id;
    public $username;
    public $password;

    public function save(){
        if (!$this->create()) {
            $this->errors["username"] = LOGINREG_ERROR_GENERAL;
            $this->errors["password"] = LOGINREG_ERROR_GENERAL;
            return false;
        }
        return true;
    }

    public static function retrieve($username) {
        $sql = "SELECT * FROM " . User::get_table_name() . " ";
        $sql.= "WHERE username = '$username' ";
        $sql.= "LIMIT 1 ";
        $result_set = self::execute_query($sql);
        return !empty($result_set) ? array_shift($result_set) : false;
    }

    public function exists() {
        $sql = "SELECT * FROM " . User::get_table_name() . " ";
        $sql.= "WHERE username = '$this->username' ";
        $sql.= "LIMIT 1 ";
        $result_set = self::execute_query($sql);
        return !empty($result_set) ? true : false;
    }

    public function verify_registration() {

        // Check empty fields
        if (empty($this->username)) $this->errors['username'] = LOGINREG_ERROR_USERNAME_EMPTY;
        if (empty($this->password)) $this->errors['password'] = LOGINREG_ERROR_PASSWORD_EMPTY;

        // Check field lengths
        if (strlen($this->username) > LIMIT_USERNAME) $this->errors['username'] = LOGINREG_ERROR_USERNAME_LENGTH;
        if (strlen($this->password) > LIMIT_PASSWORD) $this->errors['password'] = LOGINREG_ERROR_PASSWORD_LENGTH;

        if (!empty($this->errors)) return false;

        // Check if user exists
        if ($this->exists()) $this->errors['username'] = LOGINREG_ERROR_USERNAME_IN_USE;

        if (!empty($this->errors)) return false;

        return true;

    }

    public function verify_login() {

        // Check empty fields
        if (empty($this->username)) $this->errors['username'] = LOGINREG_ERROR_USERNAME_EMPTY;
        if (empty($this->password)) $this->errors['password'] = LOGINREG_ERROR_PASSWORD_EMPTY;

        // Check field lengths
        if (strlen($this->username) > LIMIT_USERNAME) $this->errors['username'] = LOGINREG_ERROR_USERNAME_LENGTH;
        if (strlen($this->password) > LIMIT_PASSWORD) $this->errors['password'] = LOGINREG_ERROR_PASSWORD_LENGTH;

        if (!empty($this->errors)) return false;

        $user_retrieved = User::retrieve($this->username);

        if (!$user_retrieved || empty($user_retrieved)) {
            $this->errors['username'] = LOGINREG_ERROR_USER_NOT_FOUND;
            return false;
        }

        if (!password_verify($this->password, $user_retrieved->password)) {
            $this->errors['password'] = LOGINREG_ERROR_PASSWORD_INCORRECT;
            return false;
        }

        return $user_retrieved;

    }

} // end of class User

?>