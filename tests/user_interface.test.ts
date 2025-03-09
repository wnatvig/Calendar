import { NAMES_MONTHS } from "../defs";
import { add_event_to_event_list, make_event, make_event_list } from "../events";
import { get_current_date, get_current_month, get_current_year } from "../time_date";
import { Event, Event_list, Month } from "../types";
import { display_event, display_month, display_next_event,  
    display_day, 
    parse_event_input, 
    parse_time, 
    find_next_event 
} from "../User_interface";

describe("display_event", () => {
    let consoleSpy:jest.SpyInstance;
    
    beforeEach(() => {
        consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    it("should format and display the event correctly", () => {
        const event = {
            time_start: 930,
            time_end: 1045,
            month: 2,
            day: 15,
            year: 2025,
            description: "Meeting with client"
        };

        display_event(event);

        expect(consoleSpy).toHaveBeenCalledWith("Date: February 15, 2025");
        expect(consoleSpy).toHaveBeenCalledWith("From: 09:30");
        expect(consoleSpy).toHaveBeenCalledWith("To: 10:45");
        expect(consoleSpy).toHaveBeenCalledWith("Description: Meeting with client");
    });
});

describe("display_month", () => {
    let consoleSpy:jest.SpyInstance, stdoutSpy: jest.SpyInstance;
    
    beforeEach(() => {
        consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        stdoutSpy = jest.spyOn(process.stdout, "write").mockImplementation(() => {return true;});
    });

    afterEach(() => {
        consoleSpy.mockRestore();
        stdoutSpy.mockRestore();
    });

    it("should display the correct month header", () => {
        const month = {
            month: 2, 
            year: 2025,
            week_numbers: [9, 10, 11, 12, 13],
            first_weekday: 5,
            month_length: 31,
            events_index: 0
        };
        const Event_list = { base_year: 2025, base_month:2, events: [[]] };

        display_month(month, Event_list, {year: 2025, month: 1, day: 1});
        
        expect(consoleSpy).toHaveBeenCalledWith("          ", "February", 2025);
        expect(consoleSpy).toHaveBeenCalledWith("   Mon Tue Wed Thu Fri Sat Sun");
    });

    it("should correctly highlight days correctly", () => {
        const event1: Event = {day: 22, 
                       month: 1,
                       year:2025,
                       time_start:945,
                       time_end: 1254,
                       description: "Tadläkare"};

        const event2: Event = {day: 5, 
                       month: 1,
                       year:2025,
                       time_start:1,
                       time_end: 1,
                       description: "Tadläkare"};
        const month1: Month = {year: 2025, 
                    month: 1, 
                    month_length: 31, 
                    first_weekday:  3,
                    week_numbers: [1, 2, 3, 4, 5], 
                    events_index: 0};

        const Event_array1: Event_list = {base_year:2025, base_month:1, events: [[event1, event2]]};
        display_month(month1, Event_array1, {year: 2025, month: 1, day: 1});


        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringMatching(/\x1b\[34m5\x1b\[0m/));
        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringMatching(/\x1b\[34m22\x1b\[0m/));
        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringMatching(/\x1b\[31m1\x1b\[0m/));
    });
});

describe("Display_next_event", () =>{
    let consoleSpy:jest.SpyInstance;
    
    beforeEach(() => {
        consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    it("should print 'No upcoming events' if there are no events", () => {
        let event_list = make_event_list(get_current_year(),get_current_month(), []);
        display_next_event(event_list);

        expect(consoleSpy).toHaveBeenCalledWith("No upcoming events");
    });

    it("should print 'No upcoming events' if all events have passed", () => {
        let event_list = make_event_list(2024, 1, []);
        let event1 = make_event(1, 1, 2025, 1200, 1200, "Tandläkare");
        add_event_to_event_list(event1, event_list);

        display_next_event(event_list);

        expect(consoleSpy).toHaveBeenCalledWith("No upcoming events");
    });

    it("should print the next event with just one event", () =>{
        let event_list = make_event_list(get_current_year(), get_current_month(), []);
        let event1 = make_event(get_current_date(), 
                                get_current_month(), 
                                get_current_year(),
                                1200,
                                1200,
                                "Tandläkare");
        add_event_to_event_list(event1, event_list);
        
        display_next_event(event_list);

        expect(consoleSpy).toHaveBeenCalledWith(`Date: ${NAMES_MONTHS[event1.month]} ${event1.day}, ${event1.year}`);
        expect(consoleSpy).toHaveBeenCalledWith("From: 12:00");
        expect(consoleSpy).toHaveBeenCalledWith("To: 12:00");
        expect(consoleSpy).toHaveBeenCalledWith("Description: Tandläkare");
    });
});

describe("Parse_time", () => {

    test("returns correct numeric time for valid input", () => {
        expect(parse_time("10:30")).toBe(1030);
        expect(parse_time("00:05")).toBe(5);
        expect(parse_time("23:59")).toBe(2359);
    });

    test("returns null for invalid time strings", () => {
        expect(parse_time("24:00")).toBeNull();
        expect(parse_time("12:60")).toBeNull();
        expect(parse_time("invalid")).toBeNull();
        expect(parse_time("12")).toBeNull();
    }); 
});

describe("parse_event_input", () => {
    test("returns error code 1 when year is not a number", () => {
        const [ev, code] = parse_event_input("10", "5", "NaN", "10:00", "11:00", "Test");
        expect(ev).toBeNull();
        expect(code).toBe(1);
    });
    
    test("returns error code 2 for an invalid month", () => {
        const [ev, code] = parse_event_input("10", "13", "2025", "10:00", "11:00", "Test");
        expect(ev).toBeNull();
        expect(code).toBe(2);
    });
    
    test("returns error code 3 for an invalid day", () => {
        // For February 2025, month_length(2025,2) should be 28.
        const [ev, code] = parse_event_input("30", "2", "2025", "10:00", "11:00", "Test");
        expect(ev).toBeNull();
        expect(code).toBe(3);
    });
    
    test("returns error code 4 for an invalid start time", () => {
        const [ev, code] = parse_event_input("10", "5", "2025", "25:00", "11:00", "Test");
        expect(ev).toBeNull();
        expect(code).toBe(4);
    });
    
    test("returns error code 5 for an invalid end time", () => {
        const [ev, code] = parse_event_input("10", "5", "2025", "10:00", "11:60", "Test");
        expect(ev).toBeNull();
        expect(code).toBe(5);
    });
    
    test("returns error code 6 when end time is before start time", () => {
        const [ev, code] = parse_event_input("10", "5", "2025", "11:00", "10:00", "Test");
        expect(ev).toBeNull();
        expect(code).toBe(6);
    });
    
    test("returns event and code 0 for valid input", () => {
        const [ev, code] = parse_event_input("10", "5", "2025", "10:00", "11:00", "Test");
        expect(code).toBe(0);
        expect(ev).not.toBeNull();
        if (ev) {
            expect(ev.day).toBe(10);
            expect(ev.month).toBe(5);
            expect(ev.year).toBe(2025);
            expect(ev.time_start).toBe(1000);
            expect(ev.time_end).toBe(1100);
            expect(ev.description).toBe("Test");
        }
    });
    

})
describe("display_day", () => {
    test("prints no events message when there are no events", () => {
        // Create a fake event list with no events for the month index.
        const eventList: Event_list = { base_year: 2025, base_month: 1, events: [] };
        const fakeMonth: Month = {
            year: 2025,
            month: 1,
            month_length: 31,
            first_weekday: 1,
            week_numbers: [1, 2, 3, 4, 5],
            events_index: 0
        };
        const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        display_day(eventList, fakeMonth, 15);
        // Check that the header and "no events" message are printed.
        expect(consoleSpy).toHaveBeenCalledWith(`All events for ${NAMES_MONTHS[fakeMonth.month]} 15:`);
        expect(consoleSpy).toHaveBeenCalledWith("Seems you have no events this day");
        consoleSpy.mockRestore();
    });
})

describe("find_next_event", ()=> {
    test("find_next_event returns the correct upcoming event", () => {
        // Use the current date information.
        const currentYear = get_current_year();
        const currentMonth = get_current_month();
        const currentDate = get_current_date();
        const eventList: Event_list = make_event_list(currentYear, currentMonth, []);
        const futureEvent = make_event(currentDate + 1, currentMonth, currentYear, 900, 1000, "Future");
        // Ensure the events array exists for the current month index (index 0).
        eventList.events[0] = [futureEvent];
        const nextEv = find_next_event(eventList);
        expect(nextEv).toEqual(futureEvent);
    });
    
    test("find_next_event returns null if no upcoming event is found", () => {
        const currentYear = get_current_year();
        const currentMonth = get_current_month();
        const eventList: Event_list = make_event_list(currentYear, currentMonth, []);
        // Set an empty events array for the current month.
        eventList.events[0] = [];
        const nextEv = find_next_event(eventList);
        expect(nextEv).toBeNull();
    });
});
