import type {Person} from './Person';
import type {Times} from '$lib/Times';

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

export class MatchingResponse {
    matches: Match[]
    times: Times[]
}
