"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init_month = init_month;
exports.load_weeks = load_weeks;
exports.get_next_month = get_next_month;
exports.get_previous_month = get_previous_month;
exports.get_month_index = get_month_index;
exports.month_length = month_length;
exports.leap_year = leap_year;
var td = require("./time_date");
var defs_1 = require("./defs");
function init_month(eventlist, year_arg, month_arg, date_arg, day_arg) {
    var month = {
        year: 0,
        month: 0,
        month_length: 0,
        first_weekday: 0,
        week_numbers: [],
        events_index: 0,
    };
    var date, day;
    // if year/month/date/day is given, use them
    if (year_arg !== undefined && month_arg !== undefined && date_arg !== undefined && day_arg !== undefined) {
        month.year = year_arg;
        month.month = month_arg;
        date = date_arg;
        day = day_arg;
    }
    else { // otherwise use current year/month/date/day
        month.year = td.get_current_year();
        month.month = td.get_current_month();
        date = td.get_current_date();
        day = td.get_current_weekday();
    }
    month.month_length = month_length(month.year, month.month);
    // loop back to date == 1 to get weekday of first day of month
    while (date > 1) {
        date--;
        day--;
        if (day === 0)
            day = 7;
    }
    month.first_weekday = day;
    // load weeks to month.week_numbers
    load_weeks(month.year, month.month, month.first_weekday, month.week_numbers);
    // store events_index, NOTE: index might be invalid (negative)
    month.events_index = get_month_index(eventlist.base_year, eventlist.base_month, month.year, month.month);
    return month;
}
function load_weeks(year, target_month, first_weekday, week_numbers) {
    var month = target_month;
    var day = first_weekday;
    var date = 1; // date corresponding to day
    var week, w_index;
    var month_len;
    // loop back to january 1
    while (month > 1) {
        month--;
        date = month_length(year, month);
        day--;
        if (day === 0)
            day = 7;
        while (date > 1) {
            date--;
            day--;
            if (day === 0)
                day = 7;
        }
    }
    // now: date == 1, month == 1
    // get first week based on what weekday january 1st is
    // see https://en.wikipedia.org/wiki/ISO_week_date#First_week
    if (day === defs_1.MONDAY || day === defs_1.TUESDAY || day === defs_1.WEDNESDAY || day === defs_1.THURSDAY) {
        week = 1;
    }
    else if (day === defs_1.FRIDAY) {
        week = 53;
    }
    else if (day === defs_1.SATURDAY && leap_year(year - 1)) {
        week = 53;
    }
    else {
        week = 52;
    }
    // loop forward to target month
    w_index = -1; // index in week_numbers of most recently added week
    while (month <= target_month) {
        month_len = month_length(year, month);
        date = 1;
        while (date <= month_len) {
            if (day === defs_1.MONDAY) {
                if ((week === 52 || week === 53) && month == 1) // first week of january is 52/53
                    week = 1;
                else if ((week === 52 || week === 53) && date >= 29) // last week of december is 1
                    week = 1;
                else
                    week++;
            }
            // add week to week_numbers if we have reached target_month and week isn't already in week_numbers
            if (month === target_month && (week_numbers[w_index] != week || w_index === -1)) {
                w_index++;
                week_numbers[w_index] = week;
            }
            date++;
            day++;
            if (day === 8)
                day = 1;
        }
        month++;
    }
}
function get_next_month(prev_month, eventlist) {
    var month = {
        year: 0,
        month: 0,
        month_length: 0,
        first_weekday: 0,
        week_numbers: [],
        events_index: 0,
    };
    var week, w_index;
    var date, day;
    month.year = prev_month.year;
    month.month = prev_month.month + 1;
    if (month.month === 13) {
        month.month = 1;
        month.year++;
    }
    month.month_length = month_length(month.year, month.month);
    // (prev_month.first_weekday + prev_month.length ) % 7
    month.first_weekday = (((prev_month.first_weekday - 1) + month_length(prev_month.year, prev_month.month)) % 7) + 1; //-+1 to make day 0-6 instead of 1-7
    date = 0;
    day = month.first_weekday;
    week = prev_month.week_numbers[prev_month.week_numbers.length - 1]; //last week of previous month
    w_index = -1;
    // this whole block is copied from load_weeks()
    while (date <= month.month_length) {
        if (day === defs_1.MONDAY) {
            if ((week === 52 || week === 53) && month.month == 1)
                week = 1;
            else if ((week === 52 || week === 53) && date >= 29)
                week = 1;
            else
                week++;
        }
        if (month.week_numbers[w_index] != week || w_index === -1) {
            w_index++;
            month.week_numbers[w_index] = week;
        }
        date++;
        day++;
        if (day === 8)
            day = 1;
    }
    //load_weeks(month.year, month.month, month.first_weekday, month.week_numbers);
    month.events_index = get_month_index(eventlist.base_year, eventlist.base_month, month.year, month.month);
    return month;
}
function get_previous_month(future_month, eventlist) {
    var month = {
        year: 0,
        month: 0,
        month_length: 0,
        first_weekday: 0,
        week_numbers: [],
        events_index: 0,
    };
    var week, w_index;
    var date, day;
    month.year = future_month.year;
    month.month = future_month.month - 1;
    if (month.month === 0) {
        month.month = 12;
        month.year--;
    }
    month.month_length = month_length(month.year, month.month);
    month.first_weekday = (((((future_month.first_weekday - 1) - month_length(month.year, month.month)) % 7) + 7) % 7) + 1;
    //commented code is unfinished and does not work, i use load_weeks instead of this mess because im lazy
    //date = month.month_len;
    //day = month.first_weekday;
    //week = future_month.week_numbers[0];	//last week of future/current_month
    //w_index = -1;
    //while (date >= 1) {
    //	if (day === SUNDAY) {
    //		if (week === 1) {
    //			//??
    //		}
    //		else
    //			week--;
    //	}
    //	//THEY GET ADDED IN REVERSE
    //	if (month.week_numbers[w_index] != week || w_index === -1) {
    //		w_index++;
    //		month.week_numbers[w_index] = week;
    //	}
    //	date--;
    //	day--;
    //	if (day === 0)
    //		day = 7;
    //}
    load_weeks(month.year, month.month, month.first_weekday, month.week_numbers); // lazy
    month.events_index = get_month_index(eventlist.base_year, eventlist.base_month, month.year, month.month);
    return month;
}
function get_month_index(base_year, base_month, year, month) {
    var year_diff = year - base_year;
    var month_diff = month - base_month;
    return year_diff * 12 + month_diff;
}
// get length of month (in days)
function month_length(year, month) {
    if (month != 2)
        return defs_1.MONTH_LENGTHS[month];
    if (leap_year(year))
        return defs_1.MONTH_LENGTHS[month] + 1;
    else
        return defs_1.MONTH_LENGTHS[month];
}
//returns true if given year is a leap year, otherwise false
function leap_year(year) {
    if (year % 4 === 0) {
        if (year % 100 === 0) {
            if (year % 400 === 0) {
                return true;
            }
            return false;
        }
        return true;
    }
    return false;
}
