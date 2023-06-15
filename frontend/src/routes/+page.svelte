<script lang="ts">
    import {modalStore, RadioGroup, RadioItem, tableMapperValues} from '@skeletonlabs/skeleton';
    import ChildInputComponent from './ChildInputComponent.svelte';
    import {Person} from '$lib/Person';
    import {convertWeekDayToStr, WeekDay} from '$lib/WeekDay';
    import {Groups} from '$lib/Groups.js';
    import {MatchingResponse} from '$lib/MatchingResponse';
    import {endDate, group, persons, resultStore, startDate} from '$lib/store';
    import { goto } from '$app/navigation'

    const mbBbWeekDays = [WeekDay.Maandag, WeekDay.Dinsdag, WeekDay.Donderdag, WeekDay.Vrijdag];
    const obBbWeekDays = [WeekDay.Maandag, WeekDay.Dinsdag, WeekDay.Donderdag];

    // let startDate, endDate;
    $startDate;
    $endDate;
    $group;
    $persons;

    // let persons: Person[] = [{name: 'Roan', preference: [WeekDay.Maandag, WeekDay.Dinsdag]}, {name: 'Lias', preference: []}, {name: 'Jade', preference: []}];
    $: availableWeekDays = $group === Groups.OB ? obBbWeekDays : mbBbWeekDays;

    function openChildDialog() {
        new Promise<Person[]>((resolve) => {
            const modalChildrenInput = {
                ref: ChildInputComponent,
                props: {persons: $persons}
            }
            modalStore.trigger({
                type: 'component',
                component: modalChildrenInput,
                response: (r: Person[]) => {
                    resolve(r);
                }
            })
        }).then((r: Person[]) => {
            $persons = r;
        });
    }

    function toggleDay(person: Person, day: WeekDay) {
        const idx = person.preference.indexOf(day);

        if (idx > -1) {
            person.preference.splice(idx, 1);
        } else {
            person.preference.push(day);
        }
        $persons = $persons;
    }

    async function getResults() {
        const body = {
            persons: $persons.map(p => ({name: p.name, preferences: p.preference})),
            days: getDateRange()
        }

        const response = await fetch('api/', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            // TODO foutafhandeling
        }
        response.json().then((response : MatchingResponse) => {
            const sortedMatches = response.matches.sort((l, r) => new Date(l.date).getTime() - new Date(r.date).getTime());
            resultStore.set({matches: sortedMatches, times: response.times});
            goto('/result');
        }, reason => {
            //TODO error handling
        })
    }

    function getDateRange(): Date[] {
        var dateArray = [];
        var currentDate = new Date($startDate);
        const end = new Date($endDate);
        while (currentDate <= end) {
            const weekDay: WeekDay = currentDate.getDay();
            console.log(`WeekDay ${weekDay} of date ${currentDate.getDay()}`);
            if (availableWeekDays.indexOf(weekDay) > -1) {
                dateArray.push(new Date (currentDate));
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dateArray;
    }

</script>

<div class="container mx-auto flex grow justify-center items-start mt-10">
    <div class="space-y-5 flex flex-col">
        <p>Kies de start en einddatum en vul de namen en voorkeuren in van de kinderen.</p>

        <label class="label">
            <span>Voor welke datums geld het?</span>
            <div class="input-group grid-cols-2 gap-8 px-5 py-3" >
                <input type="date" class="input" placeholder="Startdatum" bind:value="{$startDate}"/>
                <input type="date" class="input" placeholder="Einddatum" bind:value="{$endDate}"/>
            </div>
        </label>
        <label class="label">Welke groep wordt ingedeeld?</label>
        <RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary" display="flex">
            <RadioItem bind:group={$group} name="justify" value="{Groups.OB}" class="grow">OB</RadioItem>
            <RadioItem bind:group={$group} name="justify" value="{Groups.MB}" class="grow">MB</RadioItem>
            <RadioItem bind:group={$group} name="justify" value="{Groups.BB}" class="grow">BB</RadioItem>
        </RadioGroup>
        <button class="btn btn-sm variant-ghost-secondary self-end" on:click={openChildDialog}>Kinderen beheren</button>

        <div class="space-y-2">
            <div class="flex justify-between">
                <span class="font-bold flex">Naam</span>
                <span class="font-bold flex">Voorkeuren</span>
            </div>
            <hr class="!border-t-4"/>
            {#each $persons as person}
            <div class="flex justify-between">
                    <div class="flex">{person.name}</div>
                    <div class="flex">
                        {#each availableWeekDays as day}
                        <span
                                class="chip {person.preference.includes(day) ? 'variant-filled' : 'variant-soft'}"
                                on:click={() => { toggleDay(person, day) }}
                                on:keypress
                        >
                            <!--{#if person.preference.includes(day)}<span>(icon)</span>{/if}-->
                            <span>{convertWeekDayToStr(day)}</span>
                        </span>
                        {/each}
                    </div>
            </div>
            <hr />
            {/each}
        </div>
        <button class="btn variant-filled-primary" on:click={getResults}>Genereer resultaat</button>
	</div>
</div>

<style>

</style>
