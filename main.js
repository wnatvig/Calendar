"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add_event = add_event;
exports.delete_event = delete_event;
var User_interface_1 = require("./User_interface");
var month_1 = require("./month");
var time_date_1 = require("./time_date");
var hashtable_1 = require("./hashtable");
var file_1 = require("./file");
var DATA_FILENAME = "data";
var pt = require('prompt-sync')();
//creates the hashtable and array of users and then fills them with all the data
//we have on them
var ht = (0, hashtable_1.init_hashtable)();
var users = [];
(0, file_1.add_events_from_file)(ht, users, DATA_FILENAME);
var user = "";
var eventlist;
var month;
var selected_day;
var welcome_prompt = true;
while (true) {
    var start = false;
    if (welcome_prompt) {
        console.log("Welcome to DigiCal, your personal digital calendar");
    }
    console.log();
    var choice = (0, User_interface_1.User_input)("> ", [["login", "Log in to your accout"],
        ["reg", "Register a new account"],
        ["quit", "End the program"]]);
    if (choice === "quit") {
        break;
    }
    else if (choice === "reg") {
        console.log("What do you want your account name to be?");
        var account = void 0;
        var account_created = false;
        while (!account_created) {
            account = pt("> ");
            if (account.includes("\\")) {
                console.log("Invalid entry: Cannot use \\ in account name");
                continue;
            }
            else if (user_exists(ht, account)) {
                console.log("Invalid entry: Usernames must be unique");
                continue;
            }
            else if (account.includes("!")) {
                console.log("Invalid entry: Cannot use ! in account name");
                continue;
            }
            else {
                user = account;
                add_user(ht, users, user);
                account_created = true;
                start = true;
            }
        }
    }
    else if (choice === "login") {
        user = pt("Account name: ");
        if (user_exists(ht, user)) {
            start = true;
        }
        else {
            console.log("Could not find user '".concat(user, "'"));
            welcome_prompt = false;
            continue;
        }
    }
    selected_day = { year: (0, time_date_1.get_current_year)(), month: (0, time_date_1.get_current_month)(), day: (0, time_date_1.get_current_date)() };
    eventlist = get_event_list(ht, users, user);
    month = (0, month_1.init_month)(eventlist);
    while (start) {
        //clear
        for (var i = 0; i < 100; i++) {
            console.log();
        }
        //console.log('\x1bc');
        (0, User_interface_1.display_month)(month, eventlist, selected_day);
        if (month.year === selected_day.year && month.month === selected_day.month)
            (0, User_interface_1.display_day)(eventlist, month, selected_day.day);
        var actions_list = [["next", "Displays the next month"],
            ["prev", "Display the previous month"],
            ["add", "Add an event to the calendar"],
            ["edit", "Edit an event"],
            ["view", "View a day and all it's events"],
            ["logout", "Log out of this user"]];
        //Need function to view events
        //Need fuction to fetch specific events (such as next events)
        //Need function to show all events
        console.log();
        console.log("What action do you want to take?");
        console.log();
        var action = (0, User_interface_1.User_input)("> ", actions_list);
        if (action === "next") {
            month = (0, month_1.get_next_month)(month, eventlist);
            var current_month = (0, month_1.init_month)(eventlist);
        }
        else if (action === "prev") {
            month = (0, month_1.get_previous_month)(month, eventlist);
            var current_month = (0, month_1.init_month)(eventlist);
        }
        else if (action === "add") {
            var event_1 = (0, User_interface_1.user_add_event)();
            add_event(ht, users, user, event_1);
        }
        else if (action === "logout") {
            welcome_prompt = true;
            break;
        }
        else if (action === "view") {
            selected_day.day = (0, User_interface_1.user_pick_day)(month);
            selected_day.year = month.year;
            selected_day.month = month.month;
        }
        else if (action === "edit") {
            var event_2 = (0, User_interface_1.user_select_event)(eventlist);
            if (event_2) {
                console.log("Do you want to delete or edit this event?");
                var action_choice = (0, User_interface_1.User_input)("> ", [
                    ["delete", "Delete the event"],
                    ["edit", "Edit the event"],
                    ["cancel", "Cancel"]
                ]);
                if (action_choice === "delete") {
                    delete_event(ht, users, user, event_2);
                    console.log("Event deleted successfully.");
                }
                else if (action_choice === "edit") {
                    (0, User_interface_1.edit_event)(ht, users, user, eventlist, event_2);
                }
            }
        }
    }
}
/**
 * Add event.
 * Updates data structures and writes changes to file.
 * If the specified user does not exist the user is created.
 * @param {Hashtable} ht - hashtable for user lookup
 * @param {Array<User>} users - array of users
 * @param {string} username - user to be associated with event
 * @param {Event} event - event to add
 * @return {void}
 */
function add_event(ht, users, username, event) {
    (0, hashtable_1.ht_add_event)(ht, users, username, event);
    //append_event_to_file(event, username, DATA_FILENAME);	//not in use due to potential bug, see comment in file.ts
    if ((0, file_1.write_events_to_file)(users, DATA_FILENAME))
        console.log("write_events_to_file returned 1");
}
/**
 * Add new user.
 * Updates data structures and writes changes to file.
 * @param {Hashtable} ht - hashtable for user lookup
 * @param {Array<User>} users - array of users
 * @param {string} username - user to be added
 * @return {void}
 */
function add_user(ht, users, username) {
    (0, hashtable_1.ht_add_event)(ht, users, username);
    if ((0, file_1.write_events_to_file)(users, DATA_FILENAME)) // users with no events are still saved in file
        console.log("write_events_to_file returned 1");
}
/**
 * Checks whether or not a user exists in hashtable.
 * @param {Hashtable} ht - hashtable for user lookup
 * @param {string} username - user to look for
 * @return {boolean} - returns:
 *     true: user exists
 *     false: user does not exist
 */
function user_exists(ht, username) {
    return (0, hashtable_1.ht_entry_exists)(ht, username);
}
/**
 * Retrieve the event list associated with a user.
 * @param {Hashtable} ht - hashtable for user lookup
 * @param {Array<User>} users - array of users
 * @param {string} username - user's username
 * @return {Event_list | null} - returns:
 *     Event_list: user's event list
 *     null: if user was not found in hashtable
 */
function get_event_list(ht, users, username) {
    return (0, hashtable_1.ht_get_event_list)(ht, users, username);
}
/**
 * Delete an event.
 * Updates data structures and writes changes to file.
 * @param {Hashtable} ht - hashtable for user lookup
 * @param {Array<User>} users - array of users
 * @param {string} username - user associated with event
 * @param {Event} event - event to delete
 * @return {void}
 */
function delete_event(ht, users, username, event) {
    (0, hashtable_1.ht_delete_event)(ht, users, username, event);
    if ((0, file_1.write_events_to_file)(users, DATA_FILENAME))
        console.log("write_events_to_file returned 1");
}
/**
 * Delete a user and all events associated with that user.
 * Updates data structures and writes changes to file.
 * @param {Hashtable} ht - hashtable for user lookup
 * @param {Array<User>} users - array of users
 * @param {string} username - user
 * @return {void}
 */
function delete_user(ht, users, username) {
    (0, hashtable_1.ht_delete_event)(ht, users, username);
    if ((0, file_1.write_events_to_file)(users, DATA_FILENAME))
        console.log("write_events_to_file returned 1");
}
