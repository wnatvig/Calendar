import { NAMES_MONTHS, NAMES_WEEKDAYS } from "./defs";
import { Day, Month, Event_list, Event, Hashtable, User } from "./types";
import { get_current_date, get_current_month, get_current_weekday, get_current_year } from "./time_date";
import { add_event_to_event_list, make_event, make_event_list } from "./events";
import { get_month_index, init_month, month_length } from "./month";
import { add_event, delete_event } from "./backend";


//Makes an array with all the dates in the right place so it can be divided
//between the weeks evenly
function divide_days_in_weeks(month:Month): Array<number>{
    let days_array:Array<number> = new Array(month.week_numbers.length * 7);
    for( let i = 1; i <= month.week_numbers.length * 7; i++){
        if ( i <= month.month_length) {
            days_array[i + month.first_weekday - 2] = i;
        } else {}
    };
    return days_array;
};
//Creates an array with all the days that have events
function days_with_events(event_array: Array<Event>): Array<number> {
    let event_days: Array<number> = [];
    for (let i = 0; event_array !== undefined && i < event_array.length; i++){
        event_days[i] = event_array[i].day;
    }
    return event_days;
};

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
export function display_month(month: Month, Event_list: Event_list, selected_day: Day): void {
    let day_array = divide_days_in_weeks(month);
    let week_end_index = 7;
    //TODO: Add a function to show days when there are events

    //Create an array with all days with events that month
    let event_days = days_with_events(Event_list.events[month.events_index]);

    //check for if it is the current month
    let is_current_month = month.month === get_current_month() && month.year === get_current_year();


    console.log();
    console.log("          ", NAMES_MONTHS[month.month], month.year);
    console.log("   Mon Tue Wed Thu Fri Sat Sun")
    for (let weeks of month.week_numbers) {
        if (weeks < 10) {
            process.stdout.write(` \x1b[31m${weeks}\x1b[0m`);
        } else{
            process.stdout.write(`\x1b[31m${weeks}\x1b[0m`);
        }
        for(let i = week_end_index - 7; i < week_end_index; i++) {
            if (day_array[i] !== undefined){
                if (day_array[i] === get_current_date() && is_current_month &&	// day === today
					day_array[i] === selected_day.day && month.month === selected_day.month && month.year === selected_day.year) {	// day === selected day
                    //Color background green, with whit text if it is today and viewed day
                    if (day_array[i] < 10) {
                        process.stdout.write('  ' + `\x1b[42;37m ${day_array[i]}\x1b[0m`);
                    } else{
                        process.stdout.write('  ' + `\x1b[42;37m${day_array[i]}\x1b[0m`);
                    }
                } else if(day_array[i] === get_current_date() && is_current_month) {
                    //Color text green if it is todays date
                    if (day_array[i] < 10) {
                        process.stdout.write('  ' + `\x1b[32m ${day_array[i]}\x1b[0m`);
                    } else{
                        process.stdout.write('  ' + `\x1b[32m${day_array[i]}\x1b[0m`);
                    }
                } else if(event_days.includes(day_array[i]) && day_array[i] === selected_day.day && month.month === selected_day.month && month.year === selected_day.year) { 
                    //Colors the background blue if it the highlighted day and there is at least one event on it
                    if (day_array[i] < 10) {
                        process.stdout.write('  ' + `\x1b[44;37m ${day_array[i]}\x1b[0m`);
                    } else{
                        process.stdout.write('  ' + `\x1b[44;37m${day_array[i]}\x1b[0m`);
                    }
                } else if(day_array[i] === selected_day.day && month.month === selected_day.month && month.year === selected_day.year){
                    //Colors backgorund white to highlight the day the user is on
                    if (day_array[i] < 10) {
                        process.stdout.write('  ' + `\x1b[47;30m ${day_array[i]}\x1b[0m`);
                    } else{
                        process.stdout.write('  ' + `\x1b[47;30m${day_array[i]}\x1b[0m`);
                    }
                } else if(event_days.includes(day_array[i])){
                    //Colors text blue to show that there are events on that day
                    if (day_array[i] < 10) {
                        process.stdout.write('   ' + `\x1b[34m${day_array[i]}\x1b[0m`);
                    } else{
                        process.stdout.write('  ' + `\x1b[34m${day_array[i]}\x1b[0m`);
                    }
                } else {
                    if (day_array[i] < 10) {
                        process.stdout.write('   ' + day_array[i]);
                    } else{
                        process.stdout.write('  ' + day_array[i]);
                    }
                };
            } else {
                process.stdout.write('    ');
            }
            
        }
        week_end_index += 7;
        console.log();

    }
    console.log();
};

/**
 * Displays all events for a specific day in the terminal window.
 * @param {Event_list} event_list - The eventlist where all the events are stored
 * @param {Month} month - The month the day is in
 * @param {number} day - The date to be viewed
 * @precondition day is a positive whole number less than or equal to month.month_length
 */
export function display_day(event_list: Event_list, month: Month, day: number): void {
    let days_events: Array<Event> = []
    if (event_list.events[month.events_index] !== undefined){
        days_events = event_list.events[month.events_index].filter(events => events.day === day);
    }
    console.log(`All events for ${NAMES_MONTHS[month.month]} ${day}:`);
    console.log();
    if (days_events.length === 0){
        console.log("Seems you have no events this day");
    } else {
        for (let ev of days_events){
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
export function user_pick_day(month:Month): number{
    const date = prompt_for_number("What day do you want to view? ", (num: number) => {
        if (num < 1 || num > month.month_length) {
            return `Invalid date: ${NAMES_MONTHS[month.month]} only has ${month.month_length} days`;
        } else {}
        return null;
    });

    return date;
}




export type Choices = Array<[string, string]>;
/**
 * Presents the user with a bunch of choices and a prompt asking them to write 
 * input a valid comand
 * @param {string} Prompt - A promt to cause them to
 * @param {Choices} choices - An array of pairs where the first element is a valid 
 * comand and the second element is a description of the comand 
 * @returns A valid answer from the user
 */
export function User_input(Prompt: string, choices: Choices):string{
    //This is the function that enables user input
    const pt = require('prompt-sync')();

    //To split choices into 2 arrays 1 with descriptions, 1 with the valid entries
    const valid_entries:Array<string> =[];
    for (let choice of choices) {
        console.log(`${choice[1]} - ${choice[0]}`)
        valid_entries.push(choice[0]);
    };

    let user_answer = "";
    while (!valid_entries.includes(user_answer)){
        user_answer = pt(`${Prompt}`);
        if(!valid_entries.includes(user_answer)) {
            console.log();
            console.log("Invalid entry! Please try again.");
            console.log();
        } else {}
    };
    return user_answer;
};




// Helper: Prompt for a number with validation.
function prompt_for_number(prompt_text: string, validate: (num: number) => string | null): number {
    const pt = require('prompt-sync')();
    while (true) {
        const input = pt(prompt_text);
        const num = Number(input);
        if (isNaN(num)) {
            console.log("Invalid entry: Not a number");
            continue;
        }
        const error = validate(num);
        if (error) {
            console.log(error);
            continue;
        }
        return num;
    }
}

// Helper: Prompt for a time value in hh:mm format with validation.
function prompt_for_time(prompt_text: string, min_time: number = 0): number {
    const pt = require('prompt-sync')();
    while (true) {
        console.log("Note: Please input times using standard 24 hour notation (e.g., 11:11)");
        const userTime = pt(prompt_text);
        const parts = userTime.split(":");
        if (parts.length !== 2) {
            console.log("Invalid entry: Incorrect formatting");
            continue;
        }
        const hour = Number(parts[0]);
        const minute = Number(parts[1]);
        if (isNaN(hour) || hour < 0 || hour > 23) {
            console.log("Invalid entry: That is not a valid hour");
            continue;
        }
        if (isNaN(minute) || minute < 0 || minute > 59) {
            console.log("Invalid entry: Not a valid minute");
            continue;
        }
        const time = hour * 100 + minute;
        if (time < min_time) {
            let min_minute:string | number = min_time % 100
            let min_hour: string | number = (min_time - min_minute)/100;
            if (min_minute < 10){
                min_minute = `0${min_minute}`
            } else {}

            if (min_hour < 10){
                min_hour = `0${min_hour}`
            } else {}

            console.log(`Invalid entry: End time must be at least ${min_hour}:${min_minute}`);
            continue;
        }
        if (time > 2359) {
            console.log("Invalid entry: Time cannot exceed 23:59");
            continue;
        }
        return time;
    }
}
/**
 * Lets the user create an event by presenting them with prompts
 * for year, month, day, start time, end time, and description. 
 * @returns the user created event
 */ 
export function user_add_event(): Event {
    const pt = require('prompt-sync')();
    const current_year = get_current_year();
    const current_month = get_current_month();
    const current_date = get_current_date();

    // Get valid year (cannot be before the current year)
    const year = prompt_for_number("Year: ", (num: number) => {
        return num < current_year ? "Invalid entry: Too early year" : null;
    });



    //Get valid month
    const month = prompt_for_number("Month: ", (num: number) => {
        const start_month = year === current_year ? current_month : 1;
        if (num < start_month){
            return `Invalid entry: Month already passed`;
        } else if (num > 12){
            return `Invalid entry: There are only 12 months in the year`;
        } else {}
        return null;
    });

    // Get valid date (must be within the month's range and not in the past if current month/year)
    const date = prompt_for_number("Date: ", (num: number) => {
        if (num < 1 || num > month_length(year, month)) {
            return `Invalid date: ${NAMES_MONTHS[month]} only has ${month_length(year, month)} days`;
        } else {}
        if (year === current_year && month === current_month && num < current_date) {
            return "Invalid entry: Date already passed";
        } else {}
        return null;
    });

    // Get valid start and end times.
    const time_start = prompt_for_time("Start time: ");
    const time_end = prompt_for_time("End time: ", time_start);

    // Get event description.
    //TODO: Add so user cannot use \
    let description: string = pt("Description: ");
    while (description.includes("\\")) {
        console.log("Invalid entry: Cannot use \\ in description")
        description = pt("Description: ")
    }

    // Create the new event.
    const new_event = make_event(date, month, year, time_start, time_end, description);

    return new_event;
}

/**
 * The function gives the user the possibility to select a specific event
 * @param event_list an array of events
 * @returns the event that the user selected as the type Event
 */
export function user_select_event(event_list: Event_list): Event | null {
    const pt = require('prompt-sync')();
    
    const year = prompt_for_number("Enter year: ", (num: number) => {
        return num < event_list.base_year ? "Invalid entry: Too early year" : null;
    });

    const month = prompt_for_number("Enter month: ", (num: number) => {
        if (num < 1 || num > 12) {
            return "Invalid entry: Month must be between 1 and 12";
        }
        return null;
    });

    const monthIndex = get_month_index(event_list.base_year,event_list.base_month, year, month);

    const date = prompt_for_number("Enter date: ", (num: number) => {
        if (num < 1 || num > month_length(year, monthIndex + 1)) {
            return `Invalid entry: ${NAMES_MONTHS[monthIndex]} only has ${month_length(year, monthIndex + 1)} days`;
        }
        return null;
    });

    const events_on_date = event_list.events[monthIndex] 
        ? event_list.events[monthIndex].filter(event => event.year === year && event.day === date) 
        : [];

    if (events_on_date.length === 0) {
        console.log("No events found on this date.");
        return null;
    }

    if (events_on_date.length === 1) {
        return events_on_date[0];
    }

    console.log("Events on this date:");
    events_on_date.forEach((event, index) => {
        console.log(`${index + 1}: ${event.description} (${event.time_start} - ${event.time_end})`);
    });

    const event_index = prompt_for_number("Select an event number: ", (num: number) => {
        if (num < 1 || num > events_on_date.length) {
            return "Invalid entry: Please choose a valid event number.";
        }
        return null;
    });

    return events_on_date[event_index - 1];
}
/**
 * 
 * @param dayStr - the day of the event as a string 
 * @param monthStr - the month of the event as a string (example: "3" meaning march)
 * @param yearStr - the year of the event as a string
 * @param startTimeStr - the start time of the event as a string (example: "10:00")
 * @param endTimeStr - the end time of the event as a string (example: "11:00")
 * @param description - the description of the event
 * @returns an array with the  event and 0 if correctly parsed [event, 0],
 *          an array with null and 1 if year is not a number [null, 1], 
 *          an array with null and 2 if month is outside of range [null, 2],
 *          an array with null and 3 if day is outside of range [null, 3],
 *          an array with null and 4 if not valid start time [null, 4],
 *          an array with null and 5 id not valid end time [null, 5],
 *          an array with null and 6 if end time is before start time [null, 6].
 */
export function parse_event_input(
    dayStr: string,
    monthStr: string,
    yearStr: string,
    startTimeStr: string,
    endTimeStr: string,
    description: string
): [Event | null, number] {
    
    const day = Number(dayStr);
    const month = Number(monthStr);
    const year = Number(yearStr);
    const startTime = parse_time(startTimeStr);
    const endTime = parse_time(endTimeStr);

    if (isNaN(year)) return [null, 1];
    if (isNaN(month) || month < 1 || month > 12) return [null, 2];
    if (isNaN(day) || day < 1 || day > month_length(year, month)) return [null, 3];

    //tid
    if (startTime === null) return [null, 4]; 
    if (endTime === null) return [null, 5];
    if (startTime > endTime) return [null, 6];

    const event: Event = {
        day: day,
        month: month,
        year: year,
        time_start: startTime,
        time_end: endTime,
        description: description
    };

    return [event, 0];
}
 /**
  * Edits an event by asking user for details
  * and then deleting the old one and creating the new one.
  * @param ht - the hashtable storing users and its events
  * @param users - the array of users
  * @param username - the name of the user whos event is being edited
  * @param event_list - the users list of events
  * @param old_event - the event to be edited
  * @returns void, changes the Event_list
  */
export function edit_event(ht: Hashtable, users: Array<User>, username: string, event_list: Event_list, old_event: Event): void {
    console.log("Enter new details for the event.");

    const pt = require('prompt-sync')();
    
    const new_year = prompt_for_number("Enter new year: ", (num: number) => {
        return num < event_list.base_year ? "Invalid entry: Too early year" : null;
    });
    
    const new_month = prompt_for_number("Enter new month: ", (num: number) => {
        if (num < 1 || num > 12) {
            return "Invalid entry: Month must be between 1 and 12";
        }
        return null;
    });

    const new_day = prompt_for_number("Enter new day: ", (num: number) => {
        if (num < 1 || num > month_length(old_event.year, old_event.month)) {
            return `Invalid entry: Month ${old_event.month} only has ${month_length(old_event.year, old_event.month)} days`;
        }
        return null;
    });

    const new_start_time = prompt_for_time("Enter new start time: ");
    const new_end_time = prompt_for_time("Enter new end time:", new_start_time);

    if (new_start_time === null || new_end_time === null || new_start_time > new_end_time) {
        console.log("Invalid time input. Start time must be before end time.");
        return;
    }

    const new_description = pt("Enter new description: ");

    const new_event: Event = {
        day: new_day,
        month: new_month,
        year: new_year,
        time_start: new_start_time,
        time_end: new_end_time,
        description: new_description
    };

    delete_event(ht, users, username, old_event);
    add_event(ht, users, username, new_event);

    console.log("event did edited.");
}
/**
 * it correctly parses string versions of time
 * @param timeStr - a string representing either the start or end time of the event (example: "13:20")
 * @returns the time but as a number instead of string (input: "10:00" would return: 1000)
 */
export function parse_time(timeStr: string): number | null {
    const parts = timeStr.split(":");
    if (parts.length !== 2) return null;
    
    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);

    if (isNaN(hours) || hours < 0 || hours > 23) return null;
    if (isNaN(minutes) || minutes < 0 || minutes > 59) return null;

    return hours * 100 + minutes;
}

/**
 * Displays an event in a formated way in the terminal.
 * @param {Event} event - The event that is to be displayed 
 */
export function display_event(event: Event):void{
    let start_minute: number | string = event.time_start % 100;
    let start_hour: number | string = (event.time_start - start_minute)/ 100;
    if (start_minute < 10){
        start_minute = `0${start_minute}`
    } else {}
    
    if (start_hour < 10){
        start_hour = `0${start_hour}`
    } else {}
    
    let end_minute: number | string = event.time_end % 100;
    let end_hour: number | string = (event.time_end - end_minute) / 100;
    if (end_minute < 10){
        end_minute = `0${end_minute}`
    } else {}

    if (end_hour < 10){
        end_hour = `0${end_hour}`
    } else {}
    console.log(`Date: ${NAMES_MONTHS[event.month]} ${event.day}, ${event.year}`);
    console.log(`From: ${start_hour}:${start_minute}`);
    console.log(`To: ${end_hour}:${end_minute}`);
    console.log(`Description: ${event.description}`);
}

/**
 * Finds the next upcoming event from the provided event list.
 * @param {Event_list} event_list - An object containing all events.
 * @returns {Event | null} The next upcoming event or null if none found.
 */
export function find_next_event(event_list: Event_list): Event | null {
    let month_index = get_month_index(event_list.base_year,
                                      event_list.base_month,
                                      get_current_year(),
                                      get_current_month());
    let evs = event_list.events;

    if (month_index < 0 || month_index >= evs.length) {
        return null;
    }

    for (let i = month_index; i < evs.length; i++) {
        if (!evs[i] || evs[i].length === 0) continue;

        // Sort events by day and time_start within each month
        evs[i].sort((a, b) => a.day !== b.day ? a.day - b.day : a.time_start - b.time_start);

        for (let ev of evs[i]) {
            if (i === month_index) {
                // Only consider events today or later
                if (ev.day >= get_current_date()) {
                    return ev;
                }
            } else {
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
export function display_next_event(event_list: Event_list): void {
    const nextEvent = find_next_event(event_list);
    if (nextEvent !== null) {
        console.log("Your next upcoming event is:")
        console.log()
        display_event(nextEvent);
    } else {
        console.log("No upcoming events");
    }
}

