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

    test("delete_event_from_event_list", () =>{
        let event_list: Event_list = make_event_list(2025, 1, []);
        const event: Event = make_event(4, 9, 2025, 2400, 2359, "Birthday");

        add_event_to_event_list(event, event_list);
        delete_event_from_event_list(event, event_list);
        const month_index = 8;
        
        expect(event_list.events.length).toBeGreaterThan(month_index);
        expect(event_list.events[month_index]).not.toContainEqual(event);
    })

});
