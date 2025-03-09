"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.display_month = display_month;
exports.display_day = display_day;
exports.user_pick_day = user_pick_day;
exports.User_input = User_input;
exports.user_add_event = user_add_event;
exports.user_select_event = user_select_event;
exports.parse_event_input = parse_event_input;
exports.edit_event = edit_event;
exports.display_event = display_event;
exports.find_next_event = find_next_event;
exports.display_next_event = display_next_event;
var defs_1 = require("./defs");
var time_date_1 = require("./time_date");
var events_1 = require("./events");
var month_1 = require("./month");
var main_1 = require("./main");
//Makes an array with all the dates in the right place so it can be divided
//between the weeks evenly
function divide_days_in_weeks(month) {
    var days_array = new Array(month.week_numbers.length * 7);
    for (var i = 1; i <= month.week_numbers.length * 7; i++) {
        if (i <= month.month_length) {
            days_array[i + month.first_weekday - 2] = i;
        }
        else { }
    }
    ;
    return days_array;
}
;
//Creates an array with all the days that have events
function days_with_events(event_array) {
    var event_days = [];
    for (var i = 0; event_array !== undefined && i < event_array.length; i++) {
        event_days[i] = event_array[i].day;
    }
    return event_days;
}
;
/**
 * Dispays a month in the terminal in a formatted way.
 * The function prints:
 * - The name of the month and year as a title.
 * - A header with weekday abbreviations (Mon-Sun).
 * - The days of the month, properly aligned under their respective weekday headers.
 * - Week numbers displayed at the beginning of each row.
 * @param {Month} month - the month to be displayed
 * @param {Event_list} Event_list - The events for the calendar
 * @param {Day} selected_day - The date that should be highlighted
 */
function display_month(month, Event_list, selected_day) {
    var day_array = divide_days_in_weeks(month);
    var week_end_index = 7;
    //TODO: Add a function to show days when there are events
    //Create an array with all days with events that month
    var event_days = days_with_events(Event_list.events[month.events_index]);
    //check for if it is the current month
    var is_current_month = month.month === (0, time_date_1.get_current_month)() && month.year === (0, time_date_1.get_current_year)();
    console.log();
    console.log("          ", defs_1.NAMES_MONTHS[month.month], month.year);
    console.log("   Mon Tue Wed Thu Fri Sat Sun");
    for (var _i = 0, _a = month.week_numbers; _i < _a.length; _i++) {
        var weeks = _a[_i];
        if (weeks < 10) {
            process.stdout.write(" \u001B[31m".concat(weeks, "\u001B[0m"));
        }
        else {
            process.stdout.write("\u001B[31m".concat(weeks, "\u001B[0m"));
        }
        for (var i = week_end_index - 7; i < week_end_index; i++) {
            if (day_array[i] !== undefined) {
                if (day_array[i] === (0, time_date_1.get_current_date)() && is_current_month && // day === today
                    day_array[i] === selected_day.day && month.month === selected_day.month && month.year === selected_day.year) { // day === selected day
                    //Color background green, with whit text if it is today and viewed day
                    if (day_array[i] < 10) {
                        process.stdout.write('  ' + "\u001B[42;37m ".concat(day_array[i], "\u001B[0m"));
                    }
                    else {
                        process.stdout.write('  ' + "\u001B[42;37m".concat(day_array[i], "\u001B[0m"));
                    }
                }
                else if (day_array[i] === (0, time_date_1.get_current_date)() && is_current_month) {
                    //Color text green if it is todays date
                    if (day_array[i] < 10) {
                        process.stdout.write('  ' + "\u001B[32m ".concat(day_array[i], "\u001B[0m"));
                    }
                    else {
                        process.stdout.write('  ' + "\u001B[32m".concat(day_array[i], "\u001B[0m"));
                    }
                }
                else if (event_days.includes(day_array[i]) && day_array[i] === selected_day.day && month.month === selected_day.month && month.year === selected_day.year) {
                    //Colors the background blue if it the highlighted day and there is at least one event on it
                    if (day_array[i] < 10) {
                        process.stdout.write('  ' + "\u001B[44;37m ".concat(day_array[i], "\u001B[0m"));
                    }
                    else {
                        process.stdout.write('  ' + "\u001B[44;37m".concat(day_array[i], "\u001B[0m"));
                    }
                }
                else if (day_array[i] === selected_day.day && month.month === selected_day.month && month.year === selected_day.year) {
                    //Colors backgorund white to highlight the day the user is on
                    if (day_array[i] < 10) {
                        process.stdout.write('  ' + "\u001B[47;30m ".concat(day_array[i], "\u001B[0m"));
                    }
                    else {
                        process.stdout.write('  ' + "\u001B[47;30m".concat(day_array[i], "\u001B[0m"));
                    }
                }
                else if (event_days.includes(day_array[i])) {
                    //Colors text blue to show that there are events on that day
                    if (day_array[i] < 10) {
                        process.stdout.write('   ' + "\u001B[34m".concat(day_array[i], "\u001B[0m"));
                    }
                    else {
                        process.stdout.write('  ' + "\u001B[34m".concat(day_array[i], "\u001B[0m"));
                    }
                }
                else {
                    if (day_array[i] < 10) {
                        process.stdout.write('   ' + day_array[i]);
                    }
                    else {
                        process.stdout.write('  ' + day_array[i]);
                    }
                }
                ;
            }
            else {
                process.stdout.write('    ');
            }
        }
        week_end_index += 7;
        console.log();
    }
    console.log();
}
;
/**
 * Displays all events for a specific day in the terminal window.
 * @param {Event_list} event_list - The eventlist where all the events are stored
 * @param {Month} month - The month the day is in
 * @param {number} day - The date to be viewed
 * @precondition day is a positive whole number less than or equal to month.month_length
 */
function display_day(event_list, month, day) {
    var days_events = [];
    if (event_list.events[month.events_index] !== undefined) {
        days_events = event_list.events[month.events_index].filter(function (events) { return events.day === day; });
    }
    console.log("All events for ".concat(defs_1.NAMES_MONTHS[month.month], " ").concat(day, ":"));
    console.log();
    if (days_events.length === 0) {
        console.log("Seems you have no events this day");
    }
    else {
        for (var _i = 0, days_events_1 = days_events; _i < days_events_1.length; _i++) {
            var ev = days_events_1[_i];
            display_event(ev);
            console.log();
        }
    }
}
/**
 * Lets user pick a date from a month
 * @param {Month} month - The month from which, the user can pick a date
 * @returns a users choice of a valid date from the month in question
 */
function user_pick_day(month) {
    var date = prompt_for_number("What day do you want to view? ", function (num) {
        if (num < 1 || num > month.month_length) {
            return "Invalid date: ".concat(defs_1.NAMES_MONTHS[month.month], " only has ").concat(month.month_length, " days");
        }
        else { }
        return null;
    });
    return date;
}
var event1 = { day: 22,
    month: 3,
    year: 2025,
    time_start: 1,
    time_end: 1,
    description: "Tadläkare" };
var event2 = { day: 5,
    month: 4,
    year: 2025,
    time_start: 1,
    time_end: 1,
    description: "Tadläkare" };
var month1 = { year: 2025,
    month: 1,
    month_length: 31,
    first_weekday: 3,
    week_numbers: [1, 2, 3, 4, 5],
    events_index: 0 };
var Eent_array1 = (0, events_1.make_event_list)(2025, 1, []);
(0, events_1.add_event_to_event_list)(event1, Eent_array1);
(0, events_1.add_event_to_event_list)(event2, Eent_array1);
/**
 * Presents the user with a bunch of choices and a prompt asking them to write
 * input a valid comand
 * @param {string} Prompt - A promt to cause them to
 * @param {Choices} choices - An array of pairs where the first element is a valid
 * comand and the second element is a description of the comand
 * @returns A valid answer from the user
 */
function User_input(Prompt, choices) {
    //This is the function that enables user input
    var pt = require('prompt-sync')();
    //To split choices into 2 arrays 1 with descriptions, 1 with the valid entries
    var valid_entries = [];
    for (var _i = 0, choices_1 = choices; _i < choices_1.length; _i++) {
        var choice = choices_1[_i];
        console.log("".concat(choice[1], " - ").concat(choice[0]));
        valid_entries.push(choice[0]);
    }
    ;
    var user_answer = "";
    while (!valid_entries.includes(user_answer)) {
        user_answer = pt("".concat(Prompt));
        if (!valid_entries.includes(user_answer)) {
            console.log();
            console.log("Invalid entry! Please try again.");
            console.log();
        }
        else { }
    }
    ;
    return user_answer;
}
;
//Test for user_input
//console.log(User_input("Enter[y/n]: ",[["y", "yes"], ["n", "no"]]));
// Helper: Prompt for a number with validation.
function prompt_for_number(prompt_text, validate) {
    var pt = require('prompt-sync')();
    while (true) {
        var input = pt(prompt_text);
        var num = Number(input);
        if (isNaN(num)) {
            console.log("Invalid entry: Not a number");
            continue;
        }
        var error = validate(num);
        if (error) {
            console.log(error);
            continue;
        }
        return num;
    }
}
// Helper: Prompt for a time value in hh:mm format with validation.
function prompt_for_time(prompt_text, min_time) {
    if (min_time === void 0) { min_time = 0; }
    var pt = require('prompt-sync')();
    while (true) {
        console.log("Note: Please input times using standard 24 hour notation (e.g., 11:11)");
        var userTime = pt(prompt_text);
        var parts = userTime.split(":");
        if (parts.length !== 2) {
            console.log("Invalid entry: Incorrect formatting");
            continue;
        }
        var hour = Number(parts[0]);
        var minute = Number(parts[1]);
        if (isNaN(hour) || hour < 0 || hour > 23) {
            console.log("Invalid entry: That is not a valid hour");
            continue;
        }
        if (isNaN(minute) || minute < 0 || minute > 59) {
            console.log("Invalid entry: Not a valid minute");
            continue;
        }
        var time = hour * 100 + minute;
        if (time < min_time) {
            var min_minute = min_time % 100;
            var min_hour = (min_time - min_minute) / 100;
            if (min_minute < 10) {
                min_minute = "0".concat(min_minute);
            }
            else { }
            if (min_hour < 10) {
                min_hour = "0".concat(min_hour);
            }
            else { }
            console.log("Invalid entry: End time must be at least ".concat(min_hour, ":").concat(min_minute));
            continue;
        }
        if (time > 2359) {
            console.log("Invalid entry: Time cannot exceed 23:59");
            continue;
        }
        return time;
    }
}
//TODO: Maybe add so that you can ad events that are earlier than the days date
/**
 * Lets the user create an event by presenting them with prompts
 * for year, month, day, start time, end time, and description.
 * @returns the user created event
 */
function user_add_event() {
    var pt = require('prompt-sync')();
    var current_year = (0, time_date_1.get_current_year)();
    var current_month = (0, time_date_1.get_current_month)();
    var current_date = (0, time_date_1.get_current_date)();
    // Get valid year (cannot be before the current year)
    var year = prompt_for_number("Year: ", function (num) {
        return num < current_year ? "Invalid entry: Too early year" : null;
    });
    //Get valid month
    var month = prompt_for_number("Month: ", function (num) {
        var start_month = year === current_year ? current_month : 1;
        if (num < start_month) {
            return "Invalid entry: Month already passed";
        }
        else if (num > 12) {
            return "Invalid entry: There are only 12 months in the year";
        }
        else { }
        return null;
    });
    // Get valid date (must be within the month's range and not in the past if current month/year)
    var date = prompt_for_number("Date: ", function (num) {
        if (num < 1 || num > (0, month_1.month_length)(year, month)) {
            return "Invalid date: ".concat(defs_1.NAMES_MONTHS[month], " only has ").concat((0, month_1.month_length)(year, month), " days");
        }
        else { }
        if (year === current_year && month === current_month && num < current_date) {
            return "Invalid entry: Date already passed";
        }
        else { }
        return null;
    });
    // Get valid start and end times.
    var time_start = prompt_for_time("Start time: ");
    var time_end = prompt_for_time("End time: ", time_start);
    // Get event description.
    //TODO: Add so user cannot use \
    var description = pt("Description: ");
    while (description.includes("\\")) {
        console.log("Invalid entry: Cannot use \\ in description");
        description = pt("Description: ");
    }
    // Create the new event.
    var new_event = (0, events_1.make_event)(date, month, year, time_start, time_end, description);
    return new_event;
}
/**
 * The function gives the user the possibility to select a specific event
 * @param event_list an array of events
 * @returns the event that the user selected as the type Event
 */
function user_select_event(event_list) {
    var pt = require('prompt-sync')();
    var year = prompt_for_number("Enter year: ", function (num) {
        return num < event_list.base_year ? "Invalid entry: Too early year" : null;
    });
    var month = prompt_for_number("Enter month: ", function (num) {
        if (num < 1 || num > 12) {
            return "Invalid entry: Month must be between 1 and 12";
        }
        return null;
    });
    var monthIndex = (0, month_1.get_month_index)(event_list.base_year, event_list.base_month, year, month);
    var date = prompt_for_number("Enter date: ", function (num) {
        if (num < 1 || num > (0, month_1.month_length)(year, monthIndex + 1)) {
            return "Invalid entry: ".concat(defs_1.NAMES_MONTHS[monthIndex], " only has ").concat((0, month_1.month_length)(year, monthIndex + 1), " days");
        }
        return null;
    });
    var events_on_date = event_list.events[monthIndex]
        ? event_list.events[monthIndex].filter(function (event) { return event.year === year && event.day === date; })
        : [];
    if (events_on_date.length === 0) {
        console.log("No events found on this date.");
        return null;
    }
    if (events_on_date.length === 1) {
        return events_on_date[0];
    }
    console.log("Events on this date:");
    events_on_date.forEach(function (event, index) {
        console.log("".concat(index + 1, ": ").concat(event.description, " (").concat(event.time_start, " - ").concat(event.time_end, ")"));
    });
    var event_index = prompt_for_number("Select an event number: ", function (num) {
        if (num < 1 || num > events_on_date.length) {
            return "Invalid entry: Please choose a valid event number.";
        }
        return null;
    });
    return events_on_date[event_index - 1];
}
function parse_event_input(dayStr, monthStr, yearStr, startTimeStr, endTimeStr, description) {
    // till siffror
    var day = Number(dayStr);
    var month = Number(monthStr);
    var year = Number(yearStr);
    var startTime = parse_time(startTimeStr);
    var endTime = parse_time(endTimeStr);
    //datum
    //if (isNaN(year) || year < get_current_year()) return [null, 1]; // år
    //if (isNaN(month) || month < get_current_month() || month > 12) return [null, 2]; // månad
    //if (isNaN(day) || day < get_current_day() || day > month_length(year, month)) return [null, 3]; // dag
    if (isNaN(year))
        return [null, 1]; // år
    if (isNaN(month) || month < 1 || month > 12)
        return [null, 2]; // månad
    if (isNaN(day) || day < 1 || day > (0, month_1.month_length)(year, month))
        return [null, 3]; // dag
    //tid
    if (startTime === null)
        return [null, 4]; //starttid
    if (endTime === null)
        return [null, 5]; //sluttid
    if (startTime > endTime)
        return [null, 6]; //starttid före sluttid
    var event = {
        day: day,
        month: month,
        year: year,
        time_start: startTime,
        time_end: endTime,
        description: description
    };
    return [event, 0]; //nummer 0 vilket betyder korrekt
}
function edit_event(ht, users, username, event_list, old_event) {
    console.log("Enter new details for the event.");
    var pt = require('prompt-sync')();
    var new_day = prompt_for_number("Enter new day: ", function (num) {
        if (num < 1 || num > (0, month_1.month_length)(old_event.year, old_event.month)) {
            return "Invalid entry: Month ".concat(old_event.month, " only has ").concat((0, month_1.month_length)(old_event.year, old_event.month), " days");
        }
        return null;
    });
    var new_month = prompt_for_number("Enter new month: ", function (num) {
        if (num < 1 || num > 12) {
            return "Invalid entry: Month must be between 1 and 12";
        }
        return null;
    });
    var new_year = prompt_for_number("Enter new year: ", function (num) {
        return num < event_list.base_year ? "Invalid entry: Too early year" : null;
    });
    var new_start_time = parse_time(pt("Enter new start time (HH:MM): "));
    var new_end_time = parse_time(pt("Enter new end time (HH:MM): "));
    if (new_start_time === null || new_end_time === null || new_start_time > new_end_time) {
        console.log("Invalid time input. Start time must be before end time.");
        return;
    }
    var new_description = pt("Enter new description: ");
    var new_event = {
        day: new_day,
        month: new_month,
        year: new_year,
        time_start: new_start_time,
        time_end: new_end_time,
        description: new_description
    };
    (0, main_1.delete_event)(ht, users, username, old_event);
    (0, main_1.add_event)(ht, users, username, new_event);
    console.log("Event successfully updated.");
}
function parse_time(timeStr) {
    var parts = timeStr.split(":");
    if (parts.length !== 2)
        return null;
    var hours = Number(parts[0]);
    var minutes = Number(parts[1]);
    if (isNaN(hours) || hours < 0 || hours > 23)
        return null;
    if (isNaN(minutes) || minutes < 0 || minutes > 59)
        return null;
    return hours * 100 + minutes; //ex 15*100+15=1515
}
/**
 * Displays an event in a formated way in the terminal.
 * @param {Event} event - The event that is to be displayed
 */
function display_event(event) {
    var start_minute = event.time_start % 100;
    var start_hour = (event.time_start - start_minute) / 100;
    if (start_minute < 10) {
        start_minute = "0".concat(start_minute);
    }
    else { }
    if (start_hour < 10) {
        start_hour = "0".concat(start_hour);
    }
    else { }
    var end_minute = event.time_end % 100;
    var end_hour = (event.time_end - end_minute) / 100;
    if (end_minute < 10) {
        end_minute = "0".concat(end_minute);
    }
    else { }
    if (end_hour < 10) {
        end_hour = "0".concat(end_hour);
    }
    else { }
    console.log("Date: ".concat(defs_1.NAMES_MONTHS[event.month], " ").concat(event.day, ", ").concat(event.year));
    console.log("From: ".concat(start_hour, ":").concat(start_minute));
    console.log("To: ".concat(end_hour, ":").concat(end_minute));
    console.log("Description: ".concat(event.description));
}
//display_event(event1);
/**
 * Finds the next upcoming event from the provided event list.
 * @param {Event_list} event_list - An object containing all events.
 * @returns {Event | null} The next upcoming event or null if none found.
 */
function find_next_event(event_list) {
    var month_index = (0, month_1.get_month_index)(event_list.base_year, event_list.base_month, (0, time_date_1.get_current_year)(), (0, time_date_1.get_current_month)());
    var evs = event_list.events;
    for (var i = month_index; i < evs.length; i++) {
        for (var _i = 0, _a = evs[i]; _i < _a.length; _i++) {
            var ev = _a[_i];
            if (i === month_index) {
                // For the current month, only consider events on or after today
                if (ev.day >= (0, time_date_1.get_current_date)()) {
                    return ev;
                }
            }
            else {
                // For future months, take the first event
                return ev;
            }
        }
    }
    return null;
}
/**
 * Finds and displays the next upcoming event.
 * If no event is found, it prints "No upcoming events".
 * @param {Event_list} event_list - An object containing all events.
 */
function display_next_event(event_list) {
    var nextEvent = find_next_event(event_list);
    if (nextEvent !== null) {
        display_event(nextEvent);
    }
    else {
        console.log("No upcoming events");
    }
}
//console.log(Eent_array1.events);
//display_next_event(Eent_array1);
//user_add_event(Eent_array1);
