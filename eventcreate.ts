import {
    Month, Event, Event_list
} from './types';
import { get_month_index } from './month'


/**
 * creates an event
 * @param day a number representing the day of the event
 * @param month the month of the event as a number
 * @param year the year of the event as a number
 * @param time_start the time the event starts during the day as a number
 * @param time_end the time the event ends during the day as a number
 * @param description a string with a description of the event
 * @returns an event of type Event
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
 * creates an Event_list
 * @param base_year a number representing the base year where the calendar starts
 * @param base_month a number representing the base month where the calendar starts
 * @param events an array of events
 * @returns a list of events of type Event_list
 */
export function make_event_list(base_year: number, base_month: number, events: Array<Array<Event>>): Event_list{
    return {base_year, base_month, events}
}

/**
 * Adds event to an xisting Event_list
 * @param event an event of type Event
 * @param event_list a list of events with type Event_list
 * @returns a list of events with type Event_list
 */
export function event_to_event_list(event: Event, event_list: Event_list): Event_list{
    //TODO THIS month_index CAN BE NEGATIVE, CHECK NECESSARY SOMEWHERE
    const month_index = get_month_index(event_list.base_year, event_list.base_month, 
                                        event.year, event.month);
    
    if (event_list.events[month_index] === undefined) {
        event_list.events[month_index] = []; //sätter en array där det inte finns ngt
    }
    event_list.events[month_index].push(event); //appendar eventet till rätt ställe
    return event_list;
}
