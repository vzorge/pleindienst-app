<script lang="ts">

    import {Person} from './Person';

    export let parent: any;
    import { modalStore } from '@skeletonlabs/skeleton';
    import {WeekDay} from './WeekDay';

    const person: Person[] = $modalStore[0].component.props.persons;

    const concatSymbol = `:`;
    const daySeparator = ' ';
    let textPerson = person.map(p => `${p.name}${concatSymbol}${p.preference.join(daySeparator)}`).join('\n');
    function onFormSubmit(): void {
        function convertToPerson(input: string): Person {
            const [first, second] = input.split(concatSymbol);
            console.log('input', input);
            console.log('first', first);
            console.log('second', second);
            const prefs = second ? second.split(daySeparator).map(d => WeekDay[d]) : [];
            return {name: first, preference: prefs};
        }

        if ($modalStore[0].response) {
            let convert = textPerson.split('\n');
            console.log('textPerson', textPerson);
            console.log('convert', convert);
            $modalStore[0].response(convert.map(i => {
                console.log('i', i);
                return convertToPerson(i);
            }));
        }
        modalStore.close();
    }

</script>

{#if $modalStore[0]}
<div class="modal-example-form card p-4 w-modal shadow-xl space-y-4">
    <header class="text-2xl font-bold">Namen aanpassen</header>
    <!-- Enable for debugging: -->
    <form class="modal-form p-4 space-y-4 rounded-container-token">
        <textarea class="textarea" bind:value="{textPerson}" rows="{person.length + 5}"></textarea>
    </form>

    <footer class="modal-footer {parent.regionFooter}">
        <button class="btn variant-filled-surface" on:click={modalStore.close}>Annuleren</button>
        <button class="btn variant-filled-primary" on:click={onFormSubmit}>Namen aanpassen</button>
    </footer>
</div>
{/if}
<style>
    textarea {
        border-radius: 2px;
    }
</style>
