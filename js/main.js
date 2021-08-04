$(document).ready(function() {

    initialiseTimetracker();

    // Click handlers ================================================================== //
    $(Timetracker.id.taskSubmitButton).on("click", function(){
        newTask();
    });

    $(document).on("click", '.'+Timetracker.class.taskStop, function(){
        stopTask($(this));
    });

    $(document).on("click", '.'+Timetracker.class.taskDelete, function(){
        deleteTask($(this));
    });

    $(Timetracker.id.logout).on("click", function(){
        logout();
    });

    $("."+Timetracker.class.prevDay).on("click", function() {
        changeDate($(this));
    });

    $("."+Timetracker.class.nextDay).on("click", function() {
        changeDate($(this));
    });

    $("."+Timetracker.class.toToday).on("click", function() {
        changeDate($(this));
    });

    // Functions ======================================================================= //
    function initialiseTimetracker() {
        window.Timetracker = {}; // namespace

        // Define controller URLs
        Timetracker.controllerDirectory = "includes/controllers/";
        Timetracker.mainController = Timetracker.controllerDirectory + "mainapp_controller.php";

        // Define element classes
        Timetracker.class = {};
        Timetracker.class.nextDay           = "nextday";
        Timetracker.class.prevDay           = "prevday";
        Timetracker.class.taskDelete        = "task_delete";
        Timetracker.class.taskDurationTotal = "task_duration_total";
        Timetracker.class.taskName          = "task_name";
        Timetracker.class.taskRow           = "task_row";
        Timetracker.class.taskStop          = "task_stop";
        Timetracker.class.taskTimeHours     = "task_hours";
        Timetracker.class.taskTimeMins      = "task_mins";
        Timetracker.class.taskTimeSecs      = "task_secs";
        Timetracker.class.timerActive       = "active";
        Timetracker.class.toToday           = "today";
        Timetracker.class.unclickableButton = "btn-1_unclickable";

        // Define element IDs
        Timetracker.id = {};
        Timetracker.id.logout             = "#logout";
        Timetracker.id.newTaskName        = "#task";
        Timetracker.id.noTasksDisplay     = "#no_tasks";
        Timetracker.id.taskDate           = "#task_date";
        Timetracker.id.taskSubmitButton   = "#task_submit";
        Timetracker.id.taskTemplate       = "#task_template";
        Timetracker.id.tasksContainer     = "#task_container";
        Timetracker.id.tasksDurationTotal = "#tasks_duration_total";
        Timetracker.id.totalTimeContainer = "#total_time_container";

        // Define templates
        Timetracker.new_timer = $(Timetracker.id.taskTemplate).clone();
        Timetracker.loading   = $("#loading");

        // Starter functions
        retrieveTimers();
        startUpdateTimers();
    }


    function newTask() {

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
                    new_timer.find("."+Timetracker.class.taskName).html(response.new_timer_name);
                    new_timer.find("input."+Timetracker.class.taskName).val(response.new_timer_name);
                    new_timer.find("."+Timetracker.class.taskDurationTotal).attr("href", response.new_timer_id);
                    $(Timetracker.id.tasksContainer).append(new_timer);
                    startTimer(new_timer);
                    new_timer.find("."+Timetracker.class.taskStop).css("display", "inline");
                    new_timer.addClass(Timetracker.class.timerActive);
                }

                // If task exists, restart its timer
                if (response.timer_exists) {
                    var existing_timer = $("#"+response.timer_name);
                    existing_timer.find("."+Timetracker.class.taskStop).css("display", "inline");
                    existing_timer.addClass(Timetracker.class.timerActive);
                    if (response.timer_restart) startTimer(existing_timer);
                }

                $(Timetracker.id.totalTimeContainer).addClass(Timetracker.class.timerActive);

                disableNewTasks();
            },
            error: function(error) {
                console.debug('AJAX Error:');
                console.debug(error);
            }
        });
    }


    function stopTask(button_clicked) {
        var timer_name = button_clicked.siblings("."+Timetracker.class.taskName).val();
        var timer_duration = button_clicked.siblings("."+Timetracker.class.taskDurationTotal).attr("value");

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
                button_clicked.closest("."+Timetracker.class.taskRow).removeClass(Timetracker.class.timerActive);
                enableNewTasks();
                $(Timetracker.id.totalTimeContainer).removeClass(Timetracker.class.timerActive);
            },
            error: function(error) {
                console.debug('AJAX Error:');
                console.debug(error);
            }
        });
    }


    function deleteTask(task) {
        showLoading();

        var timer_name = task.siblings("."+Timetracker.class.taskName).val();
        var timer_duration = task.siblings("."+Timetracker.class.taskDurationTotal).val();

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
                task.closest("."+Timetracker.class.taskRow).remove();
                updateTotalTime($(Timetracker.id.tasksDurationTotal).val() - timer_duration);
                $(Timetracker.id.totalTimeContainer).removeClass(Timetracker.class.timerActive);

                if (response == "active") {
                    enableNewTasks();
                }

                hideLoading();
            },
            error: function(error) {
                console.debug('AJAX Error:');
                console.debug(error);
                hideLoading();
            }
        });
    }


    function logout() {
        showLoading();
        var timer_data = [];

        $("."+Timetracker.class.taskDurationTotal).each(function(index){
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
                hideLoading();
                window.location = "logout.php";
            },
            error: function(error) {
                console.debug('AJAX Error:');
                console.debug(error);
                hideLoading();
            }
        });
    }


    function changeDate(button_clicked) {

        if (button_clicked.hasClass(Timetracker.class.unclickableButton)) {
            return false;
        }

        var currentDate = Number($(Timetracker.id.taskDate).val());
        
        if (button_clicked.hasClass(Timetracker.class.nextDay)) {
            var requestedDate = currentDate + 1;
        } else if (button_clicked.hasClass(Timetracker.class.prevDay)) {
            var requestedDate = currentDate - 1;
        } else if (button_clicked.hasClass(Timetracker.class.toToday)) {
            var requestedDate = 0;
        } else {
            return false;
        }

        retrieveTimers(requestedDate);
        $(Timetracker.id.taskDate).val(requestedDate);

    }


    function retrieveTimers(date_difference = 0) {

        showLoading();

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

                $("."+Timetracker.class.taskRow).remove();

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
                        new_timer.find("."+Timetracker.class.taskName).html(response.timers[i].name);
                        new_timer.find("input."+Timetracker.class.taskName).val(response.timers[i].name);
                        new_timer.find("."+Timetracker.class.taskDurationTotal).attr("href", response.timers[i].id);
    
                        var timer_seconds = Number(response.timers[i].duration_secs);
    
                        new_timer.find("."+Timetracker.class.taskDurationTotal).val(timer_seconds);
    
                        // Calculate time hours mins secs
                        var timer_hours = Math.floor(timer_seconds / 3600);
                        var timer_mins = Math.floor(timer_seconds % 3600 / 60);
                        var timer_secs = Math.floor(timer_seconds % 3600 % 60);

                        total_secs += timer_seconds;
    
                        new_timer.find("."+Timetracker.class.taskTimeHours).html(addZeros(timer_hours));
                        new_timer.find("."+Timetracker.class.taskTimeMins).html(addZeros(timer_mins));
                        new_timer.find("."+Timetracker.class.taskTimeSecs).html(addZeros(timer_secs));
    
                        $(Timetracker.id.tasksContainer).append(new_timer);
                        
                        updateTotalTime(total_secs);
    
                        if (response.timers[i].active) {
                            startTimer(new_timer, true);
                            new_timer.addClass(Timetracker.class.timerActive);
                            $(Timetracker.id.totalTimeContainer).addClass(Timetracker.class.timerActive);
                            disableNewTasks();
                        } else {
                            new_timer.find("."+Timetracker.class.taskStop).css("display", "none");
                        }
                    }
                }

                hideLoading();
            },
            error: function(error) {
                console.debug('AJAX Error:');
                console.debug(error);
                hideLoading();
            }
        });

        
    }
    
    
    function startTimer(timer, activeTask = false) {
        var totalTime = Number($(Timetracker.id.tasksDurationTotal).val());

        var timer_hours = timer.find("."+Timetracker.class.taskTimeHours);
        var timer_mins  = timer.find("."+Timetracker.class.taskTimeMins);
        var timer_secs  = timer.find("."+Timetracker.class.taskTimeSecs);

        var totalSeconds = parseInt(timer.find("."+Timetracker.class.taskDurationTotal).val());
        
        Timetracker.taskTimer = setInterval(setTime, 1000);

        function setTime() {
            ++totalSeconds;
            timer.find("."+Timetracker.class.taskDurationTotal).val(totalSeconds);
            timer_secs.html(addZeros(totalSeconds % 60));
            timer_mins.html(addZeros(parseInt(totalSeconds / 60)));
            timer_hours.html(addZeros(parseInt(totalSeconds / (60 * 60))));
            updateTotalTime(totalTime + totalSeconds);
        }
    }


    function stopTimer() {
        clearInterval(Timetracker.taskTimer);
    }


    function startUpdateTimers() {

        showLoading();

        var updateTimerMins = 5;
        var updateTimerInterval = updateTimerMins * 60 * 1000;
        Timetracker.updateTimer = setInterval(updateTimers, updateTimerInterval);

        function updateTimers() {
            // retrieve all timers' total seconds values and send them to the db

            var timer_data = [];

            $("."+Timetracker.class.taskDurationTotal).each(function(index){
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
                    hideLoading();
                },
                error: function(error) {
                    console.debug('AJAX Error:');
                    console.debug(error);
                    hideLoading();
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


    function showLoading() {
        Timetracker.loading.fadeIn(100);
    }


    function hideLoading() {
        Timetracker.loading.fadeOut();
    }


    function addZeros(val) {
        var valString = val + "";
        return (valString.length < 2) ? "0" + valString : valString;
    }
});