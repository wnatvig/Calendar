import * as td from './time_date';
import type { Month } from './types';
import { NAMES_WEEKDAYS, NAMES_MONTHS, MONTH_LENGTHS } from './defs';

function init_month(): Month {
	let month: Month = {
		year: 0,
		month: 0,
		month_length: 0,
		first_weekday: 0,
		week_numbers: [],
		events_index: 0,
	};

	month.year = td.get_year();
	month.month = td.get_month();
	month.month_length = month_len(month.year, month.month);

	let date = td.get_date();
	let day = td.get_weekday();

	while (date > 1) {
		date--;
		day--;
		if (day === 0)
			day = 7;
	}

	month.first_weekday = day;

	return month;
}


function month_len(year: number, month: number): number {
	if (month != 2)
		return MONTH_LENGTHS[month];

	if (leap_year(year))
		return MONTH_LENGTHS[month] + 1;
	else
		return MONTH_LENGTHS[month];
}

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
