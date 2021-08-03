$(document).ready(function() {

    window.Timetracker = {}; // namespace

    // Define controller URLs
    Timetracker.controllerDirectory = "includes/controllers/";
    Timetracker.mainController = Timetracker.controllerDirectory + "mainapp_controller.php";

    // Define element classes
    Timetracker.class = {};
    Timetracker.class.nextDay = "nextday";
    Timetracker.class.prevDay = "prevday";
    Timetracker.class.taskDelete = "task_delete";
    Timetracker.class.taskStop = "task_stop";
    Timetracker.class.toToday = "today";
    Timetracker.class.unclickableButton = "btn-1_unclickable";

    // Define element IDs
    Timetracker.id = {};
    Timetracker.id.newTaskName = "#task";
    Timetracker.id.noTasksDisplay = "#no_tasks";
    Timetracker.id.taskDate = "#task_date";
    Timetracker.id.taskSubmitButton = "#task_submit";
    Timetracker.id.taskTemplate = "#task_template";
    Timetracker.id.tasksContainer = "#task_container";
    Timetracker.id.tasksDurationTotal = "#tasks_duration_total";
    Timetracker.id.totalTimeContainer = "#total_time_container";

    // Define templates
    Timetracker.new_timer = $(Timetracker.id.taskTemplate).clone();

    initialiseTimetracker();

    // ===== NEW TASK =================================================================== //
    $(Timetracker.id.taskSubmitButton).on("click", function(){

        var timer_name = $(Timetracker.id.newTaskName).val();

        if (!timer_name.length) return false;

        if ($(Timetracker.id.taskSubmitButton).hasClass(Timetracker.class.unclickableButton)) return false;

        $.ajax({
            type: 'post',
            url: Timetracker.mainController,
            dataType: 'json',
            data: {
                "start_timer": true,
                "timer_name": timer_name
            },
            success: function(response) {
                $(Timetracker.id.noTasksDisplay).css("display", "none");
                // If new task, add to list
                if (response.new_timer) {
                    var new_timer = Timetracker.new_timer.clone();
                    new_timer.attr("id", response.new_timer_name);
                    new_timer.find(".task_name").html(response.new_timer_name);
                    new_timer.find("input.task_name").val(response.new_timer_name);
                    new_timer.find(".task_duration_total").attr("href", response.new_timer_id);
                    $(Timetracker.id.tasksContainer).append(new_timer);
                    startTimer(new_timer);
                    new_timer.find("."+Timetracker.class.taskStop).css("display", "inline");
                    new_timer.addClass("active");
                }

                // If task exists, restart its timer
                if (response.timer_exists) {
                    var existing_timer = $("#"+response.timer_name);
                    existing_timer.find("."+Timetracker.class.taskStop).css("display", "inline");
                    existing_timer.addClass("active");
                    if (response.timer_restart) startTimer(existing_timer);
                }

                $(Timetracker.id.totalTimeContainer).addClass("active");

                disableNewTasks();
            },
            error: function(error) {
                console.debug('AJAX Error:');
                console.debug(error);
            }
        });

    });
    // ================================================================================== //


    // ===== STOP TASK ================================================================== //
    $(document).on("click", '.'+Timetracker.class.taskStop, function(){

        var button_clicked = $(this);

        var timer_name = $(this).siblings(".task_name").val();
        var timer_duration = $(this).siblings(".task_duration_total").attr("value");

        $.ajax({
            type: 'post',
            url: Timetracker.mainController,
            dataType: 'json',
            data: {
                "stop_timer": true,
                "timer_name": timer_name,
                "timer_duration": timer_duration
            },
            success: function(response) {
                stopTimer();
                $(Timetracker.id.taskSubmitButton).removeClass(Timetracker.class.unclickableButton);
                button_clicked.css("display", "none");
                button_clicked.closest(".task_row").removeClass("active");
                enableNewTasks();
                $(Timetracker.id.totalTimeContainer).removeClass("active");
            },
            error: function(error) {
                console.debug('AJAX Error:');
                console.debug(error);
            }
        });

    });
    // ================================================================================== //


    // ===== DELETE TASK ================================================================ //
    $(document).on("click", '.'+Timetracker.class.taskDelete, function(){

        var task = $(this);
        var timer_name = task.siblings(".task_name").val();
        var timer_duration = task.siblings(".task_duration_total").val();

        $.ajax({
            type: 'post',
            url: Timetracker.mainController,
            dataType: 'json',
            data: {
                "delete_timer": true,
                "timer_name": timer_name
            },
            success: function(response) {
                stopTimer();
                task.closest(".task_row").remove();
                updateTotalTime($(Timetracker.id.tasksDurationTotal).val() - timer_duration);
                $(Timetracker.id.totalTimeContainer).removeClass("active");

                if (response == "active") {
                    enableNewTasks();
                }
            },
            error: function(error) {
                console.debug('AJAX Error:');
                console.debug(error);
            }
        });

    });
    // ================================================================================== //


    // ===== CHANGE DATE ================================================================ //
    $("."+Timetracker.class.prevDay).on("click", function() {
        var prevDate = Number($(Timetracker.id.taskDate).val()) - 1;
        retrieveTimers(prevDate);
        $(Timetracker.id.taskDate).val(prevDate);
    });

    $("."+Timetracker.class.nextDay).on("click", function() {
        if ($(this).hasClass(Timetracker.class.unclickableButton)) return false;
        var nextDate = Number($(Timetracker.id.taskDate).val()) + 1;
        retrieveTimers(nextDate);
        $(Timetracker.id.taskDate).val(nextDate);

    });

    $("."+Timetracker.class.toToday).on("click", function() {
        retrieveTimers(0);
        $(Timetracker.id.taskDate).val(0);
    });
    // ================================================================================== //


    function retrieveTimers(date_difference = 0) {
        $.ajax({
            type: 'post',
            url: Timetracker.mainController,
            dataType: 'json',
            data: {
                "retrieve_timers": true,
                "date_difference": date_difference
            },
            success: function(response) {
                // DB queried to see if user has active timers for today
                // If timers active, start their timer

                $(".task_row").remove();

                if (date_difference >= 0) {
                    $("."+Timetracker.class.taskDelete).css("display", "inline");
                    $("."+Timetracker.class.toToday).html("Today");
                    $("."+Timetracker.class.nextDay).addClass(Timetracker.class.unclickableButton);
                    enableNewTasks();
                } else {
                    $("."+Timetracker.class.taskDelete).css("display", "none");
                    $("."+Timetracker.class.toToday).html(response.date);
                    $("."+Timetracker.class.nextDay).removeClass(Timetracker.class.unclickableButton);
                    disableNewTasks();
                }

                if (response.no_timers) {
                    $(Timetracker.id.noTasksDisplay).css("display", "flex");
                    $(Timetracker.id.totalTimeContainer).css("display", "none");
                } else {
    
                    $(Timetracker.id.noTasksDisplay).css("display", "none");

                    var total_secs = 0;
    
                    for (var i = 0; i < response.timers.length; i++) {
                        var new_timer = Timetracker.new_timer.clone();

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
    
                        $(Timetracker.id.tasksContainer).append(new_timer);
                        
                        updateTotalTime(total_secs);
    
                        if (response.timers[i].active) {
                            startTimer(new_timer, true);
                            new_timer.addClass("active");
                            $(Timetracker.id.totalTimeContainer).addClass("active");
                            disableNewTasks();
                        } else {
                            new_timer.find("."+Timetracker.class.taskStop).css("display", "none");
                        }
                    }

                }
            },
            error: function(error) {
                console.debug('AJAX Error:');
                console.debug(error);
            }
        });
    }
    
    
    function startTimer(timer, activeTask = false) {
        var totalTime = Number($(Timetracker.id.tasksDurationTotal).val());

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
                url: Timetracker.mainController,
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


    function updateTotalTime(total_seconds) {
        var total_hours = addZeros(Math.floor(total_seconds / 3600));
        var total_mins = addZeros(Math.floor(total_seconds % 3600 / 60));
        total_secs = addZeros(Math.floor(total_seconds % 3600 % 60));

        $("#task_total").html(total_hours+":"+total_mins+":"+total_secs);
        $(Timetracker.id.tasksDurationTotal).val(total_seconds);
    }


    function disableNewTasks() {
        $(Timetracker.id.newTaskName).val("");
        if (!$(Timetracker.id.taskSubmitButton).hasClass(Timetracker.class.unclickableButton)) {
            $(Timetracker.id.taskSubmitButton).addClass(Timetracker.class.unclickableButton);
        }
        if ($(Timetracker.id.newTaskName).attr("disabled") != "disabled") {
            $(Timetracker.id.newTaskName).attr("disabled", "disabled");
        }
    }

    function enableNewTasks() {
        $(Timetracker.id.newTaskName).val("");
        if ($(Timetracker.id.taskSubmitButton).hasClass(Timetracker.class.unclickableButton)) {
            $(Timetracker.id.taskSubmitButton).removeClass(Timetracker.class.unclickableButton);
        }
        if ($(Timetracker.id.newTaskName).attr("disabled") == "disabled") {
            $(Timetracker.id.newTaskName).removeAttr("disabled");
        }
    }


    function addZeros(val) {
        var valString = val + "";
        return (valString.length < 2) ? "0" + valString : valString;
    }
});