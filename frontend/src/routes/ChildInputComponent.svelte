<script lang="ts">
    import type {Person} from '$lib/Person';
    import { modalStore } from '@skeletonlabs/skeleton';
    import {convertStrToWeekDay, convertWeekDayToStr} from '$lib/WeekDay';

    export let parent: any;
    export let persons: Person[] = [];

    const concatSymbol = `:`;
    const daySeparator = ' ';
    let textPerson = persons.map(p => `${p.name}${concatSymbol}${p.preference.map(pref => convertWeekDayToStr(pref)).join(daySeparator)}`).join('\n');
    function onFormSubmit(): void {
        function convertToPerson(input: string): Person {
            const [first, second] = input.split(concatSymbol);
            const prefs = second ? second.split(daySeparator).map(d => convertStrToWeekDay(d)) : [];
            return {name: first, preference: prefs};
        }

        if ($modalStore[0].response) {
            let convert = textPerson.split('\n');
            $modalStore[0].response(convert.filter(i => i.trim() !== "").map(i => {
                return convertToPerson(i.trim());
            }));
        }
        modalStore.close();
    }

</script>

{#if $modalStore[0]}
<div class="modal-example-form card p-4 w-modal shadow-xl space-y-4">
    <header class="text-2xl font-bold">Namen aanpassen</header>

    <form class="modal-form p-4 space-y-4 rounded-container-token">
        <span>Vul één naam in per regel.</span>
        <textarea class="textarea" bind:value="{textPerson}" rows="{persons.length + 5}"></textarea>
    </form>

    <footer class="modal-footer {parent.regionFooter}">
        <button class="btn variant-filled-surface" on:click={modalStore.close}>Annuleren</button>
        <button class="btn variant-filled-primary" on:click={onFormSubmit}>Opslaan</button>
    </footer>
</div>
{/if}
<style>
    textarea {
        border-radius: 2px;
    }
</style>
