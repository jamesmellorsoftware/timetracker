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
        
        if (!$this) return false;

        global $db;

        $sql = "INSERT INTO " . Timer::get_table_name() . " ";
        $sql.= "(author_id, name, date, duration_secs, active) ";
        $sql.= "VALUES (?, ?, ?, ?, ?)";

        $stmt = $db->connection->prepare($sql);
        $stmt->bind_param("issii", $this->author_id, $this->name, $this->date, $this->duration_secs, $this->active);
        $stmt->execute();
        
        $this->id = $db->inserted_id();

        return true;
    }

    public function stop(){
        
        if (!$this) return false;

        global $db;

        $sql = "UPDATE " . Timer::get_table_name() . " ";
        $sql.= "SET active = 0, duration_secs = ? ";
        $sql.= "WHERE ";
        $sql.= "active = 1 AND name = ? AND date = ? AND author_id = ? ";

        $stmt = $db->connection->prepare($sql);
        $stmt->bind_param('issi', $this->duration_secs, $this->name, $this->date, $this->author_id);
        $stmt->execute();

        return $stmt->affected_rows ? true : false;
    }

    public function delete(){
        
        if (!$this) return false;

        global $db;

        $sql = "DELETE FROM " . Timer::get_table_name() . " ";
        $sql.= "WHERE ";
        $sql.= "name = ? AND date = ? AND author_id = ? ";

        $stmt = $db->connection->prepare($sql);
        $stmt->bind_param('ssi', $this->name, $this->date, $this->author_id);
        $stmt->execute();

        return $stmt->affected_rows ? true : false;
    }

    public function exists() {
        if (!$this) return false;

        global $db;

        $sql = "SELECT * FROM " . Timer::get_table_name() . " ";
        $sql.= "WHERE name = ? AND date = ? AND author_id = ? ";
        $sql.= "LIMIT 1 ";

        $stmt = $db->connection->prepare($sql);
        $stmt->bind_param("ssi", $this->name, $this->date, $this->author_id);
        $stmt->execute();
        
        $results = $stmt->get_result();
        $result_set = self::retrieve_object_from_db($results);

        return !empty($result_set) ? true : false;
    }

    public function active() {
        if (!$this) return false;

        global $db;

        $sql = "SELECT * FROM " . Timer::get_table_name() . " ";
        $sql.= "WHERE name = ? AND date = ? AND author_id = ? AND active = 1 ";
        $sql.= "LIMIT 1 ";

        $stmt = $db->connection->prepare($sql);
        $stmt->bind_param("ssi", $this->name, $this->date, $this->author_id);
        $stmt->execute();
        
        $results = $stmt->get_result();
        $result_set = self::retrieve_object_from_db($results);

        return !empty($result_set) ? true : false;
    }

    public function verify_new_timer() {

        if (!$this) return false;

        // Check empty inputs
        if (empty($this->name))      $this->errors['timer'] = TIMER_ERROR_EMPTY;
        if (empty($this->author_id)) $this->errors['timer'] = TIMER_ERROR_NO_AUTHOR;
        if (empty($this->date))      $this->errors['timer']  = TIMER_ERROR_NO_DATE;

        if ($this->date != date(TIMER_DATE_FORMAT)) $this->errors['timer'] = TIMER_ERROR_WRONG_DATE;

        if (strlen($this->name) > LIMIT_TIMER_NAME) $this->errors['timer'] = TIMER_ERROR_TOO_LONG;

        if (!empty($this->errors)) return false;

        return true;
    }

    public static function timers_active($author_id, $date) {
        global $db;

        $sql = "SELECT * FROM " . Timer::get_table_name() . " ";
        $sql.= "WHERE date = ? AND author_id = ? AND active = 1 ";
        $sql.= "LIMIT 1 ";

        $stmt = $db->connection->prepare($sql);
        $stmt->bind_param("si", $date, $author_id);
        $stmt->execute();
        
        $results = $stmt->get_result();
        $result_set = self::retrieve_object_from_db($results);

        return !empty($result_set) ? true : false;
    }

} // end of class Timer

?>