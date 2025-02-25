import * from 'time';

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
