import {GroupName} from '$lib/GroupName';

export type Group = {
    name: GroupName
    number: GroupNumber
};

export type GroupNumber = 1 | 2 | 3 | 4 | 5 | 6;
