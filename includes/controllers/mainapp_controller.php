<?php

require_once("../config.php");
require_once("../variables.php");

// Retrieve timers
if (isset($_POST['retrieve_timers']) && $_POST['retrieve_timers']) {

    if (!isset($session->user_id)) return false;
    
    $response = [];

    if (isset($_POST['date_difference']) && !empty($_POST['date_difference'])) {
        $date_difference = trim($_POST['date_difference']);
        if ($date_difference == 0) $date = date(TIMER_DATE_FORMAT);
        $date = date('Y-m-d', (strtotime ($date_difference.' day' , strtotime(date(TIMER_DATE_FORMAT)))) );
    } else {
        $date = date(TIMER_DATE_FORMAT);
    }

    $response['date'] = date("d / m / y", strtotime($date));

    if (!$timers = Timer::retrieve_timers($session->user_id, $date)) {
        $response['no_timers'] = 1;
    } else {
        $response['timers'] = $timers;
    }

    echo json_encode($response);

}

// Update timers
if (isset($_POST['update_timers']) && $_POST['update_timers']) {

    if (!isset($session->user_id)) return false;

    if (isset($_POST['timer_data']) && !empty($_POST['timer_data'])) {
        
        $timers = $_POST['timer_data'];

        foreach ($timers as $id => $duration_secs) {

            $id = trim($id);
            $duration_secs = trim($duration_secs);
    
            if (!empty($id) && !empty($duration_secs)) {
                Timer::update_timer($id, $duration_secs, $session->user_id);
            }
        }
    
        echo json_encode($_POST['timer_data']);

    } else {
        echo json_encode(['no_update' => 1]);
    }

}

// Start a new timer or restart an existing one
if (isset($_POST['start_timer']) && $_POST['start_timer']) {
    
    $new_timer = new Timer;

    $new_timer->name      = trim($_POST['timer_name']);
    $new_timer->date      = date(TIMER_DATE_FORMAT);
    $new_timer->author_id = $session->user_id;

    if (Timer::timers_active($new_timer->author_id, $new_timer->date) || $new_timer->active()) {
        
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
                echo ($new_timer->restart()) ?
                json_encode(['timer_exists' => 1, 'timer_name' => $new_timer->name, 'timer_restart' => 1])
                :
                false;
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
        if ($existing_timer->active()) {
            echo ($existing_timer->delete()) ? json_encode("active") : false;
        } else {
            echo ($existing_timer->delete());
        }
    } else {
        // User is trying to delete a timer that doesn't exist or doesn't belong to them
        echo false;
    }
}

?>