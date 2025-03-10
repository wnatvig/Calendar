import { make_event, make_event_list, add_event_to_event_list, 
    delete_event_from_event_list 
} from "../events";
import { ht_add_event, ht_delete_event, ht_entry_exists, ht_get_event_list } from "../hashtable";
import { init_hashtable } from '../backend';
import { get_current_date, get_current_month, get_current_year } from "../time_date";
import { Hashtable, User } from "../types";
import { find_next_event } from "../User_interface";
import * as fileModule from "../file";

describe("Hash_init", () => {
    it("should produce an array of length hash.table_size", () => {
        const hash = init_hashtable();

        expect(hash.table.length).toBe(hash.table_size);
    });

    it("should produce an array where all values are null", () =>{
        const hash = init_hashtable();

        for(let x of hash.table){
            expect(x).toBeNull();
        }
    });

    it("should compute hash value for a given string", () => {
        const ht = init_hashtable();

        // For example, for "abc":
        // Calculation: 0*31 + 97 = 97, then 97*31+98 = 3105, then 3105*31+99 = 96354.
        const hashValue = ht.hash("abc");
        expect(hashValue).toBe(96354);
      });
});


describe("ht_entry_exist", () =>{
    let hash = init_hashtable();
    let users: Array<User> = [];

    it("should return false if there is no user", () => {
        expect(ht_entry_exists(hash, "user")).toBe(false);
    });

    it("should return true if user exists", () => {
        ht_add_event(hash, users, "user");
        expect(ht_entry_exists(hash, "user")).toBe(true);
      });
});

describe("ht_add_event", () =>{
    let hash: Hashtable;
    let users: Array<User>;

    beforeEach(() => {
        hash = init_hashtable();
        users = [];
        jest.spyOn(console, "log").mockImplementation(() => {});
    });
      
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("Should be able to add a user without an event", () =>{
        ht_add_event(hash, users, "user");
        expect(users.length).toBe(1)
        expect(ht_entry_exists(hash, "user")).toBe(true);
    });

    it("Shouldbe able to add an event to an existing user", () =>{
        ht_add_event(hash,users, "user");
        let event1 = make_event(get_current_date(), 
                                get_current_month(), 
                                get_current_year(), 
                                1200, 
                                1200, "Tandläkare"); 
        ht_add_event(hash,users,"user", event1);
        let event_list = ht_get_event_list(hash,users, "user");
        if(event_list !== null){
        expect(find_next_event(event_list)).toStrictEqual(event1);
        } 
    });
    
    it("should log a message if adding an event fails (returns 1)", () => {
        // Stub add_event_to_event_list to simulate failure.
        const spyAddEvent = jest
          .spyOn(require("../events"), "add_event_to_event_list")
          .mockReturnValue(1);
        const fakeEvent = make_event(5, 1, 2020, 900, 1000, "Too old event");
        ht_add_event(hash, users, "dave", fakeEvent);
        expect(console.log).toHaveBeenCalledWith(
          `cannot add event at 2020-1-5 'Too old event' because it has an earlier date than base date for this user: dave with base date at ${users[0].eventlist.base_year}-${users[0].eventlist.base_month} --- skipping event`
        );
        spyAddEvent.mockRestore();
      });
});

describe("ht_delete_event", () => {
    let hash:Hashtable, users:Array<User>;
    beforeEach(() => {
      hash = init_hashtable();
      users = [];
      jest.spyOn(console, "log").mockImplementation(() => {});
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should remove a user from users", () =>{
        ht_add_event(hash, users, "user");

        ht_delete_event(hash, users, "user");
        expect(ht_entry_exists(hash, "user")).toBe(false)

    });

    it("should log a message if event deletion fails", () => {
        // Add a user and then attempt to delete a non-existent event.
        const event = make_event(10, 5, 2025, 1200, 1300, "Non-existent event");
        ht_add_event(hash, users, "eve", make_event(15, 5, 2025, 1000, 1100, "Existing event"));
        // Stub delete_event_from_event_list to return a nonzero value.
        const spyDelEvent = jest
          .spyOn(require("../events"), "delete_event_from_event_list")
          .mockReturnValue(2);
        ht_delete_event(hash, users, "eve", event);
        expect(console.log).toHaveBeenCalledWith(
          `event at 2025-5-10 'Non-existent event' cannot be deleted: does not exist in event list`
        );
        spyDelEvent.mockRestore();
      });
    
    it("should delete a user if no event is provided", () => {
        ht_add_event(hash, users, "user", make_event(20, 6, 2025, 900, 1000, "Event"));
        expect(ht_entry_exists(hash, "user")).toBe(true);
        ht_delete_event(hash, users, "user");
        expect(ht_entry_exists(hash, "user")).toBe(false);
        expect(users.length).toBe(0);
    });
});
