import type { Month, Event, Event_list } from './types';
import { display_month } from './User_interface';
import { init_month, get_next_month, get_previous_month } from './month';
import { get_current_year, get_current_month } from './time_date';


let eventlist: Event_list = { base_year: get_current_year(), base_month: get_current_month(), events: []};
let month: Month = init_month(eventlist);

display_month(month, eventlist);
