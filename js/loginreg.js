$(document).ready(function() {

    // Starter functions
    initialiseTimetrackerLogin();

    Timetracker.login.element.loading.hide();

    // Click handlers
    Timetracker.login.element.loginregister.on("click", function(){

        Timetracker.login.element.loading.show();

        Timetracker.login.removeErrors();

        var username = Timetracker.login.element.username.val();
        var password = Timetracker.login.element.username.val();

        if (Timetracker.login.element.loginregister.hasClass("register")) {
            var register = true;
            var login = false;
            var controller = Timetracker.login.controller.register_controller;
        } else if (Timetracker.login.element.loginregister.hasClass("login")) {
            var register = false;
            var login = true;
            var controller = Timetracker.login.controller.login_controller;
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
                    Timetracker.login.login();
                } else {
                    Timetracker.login.displayErrors(response);
                    Timetracker.login.element.loading.hide();
                }
            },
            error: function(error) {
                console.debug('AJAX Error:');
                console.debug(error);
                Timetracker.login.element.loading.hide();
            }
        });

    });


    function initialiseTimetrackerLogin() {

        // Define namespace
        window.Timetracker = {};
        window.Timetracker.login = {};

        // Define controllers
        Timetracker.login.controller = {};
        Timetracker.login.controller.directory           = "includes/controllers";
        Timetracker.login.controller.login_controller    = `${Timetracker.login.controller.directory}/login_controller.php`;
        Timetracker.login.controller.register_controller = `${Timetracker.login.controller.directory}/register_controller.php`;

        // Define elements
        Timetracker.login.element = {};
        Timetracker.login.element.loading         = $("#loading");
        Timetracker.login.element.loginregister   = $("#login_register");
        Timetracker.login.element.password        = $("#password");
        Timetracker.login.element.password_errors = $("#password_errors");
        Timetracker.login.element.username        = $("#username");
        Timetracker.login.element.username_errors = $("#username_errors");
    
        // Methods
        Timetracker.login.displayErrors = function(response) {
            if (response.username) {
                Timetracker.login.element.username.addClass("input-invalid");
                Timetracker.login.element.username_errors.removeClass("nodisplay");
                Timetracker.login.element.username_errors.html(response.username);
            }
            if (response.password) {
                Timetracker.login.element.password.addClass("input-invalid");
                Timetracker.login.element.password_errors.removeClass("nodisplay");
                Timetracker.login.element.password_errors.html(response.password);
            }
        }

        Timetracker.login.element.loading.hide = function() {
            Timetracker.login.element.loading.fadeOut();
        }

        Timetracker.login.login = function() {
            window.location = "index.php";
        }

        Timetracker.login.removeErrors = function() {
            Timetracker.login.element.username.removeClass("input-invalid");
            Timetracker.login.element.username_errors.html(" ");
            Timetracker.login.element.username_errors.addClass("nodisplay");
            Timetracker.login.element.password.removeClass("input-invalid");
            Timetracker.login.element.password_errors.html(" ");
            Timetracker.login.element.password_errors.addClass("nodisplay");
        }
    
        Timetracker.login.element.loading.show = function() {
            Timetracker.login.element.loading.fadeIn(100);
        }
    }
    
});