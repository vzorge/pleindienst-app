<script lang="ts">
    import {modalStore, RadioGroup, RadioItem, tableMapperValues} from '@skeletonlabs/skeleton';
    import ChildInputComponent from './ChildInputComponent.svelte';
    import {Person} from './Person';
    import {WeekDay} from './WeekDay';
    import {Groups} from './Groups.js';

    let startDate, endDate;
    let group;
    let persons: Person[] = [{name: 'Roan', preference: [WeekDay.Maandag, WeekDay.Dinsdag]}, {name: 'Lias', preference: []}, {name: 'Jade', preference: []}];
    let availableWeekDays = [WeekDay.Maandag, WeekDay.Dinsdag, WeekDay.Donderdag, WeekDay.Vrijdag]

    const personTable  = {
        head: ['Naam', 'Voorkeuren'],
        body: tableMapperValues(persons, ['name', 'preference'])
    }

    function openChildDialog() {
        new Promise<Person[]>((resolve) => {
            const modalChildrenInput = {
                ref: ChildInputComponent,
                props: {persons: persons}
            }
            modalStore.trigger({
                type: 'component',
                component: modalChildrenInput,
                response: (r: Person[]) => {
                    resolve(r);
                }
            })
        }).then((r: Person[]) => {
            console.log(r);
            persons = r;
        });
    }

    function toggleDay(person: Person, day: WeekDay) {
        const idx = person.preference.indexOf(day);
        if (idx > 0) {
            person.preference.splice(idx, 1);
        } else {
            person.preference.push(day);
        }
        persons = persons;
    }
</script>

<div class="container h-full mx-auto flex justify-center items-center">
    <div class="space-y-5 flex flex-col">
        <h1 class="h1"><span class="gradient-heading">Pleindienst</span></h1>
        <p>Kies de start en einddatum en vul de namen en voorkeuren in van de kinderen.</p>

        <label class="label">
            <span>Voor welke datums geld het?</span>
            <div class="input-group grid-cols-2 gap-8 px-5 py-3" >
                <input type="date" class="input" placeholder="Startdatum" value="{startDate}"/>
                <input type="date" class="input" placeholder="Einddatum" value="{endDate}"/>
            </div>
        </label>
        <label class="label">Welke groep wordt ingedeeld?</label>
        <RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary" display="flex">
            <RadioItem bind:group={group} name="justify" value="{Groups.OB}" class="grow">OB</RadioItem>
            <RadioItem bind:group={group} name="justify" value="{Groups.MB}" class="grow">MB</RadioItem>
            <RadioItem bind:group={group} name="justify" value="{Groups.BB}" class="grow">BB</RadioItem>
        </RadioGroup>
        <button class="btn variant-filled-primary self-center" on:click={openChildDialog}>Kinderen beheren</button>

        <div class="space-y-2">
            <div class="flex justify-between">
                <span class="font-bold flex">Naam</span>
                <span class="font-bold flex">Voorkeuren</span>
            </div>
            <hr class="!border-t-4"/>
            {#each persons as person}
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
                            <span>{day}</span>
                        </span>
                        {/each}
                    </div>
            </div>
            <hr />
            {/each}
        </div>
	</div>
</div>

<style>
    .gradient-heading {
        @apply bg-clip-text text-transparent box-decoration-clone;
        /* Direction */
        @apply bg-gradient-to-br;
        /* Color Stops */
        @apply from-primary-500 via-tertiary-500 to-secondary-500;
    }

</style>
