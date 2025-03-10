import * as fs from 'fs';
import { write_events_to_file, append_event_to_file, add_events_from_file } from '../file'; // Adjust path
import type { Event, Event_list, Hashtable, User } from '../types';
import { ht_add_event } from '../hashtable';
import { init_hashtable } from '../backend';

// Mock the fs module to avoid real file operations
jest.mock('fs');

describe("File Operations", () => {
    let users: Array<User>;
    let mockEvent: Event;
    let filename = "test_events.txt";
    let ht = init_hashtable();

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();

        mockEvent = {
            day: 14,
            month: 4,
            year: 2025,
            time_start: 1200,
            time_end: 1230,
            description: "Dentist Appointment"
        };

        users = [
            {
                username: "user1",
                eventlist: {
                    base_year: 2025,
                    base_month: 4,
                    events: [[mockEvent]]
                }
            }
        ];
    });

    test("write_events_to_file should write events to file", () => {
        const mock_write_file_sync = jest.spyOn(fs, "writeFileSync").mockImplementation();
        
        const result = write_events_to_file(users, filename);

        expect(mock_write_file_sync).toHaveBeenCalledWith(expect.any(String), expect.stringContaining("user1, 2025, 4, 14"));
        expect(result).toBe(0);
    });

    test("append_event_to_file should append event to file", () => {
        const mock_append_file_sync = jest.spyOn(fs, "appendFileSync").mockImplementation();

        const result = append_event_to_file(mockEvent, "user1", filename);

        expect(mock_append_file_sync).toHaveBeenCalledWith(expect.any(String), expect.stringContaining("user1, 2025, 4, 14"));
        expect(result).toBe(0);
    });

    test("add_events_from_file should return error when file read fails", () => {
        jest.spyOn(fs, "readFileSync").mockImplementation(() => {
            throw new Error("File not found");
        });

        const result = add_events_from_file({} as Hashtable, users, filename);
        expect(result).toBe(1);
    });

    test("add_events_from_file should parse events correctly", () => {
        const mock_data = "user1, 2025, 4, 14, 12:00, 12:30, \"Dentist Appointment\"\n";
        jest.spyOn(fs, "readFileSync").mockReturnValue(mock_data);



        const result = add_events_from_file(ht, users, filename);

        expect(result).toBe(0);
    });

    test("add_events_from_file should handle a user with no events", () => {
        // Create input representing a user with no events.
        const mockData = "!user2\n";
        jest.spyOn(fs, "readFileSync").mockReturnValue(mockData);

        // Create a fresh hashtable and users array.
        const localHT = init_hashtable();
        const localUsers: Array<User> = [];

        const result = add_events_from_file(localHT, localUsers, filename);
        expect(result).toBe(0);
        // Check that user2 has been added.
        const user2 = localUsers.find(u => u.username === "user2");
        expect(user2).toBeDefined();
    });
});
