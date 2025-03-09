"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONTH_LENGTHS = exports.NAMES_MONTHS = exports.NAMES_WEEKDAYS = exports.SUNDAY = exports.SATURDAY = exports.FRIDAY = exports.THURSDAY = exports.WEDNESDAY = exports.TUESDAY = exports.MONDAY = void 0;
exports.MONDAY = 1;
exports.TUESDAY = 2;
exports.WEDNESDAY = 3;
exports.THURSDAY = 4;
exports.FRIDAY = 5;
exports.SATURDAY = 6;
exports.SUNDAY = 7;
exports.NAMES_WEEKDAYS = [
    "",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];
exports.NAMES_MONTHS = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
// do not use directly, use month_length() from month.ts as it handles february on leap years properly
exports.MONTH_LENGTHS = [
    0,
    31,
    28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
];
