import {WeekDay} from '$lib/WeekDay';

export type Person = {
    name: Name
    preference: WeekDay[]
    startFrom?: Date
    fixedDates?: Date[]
}

export type Name = string;
