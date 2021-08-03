<?php

require_once("../config.php");
require_once("../variables.php");

// Retrieve timers
if (isset($_POST['retrieve_timers']) && $_POST['retrieve_timers']) {
    
    $response = [];

    if (!$timers = Timer::retrieve_timers($session->user_id, date(TIMER_DATE_FORMAT))) {
        $response['no_timers'] = 1;
    } else {
        $response['timers'] = $timers;
    }

    echo json_encode($response);

}

// Start a new timer or restart an existing one
if (isset($_POST['start_timer']) && $_POST['start_timer']) {

    // If a timer is active, return false
    
    $new_timer = new Timer;

    $new_timer->name      = trim($_POST['timer_name']);
    $new_timer->date      = date(TIMER_DATE_FORMAT);
    $new_timer->author_id = $session->user_id;

    if (Timer::timers_active($new_timer->author_id, $new_timer->date) || $new_timer->active()) {
        // User is trying to start a timer when one is active
        // They will only be able to do this by tampering with the JS
        // Log them out
        echo false;

    } else {

        if (!$new_timer->verify_new_timer()) {

            echo json_encode($new_timer->errors);

        } else {

            if (!$new_timer->exists()) {
                // Timer doesn't exist, create it
    
                $new_timer->duration_secs = 0;
                $new_timer->active = 1;
    
                echo ($new_timer->save()) ?
                    json_encode(
                        ["new_timer" => 1,
                        "new_timer_name" => $new_timer->name,
                        "new_timer_id" => $new_timer->id])
                    :
                    json_encode($new_timer->errors);
    
            } else {
                // Timer already exists, restart its timer
                json_encode(['timer_exists' => 1, 'timer_name' => $new_timer->name, 'timer_restart' => 1]);
            }
        }

    }

    

}

// Stop a timer
if (isset($_POST['stop_timer']) && $_POST['stop_timer']) {
    
    $existing_timer = new Timer;

    $existing_timer->name          = trim($_POST['timer_name']);
    $existing_timer->date          = date(TIMER_DATE_FORMAT);
    $existing_timer->author_id     = $session->user_id;
    $existing_timer->duration_secs = $_POST['timer_duration'];
    $existing_timer->active        = 0;

    if ($existing_timer->exists()) {
        echo ($existing_timer->stop());
    } else {
        // User is trying to stop a timer that doesn't exist
        echo false;
    }
}

// Delete a timer
if (isset($_POST['delete_timer']) && $_POST['delete_timer']) {
    
    $existing_timer = new Timer;

    $existing_timer->name          = trim($_POST['timer_name']);
    $existing_timer->date          = date(TIMER_DATE_FORMAT);
    $existing_timer->author_id     = $session->user_id;

    if ($existing_timer->exists()) {
        echo ($existing_timer->delete());
    } else {
        // User is trying to delete a timer that doesn't exist or doesn't belong to them
        echo false;
    }
}

?>