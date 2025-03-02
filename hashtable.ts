import type { List, Pair } from './lib/list';
import type { Hashtable, User } from './types';
import { pair, head, tail, is_null } from './lib/list';


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

//read file and initialize Array<User>		<- stupid idea
//initialize hashtable from Array<User>		<- stupid idea
//add event (use hashtable to get Array<User> index and add event, also append to file)
//delete event (requires change in Array<User> and then total overwrite of file)

//better than init_hashtable:
//read file, for each line (1 event per line, complete with Event data + user):
//    find user in hashtable, if user exists:
//	      add event
//	  else
//	      add user
//	      add event


//discard this, probably
export function init_hashtable(users: Array<User>): Hashtable {
	let ht: Hashtable = {table: [], table_size: HT_TABLE_SIZE, hash: HT_HASH_FUNCTION};

	for (let i = 0; i < ht.table_size; i++)
		ht.table[i] = null;

	for (let i = 0; i < users.length; i++)
		ht_add_user(ht, users[i].username, i);

	return ht;
}


function ht_add_user(ht: Hashtable, username: string, user_index: number): void {
	if (ht_entry_exists(ht, username)) {
		console.log(`DOUBLE ENTRY USER: ${username} -- SKIPPING`);
		console.log("users: Array<User> IS INVALID");
	} else {
		let ht_i = ht.hash(username) % ht.table_size;
		//ht.table[ht_i] = <List<Pair<string, number>>>pair(pair(username, user_index), ht.table[ht_i]);
		ht.table[ht_i] = pair(pair(username, user_index), ht.table[ht_i]);
	}
}

function ht_entry_exists(ht: Hashtable, key: string): boolean {
	let lst: List<Pair<string, number>>;
	let ht_i = ht.hash(key) % ht.table_size;

	for (lst = ht.table[ht_i]; !is_null(lst); lst = tail(lst)) {
		if (key === head(head(lst))) {
			return true;
		}
	}

	return false;
}

//TODO put somewhere else
function add_user(user: User, users: Array<User>, ht: Hashtable) {
	let i = users.length;
	users[i] = user;
	ht_add_user(ht, user.username, i);
}
