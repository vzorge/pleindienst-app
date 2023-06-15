export enum WeekDay {
    Maandag = 1, Dinsdag = 2, Donderdag = 4, Vrijdag = 5
}

const dayMap = {
    1: 'Maandag',
    2: 'Dinsdag',
    4: 'Donderdag',
    5: 'Vrijdag'
}

export function convertStrToWeekDay(weekDay: string): number {
    switch (weekDay) {
        case 'Maandag':
            return WeekDay.Maandag;
        case 'Dinsdag':
            return WeekDay.Dinsdag;
        case 'Donderdag':
            return WeekDay.Donderdag;
        case 'Vrijdag':
            return WeekDay.Vrijdag;
    }
}

export function convertWeekDayToStr(nr: WeekDay | number): string {
    return dayMap[nr];
}
