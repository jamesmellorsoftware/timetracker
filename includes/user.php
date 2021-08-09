<?php

class User extends db_objects {

    protected static $db_table = "users";
    protected static $db_table_fields = array("id", "username", "password");

    public $id;
    public $username;
    public $password;

    public function save(){
        global $db;

        $sql = "INSERT INTO " . User::get_table_name() . " (username, password) VALUES (?, ?)";

        $stmt = $db->connection->prepare($sql);
        $stmt->bind_param("ss", $this->username, $this->password);
        $stmt->execute();
        
        $this->id = $db->inserted_id();

        return true;
    }

    public static function get($username) {
        global $db;

        $sql = "SELECT * FROM " . User::get_table_name() . " ";
        $sql.= "WHERE username = ? ";
        $sql.= "LIMIT 1 ";

        $stmt = $db->connection->prepare($sql);
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $results = $stmt->get_result();
        $result_set = self::retrieve_object_from_db($results);

        return $result_set;
    }

    public static function retrieve($username) {
        $result_set = User::get($username);
        return !empty($result_set) ? $result_set : false;
    }

    public function exists() {
        $result_set = User::get($this->username);
        return !empty($result_set) ? true : false;
    }

    public function verify_registration() {

        // Check empty fields
        if (empty($this->username) || strlen($this->username < 1)) $this->errors['username'] = LOGINREG_ERROR_USERNAME_EMPTY;
        if (empty($this->password) || strlen($this->password < 1)) $this->errors['password'] = LOGINREG_ERROR_PASSWORD_EMPTY;

        if (!empty($this->errors)) return false;

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

    public static function initialise_new($username, $password) {
        $new_user = new User;
        $new_user->username  = trim($username);
        $new_user->password  = trim($password);
        return $new_user;
    }

} // end of class User

?>