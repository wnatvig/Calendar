"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.make_event = make_event;
exports.make_event_list = make_event_list;
exports.add_event_to_event_list = add_event_to_event_list;
exports.delete_event_from_event_list = delete_event_from_event_list;
var month_1 = require("./month");
function make_event(day, month, year, time_start, time_end, description) {
    return { day: day,
        month: month,
        year: year,
        time_start: time_start,
        time_end: time_end,
        description: description };
}
function make_event_list(base_year, base_month, events) {
    return {
        base_year: base_year,
        base_month: base_month,
        events: events,
    };
}
//0: success
//1: invalid month_index (event date is earlier than event_list base.year+base.month)
function add_event_to_event_list(event, event_list) {
    var month_index = (0, month_1.get_month_index)(event_list.base_year, event_list.base_month, event.year, event.month);
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
function delete_event_from_event_list(event, event_list) {
    var month_index = (0, month_1.get_month_index)(event_list.base_year, event_list.base_month, event.year, event.month);
    if (month_index < 0)
        return 1;
    if (event_list.events[month_index] === undefined) //event does not exist in eventlist
        return 2;
    var e;
    for (var i = 0; i < event_list.events[month_index].length; i++) {
        e = event_list.events[month_index][i];
        if (e.year === event.year &&
            e.month === event.month &&
            e.day === event.day &&
            e.time_start === event.time_start &&
            e.time_end === event.time_end &&
            e.description === event.description) {
            event_list.events[month_index].splice(i, 1); //remove event at index i
            break;
        }
    }
    return 0;
}
