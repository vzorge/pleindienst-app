<script lang="ts">
    import {modalStore, RadioGroup, RadioItem, type ModalSettings} from '@skeletonlabs/skeleton';
    import ChildInputComponent from './ChildInputComponent.svelte';
    import DatePopup from './DatePopup.svelte';
    import type {Person} from '$lib/Person';
    import {convertWeekDayToStr, WeekDay} from '$lib/WeekDay';
    import {GroupName} from '$lib/GroupName.js';
    import {group, persons, resultStore} from '$lib/store';
    import {goto} from '$app/navigation';
    import type {Group} from '$lib/Group';
	import type { Match } from '$lib/MatchingResponse';

    const mbBbWeekDays = [WeekDay.Maandag, WeekDay.Dinsdag, WeekDay.Donderdag, WeekDay.Vrijdag];
    const obBbWeekDays = [WeekDay.Maandag, WeekDay.Dinsdag, WeekDay.Donderdag];

    $persons;
    $group;
    $resultStore;

    $: availableWeekDays = $group.name === GroupName.OB ? obBbWeekDays : mbBbWeekDays;

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
        if (!$group.name || !$group.number || $persons.length === 0) {
            return;
        }

        const body = {
            persons: $persons,
            group: $group
        }

        const response = await fetch('/matching', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            console.log(response);
            // TODO foutafhandeling
        }
        response.json().then(({ matches, times }) => {
            const sortedMatches = matches.sort((l: Match, r: Match) => new Date(l.date).getTime() - new Date(r.date).getTime());
            resultStore.set({matches: sortedMatches, times: times, group: $group});
            goto('/result');
        }, reason => {
            console.log(reason);
            //TODO error handling
        })
    }

    function deleteLocalStorage() {
        new Promise<boolean>(resolve => {
            const modal: ModalSettings = {
                type: 'confirm',
                // Data
                title: 'Alle data weggooien',
                body: 'Weet je zeker dat je alle ingevulde gegevens wil weggooien?',
                buttonTextCancel: 'Terug',
                buttonTextConfirm: 'Wissen',
                response: (r: boolean) => resolve(r),
            };
            modalStore.trigger(modal);
        }).then((r: boolean) => {
            if (r) {
                persons.set([]);
                group.set({} as Group);
                resultStore.set(undefined);
            }
        })
    }

</script>

<div class="container mx-auto flex grow justify-center items-start mt-10">
    <div class="space-y-5 flex flex-col">
        <div class="self-end"><button class="btn btn-sm variant-glass-error" on:click={() => deleteLocalStorage()}>Schoon beginnen</button></div>
        <p>Vul de namen en voorkeuren in van de kinderen. Je kan ook aangeven hoe vaak iemand al dienst gehad heeft dit jaar.
        <br/>
            Een voorkeursdag is niet verplicht. Als er niks gekozen is, werkt dat hetzelfde alsof je alles gekozen hebt.
        <br/>
            Het is ook mogelijk om op te geven vanaf wanneer iemand meegeteld moet worden of dat iemand enkel vaste datums krijgt.
            klik hiervoor op het datum icoontje achter de dagen.
        </p>

        <span class="label">Welke groep wordt ingedeeld?</span>
        <RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary" display="flex">
            <RadioItem bind:group={$group.name} name="justify" value="{GroupName.OB}" class="grow">OB</RadioItem>
            <RadioItem bind:group={$group.name} name="justify" value="{GroupName.MB}" class="grow">MB</RadioItem>
            <RadioItem bind:group={$group.name} name="justify" value="{GroupName.BB}" class="grow">BB</RadioItem>
        </RadioGroup>
        <RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary" display="flex">
            <RadioItem bind:group={$group.number} name="justify" value="{1}" class="grow">1</RadioItem>
            <RadioItem bind:group={$group.number} name="justify" value="{2}" class="grow">2</RadioItem>
            <RadioItem bind:group={$group.number} name="justify" value="{3}" class="grow">3</RadioItem>
            <RadioItem bind:group={$group.number} name="justify" value="{4}" class="grow">4</RadioItem>
            <RadioItem bind:group={$group.number} name="justify" value="{5}" class="grow">5</RadioItem>
            <RadioItem bind:group={$group.number} name="justify" value="{6}" class="grow">6</RadioItem>
        </RadioGroup>
        <button class="btn btn-sm variant-ghost-secondary self-end" on:click={openChildDialog}>Kinderen beheren</button>

        <div class="space-y-2">
            <div class="flex justify-end space-x-5">
                <span class="font-bold flex flex-1">Naam</span>
                <span class="font-bold">Voorkeuren</span>
                <span class="font-bold">Eerder</span>
                <span class="font-bold pr-6">&nbsp;</span>
            </div>
            <hr class="!border-t-4"/>
            {#each $persons as person, index (person.name)}
            <div class="flex justify-end items-center space-x-2 flex-wrap">
                <div class="flex flex-1">{person.name}</div>
                <div class="flex space-x-2">
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
                    <input type="number" bind:value={person.timesPast} class="input w-10" min="0" max="99"/>
                    <div>
                        <DatePopup person="{person}" index="{index}" state="{state => !!(state === 'close' ? $persons = $persons : undefined)}"></DatePopup>
                    </div>
                </div>
            </div>
            <hr class="!border-dashed"/>
            {/each}
        </div>
        {#if $resultStore}
            <a href="result/" class="btn variant-filled-primary">Bekijk huidig resultaat</a>
        {/if}
        <button class="btn {$resultStore ? 'variant-soft-surface' : 'variant-filled-primary'}" on:click={getResults}>
            Genereer nieuwe resultaten
        </button>
	</div>
</div>

<style>
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Firefox */
    input[type=number] {
        -moz-appearance: textfield;
        appearance: textfield;
    }
</style>