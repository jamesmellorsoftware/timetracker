$(document).ready(function() {

    // Start app
    initialiseTimetracker();
    Timetracker.retrieveTimers();
    Timetracker.startUpdateTimers();

    // Click handlers ================================================================== //
    Timetracker.element.submitNewTask.on("click", function(){
        Timetracker.newTask();
    });

    Timetracker.element.logout.on("click", function(){
        Timetracker.logout();
    });

    Timetracker.element.dateSelectPrev.on("click", function() {
        Timetracker.changeDate($(this));
    });

    Timetracker.element.dateSelectNext.on("click", function() {
        Timetracker.changeDate($(this));
    });

    Timetracker.element.dateSelectToday.on("click", function() {
        Timetracker.changeDate($(this));
    });

    $(document).on("click", '.'+Timetracker.class.taskStop, function(){
        Timetracker.stopTask($(this));
    });

    $(document).on("click", '.'+Timetracker.class.taskDelete, function(){
        Timetracker.deleteTask($(this));
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
    
        // Methods
        Timetracker.addNewTimer = function(response) {
            let new_timer = Timetracker.new_timer.clone();
            new_timer.attr("id", response.new_timer_name);
            new_timer.attr("href", response.new_timer_name.replace(" ", "_"));
            new_timer.find("."+Timetracker.class.taskName).html(response.new_timer_name);
            new_timer.find("input."+Timetracker.class.taskName).val(response.new_timer_name);
            new_timer.find("."+Timetracker.class.taskDurationTotal).attr("href", response.new_timer_id);
            Timetracker.element.tasksContainer.append(new_timer);
            Timetracker.startTimer(new_timer);
            new_timer.find("."+Timetracker.class.taskStop).css("display", "inline");
            new_timer.addClass(Timetracker.class.timerActive);
        }

        Timetracker.addZeros = function(val) {
            var valString = val + "";
            return (valString.length < 2) ? "0" + valString : valString;
        }

        Timetracker.changeDate = function(button_clicked) {
            if (Timetracker.elementUnclickable(button_clicked)) return false;

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
    
            Timetracker.retrieveTimers(requestedDate);
            Timetracker.element.tasksDate.val(requestedDate);
        }

        Timetracker.deleteTask = function(task) {
            Timetracker.showLoading();

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
                    Timetracker.stopTimer();
                    task.closest("."+Timetracker.class.taskRow).remove();
                    Timetracker.updateTotalTime(Timetracker.element.totalTimeToday.val() - timer_duration);
                    Timetracker.element.totalTimeTodayContainer.removeClass(Timetracker.class.timerActive);
    
                    if (response == "active") Timetracker.enableNewTasks();
    
                    Timetracker.hideLoading();
    
                    if ($("."+Timetracker.class.taskRow).length == 0) Timetracker.displayNoTasks();
    
                },
                error: function(error) {
                    console.debug('AJAX Error:');
                    console.debug(error);
                    Timetracker.hideLoading();
                }
            });
        }

        Timetracker.disableNewTasks = function() {
            Timetracker.element.newTaskInput.val("");
            if (!Timetracker.element.submitNewTask.hasClass(Timetracker.class.unclickableButton)) {
                Timetracker.element.submitNewTask.addClass(Timetracker.class.unclickableButton);
            }
            if (Timetracker.element.newTaskInput.attr("disabled") != "disabled") {
                Timetracker.element.newTaskInput.attr("disabled", "disabled");
            }
        }

        Timetracker.displayNoTasks = function() {
            Timetracker.element.noTasksDisplay.css("display", "flex");
            Timetracker.element.totalTimeTodayContainer.css("display", "none");
        }

        Timetracker.elementUnclickable = function(element) {
            if (element.hasClass(Timetracker.class.unclickableButton)) return true;
            return false;
        }

        Timetracker.enableNewTasks = function() {
            Timetracker.element.newTaskInput.val("");
            if (Timetracker.element.submitNewTask.hasClass(Timetracker.class.unclickableButton)) {
                Timetracker.element.submitNewTask.removeClass(Timetracker.class.unclickableButton);
            }
            if (Timetracker.element.newTaskInput.attr("disabled") == "disabled") {
                Timetracker.element.newTaskInput.removeAttr("disabled");
            }
        }

        Timetracker.hideLoading = function() {
            Timetracker.element.loading.fadeOut();
        }

        Timetracker.hideNoTasks = function() {
            Timetracker.element.noTasksDisplay.css("display", "none");
            Timetracker.element.totalTimeTodayContainer.css("display", "flex");
        }

        Timetracker.logout = function() {
            Timetracker.showLoading();
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
                    Timetracker.hideLoading();
                    window.location = "logout.php";
                },
                error: function(error) {
                    console.debug('AJAX Error:');
                    console.debug(error);
                    Timetracker.hideLoading();
                }
            });
        }

        Timetracker.newTask = function() {
            var timer_name = Timetracker.element.newTaskInput.val();

            // Validate before AJAX
            if (!timer_name.length) return false;
            if (Timetracker.elementUnclickable(Timetracker.element.submitNewTask)) return false;
    
            $.ajax({
                type: 'post',
                url: Timetracker.mainController,
                dataType: 'json',
                data: {
                    "start_timer": true,
                    "timer_name": timer_name
                },
                success: function(response) {
    
                    Timetracker.hideNoTasks();
                    if (response.new_timer)    Timetracker.addNewTimer(response);
                    if (response.timer_exists) Timetracker.restartExistingTimer(response);
                    
                    Timetracker.element.totalTimeTodayContainer.addClass(Timetracker.class.timerActive);
    
                    Timetracker.disableNewTasks();
                    Timetracker.hideNoTasks();
                },
                error: function(error) {
                    console.debug('AJAX Error:');
                    console.debug(error);
                }
            });
        }

        Timetracker.restartExistingTimer = function(timer_details) {
            var existing_timer = $(`.task_row[href="${timer_details.timer_name.replace(" ", "_")}"`);
            existing_timer.find("."+Timetracker.class.taskStop).css("display", "inline");
            existing_timer.addClass(Timetracker.class.timerActive);
            if (timer_details.timer_restart) Timetracker.startTimer(existing_timer);
        }

        Timetracker.retrieveTimers = function(date_difference = 0) {
            Timetracker.showLoading();

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
                        Timetracker.enableNewTasks();
                    } else {
                        $("."+Timetracker.class.taskDelete).css("display", "none");
                        Timetracker.element.dateSelectToday.html(response.date);
                        Timetracker.element.dateSelectNext.removeClass(Timetracker.class.unclickableButton);
                        Timetracker.disableNewTasks();
                    }
    
                    if (response.no_timers) {
                        Timetracker.displayNoTasks();
                    } else {
        
                        Timetracker.hideNoTasks();
    
                        var total_secs = 0;
        
                        for (var i = 0; i < response.timers.length; i++) {
                            var new_timer = Timetracker.new_timer.clone();
    
                            new_timer.attr("id", response.timers[i].name);
                            new_timer.attr("href", response.timers[i].name.replace(" ", "_"));
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
        
                            new_timer.find("."+Timetracker.class.taskTimeHours).html(Timetracker.addZeros(timer_hours));
                            new_timer.find("."+Timetracker.class.taskTimeMins).html(Timetracker.addZeros(timer_mins));
                            new_timer.find("."+Timetracker.class.taskTimeSecs).html(Timetracker.addZeros(timer_secs));
        
                            Timetracker.element.tasksContainer.append(new_timer);
                            
                            Timetracker.updateTotalTime(total_secs);
        
                            if (response.timers[i].active) {
                                Timetracker.startTimer(new_timer, true);
                                new_timer.addClass(Timetracker.class.timerActive);
                                Timetracker.element.totalTimeTodayContainer.addClass(Timetracker.class.timerActive);
                                Timetracker.disableNewTasks();
                            } else {
                                new_timer.find("."+Timetracker.class.taskStop).css("display", "none");
                            }

                            if (date_difference == 0) {
                                new_timer.find("."+Timetracker.class.taskDelete).css("display", "inline");
                            } else {
                                new_timer.find("."+Timetracker.class.taskDelete).css("display", "none");
                            }

                        }
                    }
    
                    Timetracker.hideLoading();
                },
                error: function(error) {
                    console.debug('AJAX Error:');
                    console.debug(error);
                    Timetracker.hideLoading();
                }
            });
        }

        Timetracker.showLoading = function() {
            Timetracker.element.loading.fadeIn(100);
        }

        Timetracker.startTimer = function(timer) {
            var totalTime = Number(Timetracker.element.totalTimeToday.val());

            var timer_hours = timer.find("."+Timetracker.class.taskTimeHours);
            var timer_mins  = timer.find("."+Timetracker.class.taskTimeMins);
            var timer_secs  = timer.find("."+Timetracker.class.taskTimeSecs);
    
            var totalSeconds = parseInt(timer.find("."+Timetracker.class.taskDurationTotal).val());
            
            Timetracker.taskTimer = setInterval(setTime, 1000);
    
            function setTime() {
                ++totalSeconds;
                timer.find("."+Timetracker.class.taskDurationTotal).val(totalSeconds);
                timer_secs.html(Timetracker.addZeros(totalSeconds % 60));
                timer_mins.html(Timetracker.addZeros(parseInt(totalSeconds / 60)));
                timer_hours.html(Timetracker.addZeros(parseInt(totalSeconds / (60 * 60))));
                Timetracker.updateTotalTime(totalTime + totalSeconds);
            }
        }

        Timetracker.startUpdateTimers = function() {
            Timetracker.showLoading();

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
                        Timetracker.hideLoading();
                    },
                    error: function(error) {
                        console.debug('AJAX Error:');
                        console.debug(error);
                        Timetracker.hideLoading();
                    }
                });
            }
        }

        Timetracker.stopTask = function(button_clicked) {
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
                    Timetracker.stopTimer();
                    Timetracker.element.submitNewTask.removeClass(Timetracker.class.unclickableButton);
                    button_clicked.css("display", "none");
                    button_clicked.closest("."+Timetracker.class.taskRow).removeClass(Timetracker.class.timerActive);
                    Timetracker.enableNewTasks();
                    Timetracker.element.totalTimeTodayContainer.removeClass(Timetracker.class.timerActive);
                },
                error: function(error) {
                    console.debug('AJAX Error:');
                    console.debug(error);
                }
            });
        }

        Timetracker.stopTimer = function() {
            clearInterval(Timetracker.taskTimer);
        }

        Timetracker.stopUpdateTimer = function() {
            clearInterval(Timetracker.updateTimer);
        }

        Timetracker.updateTotalTime = function(total_seconds) {
            var total_hours = Timetracker.addZeros(Math.floor(total_seconds / 3600));
            var total_mins = Timetracker.addZeros(Math.floor(total_seconds % 3600 / 60));
            total_secs = Timetracker.addZeros(Math.floor(total_seconds % 3600 % 60));
    
            Timetracker.element.totalTimeTodayDisplay.html(total_hours+":"+total_mins+":"+total_secs);
            Timetracker.element.totalTimeToday.val(total_seconds);
        }

    }
    
});