"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_current_year = get_current_year;
exports.get_current_month = get_current_month;
exports.get_current_date = get_current_date;
exports.get_current_weekday = get_current_weekday;
function get_current_year() {
    var date = new Date();
    return date.getFullYear();
}
function get_current_month() {
    var date = new Date();
    return date.getMonth() + 1;
}
function get_current_date() {
    var date = new Date();
    return date.getDate();
}
function get_current_weekday() {
    var date = new Date();
    var d = date.getDay();
    if (d === 0)
        d = 7;
    return d;
}
