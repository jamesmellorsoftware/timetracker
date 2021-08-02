$(document).ready(function() {

    // ===== NEW TASK =================================================================== //
    $("#task_submit").on("click", function(){

        // If a timer is already running, return false;

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
                    new_timer.attr("id", response.new_timer_name);
                    new_timer.find(".task_name").html(response.new_timer_name);
                    new_timer.find("input.task_name").val(response.new_timer_name);
                    $("#task_container").append(new_timer);
                    startTimer(new_timer);
                    $("#task_submit").addClass("btn-1_unclickable");
                    $("#task").val("");
                }

                // If task exists, restart the timer
                if (response.timer_exists) {
                    var existing_timer = $("#"+response.timer_name);
                    existing_timer.css("background-color", "green");
                    if (response.timer_restart) startTimer(existing_timer);
                }
            },
            error: function(error) {
                console.debug('AJAX Error:');
                console.debug(error);
            }
        });

    });
    // ================================================================================== //


    // ===== STOP TASK ================================================================== //
    $(document).on("click", '.task_stop', function(){

        var timer_name = $(this).siblings(".task_name").val();
        var timer_duration = $(this).siblings(".task_duration_total").attr("value");

        $.ajax({
            type: 'post',
            url: 'includes/controllers/mainapp_controller.php',
            dataType: 'json',
            data: {
                "stop_timer": true,
                "timer_name": timer_name,
                "timer_duration": timer_duration
            },
            success: function(response) {
                // stop timer
                $("#task_submit").removeClass("btn-1_unclickable");
            },
            error: function(error) {
                console.debug('AJAX Error:');
                console.debug(error);
            }
        });

    });
    // ================================================================================== //


    // Start timer
    function startTimer(timer) {
        var timer_hours = timer.find(".task_hours");
        var timer_mins  = timer.find(".task_mins");
        var timer_secs  = timer.find(".task_secs");

        var totalSeconds = parseInt(timer.find(".task_duration_total").val());
        setInterval(setTime, 1000);

        function setTime() {
            ++totalSeconds;
            timer.find(".task_duration_total").val(totalSeconds);
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