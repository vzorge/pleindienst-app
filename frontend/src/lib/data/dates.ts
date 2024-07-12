import availableDates from './availableDates.json';
import vacationDates from './vacationDates.json';
import {GroupName} from '$lib/GroupName';
import {WeekDay} from '$lib/WeekDay';

const OB_START_DATE = new Date('2024-09-30');
const OB_END_DATE = new Date('2025-01-31');

export function getAvailableDates(groupName: GroupName) {
    return availableDates
        .map(d => new Date(d))
        .filter(date => {
            return groupName === GroupName.OB ? isOBDate(date) && date.getDay() !== WeekDay.Vrijdag : true;
        });
}

export function getVacationDates(groupName: GroupName): {date: Date, reason: string}[] {
    function regularFridays() {
        return availableDates.map(d => ({date: new Date(d), reason: ''})).filter(vac => vac.date.getDay() === WeekDay.Vrijdag);
    }
    const extraDates = groupName === GroupName.OB ? [...regularFridays(), ...vacationDates] : vacationDates;

    return extraDates
        .map(d => ({...d, date: new Date(d.date)}))
        .filter(vd => {
            return groupName === GroupName.OB ? isOBDate(vd.date) : true;
        });
}

function isOBDate(date: Date) {
    return date.getTime() > OB_START_DATE.getTime() && date.getTime() <= OB_END_DATE.getTime();
}
