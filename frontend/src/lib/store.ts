import {writable} from 'svelte/store';
import {Person} from './Person';
import {Groups} from './Groups';
import {MatchingResponse} from './MatchingResponse';
import { browser } from "$app/environment";

const personsKey = 'persons';
export const personStore = writable<Person[]>();
// if (browser) {
//     personStore.set(JSON.parse(localStorage.getItem(personsKey)))
//     personStore.subscribe(value => localStorage.setItem('person', JSON.stringify(value)));
// }

const groupKey = 'group';
export const groupStore = writable<Groups>();
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
