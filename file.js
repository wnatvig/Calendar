"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.write_events_to_file = write_events_to_file;
exports.append_event_to_file = append_event_to_file;
exports.add_events_from_file = add_events_from_file;
var fs = require("fs");
var hashtable_1 = require("./hashtable");
var User_interface_1 = require("./User_interface");
/* STORING EVENTS ON THE SYSTEM
 * All events, for all users, can be stored in a file.
 * Each event will be one line with the following structure:
 * user, year, month, date, start time, end time, description
 *
 * user: a username, only alphanumerical characters
 * year/month/date: only numerical characters
 * start time/end time: valid time in the format hh:mm
 * description: string starting and ending with \"
 *              description itself cannot contain \
 *
 * example:
 * namn, 2025, 4, 30, 00:00, 23:59, \"valborg\"\n
 *
 * All events for a specific user needs to be in chronological order.
 *
 * users with no events are stored in the following format:
 * !username\n
 *
 */
/**
 * Write all events for all users to file.
 * Will truncate existing file or create it if it does not exist.
 * @param {Array<User>} users - array of all users, each User contains an event list
 * @param {string} filename - file name of the file to write to
 * @return {number} - returns any of the following codes:
 *     0: success
 *     1: error writing to file, more information was written to console
 */
function write_events_to_file(users, filename) {
    var output = "";
    // loop through all events, one user at a time
    for (var u = 0; u < users.length; u++) {
        var evl = users[u].eventlist;
        var months = evl.events;
        var no_events = true;
        for (var m = 0; m < months.length; m++) {
            if (months[m] === undefined)
                continue;
            for (var e = 0; e < months[m].length; e++) {
                var event_1 = months[m][e];
                // one line per event
                output += stringify_event(event_1, users[u].username) + '\n';
                no_events = false;
            }
        }
        if (no_events) // user got no events, write no-event line
            output += '!' + users[u].username + '\n';
    }
    // write (truncate/create file) output to file
    try {
        fs.writeFileSync(filename, output);
    }
    catch (error) {
        console.log("".concat(error));
        return 1;
    }
    return 0;
}
// append_event_to_file()
// Not in use due to potential bug
//
// When reading events from file, the first occuring event for each user needs to come first.
// This is due to how base year/month is determined. This is not necessary if all events are
// upcoming.
//
// If the user would add two events in reverse chronological order and never invoke a total
// rewrite of data, then, when these two events are past events, the order of them inside the 
// data file will be invalid.
//
// Therefore, write_events_to_file() is used for adding events, as it will ensure (by always writing
// events in chronological order for a specific user) that the order in data will never become invalid over time.
function append_event_to_file(event, user, filename) {
    var line = stringify_event(event, user) + '\n';
    try {
        fs.appendFileSync(filename, line);
    }
    catch (error) {
        console.log("".concat(error));
        return 1;
    }
    return 0;
}
// takes an event and a username and returns a string that can be written to file
// does not include a newline at the end
function stringify_event(event, username) {
    var time_start_min = "".concat(event.time_start % 100).padStart(2, '0');
    var time_start_h = "".concat(Math.floor((event.time_start - (event.time_start % 100)) / 100)).padStart(2, '0');
    var time_end_min = "".concat(event.time_end % 100).padStart(2, '0');
    var time_end_h = "".concat(Math.floor((event.time_end - (event.time_end % 100)) / 100)).padStart(2, '0');
    return "".concat(username, ", ").concat(event.year, ", ").concat(event.month, ", ").concat(event.day, ", ").concat(time_start_h, ":").concat(time_start_min, ", ").concat(time_end_h, ":").concat(time_end_min, ", \\\"").concat(event.description, "\\\"");
}
/**
 * Read in events from file and add events to hashtable and user array.
 * If the user specified alongside an event does not exist it will be created.
 * @param {Hashtable} ht - initialized hashtable, used to link a user to a specific index in users
 * @param {Array<User>} users - list of users with event lists
 * @param {string} filename - file name of file to read from
 * @precondition filename is a valid file which contents adheres to specification, see top of file.ts
 * @return {number} - returns any of the following codes:
 *     0: success
 *     1: error reading from file, more information was written to console
 *     2: error in data, more information was written to console
 */
function add_events_from_file(ht, users, filename) {
    var data;
    // read file contents to data
    try {
        var databuffer = fs.readFileSync(filename, "utf8");
        data = databuffer.toString();
    }
    catch (error) {
        console.log("".concat(error));
        return 1;
    }
    var line = 0;
    var start, end;
    var lim = [0, 0];
    while (true) {
        lim = get_line(data, lim);
        start = lim[0];
        end = lim[1];
        line++;
        if (start === end) // we have reached end of file
            break;
        // current line consists of characters from data[start] to data[end]
        if (data[start] === '!') { // user with no events
            var username = section_to_string(data, start + 1, end);
            (0, hashtable_1.ht_add_event)(ht, users, username);
            continue;
        }
        // split line into tokens
        var tokens = tokenize(data, start, end);
        if (tokens.length != 7) {
            console.log("invalid data in file '".concat(filename, "' at line ").concat(line));
            return 2;
        }
        var parsed_event = (0, User_interface_1.parse_event_input)(tokens[3], //day
        tokens[2], //month
        tokens[1], //year
        tokens[4], //start time
        tokens[5], //end time
        tokens[6]);
        if (parsed_event[0] !== null && parsed_event[1] === 0) {
            (0, hashtable_1.ht_add_event)(ht, users, tokens[0], parsed_event[0]);
        }
        else {
            console.log("invalid data in file '".concat(filename, "' at line ").concat(line, ": parse_event_input returned ").concat(parsed_event[1]));
            return 2;
        }
    }
    return 0;
}
/**
 * Get next line in string by start and end index.
 * @param {string} str - source string
 * @param {[number, number]} a - current line, should be [0, 0] on initial call
 * @return {[number, number]} - returns start/end indices: [start, end]
 *                              str[start] is part of the line, str[end] is not
 *                              when all lines have been read: start === end
 */
function get_line(str, a) {
    var start = a[0];
    var end = a[1];
    // skip whitespace
    while (end < str.length && whitespace(str[end]))
        end++;
    // set new start
    start = end;
    // find end of line
    while (end < str.length && str[end] !== '\n')
        end++;
    // return start/end index for line
    return [start, end];
}
// returns true if char is a space/tab/newline, otherwise false
// precondition: char is a string of length 1
function whitespace(char) {
    return ((char === ' ') || (char === '\t') || (char === '\n'));
}
/**
 * Tokenize section of string between [start] and [end]
 * @param {string} str - source string
 * @param {number} start - start index, inclusive
 * @param {number} end - end index, exclusive
 * @precondition start < str.length and end <= str.length
 * @precondition section [start, end] in str is valid according to specification, see top of file.ts
 * @return {Array<string>} - returs array of tokens (strings)
 */
function tokenize(str, start, end) {
    var tokens_array = []; //array of tokens (arrays of chars), converted to Array<string> before return
    var tokens = [];
    var t = 0; //current token
    var t_i = 0; // write next char at t_i (tokens_array[t][t_i] = str[i])
    var inside_quote = false; // true if inside \" \" (do not ignore whitespace and do not treat delim as delimiter)
    var handle_backslash = false; // true if last character was backslash
    var delim = ','; // token delimiter
    // loop through current line
    for (var i = start; i < end; i++) {
        if (tokens_array[t] === undefined)
            tokens_array[t] = [];
        if (handle_backslash) { // last character was \
            if (str[i] === '"')
                inside_quote = !inside_quote;
            handle_backslash = false;
            continue;
        }
        if (!inside_quote && whitespace(str[i])) // skip whitespace
            continue;
        if (!inside_quote && str[i] === delim) { // delim encountered -> new token
            t++;
            t_i = 0;
            continue;
        }
        if (str[i] === '\\') {
            handle_backslash = true;
            continue;
        }
        // add char to current token
        tokens_array[t][t_i] = str[i];
        t_i++;
    }
    if (t_i === 0)
        t--; //token at t is empty
    //convert from Array<Array<string>> (str.length == 1) to Array<string> (str.length >= 1)
    for (var i = 0; i <= t; i++) {
        tokens[i] = tokens_array[i].join('');
    }
    return tokens;
}
// get section [start, end] of str as a separate string
function section_to_string(str, start, end) {
    var result = "";
    for (var i = start; i < end; i++)
        result += str[i];
    return result;
}
