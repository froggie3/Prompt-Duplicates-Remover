<script>
    let isHidden = false;
    let rotated = false;

    /** @type {number} **/
    export let numberRemoved;

    /** @type {string} **/
    export let reducedPrompts;

    function openInfo() {
        isHidden = isHidden ? false : true;
        rotateTriangle();
    }

    function rotateTriangle() {
        rotated = rotated ? false : true;
    }
</script>

<div class="prompt-information-wrapper">
    <div class="prompt-information-title-wrapper">
        <h2 class="prompt-information-title">Information</h2>
        <!-- <button class="triangle" class:rotated type="button" on:click={openInfo}>
        🔻
        </button> -->
    </div>

    <dl id="prompt-information" class:isHidden>
        <dd>Reduced prompts</dd>
        <dt>{numberRemoved}</dt>
        <dd>Total prompts removed</dd>
        <dt>
            {@html numberRemoved
                ? reducedPrompts
                : "<em> (no duplicates) </em>"}
        </dt>
    </dl>
</div>

<style>
    .prompt-information-wrapper {
        display: inherit;
        line-height: 1.5;
        background-color: var(--background-color-white);
        flex-direction: column;
    }

    #prompt-information {
        margin: 1rem 0;
        grid: auto / 1fr 2fr;
        grid-gap: 1em;
        display: grid;
        grid-column: 1 / 3;
        visibility: visible;
        opacity: 1;
        transition: opacity var(--transition-duration-small),
            transform var(--transition-duration-small);
    }

    @media screen and (max-width: 767px) {
        #prompt-information {
            grid: auto 1fr / 1fr;
            grid-column: 1 / 2;
        }
    }

    .prompt-information-title-wrapper {
        max-width: 100%;
        display: inline-flex;
        align-items: center;
    }

    .prompt-information-title {
        display: inline-block;
    }

    .triangle {
        transition: transform var(--transition-duration-small);
        transform: rotate(90deg);
        font-size: 1.5em;
        filter: grayscale(1);
    }

    .rotated {
        transform: rotate(0deg) !important;
    }

    .isHidden {
        visibility: hidden !important;
        opacity: 0 !important;
        transition: opacity var(--transition-duration-small),
            transform var(--transition-duration-small) !important;
        transform: scale(0.98) !important;
    }
</style>
