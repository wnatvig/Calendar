export function get_year(): number {
	let date: Date = new Date();
	return date.getFullYear();
}

export function get_month(): number {
	let date: Date = new Date();
	return date.getMonth() + 1;
}

export function get_date(): number {
	let date: Date = new Date();
	return date.getDate();
}

export function get_weekday(): number {
	let date: Date = new Date();

	let d = date.getDay();
	if (d === 0)
		d = 7;

	return d;
}
