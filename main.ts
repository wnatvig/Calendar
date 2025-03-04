import type { Month, Event, Event_list, Hashtable, User } from './types';
import { Choices, display_month, user_add_event, User_input } from './User_interface';
import { init_month, get_next_month, get_previous_month } from './month';
import { get_current_year, get_current_month } from './time_date';
import { init_hashtable } from './hashtable';
import { ht_add_event, ht_get_event_list } from './hashtable';



//let eventlist: Event_list = { base_year: get_current_year(), base_month: get_current_month(), events: []};
//let month: Month = init_month(eventlist);
let ht: Hashtable = init_hashtable();
let users: Array<User> = [];
let event: Event = {
	day: 3,
	month: 3,
	year: 2025,
	time_start: 1630,
	time_end: 1700,
	description: "discordmöte",
};
ht_add_event(ht, users, "user", event);

let start:boolean = true;
let eventlist: Event_list = ht_get_event_list(ht, users, "user");
let month: Month = init_month(eventlist);
while (start){
    display_month(month, eventlist);

    const actions_list: Choices = [["next", "Displays the next month"],
                                   ["prev", "Display the previous month"],
                                   ["add", "Add an event to the calendar"],
                                   ["edit", "Edit and event"],
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
        event = user_add_event(eventlist);
		ht_add_event(ht, users, "user", event);
    } else if (action === "quit") {
        break;
    }
};

