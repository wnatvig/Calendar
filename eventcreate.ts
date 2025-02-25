import {
    Month, Event, Event_list, get_month_index
} from './types';

function make_event(day: number, month: number, 
                    year: number, time_start: number, 
                    time_end: number, description: string): Event {
    return {day, month, year, time_start, time_end, description}

}

function event_to_event_list(event: Event, event_list: Event_list): Event_list{
    const month_index = get_month_index(event_list.base_year, event_list.base_month, 
                                        event.year, event.month);
    
    if (event_list.events[month_index] === undefined) {
        event_list.events[month_index] = []; //sätter en array där det inte finns ngt
    }
    event_list.events[month_index].push(event); //appendar eventet till rätt ställe
    return event_list;
}