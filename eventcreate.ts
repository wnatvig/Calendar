import {
    Month, Event, Event_list
} from './types';
import { get_month_index } from './month'

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
export function make_event_list(base_year: number,
	                            base_month: number,
                                events: Array<Array<Event>>): Event_list{
    return {
        base_year: base_year,
        base_month: base_month,
        events: events,
        };

}

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
