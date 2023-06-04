<script>
    import Header from "./Header.svelte";
    import PasteArea from "./PasteArea.svelte";
</script>

<svelte:head>
    <title>Prompt Duplicates Remover</title>
    
</svelte:head>

<Header />

<div id="container">
    <PasteArea />
</div>

<style>
    #container {
        display: flex;
        flex-direction: column;
        grid-gap: 3rem 0;
        height: max-content;
        margin: 0 auto;
        padding: 0 1rem;
    }
</style>
