"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User_interface_1 = require("./User_interface");
var month_1 = require("./month");
var time_date_1 = require("./time_date");
var hashtable_1 = require("./hashtable");
var file_1 = require("./file");
var DATA_FILENAME = "data";
var ht = (0, hashtable_1.init_hashtable)();
var users = [];
add_user(ht, users, "user");
(0, file_1.add_events_from_file)(ht, users, DATA_FILENAME);
var day = (0, time_date_1.get_current_date)();
var start = true;
var eventlist = (0, hashtable_1.ht_get_event_list)(ht, users, "user");
var month = (0, month_1.init_month)(eventlist);
while (start) {
    (0, User_interface_1.display_month)(month, eventlist, day);
    (0, User_interface_1.display_day)(eventlist, month, day);
    var actions_list = [["next", "Displays the next month"],
        ["prev", "Display the previous month"],
        ["add", "Add an event to the calendar"],
        ["edit", "Edit an event"],
        ["view", "View a day and all it's events"],
        ["quit", "End the program"]];
    //Need function to view events
    //Need fuction to fetch specific events (such as next events)
    //Need function to show all events
    console.log();
    console.log("What action do you want to take?");
    console.log();
    var action = (0, User_interface_1.User_input)(">", actions_list);
    if (action === "next") {
        month = (0, month_1.get_next_month)(month, eventlist);
        var current_month = (0, month_1.init_month)(eventlist);
        day = month.month === current_month.month && month.year === current_month.year
            ? (0, time_date_1.get_current_date)()
            : 1;
    }
    else if (action === "prev") {
        month = (0, month_1.get_previous_month)(month, eventlist);
        var current_month = (0, month_1.init_month)(eventlist);
        day = month.month === current_month.month && month.year === current_month.year
            ? (0, time_date_1.get_current_date)()
            : 1;
    }
    else if (action === "add") {
        var event_1 = (0, User_interface_1.user_add_event)();
        add_event(ht, users, "user", event_1);
    }
    else if (action === "quit") {
        break;
    }
    else if (action === "view") {
        day = (0, User_interface_1.user_pick_day)(month);
    }
    else if (action === "edit") {
        var event_2 = (0, User_interface_1.user_select_event)(eventlist);
        if (event_2) {
            console.log("Do you want to delete this event? (yes/no)");
            var confirm_delete = (0, User_interface_1.User_input)(">", [["yes", "Confirm deletion"], ["no", "Cancel"]]);
            if (confirm_delete === "yes") {
                delete_event(ht, users, "user", event_2);
                console.log("Event deleted successfully.");
            }
        }
    }
}
;
function add_event(ht, users, username, event) {
    (0, hashtable_1.ht_add_event)(ht, users, username, event);
    //append_event_to_file(event, username, DATA_FILENAME);	//not in use due to potential bug, see comment in file.ts
    if ((0, file_1.write_events_to_file)(users, DATA_FILENAME))
        console.log("write_events_to_file returned 1");
}
function add_user(ht, users, username) {
    (0, hashtable_1.ht_add_event)(ht, users, username);
}
function user_exists(ht, username) {
    return (0, hashtable_1.ht_entry_exists)(ht, username);
}
function get_event_list(ht, users, username) {
    return (0, hashtable_1.ht_get_event_list)(ht, users, username);
}
function delete_event(ht, users, username, event) {
    (0, hashtable_1.ht_delete_event)(ht, users, username, event);
    if ((0, file_1.write_events_to_file)(users, DATA_FILENAME))
        console.log("write_events_to_file returned 1");
}
function delete_user(ht, users, username) {
    (0, hashtable_1.ht_delete_event)(ht, users, username);
    if ((0, file_1.write_events_to_file)(users, DATA_FILENAME))
        console.log("write_events_to_file returned 1");
}
