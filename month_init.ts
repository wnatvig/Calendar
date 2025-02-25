import * from 'time';

function init_month(): Month {
	let month: Month = {
		year: 0,
		month: 0,
		month_length: 0,
		first_weekday: 0,
		week_numbers: [],
		events_index: 0,
	};

	month.year = get_year();
	month.month = get_month();
	month.month_length = month_len(month.year, month.month);

	let date = get_date();
	let day = get_weekday();

	while (date > 1) {
		date--;
		day--;
		if (day === 0)
			day = 7;
	}

	month.first_weekday = day;

	return month;
}


const MONTH_LENGTHS: Array<number> = [
	0,
	31,
	28,
	31,
	30,
	31,
	30,
	31,
	31,
	30,
	31,
	30,
	31,
];


function month_len(year: number, month: number): number {
	if (month != 2)
		return MONTH_LENGTHS[month];

	if (leap_year(year))
		return MONTH_LENGTHS[month] + 1;
}

function leap_year(year): boolean {
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
