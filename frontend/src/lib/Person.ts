import type {WeekDay} from '$lib/WeekDay';

export type Person = {
    name: Name
    preference: WeekDay[]
    startFrom?: DateLike
    fixedDates?: DateLike[]
    timesPast: number
}

export type Name = string;
export type DateLike = string;

export function toDate(dateLike: DateLike | undefined) {
    return dateLike ? new Date(dateLike) : undefined;
}

export type CalculatePerson = Person & {
    nextDate: Date
    fraction: number
    times: number
}