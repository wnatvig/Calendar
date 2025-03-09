import type { List, Pair } from './lib/list';
import type { Event, Event_list, User, User_HT_entry, Hashtable } from './types';
import { pair, head, tail, is_null, remove } from './lib/list';
import { append_event_to_file, add_events_from_file, write_events_to_file } from './file';
import { get_current_year, get_current_month } from './time_date';
import { make_event_list, add_event_to_event_list, delete_event_from_event_list } from './events';


// in documentation 'year/month' is referring to a specific month, denoted by year and month (1 - 12)


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

/**
 * Initialize hashtable,
 * table size will be set to HT_TABLE_SIZE and the hash function to HT_HASH_FUNCTION.
 * @precondition global constant HT_TABLE_SIZE >= 1
 * @return {Hashtable} - returns hashtable
 */
export function init_hashtable(): Hashtable {
	let ht: Hashtable = {table: [], table_size: HT_TABLE_SIZE, hash: HT_HASH_FUNCTION};

	for (let i = 0; i < ht.table_size; i++)
		ht.table[i] = null;

	return ht;
}


/**
 * Add an event to hashtable and user array.
 * If the user does not already exist the user will be created before adding the event.
 * If no event is given, the user will be created without any events.
 * If the user is created, base_year/base_month will be set to event year/month if:
 *     1) an event is given, and
 *     2) event year/month < current year/month
 * otherwise it will be set to current year/month.
 * @param {Hashtable} ht - hashtable
 * @param {Array<User>} users - array of users
 * @param {string} username - user/username associated with event
 * @param {Event} event (optional) - event to add
 * @precondition if the user exist, event year/month cannot be earlier than the
 *               user's base year/month (base_year/base_month in user's event list)
 * @return {void}
 */
export function ht_add_event(ht: Hashtable, users: Array<User>, username: string, event?: Event): void {
	let ht_i = ht.hash(username) % ht.table_size;
	let user_list: List<User_HT_entry>;
	let user_i;

	for (user_list = ht.table[ht_i]; !is_null(user_list); user_list = tail(user_list))
		if (head(head(user_list)) === username)
			break;

	// head(user_list) == pair(username, user_index)	if user already in hashtable
	// user_list == null	if user not in hashtable

	if (user_list === null) {	// user not found
		user_i = users.length;

		let base_year = get_current_year();
		let base_month = get_current_month();

		// if first event is earlier than current year/month -> set base year/month to event date
		// NOTE: this is only done when user_list === null, i.e. first call to add_event() for this specific user
		if (event !== undefined && (event.year < base_year || (event.year === base_year && event.month < base_month))) {
			base_year = event.year;
			base_month = event.month;
		}

		// create new User
		users[user_i] = {username: username, eventlist: make_event_list(base_year, base_month, [])};
		ht.table[ht_i] = pair(pair(username, user_i), ht.table[ht_i]);

	} else {	// user found
		user_i = tail(head(user_list));
	}
	
	// add event to eventlist (if an event is passed as argument)
	if (event !== undefined) {
		if (add_event_to_event_list(event, users[user_i].eventlist) === 1) {	// negative month_index
			console.log(`cannot add event at ${event.year}-${event.month}-${event.day} '${event.description}' because it has an earlier date than base date for this user: ${username} with base date at ${users[user_i].eventlist.base_year}-${users[user_i].eventlist.base_month} --- skipping event`);
		}
	}
}

/**
 * Delete an event from user's event list.
 * If no event is given, the user, alongside all events associated with the user, will be deleted.
 * @param {Hashtable} ht - hashtable
 * @param {Array<User>} users - array of users
 * @param {string} username - user/username associated with event
 * @param {Event} event (optional) - event to delete
 * @return {void}
 */
export function ht_delete_event(ht: Hashtable, users: Array<User>, username: string, event?: Event): void {
	let ht_i = ht.hash(username) % ht.table_size;
	let user_list: List<User_HT_entry>;
	let user_i;

	for (user_list = ht.table[ht_i]; !is_null(user_list); user_list = tail(user_list))
		if (head(head(user_list)) === username)
			break;

	if (user_list === null)	// user not found
		return;

	user_i = tail(head(user_list));


	if (event !== undefined) {
		// delete event from event list
		if (delete_event_from_event_list(event, users[user_i].eventlist) !== 0)
			console.log(`event at ${event.year}-${event.month}-${event.day} '${event.description}' cannot be deleted: does not exist in event list`);
	} else {	// no event specified -> delete user
		ht.table[ht_i] = remove(head(user_list), ht.table[ht_i]);	//delete user entry from ht
		users.splice(user_i, 1);	// delete user from users
	}
}

/**
 * Checks whether or not the given entry exists in the hashtable.
 * @param {Hashtable} ht - hashtable
 * @param {string} key - entry/key
 * @return {boolean} - returns true if entry exists, otherwise false
 */
export function ht_entry_exists(ht: Hashtable, key: string): boolean {
	let lst: List<User_HT_entry>;
	let ht_i = ht.hash(key) % ht.table_size;

	for (lst = ht.table[ht_i]; !is_null(lst); lst = tail(lst)) {
		if (key === head(head(lst))) {
			return true;
		}
	}

	return false;
}

/**
 * Retrieve the event list associated with a user.
 * @param {Hashtable} ht - hashtable for user lookup
 * @param {Array<User>} users - array of users
 * @param {string} user - username of user
 * @return {Event_list | null} - returns:
 *     Event_list: user's event list
 *     null: if user was not found in hashtable
 */
export function ht_get_event_list(ht: Hashtable, users: Array<User>, user: string): Event_list | null {
	let lst: List<User_HT_entry> = ht.table[ht.hash(user) % ht.table_size]
	let user_index = -1;

	for (; !is_null(lst); lst = tail(lst)) {
		if (head(head(lst)) === user) {
			user_index = tail(head(lst)); 
			break;
		}
	}
	if (user_index === -1)
		null;

	return users[user_index].eventlist;
}

//
/**
 * Add event.
 * Updates data structures and writes changes to file.
 * If the specified user does not exist the user is created.
 * @param {Hashtable} ht - hashtable for user lookup
 * @param {Array<User>} users - array of users
 * @param {string} username - user to be associated with event
 * @param {Event} event - event to add
 * @return {void}
 */
export function add_event(ht: Hashtable, users: Array<User>, username: string, event: Event, DATA_FILENAME:string): void {
	ht_add_event(ht, users, username, event);
	//append_event_to_file(event, username, DATA_FILENAME);	//not in use due to potential bug, see comment in file.ts
	if (write_events_to_file(users, DATA_FILENAME))
		console.log("write_events_to_file returned 1");
}

/**
 * Add new user.
 * Updates data structures and writes changes to file.
 * @param {Hashtable} ht - hashtable for user lookup
 * @param {Array<User>} users - array of users
 * @param {string} username - user to be added
 * @return {void}
 */
export function add_user(ht: Hashtable, users: Array<User>, username: string, DATA_FILENAME:string): void {
	ht_add_event(ht, users, username);
	if (write_events_to_file(users, DATA_FILENAME))	// users with no events are still saved in file
		console.log("write_events_to_file returned 1");
}

/**
 * Checks whether or not a user exists in hashtable.
 * @param {Hashtable} ht - hashtable for user lookup
 * @param {string} username - user to look for
 * @return {boolean} - returns:
 *     true: user exists
 *     false: user does not exist
 */
export function user_exists(ht: Hashtable, username: string, DATA_FILENAME:string): boolean {
	return ht_entry_exists(ht, username);
}

/**
 * Retrieve the event list associated with a user.
 * @param {Hashtable} ht - hashtable for user lookup
 * @param {Array<User>} users - array of users
 * @param {string} username - user's username
 * @return {Event_list | null} - returns:
 *     Event_list: user's event list
 *     null: if user was not found in hashtable
 */
export function get_event_list(ht: Hashtable, users: Array<User>, username: string, DATA_FILENAME:string): Event_list | null {
	return ht_get_event_list(ht, users, username);
}

/**
 * Delete an event.
 * Updates data structures and writes changes to file.
 * @param {Hashtable} ht - hashtable for user lookup
 * @param {Array<User>} users - array of users
 * @param {string} username - user associated with event
 * @param {Event} event - event to delete
 * @return {void}
 */
export function delete_event(ht: Hashtable, users: Array<User>, username: string, event: Event, DATA_FILENAME:string): void {
	ht_delete_event(ht, users, username, event);
	if (write_events_to_file(users, DATA_FILENAME))
		console.log("write_events_to_file returned 1");

}

/**
 * Delete a user and all events associated with that user.
 * Updates data structures and writes changes to file.
 * @param {Hashtable} ht - hashtable for user lookup
 * @param {Array<User>} users - array of users
 * @param {string} username - user
 * @return {void}
 */
export function delete_user(ht: Hashtable, users: Array<User>, username: string, DATA_FILENAME:string): void {
	ht_delete_event(ht, users, username);
	if (write_events_to_file(users, DATA_FILENAME))
		console.log("write_events_to_file returned 1");
}
