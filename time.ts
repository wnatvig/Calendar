let date: Date = new Date();

function get_year(date: Date): number {
	return date.getFullYear();
}

function get_month(date: Date): number {
	return date.getMonth() + 1;
}

function get_date(date: Date): number {
	return date.getDate();
}

function get_weekday(date: Date): number {
	let d = date.getDay();
	if (d === 0)
		d = 7;

	return d;
}

const WEEKDAYS: Array<string> = [
	"",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday"
];
const MONTHS: Array<string> = [
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

console.log(`year:    ${get_year(date)}`);
console.log(`month:   ${get_month(date)} (${MONTHS[get_month(date)]})`);
console.log(`date:    ${get_date(date)}`);
console.log(`weekday: ${get_weekday(date)} (${WEEKDAYS[get_weekday(date)]})`);
