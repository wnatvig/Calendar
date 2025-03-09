import type { List, Pair } from './lib/list';

/**
 * Time representation:
 * year {number}    - year, e.g. 2025, 1956, 2156
 * month {number}   - month, 1 - 12 (January - December)
 * day {number}		- day/date, 1 - 28/29/30/31
 * weekday {number} - weekday, 1 - 7 (Monday - Sunday)
 * time {number}    - time in format hh:mm converted to integer, examples:
 *                    valid: 0, 900, 1200, 1715, 2359
 *                    invalid: 0800, 12001, 1460, 2400
 */



/**
 * Day type, used to store a specific date, such as selected day.
 */
export type Day = {
	year: number,
	month: number,
	day: number,
};

/**
 * Stores all information necessary to display a month.
 */
export type Month = {
    year: number,
    month: number,
    month_length: number,
    first_weekday: number,	// weekday of year-month-01
    week_numbers: Array<number>,	// weeks that take place during month
    events_index: number,	// index in event list for this specific month
};

/**
 * Stores an event.
 */
export type Event = {
    day: number,
    month: number,
    year: number,
    time_start: number,
    time_end:number,
    description: string,
}



/**
 * Used to store all events for a user.
 *
 * Events are stored in events array. Each element of type
 * Array<Event> corresponds to a specific month, where the
 * Array<Event> is an array containing all events for that
 * specific month.
 *
 * base_year and base_month are used for indexing. Events
 * that occur during base month are retrieved with events[0].
 * event_list.events[month.events_index] will be an Array<Event>
 * of all events that occur during month.
 */
export type Event_list = {
	base_year: number,
	base_month: number,
	events: Array<Array<Event>>;
};


/**
 * Hashtable for user lookup.
 *
 * Perform a user lookup in a hashtable ht with:
 *     ht.table[ht.hash(username) % ht.table_size]
 * This will be a list of entries (collisions).
 * Each entry is a Pair<string, number> that consists of:
 *     [0] {string} - key
 *     [1] {number} - value
 *
 * The key will be the username and the value will
 * be an index in an Array<User>, thereby leading
 * to a User.
 */
export type Hashtable = {
	table: Array<List<Pair<string, number>>>,
	table_size: number,	// size of table array (number of elements/lists)
	hash: (key: string) => number,	// hash function
};

/**
 * Store all necessary information about a user.
 *
 * In main, all events and users are stored in an Array<User>.
 */
export type User = {
	username: string,
	eventlist: Event_list,	// list of events associated with user
}
