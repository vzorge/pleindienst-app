import {createEvents, type EventAttributes} from 'ics';
import type { OverblijfTijd } from './data/overblijftime';
import type { Person } from './Person';

export async function downloadCalendarEvent(events: EventAttributes[], person: Person) {

    const filename = `Calendar-${person.name}.ics`;
    const file: File = await new Promise((resolve, reject) => {
            let {error, value} = createEvents(events);
            if (error) {
                reject(error);
            }
            resolve(new File([value!], filename, {type: 'text/calendar'}));
        });
    
    const url = URL.createObjectURL(file);

    // trying to assign the file URL to a window could cause cross-site
    // issues so this is a workaround using HTML5
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    URL.revokeObjectURL(url);
}


export function createCalendarEvent(date: Date, timeSlot: OverblijfTijd): EventAttributes {

    return {
        start: [date.getFullYear(), date.getMonth() + 1, date.getDate(), timeSlot.van[0], timeSlot.van[1]],
        end: [date.getFullYear(), date.getMonth() + 1, date.getDate(), timeSlot.tot[0], timeSlot.tot[1]],
        startInputType: 'local',
        endInputType: 'local',
        title: 'Overblijfdienst Montessori Leidschenveen',
        description: 'Pleindienst voor de Montessori Leidscheveen. Als deze tijd u niet schikt, dit graag onderling ruilen',
        location: 'Cicerostrook 1 2493 ZL Den Haag',
        status: 'CONFIRMED',
        alarms: [
            { action: 'display', description: 'Reminder', trigger: { hours: 24, minutes: 0, before: true } },
            { action: 'display', description: 'Reminder', trigger: { hours: 0, minutes: 30, before: true } },
        ]
    };
}