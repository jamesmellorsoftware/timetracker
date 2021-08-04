$(document).ready(function() {

    initialiseTimetracker();

    // Click handlers ================================================================== //
    Timetracker.element.submitNewTask.on("click", function(){
        newTask();
    });

    Timetracker.element.logout.on("click", function(){
        logout();
    });

    Timetracker.element.dateSelectPrev.on("click", function() {
        changeDate($(this));
    });

    Timetracker.element.dateSelectNext.on("click", function() {
        changeDate($(this));
    });

    Timetracker.element.dateSelectToday.on("click", function() {
        changeDate($(this));
    });

    $(document).on("click", '.'+Timetracker.class.taskStop, function(){
        stopTask($(this));
    });

    $(document).on("click", '.'+Timetracker.class.taskDelete, function(){
        deleteTask($(this));
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

        // Define templates
        Timetracker.new_timer = $("#task_template").clone();

        // Define elements
        Timetracker.element = {};
        Timetracker.element.dateSelectNext          = $("#nextday");
        Timetracker.element.dateSelectPrev          = $("#prevday");
        Timetracker.element.dateSelectToday         = $("#today");
        Timetracker.element.logout                  = $("#logout");
        Timetracker.element.loading                 = $("#loading");
        Timetracker.element.newTaskInput            = $("#task");
        Timetracker.element.noTasksDisplay          = $("#no_tasks");
        Timetracker.element.submitNewTask           = $("#task_submit");
        Timetracker.element.tasksContainer          = $("#task_container");
        Timetracker.element.tasksDate               = $("#task_date");
        Timetracker.element.totalTimeTodayContainer = $("#total_time_container");
        Timetracker.element.totalTimeToday          = $("#tasks_duration_total");
        Timetracker.element.totalTimeTodayDisplay   = $("#task_total");

        // Starter functions
        retrieveTimers();
        startUpdateTimers();
    }


    function newTask() {

        var timer_name = Timetracker.element.newTaskInput.val();

        if (!timer_name.length) return false;

        if (Timetracker.element.submitNewTask.hasClass(Timetracker.class.unclickableButton)) return false;

        $.ajax({
            type: 'post',
            url: Timetracker.mainController,
            dataType: 'json',
            data: {
                "start_timer": true,
                "timer_name": timer_name
            },
            success: function(response) {
                Timetracker.element.noTasksDisplay.css("display", "none");
                // If new task, add to list
                if (response.new_timer) {
                    var new_timer = Timetracker.new_timer.clone();
                    new_timer.attr("id", response.new_timer_name);
                    new_timer.find("."+Timetracker.class.taskName).html(response.new_timer_name);
                    new_timer.find("input."+Timetracker.class.taskName).val(response.new_timer_name);
                    new_timer.find("."+Timetracker.class.taskDurationTotal).attr("href", response.new_timer_id);
                    Timetracker.element.tasksContainer.append(new_timer);
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

                Timetracker.element.totalTimeTodayContainer.addClass(Timetracker.class.timerActive);

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
                Timetracker.element.submitNewTask.removeClass(Timetracker.class.unclickableButton);
                button_clicked.css("display", "none");
                button_clicked.closest("."+Timetracker.class.taskRow).removeClass(Timetracker.class.timerActive);
                enableNewTasks();
                Timetracker.element.totalTimeTodayContainer.removeClass(Timetracker.class.timerActive);
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
                updateTotalTime(Timetracker.element.totalTimeToday.val() - timer_duration);
                Timetracker.element.totalTimeTodayContainer.removeClass(Timetracker.class.timerActive);

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

        var currentDate = Number(Timetracker.element.tasksDate.val());
        
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
        Timetracker.element.tasksDate.val(requestedDate);

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

                if (date_difference == 0) {
                    $("."+Timetracker.class.taskDelete).css("display", "inline");
                    Timetracker.element.dateSelectToday.html("Today");
                    Timetracker.element.dateSelectNext.addClass(Timetracker.class.unclickableButton);
                    enableNewTasks();
                } else {
                    $("."+Timetracker.class.taskDelete).css("display", "none");
                    Timetracker.element.dateSelectToday.html(response.date);
                    Timetracker.element.dateSelectNext.removeClass(Timetracker.class.unclickableButton);
                    disableNewTasks();
                }

                if (response.no_timers) {
                    Timetracker.element.noTasksDisplay.css("display", "flex");
                    Timetracker.element.totalTimeTodayContainer.css("display", "none");
                } else {
    
                    Timetracker.element.noTasksDisplay.css("display", "none");

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
    
                        Timetracker.element.tasksContainer.append(new_timer);
                        
                        updateTotalTime(total_secs);
    
                        if (response.timers[i].active) {
                            startTimer(new_timer, true);
                            new_timer.addClass(Timetracker.class.timerActive);
                            Timetracker.element.totalTimeTodayContainer.addClass(Timetracker.class.timerActive);
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
    
    
    function startTimer(timer) {
        var totalTime = Number(Timetracker.element.totalTimeToday.val());

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


    function stopUpdateTimer() {
        clearInterval(Timetracker.updateTimer);
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

        Timetracker.element.totalTimeTodayDisplay.html(total_hours+":"+total_mins+":"+total_secs);
        Timetracker.element.totalTimeToday.val(total_seconds);
    }


    function disableNewTasks() {
        Timetracker.element.newTaskInput.val("");
        if (!Timetracker.element.submitNewTask.hasClass(Timetracker.class.unclickableButton)) {
            Timetracker.element.submitNewTask.addClass(Timetracker.class.unclickableButton);
        }
        if (Timetracker.element.newTaskInput.attr("disabled") != "disabled") {
            Timetracker.element.newTaskInput.attr("disabled", "disabled");
        }
    }

    function enableNewTasks() {
        Timetracker.element.newTaskInput.val("");
        if (Timetracker.element.submitNewTask.hasClass(Timetracker.class.unclickableButton)) {
            Timetracker.element.submitNewTask.removeClass(Timetracker.class.unclickableButton);
        }
        if (Timetracker.element.newTaskInput.attr("disabled") == "disabled") {
            Timetracker.element.newTaskInput.removeAttr("disabled");
        }
    }


    function showLoading() {
        Timetracker.element.loading.fadeIn(100);
    }


    function hideLoading() {
        Timetracker.element.loading.fadeOut();
    }


    function addZeros(val) {
        var valString = val + "";
        return (valString.length < 2) ? "0" + valString : valString;
    }
});