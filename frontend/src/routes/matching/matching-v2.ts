import type { Match } from '$lib/MatchingResponse';
import type { CalculatePerson, DateLike, Person } from '$lib/Person';
import type { Times } from '$lib/Times';
import { splitArrayOn } from './arrayUtils.js';
import { hasFixedDates, hasPreference, isAllowedOnDay, tradeDays } from './matchingUtils.js';


export function matchV2(personArr: Person[], days: Date[]): [Match[], Times[]] {

    const [fixedDatePersons, nonFixedPersons] = splitArrayOn(personArr, p => hasFixedDates(p, days))
    let [remainingDays, fixedmatches] = planFixedDates(fixedDatePersons, days);

    const matches = [...fixedmatches, ...planEvenly(nonFixedPersons, remainingDays)]

    const times = calculateTimes(matches)

    return [matches, times];
}

function planEvenly(personArr: Person[], days: Date[]): Match[] {    
    const persons: CalculatePerson[] = personArr.map(p => ({...p, times: 0, nextDate: days[0], fraction: findFraction(p.startFrom, days)}))
        .sort((l, r) => (l.timesPast || 0) - (r.timesPast || 0))
    
    const totalCount = days.length + persons.reduce((nr, p) => nr += p.timesPast, 0);
    const totalFractions = persons.reduce((nr, p) => nr += p.fraction, 0);
    const [min, max] = [Math.floor(totalCount / totalFractions), Math.floor((totalCount / totalFractions) + 0.99)];
    
    console.log(`Should be between ${min} and ${max}`);
    
    let matches: Match[] = [];
    for (const date of days) {
        let pers: CalculatePerson = 
            persons
                .find(p => hasPreference(p, date) && isAllowedOnDay(p, date) && p.nextDate <= date && (p.timesPast + p.times) < min)
                || persons.find(p => p.nextDate <= date && isAllowedOnDay(p, date) && (p.timesPast + p.times) < min)
                || persons.find(p => (p.timesPast + p.times) < min && isAllowedOnDay(p, date)) 
                || persons.find(p => hasPreference(p, date) && isAllowedOnDay(p, date) && p.nextDate <= date && (p.timesPast + p.times) < max)
                || persons.find(p => p.nextDate <= date && isAllowedOnDay(p, date) && (p.timesPast + p.times) < max)
                || persons.find(p => (p.timesPast + p.times) < max && isAllowedOnDay(p, date))
                || persons.find(p => isAllowedOnDay(p, date))
                || persons[0]

        pers.times++;
        pers.nextDate = new Date(date);
        pers.nextDate.setDate(pers.nextDate.getDate() + 20); // TODO update to a better value

        matches.push({date, person: pers, happy: hasPreference(pers, date)});

        persons.sort((l, r) => l.nextDate.getTime() - r.nextDate.getTime());
    }


    matches = tradeDays(matches);

    return matches;
}


function calculateTimes(matches: Match[]): Times[] {
    const map: Map<Person, number> = matches.map(m => m.person).reduce((acc: Map<Person, number>, val: Person) => {
        acc.set(val, (acc.get(val) || 0) + 1);
        return acc;
    }, new Map<Person, number>());
    const times: Times[] = Array.from(map, ([person, amount]: [Person, number]) => ({ person, amount, total: (person.timesPast || 0) + amount }))
        .sort((l, r) => r.amount - l.amount);
    return times;
  }


function findFraction(startFrom: DateLike | undefined, dates: Date[]): number {
    if (!startFrom) return 1;

    const fromDate = new Date(startFrom);

    if (fromDate > dates[dates.length - 1]) return 0;
    if (fromDate <= dates[0]) return 1;

    const idx = dates.findIndex((val, idx, arr) => val === fromDate || (val < fromDate && arr[idx] > fromDate));

    return dates.length / (idx + 1);
}

function planFixedDates(persons: Person[], days: Date[]): [Date[], Match[]] {
    let matches: Match[] = [];
    let remainingDays = [...days];
    for (const person of persons) {
        for (const dateLike of person.fixedDates || []) {
            const idx = remainingDays.findIndex(d => d.getTime() === new Date(dateLike).getTime());
            if (idx > -1) {
                matches.push({date: new Date(dateLike), person, happy: true});
                remainingDays.splice(idx, 1);
            } else {
                console.log(`Datum ${dateLike} is niet een correcte overblijfdag`);
            }
        }
    }
    
    return [remainingDays, matches];
}