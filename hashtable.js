"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init_hashtable = init_hashtable;
exports.ht_add_event = ht_add_event;
exports.ht_delete_event = ht_delete_event;
exports.ht_entry_exists = ht_entry_exists;
exports.ht_get_event_list = ht_get_event_list;
var list_1 = require("./lib/list");
var time_date_1 = require("./time_date");
var events_1 = require("./events");
// in documentation 'year/month' is referring to a specific month, denoted by year and month (1 - 12)
var HT_TABLE_SIZE = 100;
var HT_HASH_FUNCTION = simple_hash;
//from pkd lecture 9A
function simple_hash(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
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
function init_hashtable() {
    var ht = { table: [], table_size: HT_TABLE_SIZE, hash: HT_HASH_FUNCTION };
    for (var i = 0; i < ht.table_size; i++)
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
function ht_add_event(ht, users, username, event) {
    var ht_i = ht.hash(username) % ht.table_size;
    var user_list;
    var user_i;
    for (user_list = ht.table[ht_i]; !(0, list_1.is_null)(user_list); user_list = (0, list_1.tail)(user_list))
        if ((0, list_1.head)((0, list_1.head)(user_list)) === username)
            break;
    // head(user_list) == pair(username, user_index)	if user already in hashtable
    // user_list == null	if user not in hashtable
    if (user_list === null) { // user not found
        user_i = users.length;
        var base_year = (0, time_date_1.get_current_year)();
        var base_month = (0, time_date_1.get_current_month)();
        // if first event is earlier than current year/month -> set base year/month to event date
        // NOTE: this is only done when user_list === null, i.e. first call to add_event() for this specific user
        if (event !== undefined && (event.year < base_year || (event.year === base_year && event.month < base_month))) {
            base_year = event.year;
            base_month = event.month;
        }
        // create new User
        users[user_i] = { username: username, eventlist: (0, events_1.make_event_list)(base_year, base_month, []) };
        ht.table[ht_i] = (0, list_1.pair)((0, list_1.pair)(username, user_i), ht.table[ht_i]);
    }
    else { // user found
        user_i = (0, list_1.tail)((0, list_1.head)(user_list));
    }
    // add event to eventlist (if an event is passed as argument)
    if (event !== undefined) {
        if ((0, events_1.add_event_to_event_list)(event, users[user_i].eventlist) === 1) { // negative month_index
            console.log("cannot add event at ".concat(event.year, "-").concat(event.month, "-").concat(event.day, " '").concat(event.description, "' because it has an earlier date than base date for this user: ").concat(username, " with base date at ").concat(users[user_i].eventlist.base_year, "-").concat(users[user_i].eventlist.base_month, " --- skipping event"));
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
function ht_delete_event(ht, users, username, event) {
    var ht_i = ht.hash(username) % ht.table_size;
    var user_list;
    var user_i;
    for (user_list = ht.table[ht_i]; !(0, list_1.is_null)(user_list); user_list = (0, list_1.tail)(user_list))
        if ((0, list_1.head)((0, list_1.head)(user_list)) === username)
            break;
    if (user_list === null) // user not found
        return;
    user_i = (0, list_1.tail)((0, list_1.head)(user_list));
    if (event !== undefined) {
        // delete event from event list
        if ((0, events_1.delete_event_from_event_list)(event, users[user_i].eventlist) !== 0)
            console.log("event at ".concat(event.year, "-").concat(event.month, "-").concat(event.day, " '").concat(event.description, "' cannot be deleted: does not exist in event list"));
    }
    else { // no event specified -> delete user
        ht.table[ht_i] = (0, list_1.remove)((0, list_1.head)(user_list), ht.table[ht_i]); //delete user entry from ht
        users.splice(user_i, 1); // delete user from users
    }
}
/**
 * Checks whether or not the given entry exists in the hashtable.
 * @param {Hashtable} ht - hashtable
 * @param {string} key - entry/key
 * @return {boolean} - returns true if entry exists, otherwise false
 */
function ht_entry_exists(ht, key) {
    var lst;
    var ht_i = ht.hash(key) % ht.table_size;
    for (lst = ht.table[ht_i]; !(0, list_1.is_null)(lst); lst = (0, list_1.tail)(lst)) {
        if (key === (0, list_1.head)((0, list_1.head)(lst))) {
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
function ht_get_event_list(ht, users, user) {
    var lst = ht.table[ht.hash(user) % ht.table_size];
    var user_index = -1;
    for (; !(0, list_1.is_null)(lst); lst = (0, list_1.tail)(lst)) {
        if ((0, list_1.head)((0, list_1.head)(lst)) === user) {
            user_index = (0, list_1.tail)((0, list_1.head)(lst));
            break;
        }
    }
    if (user_index === -1)
        null;
    return users[user_index].eventlist;
}
