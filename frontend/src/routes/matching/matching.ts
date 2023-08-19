import type { Match } from '$lib/MatchingResponse';
import { toDate, type Person } from '$lib/Person';
import type { Times } from '$lib/Times';
import { shuffleArray, splitArray, splitArrayOn } from './arrayUtils.js';
import { hasFixedDates, hasPreference, intersect, isAllowedOnDay, tradeDays } from './matchingUtils.js';


export function match(personArr: Person[], days: Date[]): [Match[], Times[]] {
  const [later, persons] = splitArrayOn(personArr, p => !!p.startFrom && toDate(p.startFrom)! > days[0]);
  shuffleArray(persons);

  const matches = matchDays(days, {later, persons}).sort((l, r) => l.date.getTime() - r.date.getTime());

  const times: Times[] = calculateTimes(matches);

  return [matches, times];
}


function calculateTimes(matches: Match[]): Times[] {
  const map: Map<Person, number> = matches.map(m => m.person).reduce((acc: Map<Person, number>, val: Person) => {
      acc.set(val, (acc.get(val) || 0) + 1);
      return acc;
  }, new Map<Person, number>());
  const times: Times[] = Array.from(map, ([person, amount]) => ({ person, amount }))
      .sort((l, r) => r.amount - l.amount);
  return times;
}

function matchDays(allDates: Date[], {later, persons}: {later: Person[], persons: Person[]}): Match[] {
  if (allDates.length === 0) {
      return [];
  }

  persons = [...persons];

  if (later.length > 0) {
      const lastDay: Date = allDates[Math.min(allDates.length - 1, persons.length)];
      for (let i = later.length - 1; i >= 0; i--) {
          const laterPerson = later[i];
          const startFromDate = toDate(laterPerson.startFrom);
          if (startFromDate && startFromDate <= lastDay) {
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