<script>
    let checkBoxRemoveBreak = false;
    let checkBoxAddSpace = false;
    let isButtonVisible = false;

    $: {
        isButtonVisible = checkBoxAddSpace || checkBoxRemoveBreak;
    }

    export let promptIn = "";

    function buttonClick() {
        //console.log(['Clicked', promptIn]);
        promptIn = promptIn.replaceAll(/\n/g, "");
    }

    $: {
        promptIn = promptIn;
    }
</script>

<div>
    <ul>
        <li>
            <label>
                <input type="checkbox" bind:checked={checkBoxRemoveBreak} />
                remove break
            </label>
        </li>
        <!-- <li>
            <label>
                <input type="checkbox" bind:checked={checkBoxAddSpace} />
                add space before comma
            </label>
        </li> -->
    </ul>
    <button
        class="button"
        class:hidden={!isButtonVisible}
        type="button"
        on:click={buttonClick}
    />
</div>

<style>
    ul {
        display: inline-flex;
        list-style: none;
        flex-direction: row;
        column-gap: 1em;
    }

    ul > li {
        display: inherit;
        column-gap: 0.25em;
    }

    :is(#removeBreak, #addSpace, #cleanze, label) {
        font-size: 0.9em;
        -moz-user-select: none;
        -webkit-user-select: none;
        user-select: none;
    }

    .button:before {
        content: "🗑️";
        filter: contrast(4);
    }

    .button:hover::before {
        filter: contrast(1);
    }

    .hidden {
        visibility: hidden !important;
        opacity: 0 !important;
        transition: border-color var(--transition-duration-small) ease,
            opacity var(--transition-duration-small) ease,
            background-color var(--transition-duration-small) ease;
    }
</style>
