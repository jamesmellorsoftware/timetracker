$(document).ready(function() {

    // New task
    $("#task_submit").on("click", function(){

        var timer_name = $("#task").val();

        $.ajax({
            type: 'post',
            url: 'includes/controllers/mainapp_controller.php',
            dataType: 'json',
            data: {
                "start_timer": true,
                "timer_name": timer_name
            },
            success: function(response) {
                // If new task, add to list
                if (response.new_timer) {
                    var new_timer = $("#task_template").clone();
                    new_timer.find(".task_name").html(response.new_timer_name);
                    $("#task_container").append(new_timer);
                    startTimer(new_timer);                    
                }

                // If existing task
                    // If task running, flash it green

                    // If task not running, restart it and flash it green
                console.log(response);
            },
            error: function(error) {
                console.debug('AJAX Error:');
                console.debug(error);
            }
        });

    });


    // Start timer
    function startTimer(timer) {
        var timer_hours = timer.find(".task_hours");
        var timer_mins  = timer.find(".task_mins");
        var timer_secs  = timer.find(".task_secs");

        var totalSeconds = 0;
        setInterval(setTime, 1000);

        function setTime() {
            ++totalSeconds;
            timer_secs.html(addZeros(totalSeconds % 60));
            timer_mins.html(addZeros(parseInt(totalSeconds / 60)));
            timer_hours.html(addZeros(parseInt(totalSeconds / (60 * 60))));
        }
    }

    function addZeros(val) {
        var valString = val + "";
        return (valString.length < 2) ? "0" + valString : valString;
    }
});