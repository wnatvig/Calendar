import type { Month, Event, Event_list, Hashtable, User } from './types';
import { Choices, display_day, display_month, user_add_event, User_input, user_pick_day } from './User_interface';
import { init_month, get_next_month, get_previous_month } from './month';
import { get_current_year, get_current_month, get_current_date } from './time_date';
import { init_hashtable, ht_add_event, ht_delete_event, ht_entry_exists, ht_get_event_list } from './hashtable';
import { append_event_to_file, add_events_from_file, write_events_to_file } from './file';

const DATA_FILENAME = "data";

let ht: Hashtable = init_hashtable();
let users: Array<User> = [];
add_user(ht, users, "user");
add_events_from_file(ht, users, DATA_FILENAME);

let day = get_current_date();
let start:boolean = true;
let eventlist: Event_list = get_event_list(ht, users, "user")!;
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
        let event = user_add_event();
		add_event(ht, users, "user", event);
    } else if (action === "quit") {
        break;
    } else if (action === "view") {
        day = user_pick_day(month);
    }
};



function add_event(ht: Hashtable, users: Array<User>, username: string, event: Event): void {
	ht_add_event(ht, users, username, event);
	//append_event_to_file(event, username, DATA_FILENAME);	//not in use due to potential bug, see comment in file.ts
	if (write_events_to_file(users, DATA_FILENAME))
		console.log("write_events_to_file returned 1");
}

function add_user(ht: Hashtable, users: Array<User>, username: string): void {
	ht_add_event(ht, users, username);
}

function user_exists(ht: Hashtable, username: string): boolean {
	return ht_entry_exists(ht, username);
}

function get_event_list(ht: Hashtable, users: Array<User>, username: string): Event_list | null {
	return ht_get_event_list(ht, users, username);
}

function delete_event(ht: Hashtable, users: Array<User>, username: string, event: Event): void {
	ht_delete_event(ht, users, username, event);
	if (write_events_to_file(users, DATA_FILENAME))
		console.log("write_events_to_file returned 1");

}

function delete_user(ht: Hashtable, users: Array<User>, username: string): void {
	ht_delete_event(ht, users, username);
	if (write_events_to_file(users, DATA_FILENAME))
		console.log("write_events_to_file returned 1");
}
