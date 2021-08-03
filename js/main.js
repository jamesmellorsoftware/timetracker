$(document).ready(function() {

    // ===== NEW TASK =================================================================== //
    $("#task_submit").on("click", function(){

        var timer_name = $("#task").val();

        if ($("#task_submit").hasClass("btn-1_unclickable")) return false;

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
                    $("#task_submit").addClass("btn-1_unclickable");
                    $("#task").val("");
                    startTimer(new_timer);
                }

                // If task exists, restart its timer
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
                stopTimer();
                $("#task_submit").removeClass("btn-1_unclickable");
            },
            error: function(error) {
                console.debug('AJAX Error:');
                console.debug(error);
            }
        });

    });
    // ================================================================================== //


    // ===== DELETE TASK ================================================================ //
    $(document).on("click", '.task_delete', function(){

        var task = $(this);
        var timer_name = task.siblings(".task_name").val();

        $.ajax({
            type: 'post',
            url: 'includes/controllers/mainapp_controller.php',
            dataType: 'json',
            data: {
                "delete_timer": true,
                "timer_name": timer_name
            },
            success: function(response) {
                // stopTimer();
                task.closest(".task_row").remove();
            },
            error: function(error) {
                console.debug('AJAX Error:');
                console.debug(error);
            }
        });

    });
    // ================================================================================== //


    function startTimer(timer, stopTimer) {
        var timer_hours = timer.find(".task_hours");
        var timer_mins  = timer.find(".task_mins");
        var timer_secs  = timer.find(".task_secs");

        var totalSeconds = parseInt(timer.find(".task_duration_total").val());
        window.taskTimer = setInterval(setTime, 1000);

        function setTime() {
            ++totalSeconds;
            timer.find(".task_duration_total").val(totalSeconds);
            timer_secs.html(addZeros(totalSeconds % 60));
            timer_mins.html(addZeros(parseInt(totalSeconds / 60)));
            timer_hours.html(addZeros(parseInt(totalSeconds / (60 * 60))));
        }
    }

    
    function stopTimer() {
        clearInterval(window.taskTimer);
    }


    function addZeros(val) {
        var valString = val + "";
        return (valString.length < 2) ? "0" + valString : valString;
    }
});