<script lang="ts">
	import { parseGroup, type Group } from "$lib/Group";
	import papaparse from "papaparse";
	import { onMount } from "svelte";
  import downloadImg from '$lib/images/download.svg';
	import { createCalendarEvent, downloadCalendarEvent } from "$lib/Calendar";
	import { overblijftijd } from "$lib/data/overblijftime";

  const DATE_FIELD = 'Datum';
  const GROUP_FIELD = 'Groep';
  const NAAM_FIELD = 'Ouders van:';

  type DataRow = {date: Date, group: Group, name: string};

  let names: {[key:string]: DataRow[]} = {};

  async function getResults() {
    const data: any = await new Promise((resolve) => {
      papaparse.parse('/csv/pleindienst-BB1.csv', {
        download: true,
        delimiter: ';',
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: results => {
          console.log('results');
          console.log(results.data);
          resolve(results.data);
        }
      });
    });

    
    names = data
      .map((d: any) => ({
        date: new Date(d[DATE_FIELD]), 
        group: parseGroup(d[GROUP_FIELD]),
        name: d[NAAM_FIELD]
      }))
      .filter((d: DataRow) => !(d.name.includes('vakantie') || d.name.includes('Studiedag') || d.name.includes('12 uur')))
      .reduce(groupBy, {});
    console.log(names);
  }

  const groupBy = (a: {[key: string]: DataRow[]}, b: DataRow) => {
    a[b.name] = [...(a[b.name] || []), b]
    return a;
  };


  function createCalendarEvents(name: string, data: DataRow[]) {
    const calendarEvents = data
      .map(d => createCalendarEvent(d.date, overblijftijd(d.group, d.date.getDay())));
    downloadCalendarEvent(calendarEvents, name);
  }

  onMount(() => {
    getResults();
  });
</script>


<div class="flex flex-col flex-wrap space-y-5">
  {#each Object.entries(names) as [name, data]}
  <div class="flex space-x-7">
    <button class="btn btn-icon btn-icon-sm variant-filled-primary" on:click={() => createCalendarEvents(name, data)}>
      <img src={downloadImg} alt="Download" class="h-2/3"/>
    </button>
    <span>{name}</span>
  </div>
  <hr class="!border-dashed"/>
  
  {/each}
</div>
