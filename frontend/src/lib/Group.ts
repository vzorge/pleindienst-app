import {GroupName} from '$lib/GroupName';

export type Group = {
    name: GroupName
    number: GroupNumber
};

export type GroupNumber = 1 | 2 | 3 | 4 | 5 | 6;

export function parseGroup(s: string): Group {
    if (s.length !== 3) throw new Error('Cannot parse GroupNumber ' + s);
    // @ts-ignore 
    const name = GroupName[s.substring(0,2).toUpperCase()];
    const number = parseInt(s.substring(2,3), 10) as GroupNumber;

    return {name, number};
}