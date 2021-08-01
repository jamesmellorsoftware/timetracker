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
        $sql = "SELECT * FROM " . User::get_table_name() . " ";
        $sql.= "WHERE username = '$username' ";
        $sql.= "LIMIT 1 ";
        $result_set = self::execute_query($sql);
        return !empty($result_set) ? array_shift($result_set) : false;
    }

    public function exists() {
        $sql = "SELECT * FROM " . User::get_table_name() . " WHERE username = '$this->username' ";
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

        // Check empty fields
        if (empty($this->username)) $this->errors['username'] = "Username cannot be empty!";
        if (empty($this->password)) $this->errors['password'] = "Password cannot be empty!";

        // Check field lengths
        if (strlen($this->username) > 30)  $this->errors['username']  = "Username too long";
        if (strlen($this->password) > 30)  $this->errors['password']  = "Password too long";

        if (!empty($this->errors)) return false;

        $user_retrieved = User::retrieve($this->username);

        if (!$user_retrieved || empty($user_retrieved)) {
            $this->errors['username'] = "Username not found";
            return false;
        }

        if (!password_verify($this->password, $user_retrieved->password)) {
            $this->errors['password'] = "Incorrect password";
            return false;
        }

        return $user_retrieved;

    }

} // end of class User

?>