<?php

class Session {

    private $signed_in;
    public $user_id;
    public $username;

    function __construct(){
        session_start();
        $this->check_login_details();
    }

    private function check_login_details(){
        if (isset($_SESSION['user_id']) && isset($_SESSION['username'])) {
            $this->user_id       = $_SESSION['user_id'];
            $this->username = $_SESSION['username'];
            $this->signed_in = true;
        } else {
            unset($this->user_id);
            unset($this->username);
            $this->signed_in = false;
        }
    }

    public function is_signed_in() {
        return $this->signed_in;
    }

    public function login($user){
        // Sets session user ID to submitted user object's user ID and signed_in property true
        if ($user) {
            $this->username  = $_SESSION['username'] = $user->username;
            $this->id        = $_SESSION['user_id']  = $user->id;
            $this->signed_in = true;
        }
    }

    public function logout(){
        unset($_SESSION['user_id']);
        unset($_SESSION['username']);
        unset($this->user_id);
        $this->signed_in = false;
    }

} // end of class Session

$session = new Session();

?>