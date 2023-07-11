<script lang="ts">
    import type {Person} from '$lib/Person';
    import {popup} from '@skeletonlabs/skeleton';
    import datepicker from '$lib/images/date-range.svg';

    export let persons: Person[];
    export let index: number;

    const popupDatePicker = {
        // Represents the type of event that opens/closed the popup
        event: 'click',
        // Matches the data-popup value on your popup element
        target: 'popupDatePicker' + index,
        // Defines which side of your trigger the popup will appear
        placement: 'top',
    };
</script>

<button class="btn-icon {persons[index].startFrom ? 'variant-filled-surface':'variant-glass'}" use:popup={popupDatePicker}>
    <img src={datepicker} alt="Selecteer vroegste datum van meedoen" />
</button>


<div class="card p-4 w-72 shadow-xl z-40" data-popup="{'popupDatePicker'+index}" id="{index}">
    <div class="flex flex-col space-y-3">
        <p class="font-bold text-center">Datum vanaf wanneer kind meedoet met pleindienst.</p>
        <hr />
        <span class="text-surface-900-50-token text-xs">Mocht het kind pas later in het jaar in de klas komen vul hier dan de datum in</span>
        <input type="date" class="input" placeholder="Vanaf Datum" bind:value="{persons[index].startFrom}" />
    </div>
    <div class="arrow bg-surface-100-800-token"></div>
</div>
