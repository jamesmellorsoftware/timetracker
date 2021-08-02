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
        echo true;
        // Make sure EVERYTHING corresponds to today's date
        // If timer doesn't exist and name validates, create it
        // If timer exists and isn't running, restart it
        // If timer exists and is running, don't do anything, return a signal to highlight the timer
    }
}

?>