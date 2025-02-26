
import { Console } from "console";
import { get_month, NAMES_MONTHS, NAMES_WEEKDAYS } from "./time";
import { Month, Event_list, Event } from "./types";

function divide_days_in_weeks(month:Month): Array<number>{
    let days_array:Array<number> = new Array(month.week_numbers.length * 7);
    for( let i = 1; i <= month.week_numbers.length * 7; i++){
        if ( i <= month.month_length) {
            days_array[i + month.first_weekday - 1] = i;
        } else {}
    };
    return days_array;
};

/**
 * Dispays a month in the terminal
 * @param month 
 */
export function display_month(month: Month): void{
    let day_array = divide_days_in_weeks(month);
    let week_lenght = 7;

    console.log();
    console.log("          ",NAMES_MONTHS[month.month] ,month.year);
    console.log("   Mon Tue Wed Thu Fri Sat Sun")
    for (let weeks of month.week_numbers) {
        process.stdout.write('' + weeks);
        for(let i = week_lenght - 7; i < week_lenght; i++) {
            if (day_array[i] !== undefined){
                if (day_array[i] < 10) {
                    process.stdout.write('   ' + day_array[i]);
                } else{
                    process.stdout.write('  ' + day_array[i]);
                }
            } else {
                process.stdout.write('    ');
            }
            
        }
        week_lenght += 7;
        console.log();

    }
    console.log();
};


const month1: Month= {year: 2025, 
                    month: 1, 
                    month_length: 31, 
                    first_weekday:  3,
                    week_numbers: [1, 2, 3, 4, 5], 
                    events_index: 0};

display_month(month1);


