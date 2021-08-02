<?php
require_once("includes/head.php");
if (!$session->is_signed_in()) header("Location: login.php");
?>

<main class="mainapp">

    <header class="mainapp_header">
        <h2 class="mainapp_header_appname">
            <?php echo APP_NAME; ?>
        </h2>
        <a class="mainapp_header_logout btn-1" href="logout.php">
            <?php echo MAINAPP_LOGOUT;?>
        </a>
    </header>

    <section class="mainapp_newtask">

        <input id="task" type="text" class="mainapp_newtask_text"
        maxlength="<?php echo LIMIT_TIMER_NAME; ?>"
        placeholder="<?php echo MAINAPP_TEXT; ?>">

        <a id="task_submit" class="mainapp_newtask_button btn-1">
            <?php echo MAINAPP_BUTTON; ?>
        </a>

    </section>

    <section id="task_container" class="mainapp_tasks">
<!--
        <div class="mainapp_tasks_notasks">
            No tasks yet.
        </div>
-->
        <div id="task_template" class="mainapp_tasks_task">
            <p class="mainapp_tasks_task_taskdesc">
                <span class="mainapp_tasks_task_taskdesc_name task_name">Task Name</span>
                <span class="mainapp_tasks_task_taskdesc_duration task_duration">
                    <span class="mainapp_tasks_task_taskdesc_duration_hours task_hours">00</span>:
                    <span class="mainapp_tasks_task_taskdesc_duration_mins task_mins">00</span>:
                    <span class="mainapp_tasks_task_taskdesc_duration_secs task_secs">00</span>
                </span>
            </p>
            <div class="mainapp_tasks_task_controls">
                <span class="mainapp_tasks_task_controls_control
                mainapp_tasks_task_controls_control_stop">
                    <img class="mainapp_tasks_task_controls_control_img
                    mainapp_tasks_task_controls_control_stop_img"
                    src="img/stop.png" alt="stop">
                </span>
                <span class="mainapp_tasks_task_controls_control
                mainapp_tasks_task_controls_control_trash">
                    <img class="mainapp_tasks_task_controls_control_img
                    mainapp_tasks_task_controls_control_trash_img"
                    src="img/trash.png" alt="trash">
                </span>
            </div>
        </div>

    </section>

    <section class="mainapp_date">
        <span class="mainapp_date_select btn-1 prevday">&lt;</span>
        <span class="mainapp_date_date btn-1 today">Today</span>
        <span class="mainapp_date_select btn-1 nextday">&gt;</span>
    </section>

</main>

<?php require_once("includes/foot.php"); ?>