import { Month, Event, Event_list
} from './types';
import { get_month_index } from './month'

/**
 * Creates an Event object with the given date, time and description.
 * @param {Number} day - the day of the event (1 to 31)
 * @param {Number} month - the month of the event (1 to 12)
 * @param {Number} year - the year of the event (example: 2025)
 * @param {Number} time_start - the starting time of the event (example: 1200, for 12:00)
 * @param {Number} time_end - the ending time of the event (example: 1300, for 13:00)
 * @param {String} description - a description of the event
 * @returns {Event} An event of type Event containing the specific details 
 */
export function make_event(day: number, month: number, 
                    year: number, time_start: number, 
                    time_end: number, description: string): Event {
    return {day: day,
			month: month,
			year: year,
			time_start: time_start,
			time_end: time_end,
			description: description};
}
/**
 * Creates an Event_list object that holds events for specific month and year.
 * @param {Number} base_year - The reference year for the event list 
 * @param {Number} base_month - the reference month for the event list
 * @param {Event_list} events - an array containing arrays where each inner array represents a month containing events
 * @returns {Event_list} an event list of type Event_list containing events that are associated with the given month and year
 */
export function make_event_list(base_year: number,
	                            base_month: number,
                                events: Array<Array<Event>>): Event_list{
    return {
        base_year: base_year,
        base_month: base_month,
        events: events,
        };

}

/**
 * Adds an event to the correct posision in the given Event_list
 * @param {Event} event - the event added
 * @param {Event_list} event_list - the list of events that the event gets added into
 * @returns {Number} 0 if the event was added and 1 of the event month is out of range
 */
export function add_event_to_event_list(event: Event, event_list: Event_list): number {
    const month_index = get_month_index(event_list.base_year, event_list.base_month, 
                                        event.year, event.month);

	if (month_index < 0)
		return 1;
    
    if (event_list.events[month_index] === undefined) {
        event_list.events[month_index] = [];
    }
    event_list.events[month_index].push(event);

	return 0;
}

/**
 * Removes a specific event from the given Event_list
 * @param {Event} event - the event being removed
 * @param {Event_list} event_list - the list of events 
 * @returns 0 if the event was removed, 
 * 			1 if the event month is out of range,
 * 			2 if the event does not exist
 */
export function delete_event_from_event_list(event: Event, event_list: Event_list): number {
    const month_index = get_month_index(event_list.base_year, event_list.base_month, 
                                        event.year, event.month);
	if (month_index < 0)
		return 1;

	if (event_list.events[month_index] === undefined)
		return 2;

	let found = false;
	let e: Event;
	for (let i = 0; i < event_list.events[month_index].length; i++) {
		e = event_list.events[month_index][i];
		if (e.year === event.year &&
			e.month === event.month &&
			e.day === event.day &&
			e.time_start === event.time_start &&
			e.time_end === event.time_end &&
			e.description === event.description) {
			
			found = true;
			event_list.events[month_index].splice(i, 1);
			break;
			
		}
	}

	return found ? 0: 2;
}
