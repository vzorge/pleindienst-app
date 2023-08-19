import type {Person} from './Person';
import type {Times} from '$lib/Times';
import type {Group} from '$lib/Group';

export class Match {
    date: Date;
    person: Person;
    happy: boolean;

    constructor(match: Match) {
        this.date = new Date(match.date);
        this.person = match.person;
        this.happy = match.happy;
    }
}

export type MatchingResponse = {
    matches: Match[]
    times: Times[]
    group: Group
}
