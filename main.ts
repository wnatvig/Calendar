import type { Month, Event, Event_list, Hashtable, User } from './types';
import { Choices, display_day, display_month, user_add_event, User_input, user_pick_day } from './User_interface';
import { init_month, get_next_month, get_previous_month } from './month';
import { get_current_year, get_current_month, get_current_date } from './time_date';
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

let day = get_current_date();
let start:boolean = true;
let eventlist: Event_list = ht_get_event_list(ht, users, "user");
let month: Month = init_month(eventlist);
while (start){
    display_month(month, eventlist, day);
    display_day(eventlist, month, day);
    const actions_list: Choices = [["next", "Displays the next month"],
                                   ["prev", "Display the previous month"],
                                   ["add", "Add an event to the calendar"],
                                   ["edit", "Edit an event"],
                                   ["view", "View a day and all it's events"],
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
        let current_month = init_month(eventlist);
        day = month.month === current_month.month && month.year === current_month.year
             ? get_current_date()
             :1;
    } else if(action === "prev") {
        month = get_previous_month(month, eventlist);
        let current_month = init_month(eventlist);
        day = month.month === current_month.month && month.year === current_month.year
            ? get_current_date()
            :1;
    } else if (action === "add") {
        event = user_add_event();
		ht_add_event(ht, users, "user", event);
    } else if (action === "quit") {
        break;
    } else if (action === "view") {
        day = user_pick_day(month);
    }
};

