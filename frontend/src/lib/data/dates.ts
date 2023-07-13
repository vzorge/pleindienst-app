import availableDates from './availableDates.json';
import vacationDates from './vacationDates.json';
import {GroupName} from '$lib/GroupName';

const OB_END_DATE = new Date('2024-02-02');

export function getAvailableDates(groupName: GroupName) {
    return availableDates
        .map(d => new Date(d))
        .filter(date => {
            return groupName === GroupName.OB ? date.getTime() <= OB_END_DATE.getTime() : true;
        });
}

export function getVacationDates(groupName: GroupName) {
    return vacationDates
        .map(d => ({...d, date: new Date(d.date)}))
        .filter(vd => {
            return groupName === GroupName.OB ? vd.date.getTime() <= OB_END_DATE.getTime() : true;
        });
}
