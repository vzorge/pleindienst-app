import {writable} from 'svelte/store';
import {Person} from './Person';
import {Groups} from './Groups';
import { MatchingResponse } from './MatchingResponse';
import { browser } from "$app/environment";
import {WeekDay} from './WeekDay';

const personsKey = 'persons';
export const startDate = writable<Date>();
export const endDate = writable<Date>();
export const persons = writable<Person[]>([{name: 'Roan', preference: [WeekDay.Maandag, WeekDay.Dinsdag]}, {name: 'Lias', preference: []}, {name: 'Jade', preference: []}]);
// if (browser) {
//     personStore.set(JSON.parse(localStorage.getItem(personsKey)))
//     personStore.subscribe(value => localStorage.setItem('person', JSON.stringify(value)));
// }

const groupKey = 'group';
export const group = writable<{name: Groups, number: number}>();
// if (browser) {
//     groupStore.set(Groups[localStorage.getItem(groupKey)]);
//     groupStore.subscribe(value => localStorage.setItem(groupKey, value));
// }

const resultKey = 'result';
export const resultStore = writable<MatchingResponse>();
// if (browser) {
//     resultStore.set(JSON.parse(localStorage.getItem(resultKey)));
//     groupStore.subscribe(value => localStorage.setItem(resultKey, JSON.stringify(value)));
// }
