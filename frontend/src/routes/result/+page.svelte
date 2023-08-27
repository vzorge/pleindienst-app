<script lang="ts">
    import {Table} from '@skeletonlabs/skeleton';
    import type {Match, MatchingResponse} from '$lib/MatchingResponse';
    import {group, resultStore} from '$lib/store';
    import CSVDownloader from './CSVDownloader.svelte';
    import {convertWeekDayToStr} from '$lib/WeekDay';
    import type {Times} from '$lib/Times';
    import {getVacationDates} from '$lib/data/dates';
    import {browser} from '$app/environment';
	import { overblijftijd } from '$lib/data/overblijftime';

    const options = {
        delimiter: ';'
    }

    let matches: Match[] = [];
    let times: Times[] = [];
    let groupName: string;
    let csvData: {};
    let csvTimes: {Naam: string, Aantal: number, Totaal: number}[] = [];

    if (browser) {
        resultStore.subscribe((value: MatchingResponse | undefined) => {
            if (value) {
                matches = value.matches;
                times = value.times;
                groupName = `${value.group.name}${value.group.number}`;

                csvData = [
                    ...value.matches.map(m => {
                        const datum = new Date(m.date);
                        return ({
                            'Datum': datum,
                            'Groep': groupName,
                            'Dag': convertWeekDayToStr(datum.getDay()),
                            'Ouders van:': m.person.name
                        });
                    }),
                    ...getVacationDates(value.group.name)
                        .map(vd => {
                        return ({
                            'Datum': vd.date,
                            'Groep': groupName,
                            'Dag': convertWeekDayToStr(vd.date.getDay()),
                            'Ouders van:': vd.reason
                        });
                    })
                ].sort((l, r) => l.Datum.getTime() - r.Datum.getTime())
                .map(val => ({...val, "Datum": val.Datum.toLocaleDateString('nl-NL')}));
               
                csvTimes = times.map(val => ({Naam: val.person.name, Aantal: val.amount, Totaal: val.total}));
            }
        });
    }


    const tableTimes = {
        head: ['Naam', 'Aantal nu', 'Aantal totaal'],
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

    function tableTimesMapper(): string[][] {
        const result: string[][] = [];
        for (const time of times) {
            result.push([time.person.name, String(time.amount), String(time.total)]);
        }
        return result;
    }

    function showOverblijfTijd(date: Date) {
        const overblijf = overblijftijd($group, date.getDay());
        return `${overblijf.van} - ${overblijf.tot}`;
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
            {#if csvData}
            <div class="justify-center">
                <CSVDownloader data="{csvData}" bom="{true}" filename="{'pleindienst-' + groupName}" options="{options}" class="btn variant-filled-primary">
                    Download overblijf data
                </CSVDownloader>
            </div>
            {/if}
            <hr />
            <p class="opacity-70">Onderstaande tabel geeft een overzicht van hoe vaak een naam overblijf dienst heeft. <br/> Deze lijst komt niet mee in de download</p>
            <CSVDownloader data="{csvTimes}" bom="{true}" filename="{'pleindienst-' + groupName + "-aantal"}" options="{options}" class="btn variant-soft-secondary">
                Download aantal keren data
            </CSVDownloader>
            <Table source="{tableTimes}"></Table>
            <hr />
            <div class="space-y-2">
                <p class="opacity-70">Hieronder staat compact de gehele lijst van datums en bijbehorende namen</p>
                <dl class="list-dl">
                    {#each matches as match (match.date)}
                    <div>
                        <span class="flex-auto">
                            <dt class="font-bold">{convertWeekDayToStr(new Date(match.date).getDay())} {new Date(match.date).toLocaleDateString("nl-NL")}</dt>
                            <dd class="text-sm">
                                <div class="flex">
                                    <span class="badge-icon {match.happy ? 'variant-filled-success' : 'variant-filled-error'}">{match.happy ? '+' : '-'}</span>
                                    <span>{match.person.name}</span>
                                    <span>{showOverblijfTijd(new Date(match.date))}
                                </div>
                            </dd>
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
