<svelte:head>
    <title>How to use | Prompt Duplicates Remover</title>
</svelte:head>

<img
    src="../img/ogp.png"
    width="480"
    alt="Prompt Duplicates Remover"
/>
<h2 id="what-is-this">What is this?</h2>
<p>A handy tool that can eliminate any duplicated tokens in your prompt:</p>
<p>
    We engineer prompts in generating images with Stable Diffusion where you
    combine words and phrases. It sometimes, however, makes us struggled since
    the more words we deel with the harder we manage all of them, for example,
    it is not rare for us to allow the prompt to have duplicated words. The tool
    enables it more easier, and sanitizes, and deletes any duplicated words in a
    prompt.
</p>
<h2 id="how-to-use">How to use</h2>
<p>
    Paste your prompt into the textarea laveled with “Paste your prompt here“ .
</p>
<img
    src="../img/docs/2023-02-26 133316.png"
    width="480"
    alt="textbox to contain prompts"
/>

<p>
    The tool parses the prompt at once, gets rid of the redundant words, and
    then displays the result. You can select the output text and copy into the
    clipboard to use it for generating images you like.
</p>
<img
    src="../img/docs/2023-02-26 133316.png"
    width="480"
    alt="textbox to contain prompts"
/>

<p>
    The section below have “Reduced prompts“ and “Total prompts removed“ each.
    “Reduced prompts“ is a brief summary for the deleted words, whereas “Total
    prompts removed“ refers to the total number of tokens deleted.
</p>
<img
    src="../img/docs/2023-02-26 133554.png"
    width="480"
    alt="duplicated kind of prompts"
/>

<h2 id="unsupported-prompts">Unsupported prompts</h2>
<p>
    This tools does not support these types of prompts below, for example a
    prompt with <code>()</code> or
    <code>[]</code> to make attention, <code>[pig|cow]</code> as in Alternating
    words, and
    <code>
        a busy city street in a modern city|illustration|cinematic lighting</code
    > as in Prompt Matrix are not all supported for now.
</p>
<ul>
    <li>Novel AI Prompts</li>
    <li>Prompt Matrix</li>
    <li>Alternating Words</li>
    <li>Dynamic Prompts</li>
</ul>

<h2 id="questions-and-answers">Questions and Answers</h2>
<dl>
    <dt>
        <p>Is my prompt sent to somewhere?</p>
    </dt>
    <dd>
        <p>
            No. The tools process all the prompts within your browser only, and
            therefore your prompt will not go out of your browser.
        </p>
    </dd>
    <dt>
        <p>What are two checkbox under the textarea?</p>
        <img
            src="../img/docs/2023-02-26 133419.png"
            width="480"
            alt="checkboxes shown below"
        />
    </dt>
    <dd>
        <p>
            The checkbox provides two options to optimize the prompt input.
            “remove breaks“ just eliminates unwanted breaks in a prompt and “add
            space before comma“ places a comma after spaces. As you mark the
            checkbox, a button appears next to the checkbox.
        </p>
    </dd>
</dl>

<style>
    p + img,
    img {
        display: block;
        width: 100%;
        margin-bottom: 1rem;
    }

    h2,
    ul,
    p {
        margin-bottom: 1rem;
    }

    p {
        text-align: justify;
    }
    
    ul {
        padding-left: 1.5em;
    }
</style>
