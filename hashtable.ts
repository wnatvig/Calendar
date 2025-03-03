import type { List, Pair } from './lib/list';
import type { Event, Event_list, Hashtable, User } from './types';
import { pair, head, tail, is_null } from './lib/list';

import { get_current_year, get_current_month } from './time_date';
import { make_event_list, add_event_to_event_list } from './eventcreate';


const HT_TABLE_SIZE: number = 100;
const HT_HASH_FUNCTION: (key: string) => number = simple_hash;

//from pkd lecture 9A
function simple_hash(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = hash * 31 + str.charCodeAt(i);
	}

	return hash;
}


// delete event
// delete user


export function init_hashtable(): Hashtable {
	let ht: Hashtable = {table: [], table_size: HT_TABLE_SIZE, hash: HT_HASH_FUNCTION};

	for (let i = 0; i < ht.table_size; i++)
		ht.table[i] = null;

	return ht;
}


//TODO function spec
//lookup username in hashtable
//if user does not exist:
//    create User in users at index i
//    create ht entry for user with index i
//    add event to User's (empty) Event_list
//    base year/month will be set to event date if event < current, otherwise current date
//if uses exists:
//    retrieve user index from hashtable
//    go to Array<User> at user index
//    update user Event_list with new event
//
// if no event is given (optional parameter) user will be created but with an empty eventlist (current date as base)
//
// DOES NOT WRITE TO FILE
export function add_event(ht: Hashtable, users: Array<User>, username: string, event?: Event): void {
	let ht_i = ht.hash(username) % ht.table_size;
	let user_list: List<Pair<string, number>>;
	let user_i;

	for (user_list = ht.table[ht_i]; !is_null(user_list); user_list = tail(user_list))
		if (head(head(user_list)) === username)
			break;

	// head(user_list) == pair(username, user_index)	if user already in hashtable
	// user_list == null	if user not in hashtable

	if (user_list === null) {
		user_i = users.length;

		let base_year = get_current_year();
		let base_month = get_current_month();

		// if first event is earlier than current year/month -> set base year/month to that of event
		// NOTE: this is only done when user_list === null, i.e. first call to add_event() for this specific user
		if (event !== undefined && (event.year < base_year || (event.year === base_year && event.month < base_month))) {
			base_year = event.year;
			base_month = event.month;
		}

		users[user_i] = {username: username, eventlist: make_event_list(base_year, base_month, [])};

		ht.table[ht_i] = pair(pair(username, user_i), ht.table[ht_i]);
	} else {	// user found
		user_i = tail(head(user_list));
	}
	
	// add event to eventlist
	// TODO IF GIVEN EVENT IS EARLIER THAN BASE THIS WILL GO BAD FIX FIX FIX
	// THIS SHOULD NOT HAPPEN, ASSUMING VALID FILE AND NO ADDING EVENTS IN THE PAST
	if (event !== undefined)
		add_event_to_event_list(event, users[user_i].eventlist);
}

//function ht_add_user(ht: Hashtable, username: string, user_index: number): void {
//	if (ht_entry_exists(ht, username)) {
//		console.log(`DOUBLE ENTRY USER: ${username} -- SKIPPING`);
//		console.log("users: Array<User> IS INVALID");
//	} else {
//		let ht_i = ht.hash(username) % ht.table_size;
//		//ht.table[ht_i] = <List<Pair<string, number>>>pair(pair(username, user_index), ht.table[ht_i]);
//		ht.table[ht_i] = pair(pair(username, user_index), ht.table[ht_i]);
//	}
//}

//function ht_entry_exists(ht: Hashtable, key: string): boolean {
//	let lst: List<Pair<string, number>>;
//	let ht_i = ht.hash(key) % ht.table_size;
//
//	for (lst = ht.table[ht_i]; !is_null(lst); lst = tail(lst)) {
//		if (key === head(head(lst))) {
//			return true;
//		}
//	}
//
//	return false;
//}

//TODO move somewhere else?
export function get_event_list(ht: Hashtable, users: Array<User>, user: string): Event_list {
	let lst = ht.table[ht.hash(user) % ht.table_size]
	let user_index = -1;
	for (; !is_null(lst); lst = tail(lst)) {
		if (head(head(lst)) === user) {
			user_index = tail(head(lst)); 
			break;
		}
	}
	if (user_index === -1) {
		console.log("ERCHUOTNHURCHOUCRHCR");
	}

	return users[user_index].eventlist;
}
