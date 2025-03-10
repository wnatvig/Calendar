import type { Event, Event_list, User, User_HT_entry, Hashtable } from './types';
import { HT_TABLE_SIZE, HT_HASH_FUNCTION } from './hashtable';
import { ht_init, ht_add_event, ht_delete_event, ht_entry_exists, ht_get_event_list } from './hashtable';
import { DATA_FILENAME } from './file';
import { write_events_to_file, add_events_from_file } from './file';


/**
 * Initialize hashtable.
 * @return {Hashtable} - returns hashtable
 */
export function init_hashtable(): Hashtable {
	return ht_init(HT_TABLE_SIZE, HT_HASH_FUNCTION);
}

/**
 * Load events from file. See add_events_from_file() specification in file.ts
 */
export function load_events(ht: Hashtable, users: Array<User>): number {
	return add_events_from_file(ht, users, DATA_FILENAME);
}


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
export function add_event(ht: Hashtable, users: Array<User>, username: string, event: Event): void {
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
export function add_user(ht: Hashtable, users: Array<User>, username: string): void {
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
export function user_exists(ht: Hashtable, username: string): boolean {
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
export function get_event_list(ht: Hashtable, users: Array<User>, username: string): Event_list | null {
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
export function delete_event(ht: Hashtable, users: Array<User>, username: string, event: Event): void {
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
export function delete_user(ht: Hashtable, users: Array<User>, username: string): void {
	ht_delete_event(ht, users, username);
	if (write_events_to_file(users, DATA_FILENAME))
		console.log("write_events_to_file returned 1");
}
