import { Console } from "console";
import { NAMES_MONTHS, NAMES_WEEKDAYS } from "./defs";
import { Month, Event_list, Event} from "./types";



function divide_days_in_weeks(month:Month): Array<number>{
    let days_array:Array<number> = new Array(month.week_numbers.length * 7);
    for( let i = 1; i <= month.week_numbers.length * 7; i++){
        if ( i <= month.month_length) {
            days_array[i + month.first_weekday - 1] = i;
        } else {}
    };
    return days_array;
};

function days_with_events(event_array: Array<Event>): Array<number> {
    let event_days: Array<number> = [];
    for (let i = 0; i <event_array.length; i++){
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
        process.stdout.write(`\x1b[31m${weeks}\x1b[0m`);
        for(let i = week_end_index - 7; i < week_end_index; i++) {
            if (day_array[i] !== undefined){
                if(event_days.includes(day_array[i])){
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

const event1: Event = {day: 22, 
                       month: 1,
                       year:2025,
                       time_start:1,
                       time_end: 1,
                       description: "Tadläkare"};

const event2: Event = {day: 5, 
                       month: 1,
                       year:2025,
                       time_start:1,
                       time_end: 1,
                       description: "Tadläkare"};
const month1: Month= {year: 2025, 
                    month: 1, 
                    month_length: 31, 
                    first_weekday:  3,
                    week_numbers: [1, 2, 3, 4, 5], 
                    events_index: 0};

const Eent_array1: Event_list = {base_year:2025, base_month:1, events: [[event1, event2]]};

display_month(month1, Eent_array1);
