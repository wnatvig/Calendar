import * as fs from 'fs';
import type { Event, Hashtable, User } from './types';
import { ht_add_event } from './hashtable';


const DATA_FILENAME = "data";


export function write_events_to_file(users: Array<User>, filename: string): number {
	//loop through all events
	//stringify each event
	//write everything to file
}

export function append_event_to_file(event: Event, user: string, filename: string): number {
	//stringify event
	//append to file
}

function stringify_event(event: Event, username: string): string {
}

// read file
// for each line:
//     get tokens
//     create event, user
//     ht_add_event(event)
export function add_events_from_file(ht: Hashtable, users: Array<User>, filename: string): number {
	let data: string;

	try {
		let databuffer = fs.readFileSync(filename, "utf8");
		data = databuffer.toString();
	} catch (error) {
		console.log(`${error}`);	//TODO somehow return this error instead?
		return 1;
	}

	let start, end;
	let lim: [number, number] = [0, 0];

	while (true) {
		lim = get_line(data, lim);
		start = lim[0];
		end = lim[1];

		if (start === end)
			break;

		// handle line in data from data[start] to data[end]
		//tokenize(data, start, end);
		let tokens = tokenize(data, start, end);

		if (tokens.length != 7) {
			console.log("invalid line, somewhere");	//TODO better error message/handling
			return 2;
		}

		//TODO create Event (with tokens), william skriver denna
		//let event = ... ^
		//let user = token[0]

		ht_add_event(ht, users, user, event);
	}

	return 0;
}

//start with get_line(data, 0, 0)
//if returned [start, end], start === end, we are done
function get_line(str: string, a: [number, number]): [number, number] {
	let start = a[0];
	let end = a[1];

	while (end < str.length && whitespace(str[end]))
		end++;

	start = end;

	while (end < str.length && str[end] !== '\n')
		end++;

	return [start, end];
}

function whitespace(char: string): boolean {
	return ((char === ' ') || (char === '\t') || (char === '\n'));
}

function tokenize(str: string, start: number, end: number): Array<string> {
	let tokens_array: Array<Array<string>> = [];	//array of tokens (arrays of chars), converted to Array<string> before return
	let tokens: Array<string> = [];
	let t = 0;	//current token
	let t_i = 0;	// write next char at t_i (tokens_array[t][t_i] = str[i])


	let inside_quote = false;		// true if inside \" \" - do not ignore whitespace and do not treat delim as delimiter
	let handle_backslash = false;	// true if last character was \
	let delim = ',';

	for (let i = start; i < end; i++) {
		if (tokens_array[t] === undefined)
			tokens_array[t] = [];
		
		if (handle_backslash) {
			if (str[i] === '"')
				inside_quote = !inside_quote;
			handle_backslash = false;
			continue;
		}

		if (!inside_quote && whitespace(str[i]))
			continue;

		if (!inside_quote && str[i] === delim) {
			t++;
			t_i = 0;
			continue;
		}

		if (str[i] === '\\') {
			handle_backslash = true;
			continue;
		}
	
		tokens_array[t][t_i] = str[i];
		t_i++;
	}

	if (t_i === 0) t--;
	for (let i = 0; i <= t; i++) {
		tokens[i] = tokens_array[i].join('');
	}

	return tokens;
}
