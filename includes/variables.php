<?php

require_once("config.php");

// HEAD
defined("APP_NAME") ? null : define("APP_NAME", "Time Tracker");
defined("PAGE_TITLE") ? null : define("PAGE_TITLE", "Time Tracker / James Mellor");

// LOGIN / REGISTER
defined("LOGINREG_CHANGE_LOGIN") ? null : define("LOGINREG_CHANGE_LOGIN", "Don't have an account? Register");
defined("LOGINREG_CHANGE_REGISTER") ? null : define("LOGINREG_CHANGE_REGISTER", "Already have an account? Log in");
defined("LOGINREG_ERROR_GENERAL") ? null : define("LOGINREG_ERROR_GENERAL", "Error creating user");
defined("LOGINREG_ERROR_PASSWORD_EMPTY") ? null : define("LOGINREG_ERROR_PASSWORD_EMPTY", "Password cannot be empty");
defined("LOGINREG_ERROR_PASSWORD_INCORRECT") ? null : define("LOGINREG_ERROR_PASSWORD_INCORRECT", "Incorrect password");
defined("LOGINREG_ERROR_PASSWORD_LENGTH") ? null : define("LOGINREG_ERROR_PASSWORD_LENGTH", "Username must be no longer than" . LIMIT_PASSWORD . " characters");
defined("LOGINREG_ERROR_USER_NOT_FOUND") ? null : define("LOGINREG_ERROR_USER_NOT_FOUND", "User doesn't exist");
defined("LOGINREG_ERROR_USERNAME_EMPTY") ? null : define("LOGINREG_ERROR_USERNAME_EMPTY", "Username cannot be empty");
defined("LOGINREG_ERROR_USERNAME_IN_USE") ? null : define("LOGINREG_ERROR_USERNAME_IN_USE", "Username already exists");
defined("LOGINREG_ERROR_USERNAME_LENGTH") ? null : define("LOGINREG_ERROR_USERNAME_LENGTH", "Username must be no longer than" . LIMIT_USERNAME . " characters");
defined("LOGINREG_LOGIN") ? null : define("LOGINREG_LOGIN", "Log In");
defined("LOGINREG_PASSWORD") ? null : define("LOGINREG_PASSWORD", "Password");
defined("LOGINREG_REGISTER") ? null : define("LOGINREG_REGISTER", "Register");
defined("LOGINREG_USERNAME") ? null : define("LOGINREG_USERNAME", "Username");

// MAIN APP
defined("MAINAPP_BUTTON") ? null : define("MAINAPP_BUTTON", "Start");
defined("MAINAPP_LOGOUT") ? null : define("MAINAPP_LOGOUT", "Log Out");
defined("MAINAPP_TEXT") ? null : define("MAINAPP_TEXT", "Task Name");

// TIMERS
defined("TIMER_ERROR_EMPTY") ? null : define("TIMER_ERROR_EMPTY", "Please give your task a name");
defined("TIMER_ERROR_GENERAL") ? null : define("TIMER_ERROR_GENERAL", "Error creating timer");
defined("TIMER_ERROR_NO_AUTHOR") ? null : define("TIMER_ERROR_NO_AUTHOR", "LOG USER OUT");
defined("TIMER_ERROR_NO_DATE") ? null : define("TIMER_ERROR_NO_DATE", "Date incorrect");
defined("TIMER_ERROR_TOO_LONG") ? null : define("TIMER_ERROR_TOO_LONG", "Task name must be less than " . LIMIT_TIMER_NAME . " characters");
defined("TIMER_ERROR_WRONG_DATE") ? null : define("TIMER_ERROR_WRONG_DATE", "Date incorrect");

?>