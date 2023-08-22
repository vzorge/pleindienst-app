import type { Match } from "$lib/MatchingResponse";
import { toDate, type Person, type DateLike } from "$lib/Person";

export function tradeDays(matched: Match[]): Match[] {
  function canTrade(person1: Person, date1: Date, person2: Person, date2: Date, happyOnOtherDay: boolean, p2Happy: boolean) {
      return hasPreference(person1, date2)
          && person1.name !== person2.name
          && isAllowedOnDay(person1, date2)
          && isAllowedOnDay(person2, date1)
          && !hasFixedDates(person2, [date2])
          && (happyOnOtherDay || !p2Happy);
  }

  const tradeRange = 8;

  const fixedMatched = [...matched];
  for (let i = 0; i < fixedMatched.length; i++) {
      const {date, person, happy}: Match = fixedMatched[i];
      if (!happy) {
          for (let j = Math.max(0, i - tradeRange); j < Math.min(fixedMatched.length, i + tradeRange); j++) {
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

export function intersect(fixedDates: DateLike[], dates: Date[]): Date[] {
  const matches = [];
  for (const fixedDate of fixedDates) {
      const match = dates.find(d => d.getTime() === new Date(fixedDate).getTime());
      if (match) {
          matches.push(match);
      }
  }
  return matches;
}

export function hasPreference(person: Person, day: Date): boolean {
  return person.preference.length === 0 || person.preference.includes(day.getDay());
}

export function isAllowedOnDay(person: Person, day: Date) {
  const startFrom = toDate(person.startFrom)
  return !startFrom || day >= startFrom;
}

export function hasFixedDates(p: Person, dates: Date[]) {
  return !!p.fixedDates && intersect(p.fixedDates, dates).length > 0;
}
