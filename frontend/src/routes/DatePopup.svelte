<script lang="ts">
    import type {Person} from '$lib/Person';
    import {Accordion, AccordionItem, popup} from '@skeletonlabs/skeleton';
    import datepicker from '$lib/images/date-range.svg';

    export let person: Person;
    export let index: number;

    const popupDatePicker = {
        // Represents the type of event that opens/closed the popup
        event: 'click',
        // Matches the data-popup value on your popup element
        target: 'popupDatePicker' + index,
        // Defines which side of your trigger the popup will appear
        placement: 'top',
        closeQuery: 'a',
    };

    let extraDate: Date;

    function addFixedDate() {
        if (extraDate && !(person.fixedDates || []).includes(extraDate)) {
            if (!person.fixedDates) person.fixedDates = [];
            person.fixedDates.push(new Date(extraDate));
            person = person;
        }
    }

    function removeFixedDate(index) {
        person.fixedDates!.splice(index, 1);
        person = person;
    }
</script>

<button class="btn-icon {person.startFrom || person.fixedDates ? 'variant-filled-surface':'variant-glass'}" use:popup={popupDatePicker}>
    <img src={datepicker} alt="Selecteer vroegste datum van meedoen" />
</button>


<div class="card p-2 w-72 shadow-xl z-40" data-popup="{'popupDatePicker'+index}" id="{index}">
    <Accordion>
        <AccordionItem>
<!--                <svelte:fragment slot="lead">(icon)</svelte:fragment>-->
            <svelte:fragment slot="summary">Datum vanaf inroosteren</svelte:fragment>
            <svelte:fragment slot="content">
                <span class="text-surface-900-50-token text-xs">Mocht het kind pas later in het jaar in de klas komen vul hier dan de datum in vanaf wanneer er ingeroosterd moet worden</span>
                <input type="date" class="input" placeholder="Vanaf Datum" bind:value="{person.startFrom}" />
            </svelte:fragment>
        </AccordionItem>
        <AccordionItem>
<!--                <svelte:fragment slot="lead">(icon)</svelte:fragment>-->
            <svelte:fragment slot="summary">Vaste datum opgeven</svelte:fragment>
            <svelte:fragment slot="content">
                <div class="flex flex-col space-y-1">
                    <span class="text-surface-900-50-token text-xs">Als je vaste datums wil geven, vul deze dan hier in en voeg ze toe via het plusje.
                        Verwijderen is mogelijk door op de datum te klikken.</span>
                    <span class="font-bold text-xs">Deze functie werkt op het moment nog niet</span>
                    <div class="flex space-x-1">
                        <input type="date" class="input" placeholder="Caste datum toevoegen" bind:value="{extraDate}" />
                        <button class="btn-icon variant-glass" on:click={addFixedDate}><span class="text-2xl font-bold text-primary-900-50-token">+</span></button>
                    </div>
                    <div class="flex flex-wrap space-evenly">
                        {#each (person.fixedDates || []) as fixedDate, i (fixedDate)}
                            <span class="chip variant-soft hover:variant-filled m-1" on:click={() => removeFixedDate(i)} on:keydown={() => removeFixedDate(index)}>
                                <span class="text-sm">{fixedDate.toLocaleDateString('nl-NL')}</span>
                                <span class="text-lg font-bold text-error-900-50-token">-</span>
                            </span>
                        {/each}
                    </div>
                </div>
            </svelte:fragment>
        </AccordionItem>
    </Accordion>
    <div class="arrow bg-surface-100-800-token"></div>
</div>
