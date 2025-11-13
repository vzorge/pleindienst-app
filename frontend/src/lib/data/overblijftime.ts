import type { Group } from "$lib/Group";
import { WeekDay } from "$lib/WeekDay";

type Slots = 'early' | 'mid' | 'late' | 'midFriday' | 'lateFriday';

const data: {[key: string]: {[key: string]: string[]}} = {
    [WeekDay.Maandag]: {
        'early': ['OB1','OB2','MB3','BB1','BB4'],
        'mid': ['OB3','MB2','MB5','BB5','BB6'],
        'late': ['OB4','OB5','MB1','MB4','BB2','BB3']
    },
    [WeekDay.Dinsdag]: {
        'early': ['OB4','OB2','MB2','BB2','BB5'],
        'mid': ['OB3','OB5','MB1','MB3','BB1','BB3'],
        'late': ['OB1','MB4','MB5','BB4','BB6']
    },
    [WeekDay.Donderdag]:{
        'early': ['OB5','MB1','MB5','BB2','BB6'],
        'mid': ['OB2','OB3','MB3','BB3','BB4'],
        'late': ['OB1','OB4','MB2','MB4','BB1','BB5']
    },
    [WeekDay.Vrijdag]:{
        'early': [],
        'midFriday': ['MB1','MB2','MB3','BB1','BB5','BB4'],
        'lateFriday': ['MB4','MB5','BB3','BB2','BB6']
    },
}

export type OverblijfTijd = {
    van: [number, number]
    tot: [number, number]
};

class TimeSlot {
    public static early: OverblijfTijd = {van: [11,30], tot: [12,0]};
    public static mid: OverblijfTijd = {van: [12,0], tot: [12,30]};
    public static late: OverblijfTijd = {van: [12,30], tot: [13,0]};
    public static midFriday: OverblijfTijd = {van: [12,15], tot: [12,45]};
    public static lateFriday: OverblijfTijd = {van: [12,45], tot: [13,15]};
}

export function overblijftijd(group: Group, day: WeekDay): OverblijfTijd {
   for (let [slot, groups] of Object.entries(data[day])) {
        if (groups.includes(group.name+group.number)) {
            switch(slot as Slots) {
                case "early": return TimeSlot.early;
                case "mid": return TimeSlot.mid;
                case "late": return TimeSlot.late;
                case "midFriday": return TimeSlot.midFriday;
                case "lateFriday": return TimeSlot.lateFriday;
            }
        }
   }

   console.log(`Geen tijdslot gevonden voor ${group.name+group.number} op ${day}`);
   throw new Error();
}

export function overblijfTijdToReadableFormat(overblijf: OverblijfTijd) {
    return `${overblijf.van[0]}:${String(overblijf.van[1]).padStart(2, '0')} - ${overblijf.tot[0]}:${String(overblijf.tot[1]).padStart(2, '0')}`;
}


