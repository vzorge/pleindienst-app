import {WeekDay} from '$lib/WeekDay';

export class Person {
    name: string
    preference: WeekDay[]
}

export function hasPreference(person: Person, day: Date): boolean {
    return person.preference.length === 0 || person.preference.includes(day.getDay());
}
