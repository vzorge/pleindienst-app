<script lang="ts">
    import {Table} from '@skeletonlabs/skeleton';
    import {Match, MatchingResponse, Times} from '$lib/MatchingResponse';
    import {resultStore} from '$lib/store';

    let matches: Match[] = [];
    let times: Times[] = [];
    resultStore.subscribe((value: MatchingResponse) => {
        if (value) {
            matches = value.matches;
            times = value.times;
        }
    });


    const tableMatches = {
        head: ['Datum', 'Naam', 'Voorkeur'],
        body: tableMatchMapper()
    };
    const tableTimes = {
        head: ['Naam', 'Aantal'],
        body: tableTimesMapper()
    };

    function tableMatchMapper() {
        const result = [];
        for (const match of matches) {
            const date = new Date(match.date).toLocaleDateString('nl', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            result.push([date, match.person.name, match.happy ? 'Ja' : 'Nee']);
        }
        return result;
    }

    function tableTimesMapper() {
        const result = [];
        for (const time of times) {
            result.push([time.person.name, time.amount]);
        }
        return result;
    }

</script>

<div class="container mx-auto flex grow justify-center items-start mt-10">
    <div class="space-y-6">
        {#if matches.length > 0}
            <Table source="{tableMatches}" />
            <hr />
            <Table source="{tableTimes}" />
        {:else}
            <p>Nog geen resultaten. Ga terug naar de invoer</p>
        {/if}
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
