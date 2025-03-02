import type { Month, Event, Event_list } from './types';
import { Choices, display_month, user_add_event, User_input } from './User_interface';
import { init_month, get_next_month, get_previous_month } from './month';
import { get_current_year, get_current_month } from './time_date';


let eventlist: Event_list = { base_year: get_current_year(), base_month: get_current_month(), events: []};
let month: Month = init_month(eventlist);

let start:boolean = true;

while (start){
    display_month(month, eventlist);

    const actions_list: Choices = [["next", "Displays the next month"],
                                   ["prev", "Display the previous month"],
                                   ["add", "Add an event to the calendar"],
                                   ["quit", "End the program"]];
    
    //Need function to view events
    //Need fuction to fetch specific events (such as next events)
    //Need function to show all events
    console.log()
    console.log("What action do you want to take?")
    console.log()
    let action = User_input(">", actions_list);
    if (action === "next") {
        month = get_next_month(month, eventlist);
    } else if(action === "prev") {
        month = get_previous_month(month, eventlist);
    } else if (action === "add") {
        user_add_event(eventlist);
    } else if (action === "quit") {
        break;
    }
};

