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

    public function exists() {
        $sql = "SELECT * FROM " . Timer::get_table_name() . " ";
        $sql.= "WHERE name = '$this->name' ";
        $sql.= "AND date = '$this->date' ";
        $sql.= "AND author_id = '$this->author_id' ";
        $sql.= "LIMIT 1 ";
        $result_set = self::execute_query($sql);
        return !empty($result_set) ? true : false;
    }

    public function active() {
        $sql = "SELECT * FROM " . Timer::get_table_name() . " ";
        $sql.= "WHERE name = '$this->name' ";
        $sql.= "AND date = '$this->date' ";
        $sql.= "AND author_id = '$this->author_id' ";
        $sql.= "AND active = 1 ";
        $sql.= "LIMIT 1 ";
        $result_set = self::execute_query($sql);
        return !empty($result_set) ? true : false;
    }

    public function verify_new_timer() {
        // Check empty inputs
        if (empty($this->name))      $this->errors['timer'] = TIMER_ERROR_EMPTY;
        if (empty($this->author_id)) $this->errors['timer'] = TIMER_ERROR_NO_AUTHOR;
        if (empty($this->date))      $this->errors['timer']  = TIMER_ERROR_NO_DATE;

        if ($this->date != date(TIMER_DATE_FORMAT)) $this->errors['timer'] = TIMER_ERROR_WRONG_DATE;

        if (strlen($this->name) > LIMIT_TIMER_NAME) $this->errors['timer'] = TIMER_ERROR_TOO_LONG;

        if (!empty($this->errors)) return false;

        return true;
    }

} // end of class Timer

?>