import { Month, Event, Event_list
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

//0: success
//1: invalid month_index (event date is earlier than event_list base.year+base.month)
export function add_event_to_event_list(event: Event, event_list: Event_list): number {
    const month_index = get_month_index(event_list.base_year, event_list.base_month, 
                                        event.year, event.month);

	if (month_index < 0)
		return 1;
    
    if (event_list.events[month_index] === undefined) {
        event_list.events[month_index] = []; //sätter en array där det inte finns ngt
    }
    event_list.events[month_index].push(event); //appendar eventet till rätt ställe

	return 0;
}

//0: success
//1: invalid month_index (event date is earlier than event_list base.year+base.month)
//2: event does not exist in event list
export function delete_event_from_event_list(event: Event, event_list: Event_list): number {
    const month_index = get_month_index(event_list.base_year, event_list.base_month, 
                                        event.year, event.month);
	if (month_index < 0)
		return 1;

	if (event_list.events[month_index] === undefined)	//event does not exist in eventlist
		return 2;

	let e: Event;
	for (let i = 0; i < event_list.events[month_index].length; i++) {
		e = event_list.events[month_index][i];
		if (e.year === event.year &&
			e.month === event.month &&
			e.day === event.day &&
			e.time_start === event.time_start &&
			e.time_end === event.time_end &&
			e.description === event.description) {

			event_list.events[month_index].splice(i, 1);	//remove event at index i
			break;
		}
	}

	return 0;
}
