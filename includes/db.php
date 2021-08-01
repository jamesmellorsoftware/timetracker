<?php

require_once("config.php");

class Database {
    public $connection;

    function __construct(){
        $this->open_db_connection();
    }

    public function open_db_connection(){
        $this->connection = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        if ($this->connection->connect_errno) die("DB CONNECTION FAILED: " . $this->connection->connect_error);
    }

    public function query($sql){
        // Returns result of mysqli_query() (object) if successful
        // Argument accepted: SQL query string e.g. "SELECT * FROM users"

        $result = $this->connection->query($sql);

        if (!$result) die("QUERY FAILED: " . $this->connection->error);

        return $result;
    }

    public function inserted_id(){
        return $this->connection->insert_id;
    }
    
} // end class Database

$db = new Database();

?>