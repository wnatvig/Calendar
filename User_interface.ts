import { MONTH_LENGTHS, NAMES_MONTHS, NAMES_WEEKDAYS } from "./defs";
import { Month, Event_list, Event} from "./types";
import { get_current_date, get_current_month, get_current_weekday, get_current_year } from "./time_date";
import { add_event_to_event_list, make_event } from "./eventcreate";
import { init_month } from "./month";


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
 */
export function display_month(month: Month, Event_list: Event_list): void{    
    let day_array = divide_days_in_weeks(month);
    let week_end_index = 7;
    //TODO: Add a function to show days when there are events

    //Create an array with all days with events that month
    let event_days = days_with_events(Event_list.events[month.events_index]);
    


    console.log();
    console.log("          ",NAMES_MONTHS[month.month] ,month.year);
    console.log("   Mon Tue Wed Thu Fri Sat Sun")
    for (let weeks of month.week_numbers) {
        if (weeks < 10) {
            process.stdout.write(` \x1b[31m${weeks}\x1b[0m`);
        } else{
            process.stdout.write(`\x1b[31m${weeks}\x1b[0m`);
        }
        for(let i = week_end_index - 7; i < week_end_index; i++) {
            if (day_array[i] !== undefined){
                if(event_days.includes(day_array[i])){
                    if (day_array[i] < 10) {
                        process.stdout.write('   ' + `§${day_array[i]}\x1b[0m`);
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


// const event1: Event = {day: 22, 
//                        month: 1,
//                        year:2025,
//                        time_start:1,
//                        time_end: 1,
//                        description: "Tadläkare"};

// const event2: Event = {day: 5, 
//                        month: 1,
//                        year:2025,
//                        time_start:1,
//                        time_end: 1,
//                        description: "Tadläkare"};
// const month1: Month= {year: 2025, 
//                     month: 1, 
//                     month_length: 31, 
//                     first_weekday:  3,
//                     week_numbers: [1, 2, 3, 4, 5], 
//                     events_index: 0};

// const Eent_array1: Event_list = {base_year:2025, base_month:1, events: [[event1, event2]]};

// display_month(init_month(Eent_array1), Eent_array1);


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

//Test for user_input
//console.log(User_input("Enter[y/n]: ",[["y", "yes"], ["n", "no"]]));

// /**
//  * 
//  */
// export function switch_month():void{
//     let current_month = get_current_month();
//}


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
//TODO: Maybe add so that you can ad events that are earlier than the days date
/**
 * Lets the user add an event to the event_list by presenting them with prompts
 * for year, month, day, start time, end time. 
 * @param {Event_list} event_list - The Event list to which the user's event 
 * should be added.
 * //TODO 
 */ 
export function user_add_event(event_list: Event_list): Event {
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
        if (num < 1 || num > MONTH_LENGTHS[month]) {
            return `Invalid date: ${NAMES_MONTHS[month]} only has ${MONTH_LENGTHS[month]} days`;
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
    const description = pt("Description: ");

    // Create the new event.
    const new_event = make_event(date, month, year, time_start, time_end, description);

    return new_event;
}

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
    console.log(`To: ${end_hour}: ${end_minute}`);
    console.log(`Desciption: ${event.description}`);
}

//display_event(event1);

// export function user_change_event(event_list: Event_list): void{

// }

//user_add_event(Eent_array1);
