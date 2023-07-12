<script lang="ts">
    import {Table} from '@skeletonlabs/skeleton';
    import {Match, MatchingResponse} from '$lib/MatchingResponse';
    import {group, resultStore} from '$lib/store';
    import {CSVDownloader} from 'svelte-csv';
    import vacationDates from '$lib/data/vacationDates.json';
    import {convertWeekDayToStr} from '$lib/WeekDay';
    import {Groups} from '$lib/Groups';
    import type {Times} from '$lib/Times';

    const OB_END_DATE = new Date('2024-02-02');

    let matches: Match[] = [];
    let times: Times[] = [];
    let csvData;

    resultStore.subscribe((value: MatchingResponse) => {
        group.subscribe(g => {
            if (value) {
                matches = value.matches;
                times = value.times;
                csvData = [...value.matches.map(m => {
                    const datum = new Date(m.date);
                    return ({
                        'Datum': datum,
                        'Groep': (`${g.name}${g.number}`) || 'onbekend',
                        'Dag': convertWeekDayToStr(datum.getDay()),
                        'Ouders van:': m.person.name
                    });
                }),
                    ...vacationDates
                        .filter(vd => g.name === Groups.OB ? new Date(vd.date).getTime() <= OB_END_DATE.getTime() : true)
                        .map(vd => {
                        const date = new Date(vd.date);
                        return ({
                            'Datum': date,
                            'Groep': (`${g.name}${g.number}`),
                            'Dag': convertWeekDayToStr(date.getDay()),
                            'Ouders van:': vd.reason
                        });
                    })
                ].sort((l, r) => l.Datum.getTime() - r.Datum.getTime())
                    .map(val => ({...val, "Datum": val.Datum.toLocaleDateString('nl-NL')}));
            }
        });
    });


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
            <p>Hieronder staat een overzicht van de gegenereerde resultaten. <br/>
                Deze kan je met onderstaande link downloaden.<br/>
                Je krijgt dan een CSV in het formaat zoals het ook aangeleverd moet worden aan school. <br/>
                Deze CSV zou direct door excel geopend moeten kunnen worden.
            </p>
            <div class="justify-center"><CSVDownloader data="{csvData}" bom="{true}" filename="{'pleindienst.csv'}">Download overblijf data</CSVDownloader></div>
            <hr />
            <p class="opacity-70">Onderstaande tabel geeft een overzicht van hoe vaak een naam overblijf dienst heeft. <br/> Deze lijst komt niet mee in de download</p>
            <Table source="{tableTimes}"></Table>
            <hr />
            <div class="space-y-2">
                <p class="opacity-70">Hieronder staat compact de gehele lijst van datums en bijbehorende namen</p>
                <dl class="list-dl">
                    {#each matches as match (match.date)}
                    <div>
                        <span class="flex-auto">
                            <dt class="font-bold">{convertWeekDayToStr(new Date(match.date).getDay())} {new Date(match.date).toLocaleDateString("nl-NL")}</dt>
                            <dd class="text-sm">{match.person.name}</dd>
                        </span>
                    </div>
                    {/each}
                </dl>
            </div>
        {:else}
            <p>Nog geen resultaten. Ga terug naar de invoer</p>
        {/if}
    </div>
</div>
