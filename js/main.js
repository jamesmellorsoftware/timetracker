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
            success: function(response){
                console.log(response);
            },
            error: function(error) {
                console.debug('AJAX Error:');
                console.debug(error);
            }
        });

    });
    
});