type month = {
    year: number,
    month: number,
    month_lenght: number
    first_day: number,
    weeks: Array<number>,
    events_indexes: Array<number>
};

type event = {
    day: number, 
    month: number, 
    year: number, 
    time_start: number, 
    time_end:number,
    description: string
}

type event_array = Array<event>;

