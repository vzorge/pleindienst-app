<script lang="ts">
    import { unparse } from 'papaparse';
    import type { UnparseConfig } from 'papaparse';
    export let data: any;
    export let filename = 'filename';
    export let bom = false;
    export let options: UnparseConfig | undefined = undefined;

    function download(data: any, filename: string, bom: boolean) {
        const bomCode = bom ? '\ufeff' : '';
        let csvContent = null;
        if (typeof data === 'object') {
            csvContent = unparse(data, options);
        } else {
            csvContent = data;
        }
        const csvData = new Blob([`${bomCode}${csvContent}`], {
            type: 'text/csv;charset=utf-8;'
        });
        let csvURL = null;
        if ((navigator as any).msSaveBlob) {
            csvURL = (navigator as any).msSaveBlob(csvData, `${filename}.csv`);
        } else {
            csvURL = window.URL.createObjectURL(csvData);
        }
        const link = document.createElement('a');
        link.href = csvURL;
        link.setAttribute('download', `${filename}.csv`);
        link.click();
        link.remove();
    }
</script>

<button class={$$props.class} on:click={() => download(data, filename, bom)}>
    <slot />
</button>
