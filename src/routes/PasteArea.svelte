<script>
    import { duplicatesRemove } from "./DuplicateRemover.svelte";
    import Controls from "./Controls.svelte";
    import Information from "./Information.svelte";
    import Title from "./Title.svelte";

    let promptIn = "";

    let obj;

    /**
     * @type {string}
     */
    let fPrompt;

    /**
     * @type {string}
     */
    let reducedPrompts;

    /**
     * @type {number}
     */
    let reducedNumbers;

    $: {
        obj = duplicatesRemove(promptIn);
        fPrompt = obj["outPrompt"];
        reducedNumbers = obj["reduced"]["number"];
        reducedPrompts = obj["reduced"]["prompt"].join(", ");
    }
</script>

<div class="paste-area-wrapper">
    <Title />
    <!-- <p>Note: prompts must be separated with commas</p> -->

    <div class="cols">
        <div class="box-textarea">
            <label for="inputArea"> Your prompt </label>

            <textarea
                bind:value={promptIn}
                class="prompt-textarea"
                name="inputArea"
                placeholder="1girl, solo"
                rows="10"
            />
        </div>

        <!--Preview /-->

        <div id="previewWrap" class="box-textarea">
            <label for="preview">Cleaned prompt</label>
            <textarea class="prompt-textarea" bind:value={fPrompt} readonly />
        </div>
    </div>

    <Controls promptIn={promptIn}/>
    
    <Information numberRemoved={reducedNumbers} {reducedPrompts} />
</div>

<style>
    .box-textarea {
        display: inherit;
        flex-direction: column;
        width: 50%;
    }

    :is(.box-textarea) > :is(label, prompt-textarea) {
        margin-bottom: 1em;
        /* height: max-content; */
    }

    .cols {
        column-gap: 1rem;
        display: inherit;
        flex-direction: row;
        width: 100%;
    }

    /* @media screen and (max-width: 767px) {
    .box-textarea {
      display: inherit;
      grid-template-rows: min-content min-content;
    }
  } */

    .prompt-textarea {
        background-color: var(--background-color-white);
        border-radius: var(--border-radius-medium);
        border: 1px solid var(--border-color-gray);
        font-family: var(--font-family-monospace);
        font-size: 0.8em;
        height: calc(100vh - calc(100vh - 100%));
        line-height: 1.5;
        outline: none;
        padding: 0.75rem;
        resize: none;
        transition: border var(--transition-duration-small);
    }

    .prompt-textarea:focus-visible {
        border: 1px solid var(--border-color-gray-focused);
    }

    @keyframes slidein {
        0% {
            opacity: 0;
            transform: translateY(1rem);
        }

        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .paste-area-wrapper {
        /* grid-gap: 1rem; */
        /* grid: 1fr / repeat(2, 1fr); */
        background-color: var(--background-color-white);
        display: flex;
        flex-direction: column;
        margin: 0 2rem;
        row-gap: 1rem;
    }
</style>
