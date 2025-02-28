export type Month = {						//ex.
    year: number,					//2025
    month: number,					//2
    month_length: number			//28
    first_weekday: number,			//6
    week_numbers: Array<number>,	//[5, 6, 7, 8, 9]
    events_index: number,
};

export type Event = {						//ex.
    day: number,					//22
    month: number,					//3
    year: number,					//2025
    time_start: number,				//800
    time_end:number,				//1700
    description: string				//"tentamen"
}

export type Event_list = {					//ex.
	base_year: number,				//2025
	base_month: number,				//2
	events: Array<Array<Event>>;
};
