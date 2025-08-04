import type { Group } from '$lib/Group';
import type { Person } from '$lib/Person';
import { getAvailableDates } from '$lib/data/dates';
import { json } from '@sveltejs/kit';
import { match } from './matching-v2.js';

export async function POST({ request }: {request: Request}) {
    const data: {group: Group, persons: Person[]} = await request.json();
    const fixedDays = getAvailableDates(data.group.name);
    const [matches, times] = match(data.persons, fixedDays);

    return json({matches, times, group: data.group}, {status: 200});
}





