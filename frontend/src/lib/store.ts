import {writable} from 'svelte/store';
import {MatchingResponse} from './MatchingResponse';
import {localStorageStore} from '@skeletonlabs/skeleton';
import {Groups} from '$lib/Groups';
import {Person} from '$lib/Person';

export const startDate = writable<Date>();
export const endDate = writable<Date>();
export const persons = localStorageStore<Person[]>('persons', []);

export const group = localStorageStore<{name?: Groups, number?: number}>('group', {});

export const resultStore = localStorageStore<MatchingResponse>('result', {matches: [], times: []});
