import type { Day, Month, Event, Event_list, Hashtable, User } from './types';
import { Choices, display_day, display_month, display_next_event, user_add_event, 
        User_input, user_pick_day, user_select_event, edit_event } from './User_interface';
import { init_month, get_next_month, get_previous_month } from './month';
import { get_current_year, get_current_month, get_current_date } from './time_date';
import { init_hashtable, add_user,add_event, user_exists, get_event_list, 
        delete_event} from './hashtable';
import { add_events_from_file} from './file';


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
            } else if (user_exists(ht, account, DATA_FILENAME)) {
                console.log("Invalid entry: Usernames must be unique");
                continue;
            } else if(account.includes("!")) {
                console.log("Invalid entry: Cannot use ! in account name");
                continue;
            } else {
				user = account;
                add_user(ht, users, user, DATA_FILENAME);
                account_created = true;
				start = true;
            }
        }
    } else if (choice === "login") {
		user = pt("Account name: ");
		if (user_exists(ht, user, DATA_FILENAME)) {
			start = true;
		} else {
			console.log(`Could not find user '${user}'`);
			welcome_prompt = false;
			continue;
		}
    }

	selected_day = {year: get_current_year(), month: get_current_month(), day: get_current_date()};
	eventlist = get_event_list(ht, users, user, DATA_FILENAME)!;
	month = init_month(eventlist);
    let next_event = false;
    while (start) {
		//clear
		for (let i = 0; i < 100; i++){
            console.log();
        }
		//console.log('\x1bc');

        display_month(month, eventlist, selected_day);
        if(next_event){
            console.log();
            display_next_event(eventlist);
            console.log();
            next_event = false;
        } else {}

		if (month.year === selected_day.year && month.month === selected_day.month){
			display_day(eventlist, month, selected_day.day);
        } else {}



        const actions_list: Choices = [["next", "Displays the next month"],
                                    ["prev", "Display the previous month"],
                                    ["add", "Add an event to the calendar"],
                                    ["edit", "Edit an event"],
                                    ["view", "View a day and all it's events"],
                                    ["next event", "Displays your next event"],
                                    ["logout", "Log out of this user"]
                                    ];
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
            add_event(ht, users, user, event, DATA_FILENAME);
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
                console.log("Do you want to delete or edit this event?");
                let action_choice = User_input("> ", [
                    ["delete", "Delete the event"],
                    ["edit", "Edit the event"],
                    ["cancel", "Cancel"]
                ]);
        
                if (action_choice === "delete") {
                    delete_event(ht, users, user, event, DATA_FILENAME);
                    console.log("bort yes.");
                } else if (action_choice === "edit") {
                    edit_event(ht, users, user, eventlist, event, DATA_FILENAME);
                }
            }
        } else if(action === "next event") {
            next_event = true;
        } else {}
    }
}

