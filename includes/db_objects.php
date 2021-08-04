<?php

class db_objects {
    public $errors = [];
    
    public static function get_table_name() {
        return static::$db_table;
    }

    public static function execute_query($sql){
        // Takes SQL statement string e.g. "SELECT * FROM users ... "
        // Sends to DB, returns SQL results, converts to indexed array of instances of objects e.g.
        // [0] => User Object ( [user_id] => 1 [user_username] => JohnSmith ... )
        // [1] => User Object ( [user_id] => 2 [user_username] => JaneDoe ... )

        global $db;
        
        $query_results = $db->query($sql);

        // Loop through assoc array from query results and instantiate object for every row
        $result_object_set = [];
        while ($row = mysqli_fetch_array($query_results)) $result_object_set[] = static::retrieved_row_to_object_instance($row);

        return $result_object_set;
    }

    public static function retrieve_object_from_db($query_results){
        // Loop through assoc array from query results and instantiate object for 1 row
        $result_object_set = [];
        while ($row = $query_results->fetch_assoc()) $result_object_set = static::retrieved_row_to_object_instance($row);

        return $result_object_set;
    }

    public static function retrieve_objects_from_db($query_results){
        // Loop through assoc array from query results and instantiate object for every row
        $result_object_set = [];
        while ($row = $query_results->fetch_assoc()) $result_object_set[] = static::retrieved_row_to_object_instance($row);

        return $result_object_set;
    }

    public static function retrieved_row_to_object_instance($row) {
        // Creates instance of class called from mysqli_query() results

        $called_class = get_called_class();

        $new_instance_from_object = new $called_class;

        foreach ($row as $col => $value) {
            // If the class actually has the property retrieved from DB col, assign it
            if ($new_instance_from_object->has_attribute($col)) $new_instance_from_object->$col = $value;
        }

        return $new_instance_from_object;
    }

    protected function has_attribute($attribute) {
        // Check if the called class has a property or not
        return (property_exists(get_called_class(), $attribute)) ? true : false;
    }

    protected function set_properties() {
        // Creates assoc array of object instance properties and values e.g. ["photo_id" => 3, ... ]
        // Loops through all DB fields defined in corresponding object
        // Checks if $this instance actually has the property set and assigns it
        // Keys are DB columns, values are their corresponding values
        // Avoids repeating assignation of object properties to arrays for processing
        // and also checks if the object actually has the fields set in db_table_fields

        $properties = array();

        foreach (static::$db_table_fields as $db_table_field) {
            if (property_exists($this, $db_table_field)) {
                if (!empty($this->$db_table_field)) $properties[$db_table_field] = $this->$db_table_field;
            }
        }

        return $properties;
    }

}

?>