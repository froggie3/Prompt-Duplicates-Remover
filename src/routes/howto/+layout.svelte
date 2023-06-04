<script>
    import Header from "../Header.svelte";
</script>

<Header />

<div id="container">
    <slot />
</div>

<style>
    #container {
        box-shadow: none !important;
        box-shadow: var(--primary-shadow);
        line-height: 1.75;
        margin: 0 auto;
        padding: 2rem;
        width: calc(600px + 2rem);
        word-break: normal;
    }

    @media screen and (max-width: 767px) {
        #container {
            box-shadow: none;
            padding: 1rem;
            width: 100%;
        }
    }
</style>
