<?php

require_once("../config.php");
require_once("../variables.php");

if (isset($_POST['start_timer']) && $_POST['start_timer']) {
    $new_timer = new Timer;
    $new_timer->name = trim($_POST['timer_name']);
    $new_timer->date = date(TIMER_DATE_FORMAT);
    $new_timer->author_id = $session->user_id;

    if (!$new_timer->verify_new_timer()) {
        echo json_encode($new_timer->errors);
    } else {
        if (!$new_timer->exists()) {

            $new_timer->duration_secs = 0;
            $new_timer->active = 1;

            echo ($new_timer->save()) ?
                json_encode(["new_timer" => 1, "new_timer_name" => $new_timer->name])
                :
                json_encode($new_timer->errors);

        } else {
            // if (!$new_timer->active()) {
            //     // If timer exists and isn't running, restart it
            // } else {
            //     // If timer exists and is running, don't do anything, return a signal to highlight the timer
            // }
        }
        
    }
}

?>