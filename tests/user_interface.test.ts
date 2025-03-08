import { NAMES_MONTHS } from "../defs";
import { add_event_to_event_list, make_event, make_event_list } from "../events";
import { get_current_date, get_current_month, get_current_year } from "../time_date";
import { Event, Event_list, Month } from "../types";
import { display_event, display_month, display_next_event} from "../User_interface";

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

        display_month(month, Event_list, 1);
        
        expect(consoleSpy).toHaveBeenCalledWith("          ", "February", 2025);
        expect(consoleSpy).toHaveBeenCalledWith("   Mon Tue Wed Thu Fri Sat Sun");
    });

    it("should correctly highlight days with events", () => {
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
        display_month(month1, Event_array1, 1);

        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringMatching(/\x1b\[34m5\x1b\[0m/));
        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringMatching(/\x1b\[34m22\x1b\[0m/));
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
        expect(consoleSpy).toHaveBeenCalledWith("Desciption: Tandläkare");
    });
});