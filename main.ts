import type { Day, Month, Event, Event_list, Hashtable, User } from './types';
import { Choices, display_day, display_month, user_add_event, User_input, user_pick_day, user_select_event } from './User_interface';
import { init_month, get_next_month, get_previous_month } from './month';
import { get_current_year, get_current_month, get_current_date } from './time_date';
import { init_hashtable, ht_add_event, ht_delete_event, ht_entry_exists, ht_get_event_list } from './hashtable';
import { append_event_to_file, add_events_from_file, write_events_to_file } from './file';

const DATA_FILENAME = "data";
const pt = require('prompt-sync')();

//creates the hashtable and array of users and then fills them with all the data
//we have on them
let ht: Hashtable = init_hashtable();
let users: Array<User> = [];
add_events_from_file(ht, users, DATA_FILENAME);

let user: string = "";
let eventlist: Event_list;
let month: Month;
let selected_day: Day;

let welcome_prompt = true;

while(true) {
    let start:boolean = false; 
	if (welcome_prompt) {
		console.log("Welcome to DigiCal, your personal digital calendar");
	}
	console.log();
    let choice = User_input("> ", [["login", "Log in to your accout"],
                                 ["reg", "Register a new account"],
                                  ["quit", "End the program"]]);
    if (choice === "quit") {
        break;
    } else if (choice === "reg") {
        console.log("What do you want your account name to be?");
        let account: string;
        let account_created = false;
        while (!account_created) {
            account = pt("> ");
            if  (account.includes("\\")) {
                console.log("Invalid entry: Cannot use \\ in account name");
                continue;
            } else if (user_exists(ht, account)) {
                console.log("Invalid entry: Usernames must be unique");
                continue;
            } else if(account.includes("!")) {
                console.log("Invalid entry: Cannot use ! in account name");
                continue;
            } else {
				user = account;
                add_user(ht, users, user);
                account_created = true;
				start = true;
            }
        }
    } else if (choice === "login") {
		user = pt("Account name: ");
		if (user_exists(ht, user)) {
			start = true;
		} else {
			console.log(`Could not find user '${user}'`);
			welcome_prompt = false;
			continue;
		}
    }

	selected_day = {year: get_current_year(), month: get_current_month(), day: get_current_date()};
	eventlist = get_event_list(ht, users, user)!;
	month = init_month(eventlist);

    while (start) {
		//clear
		for (let i = 0; i < 100; i++){
            console.log();
        }
		//console.log('\x1bc');

        display_month(month, eventlist, selected_day);
		if (month.year === selected_day.year && month.month === selected_day.month)
			display_day(eventlist, month, selected_day.day);

        const actions_list: Choices = [["next", "Displays the next month"],
                                    ["prev", "Display the previous month"],
                                    ["add", "Add an event to the calendar"],
                                    ["edit", "Edit an event"],
                                    ["view", "View a day and all it's events"],
                                    ["logout", "Log out of this user"]];
        
        //Need function to view events
        //Need fuction to fetch specific events (such as next events)
        //Need function to show all events
        console.log()
        console.log("What action do you want to take?")
        console.log()
        let action = User_input("> ", actions_list);
        if (action === "next") {
            month = get_next_month(month, eventlist);
            let current_month = init_month(eventlist);
        } else if(action === "prev") {
            month = get_previous_month(month, eventlist);
            let current_month = init_month(eventlist);
        } else if (action === "add") {
            let event = user_add_event();
            add_event(ht, users, user, event);
        } else if (action === "logout") {
			welcome_prompt = true;
            break;
        } else if (action === "view") {
			selected_day.day = user_pick_day(month);
			selected_day.year = month.year;
			selected_day.month = month.month;
        } else if (action === "edit") {
            let event = user_select_event(eventlist);
            if (event) {
                console.log("Do you want to delete this event? (yes/no)");
                let confirm_delete = User_input("> ", [["yes", "Confirm deletion"], ["no", "Cancel"]]);
                if (confirm_delete === "yes") {
                    delete_event(ht, users, user, event);
                    console.log("Event deleted successfully.");
                }
            }
        }
    }
}

function add_event(ht: Hashtable, users: Array<User>, username: string, event: Event): void {
	ht_add_event(ht, users, username, event);
	//append_event_to_file(event, username, DATA_FILENAME);	//not in use due to potential bug, see comment in file.ts
	if (write_events_to_file(users, DATA_FILENAME))
		console.log("write_events_to_file returned 1");
}

function add_user(ht: Hashtable, users: Array<User>, username: string): void {
	ht_add_event(ht, users, username);
	if (write_events_to_file(users, DATA_FILENAME))	// users with no events are still saved in file
		console.log("write_events_to_file returned 1");
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
