import { make_event, make_event_list, add_event_to_event_list, delete_event_from_event_list } from "../events";
import { Event, Event_list } from "../types";

describe("Event Functions", () => {
    
    test("make_event:", () => {
        const event: Event = make_event(28, 2, 2025, 1315, 1500, "Math");

        expect(event).toEqual({
            day: 28,
            month: 2,
            year: 2025,
            time_start: 1315,
            time_end: 1500,
            description: "Math",
        });
    });

    test("make_event_list:", () => {
        const event_list: Event_list = make_event_list(2025, 1, []);

        expect(event_list).toEqual({
            base_year: 2025,
            base_month: 1,
            events: [],
        });
    });

    test("add_event_to_event_list:", () => {
        let event_list: Event_list = make_event_list(2025, 1, []);
        const event: Event = make_event(4, 9, 2025, 2400, 2359, "Birthday");

        add_event_to_event_list(event, event_list);

        const month_index = 8; // september är nionde (index 8 när jan = index 0)
        expect(event_list.events.length).toBeGreaterThan(month_index);
        expect(event_list.events[month_index]).toContainEqual(event);
    });

    test("add_event_to_event_list when the event is to early", ()=> {
        const eventList: Event_list = make_event_list(2025, 5, []);
        const event1 = make_event(15, 4, 2025, 1000, 1100, "Meeting");
        const ret = add_event_to_event_list(event1, eventList);
        expect(ret).toBe(1);
        // Ensure that the event list remains unmodified.
        expect(eventList.events.length).toBe(0);
    });

    test("delete_event_from_event_list", () =>{
        let event_list: Event_list = make_event_list(2025, 1, []);
        const event: Event = make_event(4, 9, 2025, 2400, 2359, "Birthday");

        add_event_to_event_list(event, event_list);
        delete_event_from_event_list(event, event_list);
        const month_index = 8;
        
        expect(event_list.events.length).toBeGreaterThan(month_index);
        expect(event_list.events[month_index]).not.toContainEqual(event);
    });

    test("delete_event_from_event_list returns 1 for negative month index", () => {
        // Base event list with base month May 2025.
        // An event in April 2025 gives a negative month index.
        const eventList: Event_list = make_event_list(2025, 5, []);
        const event = make_event(15, 4, 2025, 1000, 1100, "Meeting");
        const ret = delete_event_from_event_list(event, eventList);
        expect(ret).toBe(1);
    });

    test("delete_event_from_event_list returns 2 when events array is undefined", () => {
        // Base event list with base month January 2025.
        // For an event in May 2025, no events array has been created (index 4 remains undefined).
        const eventList: Event_list = make_event_list(2025, 1, []);
        const event = make_event(10, 5, 2025, 900, 1000, "Workshop");
        const ret = delete_event_from_event_list(event, eventList);
        expect(ret).toBe(2);
    });

    test("delete_event_from_event_list returns 2 when event does not exist in non-empty events array", () => {
        const eventList: Event_list = make_event_list(2025, 1, []);
        const event1 = make_event(4, 9, 2025, 2400, 2359, "Birthday");
        add_event_to_event_list(event1, eventList);


        const event2 = make_event(5, 9, 2025, 1000, 1100, "Meeting");
        const ret = delete_event_from_event_list(event2, eventList);

        expect(ret).toBe(2);
        const monthIndex = 8;
        expect(eventList.events[monthIndex]).toContainEqual(event1);
    });

});
