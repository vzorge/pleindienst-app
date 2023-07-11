<script lang='ts'>
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
    // Floating ui
    import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
    import { storePopup } from '@skeletonlabs/skeleton';

    // Most of your app wide CSS should be put in this file
	import '../app.postcss';
    import {Modal} from '@skeletonlabs/skeleton';
    import Header from './Header.svelte';

    storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
</script>


<div class="app">
    <Header />

    <main>
        <div class="flex justify-center items-center">
            <h1 class="h1"><span class="gradient-heading">Pleindienst</span></h1>
        </div>
        <slot />
    </main>

</div>
<Modal />

<style>
    .app {

        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    main {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        width: 100%;
        max-width: 64rem;
        margin: 0 auto;
        box-sizing: border-box;
        justify-items: start;
    }

    .gradient-heading {
        @apply bg-clip-text text-transparent box-decoration-clone;
        /* Direction */
        @apply bg-gradient-to-br;
        /* Color Stops */
        @apply from-primary-500 via-tertiary-500 to-secondary-500;
    }
</style>

