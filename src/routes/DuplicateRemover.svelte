<script context="module">
    /**
     * @param {string} text
     */

    export function duplicatesRemove(text) {
        const reLoRA = /<(.*)>/;

        const reTrailingComma = /,\s?$/;

        const unwrapParentheses = (/** @type {string} */ str) => {
            const m = /[<([](.+)?[)\]>]/.exec(str);
            return m ? m[1] : str;
        };

        const separateDecimals = (/** @type {string} */ e) =>
            e.indexOf(":") === -1 ? [e, "1.0"] : e.split(":");

        const accumulateAttentions = (
            /** @type {{ [x: string]: string[]; }} */
            prev,
            /** @type {string[]} */
            curr
        ) => ({
            ...prev,
            [curr[0]]: [...(prev[curr[0]] ? prev[curr[0]] : []), curr[1]],
        });

        const adoptMaximumAttention = (
            /** @type {{ [x: string]: string[]; }} */ obj
        ) =>
            Object.keys(obj).reduce(
                (prev, curr) => ({
                    ...prev,
                    [curr]: Math.max(...obj[curr].map((f) => parseFloat(f))),
                }),
                Object.create(null)
            );

        const unpackPrompts = (/** @type {{ [x: string]: any; }} */ obj) =>
            Object.keys(obj).reduce(
                (
                    /** @type {string[]} **/ prev,
                    /** @type {string} **/ curr
                ) => [
                    ...prev,
                    obj[curr] === 1 ? curr : `(${curr}:${obj[curr]})`,
                ],
                []
            );

        /** @type {string[]} **/
        const promptsPure = text
            .replace(reTrailingComma, "")
            .split(",")
            .map((x) => x.trim());

        const promptsAdditionalNetwork = promptsPure.filter((x) =>
            reLoRA.exec(x)
        );

        const promptWithDecimals = promptsPure
            .filter((x) => !reLoRA.exec(x))
            .map((x) => unwrapParentheses(x))
            .map((x) => separateDecimals(x));

        /** @type {{ [x: string]: string[] }} **/
        const promptsWithAttentions = promptWithDecimals.reduce(
            (p, c) => accumulateAttentions(p, c),
            Object.create(null)
        );

        /** @type {string[]} **/
        const promptsUnpacked = unpackPrompts(
            adoptMaximumAttention(promptsWithAttentions)
        );

        /** @type {string} **/
        const outPrompt = [
            ...promptsUnpacked,
            ...promptsAdditionalNetwork,
        ].join(", ");

        /** @type {number} **/
        const numberReduced =
            promptWithDecimals.length - promptsUnpacked.length;

        /** @type {string[]} **/
        const promptReduced = Object.keys(promptsWithAttentions).filter(
            (x) => promptsWithAttentions[x].length > 1
        );

        /** @type {{number: number; prompt: string[]}} **/
        const reduced = {
            number: numberReduced,
            prompt: promptReduced,
        };

        // console.log(promptsWithAttentions);

        return {
            outPrompt: outPrompt,
            reduced: reduced,
        };
    }
</script>
