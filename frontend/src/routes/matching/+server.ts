import type {DateLike, Person} from '$lib/Person';
import {toDate} from '$lib/Person';
import {json} from '@sveltejs/kit';
import {Match} from '$lib/MatchingResponse';
import type {Times} from '$lib/Times';
import type {Group} from '$lib/Group';
import {getAvailableDates} from '$lib/data/dates';

export async function POST({ request }) {
    const data: {group: Group, persons: Person[]} = await request.json();
    const fixedDays = getAvailableDates(data.group.name);
    const [matches, times] = match(data.persons, fixedDays);

    return json({matches, times, group: data.group}, {status: 200});
}

function match(personArr: Person[], days: Date[]): [Match[], Times[]] {
    const [later, persons] = splitArrayOn(personArr, p => !!p.startFrom && toDate(p.startFrom) > days[0]);

    const matches = matchDays(days, {later, persons}).sort((l, r) => l.date.getTime() - r.date.getTime());

    const map = matches.map(m => m.person).reduce((acc: Map<Person, number>, val: Person) => {
        acc.set(val, (acc.get(val) || 0) + 1);
        return acc;
    }, new Map<Person, number>());
    const times: Times[] = Array.from(map, ([person, amount]) => ({person, amount}))
        .sort((l, r) => r.amount - l.amount);

    return [matches, times];
}


function matchDays(allDates: Date[], {later, persons}: {later: Person[], persons: Person[]}) {
    if (allDates.length === 0) {
        return [];
    }

    persons = [...persons];

    if (later.length > 0) {
        const lastDay: Date = allDates[Math.min(allDates.length - 1, persons.length)];
        for (let i = later.length - 1; i >= 0; i--) {
            const laterPerson = later[i];
            if (toDate(laterPerson.startFrom) <= lastDay) {
                persons.push(laterPerson);
                later.splice(i, 1);
            }
        }
    }

    const [dates, remainingDates] = splitArray(allDates, persons.length);

    let matchedDates: Match[] = [];

    const [fixedDatePersons, nonFixedPersons] = splitArrayOn(persons, p => hasFixedDates(p, dates))

    for (const person of fixedDatePersons) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const matches = intersect(person.fixedDates!, dates);
        matches.forEach(match => {
            matchedDates.push({date: match, person, happy: true});
            dates.splice(dates.indexOf(match), 1);

        })
    }

    for (const person of nonFixedPersons) {
        if (dates.length === 0 ) {
            break;
        }

        if (person.preference.length === 0 && isAllowedOnDay(person, dates[0])) {
            const date = dates.shift();
            if (date) matchedDates.push({date, person, happy: true});
        } else {
            const preferredDate = findPreferredDate(person, dates);
            if (preferredDate) {
                matchedDates.push({date: preferredDate, person, happy: true});
            } else {
                const firstAvailableIndex = dates.findIndex(d => isAllowedOnDay(person, d));
                if (firstAvailableIndex > -1) {
                    const date = dates.splice(firstAvailableIndex, 1)[0];
                    if (date) matchedDates.push({date, person, happy: false});
                }
            }
        }
    }
    matchedDates = tradeDays(matchedDates);

    if (dates.length > 0) {
        console.log('There were dates left, someone must not be allowed to start yet and someone else took their place at the end of the queue');
    }

    const allHappy = matchedDates.every(m => m.happy);
    if (!allHappy) {
        shuffleArray(persons);
    }

    if (remainingDates.length > 0 || dates.length > 0) {
        return [...matchedDates, ...matchDays([...dates, ...remainingDates], {later, persons})];
    }
    return matchedDates;
}

function findPreferredDate(person: Person, dates: Date[]) {
    for (let i = 0; i < dates.length; i++) {
        if (hasPreference(person, dates[i]) && isAllowedOnDay(person, dates[i])) {
            return dates.splice(i, 1)[0];
        }
    }
    return undefined;
}


function tradeDays(matched: Match[]): Match[] {
    function canTrade(person1: Person, date1: Date, person2: Person, date2: Date, happyOnOtherDay: boolean, p2Happy: boolean) {
        return hasPreference(person1, date2)
            && person1.name !== person2.name
            && isAllowedOnDay(person1, date2)
            && isAllowedOnDay(person2, date1)
            && !hasFixedDates(person2, [date2])
            && (happyOnOtherDay || !p2Happy);
    }

    const fixedMatched = [...matched];
    for (let i = 0; i < fixedMatched.length; i++) {
        const {date, person, happy}: Match = fixedMatched[i];
        if (!happy) {
            for (let j = 0; j < fixedMatched.length; j++) {
                const {date: day2, person: person2, happy: p2Happy} = fixedMatched[j];
                const happyOnOtherDay = hasPreference(person2, date);
                if (canTrade(person, date, person2, day2, happyOnOtherDay, p2Happy)) {
                    fixedMatched[i] = {date, person: person2, happy: happyOnOtherDay};
                    fixedMatched[j] = {date: day2, person, happy: true};
                    if (!happyOnOtherDay) {
                        i--; // Reset i to try to find a day for the person that is now not happy.
                    }
                    break;
                }
            }
        }
    }
    return fixedMatched;
}

function hasPreference(person: Person, day: Date): boolean {
    return person.preference.length === 0 || person.preference.includes(day.getDay());
}

function isAllowedOnDay(person: Person, day: Date) {
    return !person.startFrom || day >= toDate(person.startFrom);
}

function intersect(fixedDates: DateLike[], dates: Date[]): Date[] {
    const matches = [];
    for (const fixedDate of fixedDates) {
        const match = dates.find(d => d.getTime() === new Date(fixedDate).getTime());
        if (match) {
            console.log('match found');
            matches.push(match);
        }
    }
    return matches;
}

function splitArray(allDates: Date[], desiredLength: number): [Date[], Date[]] {
    const length = Math.min(allDates.length, desiredLength);
    const split = allDates.splice(0, length);

    return [split, allDates];
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function splitArrayOn<T>(arr: T[], func: (val: T) => boolean): [T[], T[]] {
    const truth = [];
    const falsy = [];

    arr.forEach(t => {
        (func(t) ? truth : falsy).push(t);
    });

    return [truth, falsy];
}

function hasFixedDates(p: Person, dates: Date[]) {
    return !!p.fixedDates && intersect(p.fixedDates, dates).length > 0;
}
