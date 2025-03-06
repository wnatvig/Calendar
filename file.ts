import * as fs from 'fs';
import type { Event, Event_list, Hashtable, User } from './types';
import { ht_add_event } from './hashtable';
import { parse_event_input } from './User_interface';


export function write_events_to_file(users: Array<User>, filename: string): number {
	let output: string = "";

	// loop through all events, one user at a time
	for (let u = 0; u < users.length; u++) {
		let evl: Event_list = users[u].eventlist;
		let months: Array<Array<Event>> = evl.events;

		for (let m = 0; m < months.length; m++) {
			if (months[m] === undefined)
				continue;

			for (let e = 0; e < months[m].length; e++) {
				let event = months[m][e]
	
				// one line per event
				output += stringify_event(event, users[u].username) + '\n';
			}
		}
	}

	// write (truncate/create file) output to fil
	try {
		fs.writeFileSync(filename, output);
	} catch (error) {
		console.log(`${error}`);
		return 1;
	}

	return 0;
}

// Not in use due to potential bug
//
// When reading events from file, the first occuring event for each user needs to come first.
// This is due to how base year/month is determined. This is not necessary if all events are
// upcoming.
//
// If the user would add two events in reverse chronological order and never invoke a total
// rewrite of data, then, when these two events are past events, the order of them inside the 
// data file will be invalid.
//
// Therefore, write_events_to_file() is used for adding events, as it will ensure (by always writing
// events in chronological order for a specific user), that the order in data will never become invalid with time.
export function append_event_to_file(event: Event, user: string, filename: string): number {
	let line: string = stringify_event(event, user) + '\n';

	try {
		fs.appendFileSync(filename, line);
	} catch (error) {
		console.log(`${error}`);
		return 1;
	}
	
	return 0;
}

function stringify_event(event: Event, username: string): string {
	let time_start_min = `${event.time_start % 100}`.padStart(2, '0');
	let time_start_h = `${Math.floor((event.time_start - (event.time_start % 100))/100)}`.padStart(2, '0');
	let time_end_min = `${event.time_end % 100}`.padStart(2, '0');
	let time_end_h = `${Math.floor((event.time_end - (event.time_end % 100))/100)}`.padStart(2, '0');
	return `${username}, ${event.year}, ${event.month}, ${event.day}, ${time_start_h}:${time_start_min}, ${time_end_h}:${time_end_min}, \\\"${event.description}\\\"`;
}

//0: success
//1: error reading data
//2: error in data
export function add_events_from_file(ht: Hashtable, users: Array<User>, filename: string): number {
	let data: string;

	// read file contents to data
	try {
		let databuffer = fs.readFileSync(filename, "utf8");
		data = databuffer.toString();
	} catch (error) {
		console.log(`${error}`);
		return 1;
	}


	let line = 0;
	let start, end;
	let lim: [number, number] = [0, 0];

	while (true) {
		lim = get_line(data, lim);
		start = lim[0];
		end = lim[1];
		line++;

		if (start === end)	// we have reached end of file
			break;


		// current line consists of characters from data[start] to data[end]

		// split line into tokens
		let tokens = tokenize(data, start, end);

		if (tokens.length != 7) {
			console.log(`invalid data in file '${filename}' at line ${line}:`);
			return 2;
		}

		let parsed_event: [Event | null, number] = parse_event_input(
			tokens[3],	//day
			tokens[2],	//month
			tokens[1],	//year
			tokens[4],	//start time
			tokens[5],	//end time
			tokens[6],	//desc
		);

		if (parsed_event[0] !== null && parsed_event[1] === 0) {
			ht_add_event(ht, users, tokens[0], parsed_event[0]);
		} else {
			console.log(`invalid data in file '${filename}' at line ${line}: parse_event_input returned ${parsed_event[1]}$`);
			return 2;
		}
	}

	return 0;
}

//first call should be get_line(data, [0, 0])
//if returned [start, end], start === end, we are done
function get_line(str: string, a: [number, number]): [number, number] {
	let start = a[0];
	let end = a[1];

	// skip whitespace
	while (end < str.length && whitespace(str[end]))
		end++;

	// set new start
	start = end;

	// find end of line
	while (end < str.length && str[end] !== '\n')
		end++;

	// return start/end index for line
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


	let inside_quote = false;		// true if inside \" \" (do not ignore whitespace and do not treat delim as delimiter)
	let handle_backslash = false;	// true if last character was backslash
	let delim = ',';				// token delimiter

	// loop through current line
	for (let i = start; i < end; i++) {
		if (tokens_array[t] === undefined)
			tokens_array[t] = [];
		
		if (handle_backslash) { // last character was \
			if (str[i] === '"')
				inside_quote = !inside_quote;
			handle_backslash = false;
			continue;
		}

		if (!inside_quote && whitespace(str[i]))	// skip whitespace
			continue;

		if (!inside_quote && str[i] === delim) {	// delim encountered -> new token
			t++;
			t_i = 0;
			continue;
		}

		if (str[i] === '\\') {
			handle_backslash = true;
			continue;
		}
	
		// add char to current token
		tokens_array[t][t_i] = str[i];
		t_i++;
	}

	if (t_i === 0) t--;
	for (let i = 0; i <= t; i++) {
		tokens[i] = tokens_array[i].join('');
	}

	return tokens;
}
