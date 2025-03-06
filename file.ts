import * as fs from 'fs';
import type { Event, Event_list, Hashtable, User } from './types';
import { ht_add_event } from './hashtable';
import { parse_event_input } from './User_interface';


export function write_events_to_file(users: Array<User>, filename: string): number {
	//loop through all events
	//stringify each event
	//write everything to file
	
	let output: string = "";

	for (let u = 0; u < users.length; u++) {
		let evl: Event_list = users[u].eventlist;
		let months: Array<Array<Event>> = evl.events;

		for (let m = 0; m < months.length; m++) {
			if (months[m] === undefined)
				continue;

			for (let e = 0; e < months[m].length; e++) {
				let event = months[m][e]
	
				output += stringify_event(event, users[u].username);
			}
		}
	}

	try {
		fs.writeFileSync(filename, output);
	} catch (error) {
		console.log(`${error}`);	//TODO somehow return this error instead?
		return 1;
	}

	return 0;
}

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
		// TODO if data does not exist -- is it really an error?
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
			console.log("parse_event_input says invalid, somewhere");	//TODO better error
			console.log(parsed_event);
			return 2;
		}
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
