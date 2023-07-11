<script lang="ts">
    import {Table} from '@skeletonlabs/skeleton';
    import {Match, MatchingResponse} from '$lib/MatchingResponse';
    import {resultStore, group} from '$lib/store';
    import {CSVDownloader} from 'svelte-csv';
    import vacationDates from '$lib/data/vacationDates.json';
    import {convertWeekDayToStr} from '$lib/WeekDay';
    import {Groups} from '$lib/Groups';
    import type {Times} from '$lib/Times';

    const OB_END_DATE = new Date('2024-02-02');

    let matches: Match[] = [];
    let times: Times[] = [];
    let csvData;
    $group;
    resultStore.subscribe((value: MatchingResponse) => {
        if (value) {
            matches = value.matches;
            times = value.times;
            csvData = [...value.matches.map(m => {
                const datum = new Date(m.date);
                return ({
                    'Datum': datum,
                    'Groep': (`${$group.name}${$group.number}`) || 'onbekend',
                    'Dag': convertWeekDayToStr(datum.getDay()),
                    'Ouders van:': m.person.name
                });
            }),
                ...vacationDates
                    .filter(vd => $group.name === Groups.OB ? new Date(vd.date).getTime() <= OB_END_DATE.getTime() : true)
                    .map(vd => {
                    const date = new Date(vd.date);
                    return ({
                        'Datum': date,
                        'Groep': ($group.name + $group.number.toString(10)) || 'onbekend',
                        'Dag': convertWeekDayToStr(date.getDay()),
                        'Ouders van:': vd.reason
                    });
                })
            ].sort((l, r) => l.Datum.getTime() - r.Datum.getTime())
                .map(val => ({...val, "Datum": val.Datum.toLocaleDateString('nl-NL')}));

            console.log(csvData);
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
            <CSVDownloader data="{csvData}" bom="{true} filename={'pleindienst.csv'}">Download als csv</CSVDownloader>
            <Table source="{tableMatches}"/>
            <hr/>
            <Table source="{tableTimes}"/>
        {:else}
            <p>Nog geen resultaten. Ga terug naar de invoer</p>
        {/if}
    </div>
</div>
