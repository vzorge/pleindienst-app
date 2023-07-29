import {MatchingResponse} from './MatchingResponse';
import {localStorageStore} from '@skeletonlabs/skeleton';
import type {Person} from '$lib/Person';
import type {Group} from '$lib/Group';

export const persons = localStorageStore<Person[]>('persons', []);

export const group = localStorageStore<Group>('group', {} as Group);

export const resultStore = localStorageStore<MatchingResponse | undefined>('result', undefined, {
    serializer: {
        parse: (text: string) => (text && text === 'undefined') ? undefined : JSON.parse(text) as MatchingResponse,
        stringify: (object: MatchingResponse | undefined): string => object ? JSON.stringify(object) : 'undefined'
    }
});
