export const MONDAY: number		= 1;
export const TUESDAY: number	= 2;
export const WEDNESDAY: number	= 3;
export const THURSDAY: number	= 4;
export const FRIDAY: number		= 5;
export const SATURDAY: number	= 6;
export const SUNDAY: number		= 7;

export const NAMES_WEEKDAYS: Array<string> = [
	"",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday"
];

export const NAMES_MONTHS: Array<string> = [
	"",
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];

// do not use directly, use month_length() from month.ts as it handles february on leap years properly
export const MONTH_LENGTHS: Array<number> = [
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
