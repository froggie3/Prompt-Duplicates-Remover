<script>
    import { duplicatesRemove } from "./DuplicateRemover.svelte";
    import Controls from "./Controls.svelte";
    import Information from "./Information.svelte";
    import Title from "./Title.svelte";

    let promptInput = "";
    let fPrompt = "";
    let reducedNumbers = 0;
    let reducedPrompts = "";

    $: {
        const obj = duplicatesRemove(promptInput);
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
                bind:value={promptInput}
                class="prompt-textarea"
                id="inputArea"
                placeholder="1girl, solo"
                rows="10"
            />
        </div>

        <div class="box-textarea">
            <label for="preview">Cleaned prompt</label>
            <textarea
                id="preview"
                class="prompt-textarea"
                bind:value={fPrompt}
                readonly
            />
        </div>
    </div>

    <Controls bind:promptDirty={promptInput} />

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
    }

    .cols {
        column-gap: 1rem;
        display: inherit;
        flex-direction: row;
        width: 100%;
    }

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

    .paste-area-wrapper {
        background-color: var(--background-color-white);
        display: flex;
        flex-direction: column;
        row-gap: 1rem;
        margin: 0 2rem;
    }

    @media screen and (max-width: 768px) {
        .paste-area-wrapper {
            margin: 0 1rem;
        }

        .cols {
            flex-direction: column;
        }

        .box-textarea {
            width: 100%;
            margin-bottom: 1em;
        }
    }
</style>
