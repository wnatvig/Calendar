import * as td from './time_date';
import type { Month, Event_list } from './types';
import { NAMES_WEEKDAYS, NAMES_MONTHS, MONTH_LENGTHS,
		MONDAY,
		TUESDAY,
		WEDNESDAY,
		THURSDAY,
		FRIDAY,
		SATURDAY,
		SUNDAY } from './defs';

function init_month(eventlist: Event_list): Month {
	let month: Month = {
		year: 0,
		month: 0,
		month_length: 0,
		first_weekday: 0,
		week_numbers: [],
		events_index: 0,
	};

	// set year, month, and month_length
	month.year = td.get_current_year();
	month.month = td.get_current_month();
	month.month_length = month_length(month.year, month.month);

	// current day and date
	let date = td.get_current_date();
	let day = td.get_current_weekday();

	// loop back to date == 01 to get weekday of first day of month
	while (date > 1) {
		date--;
		day--;
		if (day === 0)
			day = 7;
	}

	month.first_weekday = day;

	load_weeks(month.year, month.month, month.first_weekday, month.week_numbers);
	month.events_index = get_month_index(eventlist.base_year, eventlist.base_month, month.year, month.month);

	return month;
}

function load_weeks(year: number, target_month: number, first_weekday: number, week_numbers: Array<number>): void {

	let month = target_month;
	let day = first_weekday;
	let date = 1;	// date corresponding to day

	let week;

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
	if (day === MONDAY || day === TUESDAY || day === WEDNESDAY || day === THURSDAY) {
		week = 1;
	}
	else if (day === FRIDAY) {
		week = 53;
	}
	else if (day === SATURDAY && leap_year(year-1)) {
		week = 53;
	}
	else {
		week = 52;
	}

	// loop forward to target month
	
	let month_len;
	let week_i = -1;

	while (month <= target_month) {
		month_len = month_length(year, month);
		date = 1;

		while (date <= month_len) {
			if (day === MONDAY) {
				if ((week === 52 || week === 53) && month == 1)
					week = 1;
				
				else if ((week === 52 || week === 53) && date >= 29)
					week = 1;

				else
					week++;
			}

			if (month === target_month && (week_numbers[week_i] != week || week_i === -1)) {
				week_i++;
				week_numbers[week_i] = week;
			}

			date++;
			day++;
			if (day === 8)
				day = 1;
		}

		month++;
	}
}

//TODO error/invalid/illegal input check
export function get_month_index(base_year: number, base_month: number,
						 year: number, month: number): number {
	let year_diff = year - base_year;
	let month_diff = month - base_month;

	return year_diff * 12 + month_diff;
}


// get length of month (in days)
function month_length(year: number, month: number): number {
	if (month != 2)
		return MONTH_LENGTHS[month];

	if (leap_year(year))
		return MONTH_LENGTHS[month] + 1;
	else
		return MONTH_LENGTHS[month];
}

//returns true if given year is a leap year, otherwise false
function leap_year(year: number): boolean {
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
