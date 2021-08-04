$(document).ready(function() {

    window.Timetracker = {}
    Timetracker.loading = $("#loading");

    hideLoading();

    $("#login_register").on("click", function(){

        showLoading();

        // Remove validation marks
        $("#username").removeClass("input-invalid");
        $("#username_errors").html(" ");
        $("#username_errors").addClass("nodisplay");
        $("#password").removeClass("input-invalid");
        $("#password_errors").html(" ");
        $("#password_errors").addClass("nodisplay");

        var username = $("#username").val();
        var password = $("#password").val();

        if ($("#login_register").hasClass("register")) {
            var register = true;
            var login = false;
            var controller = 'includes/controllers/register_controller.php';
        } else if ($("#login_register").hasClass("login")) {
            var register = false;
            var login = true;
            var controller = 'includes/controllers/login_controller.php';
        }

        $.ajax({
            type: 'post',
            url: controller,
            dataType: 'json',
            data: {
                "login":    login,
                "register": register,
                "username": username,
                "password": password
            },
            success: function(response){
                if (response == true) {
                    // Registration / login successful, take to index
                    window.location = "index.php";
                } else {
                    // Fail, display errors
                    if (response.username) {
                        $("#username").addClass("input-invalid");
                        $("#username_errors").removeClass("nodisplay");
                        $("#username_errors").html(response.username);
                    }
                    if (response.password) {
                        $("#password").addClass("input-invalid");
                        $("#password_errors").removeClass("nodisplay");
                        $("#password_errors").html(response.password);
                    }
                    hideLoading();
                }
            },
            error: function(error) {
                console.debug('AJAX Error:');
                console.debug(error);
                hideLoading();
            }
        });

    });

    function hideLoading() {
        Timetracker.loading.fadeOut();
    }

    function showLoading() {
        Timetracker.loading.fadeIn(100);
    }
    
});