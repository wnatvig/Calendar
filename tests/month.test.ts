import * as td from '../time_date';
import { init_month, load_weeks, get_next_month, get_previous_month, 
         get_month_index, month_length, leap_year } from "../month";
import { Month, Event_list } from "../types";
import { NAMES_WEEKDAYS, NAMES_MONTHS, MONTH_LENGTHS,
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
    SUNDAY } from '../defs';

    describe("Calendar Functions", () => {

        test("get_month_index", () => {
            expect(get_month_index(2025, 1, 2025, 1)).toBe(0);
            expect(get_month_index(2025, 1, 2025, 2)).toBe(1);
            expect(get_month_index(2025, 1, 2026, 1)).toBe(12);
            expect(get_month_index(2025, 6, 2024, 12)).toBe(-6);
        });
    
        test("month_length", () => {
            expect(month_length(2025, 1)).toBe(31);  // januari
            expect(month_length(2025, 2)).toBe(28);  // feb
            expect(month_length(2024, 2)).toBe(29);  // feb med "leap"
            expect(month_length(2025, 4)).toBe(30);  // apr
        });
    
        test("leap_year", () => {
            expect(leap_year(2024)).toBe(true);   // ja leap (/4)
            expect(leap_year(2023)).toBe(false);  // nej leap
            expect(leap_year(2000)).toBe(true);   // ja leap delbar med 400
            expect(leap_year(1900)).toBe(false);  // ja leap trots delbar med 100
        });
    
        test("init_month", () => {
            const Event_list: Event_list = { base_year: 2025, base_month: 1, events: [] };
            const month = init_month(Event_list, 2025, 3, 1, 5); // mars 1, 2025 lördag
    
            expect(month.year).toBe(2025);
            expect(month.month).toBe(3);
            expect(month.month_length).toBe(31);
            expect(month.first_weekday).toBe(5);
        });

        test("init_month with only event_list as argument", () =>{
            const Event_list: Event_list = { base_year: 2025, base_month: 1, events: [] };
            const month = init_month(Event_list);
            
            expect(month.year).toBe(td.get_current_year());
            expect(month.month).toBe(td.get_current_month());
            expect(month.month_length).toBe(month_length(td.get_current_year(), 
                                                         td.get_current_month()));
        });
    
        test("get_next_month", () => {
            const Event_list: Event_list = { base_year: 2025, base_month: 1, events: [] };
            const currentMonth: Month = {
                year: 2025,
                month: 3,
                month_length: 31,
                first_weekday: 5,
                week_numbers: [],
                events_index: 0
            };
            const nextMonth = get_next_month(currentMonth, Event_list);
            expect(nextMonth.year).toBe(2025);
            expect(nextMonth.month).toBe(4);
            expect(nextMonth.month_length).toBe(30);
        });
    
        test("get_next_month (next year)", () => {
            const Event_list: Event_list = { base_year: 2025, base_month: 1, events: [] };
            const currentMonth: Month = {
                year: 2025,
                month: 12,
                month_length: 31,
                first_weekday: 2,
                week_numbers: [],
                events_index: 0
            };
    
            const nextMonth = get_next_month(currentMonth, Event_list);
            expect(nextMonth.year).toBe(2026);
            expect(nextMonth.month).toBe(1);
        });
    
        test("get_previous_month", () => {
            const Event_list: Event_list = { base_year: 2025, base_month: 1, events: [] };
            const currentMonth: Month = {
                year: 2025,
                month: 3,
                month_length: 31,
                first_weekday: 5,
                week_numbers: [],
                events_index: 0
            };
    
            const previousMonth = get_previous_month(currentMonth, Event_list);
            expect(previousMonth.year).toBe(2025);
            expect(previousMonth.month).toBe(2);
            expect(previousMonth.month_length).toBe(28);
        });
    
        test("get_previous_month (last year)", () => {
            const Event_list: Event_list = { base_year: 2025, base_month: 1, events: [] };
            const currentMonth: Month = {
                year: 2025,
                month: 1,
                month_length: 31,
                first_weekday: 3,
                week_numbers: [],
                events_index: 0
            };
    
            const previousMonth = get_previous_month(currentMonth, Event_list);
            expect(previousMonth.year).toBe(2024);
            expect(previousMonth.month).toBe(12);
        });
    
    });

