import { make_event } from "../events";
import { ht_add_event, ht_delete_event, ht_entry_exists, ht_get_event_list, init_hashtable } from "../hashtable";
import { get_current_date, get_current_month, get_current_year } from "../time_date";
import { User } from "../types";
import { find_next_event } from "../User_interface";

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
});

describe("ht_entry_exist", () =>{
    let hash = init_hashtable();

    it("should return false if there is no user", () => {
        expect(ht_entry_exists(hash, "user")).toBe(false);
    });
});

describe("ht_add_event", () =>{
    let hash = init_hashtable();
    let users: Array<User> = [];

    it("Should be able to add a user without an event", () =>{
        ht_add_event(hash, users, "user");

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
});

describe("ht_delete_event", () => {
    it("should remove a user from users", () =>{
        let hash = init_hashtable();
        let users: Array<User> = [];
        ht_add_event(hash, users, "user");

        ht_delete_event(hash, users, "user");
        expect(ht_entry_exists(hash, "user")).toBe(false)

    })
});