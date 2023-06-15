import {Person} from './Person';

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

export class Times {
    person: Person;
    amount: number;
}

export class MatchingResponse {
    matches: Match[]
    times: Times[]
}
