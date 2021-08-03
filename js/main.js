$(document).ready(function() {

    window.new_timer = $("#task_template").clone();

    initialiseTimetracker();

    // ===== NEW TASK =================================================================== //
    $("#task_submit").on("click", function(){

        var timer_name = $("#task").val();

        if (!timer_name.length) return false;

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
                $("#no_tasks").css("display", "none");
                // If new task, add to list
                if (response.new_timer) {
                    var new_timer = window.new_timer.clone();
                    new_timer.attr("id", response.new_timer_name);
                    new_timer.find(".task_name").html(response.new_timer_name);
                    new_timer.find("input.task_name").val(response.new_timer_name);
                    new_timer.find(".task_duration_total").attr("href", response.new_timer_id);
                    $("#task_container").append(new_timer);
                    startTimer(new_timer);
                    new_timer.find(".task_stop").css("display", "inline");
                    new_timer.addClass("active");
                }

                // If task exists, restart its timer
                if (response.timer_exists) {
                    var existing_timer = $("#"+response.timer_name);
                    if (response.timer_restart) startTimer(existing_timer);
                    existing_timer.find(".task_stop").css("display", "inline");
                    existing_timer.addClass("active");
                }

                $("#total_time_container").addClass("active");
                $("#task_submit").addClass("btn-1_unclickable");
                $("#task").val("");
                $("#task").attr("disabled", "disabled");
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

        var button_clicked = $(this);

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
                button_clicked.css("display", "none");
                button_clicked.closest(".task_row").removeClass("active");
                $("#total_time_container").removeClass("active");
                $("#task").removeAttr("disabled", "disabled");
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
        var timer_duration = task.siblings(".task_duration_total").val();

        $.ajax({
            type: 'post',
            url: 'includes/controllers/mainapp_controller.php',
            dataType: 'json',
            data: {
                "delete_timer": true,
                "timer_name": timer_name
            },
            success: function(response) {
                stopTimer();
                task.closest(".task_row").remove();
                updateTotalTime($("#tasks_duration_total").val() - timer_duration);
                $("#total_time_container").removeClass("active");
            },
            error: function(error) {
                console.debug('AJAX Error:');
                console.debug(error);
            }
        });

    });
    // ================================================================================== //


    // ===== CHANGE DATE ================================================================ //
    $(".prevday").on("click", function() {
        var prevDate = Number($("#task_date").val()) - 1;
        retrieveTimers(prevDate);
        $("#task_date").val(prevDate);
    });

    $(".nextday").on("click", function() {
        if ($(this).hasClass("btn-1_unclickable")) return false;
        var nextDate = Number($("#task_date").val()) + 1;
        retrieveTimers(nextDate);
        $("#task_date").val(nextDate);

    });

    $(".today").on("click", function() {
        retrieveTimers(0);
        $("#task_date").val(0);
    });
    // ================================================================================== //


    function retrieveTimers(date_difference = 0) {
        $.ajax({
            type: 'post',
            url: 'includes/controllers/mainapp_controller.php',
            dataType: 'json',
            data: {
                "retrieve_timers": true,
                "date_difference": date_difference
            },
            success: function(response) {
                // DB queried to see if user has active timers for today
                // If timers active, start their timer

                $(".task_row").remove();

                if (response.no_timers) {
                    $("#no_tasks").css("display", "flex");
                    $("#total_time_container").css("display", "none");
                } else {
    
                    $("#no_tasks").css("display", "none");

                    var total_secs = 0;
    
                    for (var i = 0; i < response.timers.length; i++) {
                        var new_timer = window.new_timer.clone();

                        new_timer.attr("id", response.timers[i].name);
                        new_timer.find(".task_name").html(response.timers[i].name);
                        new_timer.find("input.task_name").val(response.timers[i].name);
                        new_timer.find(".task_duration_total").attr("href", response.timers[i].id);
    
                        var timer_seconds = Number(response.timers[i].duration_secs);
    
                        new_timer.find(".task_duration_total").val(timer_seconds);
    
                        // Calculate time hours mins secs
                        var timer_hours = Math.floor(timer_seconds / 3600);
                        var timer_mins = Math.floor(timer_seconds % 3600 / 60);
                        var timer_secs = Math.floor(timer_seconds % 3600 % 60);

                        total_secs += timer_seconds;
    
                        new_timer.find(".task_hours").html(addZeros(timer_hours));
                        new_timer.find(".task_mins").html(addZeros(timer_mins));
                        new_timer.find(".task_secs").html(addZeros(timer_secs));
    
                        $("#task_container").append(new_timer);
    
    
                        if (response.timers[i].active) {
                            $("#task_submit").addClass("btn-1_unclickable");
                            startTimer(new_timer);
                            new_timer.addClass("active");
                            $("#total_time_container").addClass("active");
                        } else {
                            new_timer.find(".task_stop").css("display", "none");
                        }
                    }

                    if (date_difference == 0) {
                        $(".task_delete").css("display", "inline");
                        $(".today").html("Today");
                        $(".nextday").addClass("btn-1_unclickable");
                        $("#task_submit").removeClass("btn-1_unclickable");
                        $("#task").removeAttr("disabled");
                    } else {
                        $(".task_delete").css("display", "none");
                        $(".today").html(response.date);
                        $(".nextday").removeClass("btn-1_unclickable");
                        $("#task_submit").addClass("btn-1_unclickable");
                        $("#task").attr("disabled", "disabled");
                    }

                    updateTotalTime(total_secs);
    
                }
            },
            error: function(error) {
                console.debug('AJAX Error:');
                console.debug(error);
            }
        });
    }
    
    
    function startTimer(timer) {
        var totalTime = Number($("#tasks_duration_total").val());

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
            updateTotalTime(totalTime + totalSeconds);
        }
    }


    function initialiseTimetracker() {
        retrieveTimers();
        startUpdateTimers();
    }

    
    function stopTimer() {
        clearInterval(window.taskTimer);
    }


    function startUpdateTimers() {

        var updateTimerMins = 5;

        var updateTimerInterval = updateTimerMins * 60 * 1000;

        window.updateTimer = setInterval(updateTimers, updateTimerInterval);

        function updateTimers() {
            // retrieve all timers' total seconds values and send them to the db

            var timer_data = [];

            $(".task_duration_total").each(function(index){
                var id = $(this).attr("href");
                var duration_secs = $(this).val();
                timer_data[id] = duration_secs;
            });

            $.ajax({
                type: 'post',
                url: 'includes/controllers/mainapp_controller.php',
                dataType: 'json',
                data: {
                    "update_timers": true,
                    "timer_data": timer_data
                },
                success: function(response) {
                    // Currently no feedback
                },
                error: function(error) {
                    console.debug('AJAX Error:');
                    console.debug(error);
                }
            });
        }
    }


    function updateTotalTime(total_secs) {
        var total_hours = addZeros(Math.floor(total_secs / 3600));
        var total_mins = addZeros(Math.floor(total_secs % 3600 / 60));
        total_secs = addZeros(Math.floor(total_secs % 3600 % 60));

        $("#task_total").html(total_hours+":"+total_mins+":"+total_secs);
        $("#tasks_duration_total").val(total_secs);
    }


    function addZeros(val) {
        var valString = val + "";
        return (valString.length < 2) ? "0" + valString : valString;
    }
});