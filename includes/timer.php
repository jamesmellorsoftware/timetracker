<?php

class Timer extends db_objects {

    protected static $db_table = "timers";
    protected static $db_table_fields = array("id", "author_id", "name", "date", "duration_secs", "active");

    public $id;
    public $author_id;
    public $name;
    public $date;
    public $duration_secs;
    public $active;

    public function save(){
        if (!$this->create()) {
            $this->errors["timer"] = TIMER_ERROR_GENERAL;
            return false;
        }
        return true;
    }

    public function verify_new_timer() {

        if (empty($this->name)) $this->errors['timer'] = TIMER_ERROR_EMPTY;
        
        if (strlen($this->name) > LIMIT_TIMER_NAME) $this->errors['timer'] = TIMER_ERROR_TOO_LONG;

        if (!empty($this->errors)) return false;

        // If timer already exists for today
        // - restart the timer if it is paused
        // - flash the timer running if it is running
        // if ($this->exists()) $this->errors['username'] = LOGINREG_ERROR_USERNAME_IN_USE;

        return true;

    }

} // end of class Timer

?>