<style>
    @media screen and (max-width: 767px) {
        .readme {
            width: 100%;
            padding: 0;
            box-shadow: none;
        }
    }
    .document-wrapper {
        line-height: 1.75;
        word-break: normal;
        box-shadow: none !important;
    }

    .document-wrapper :is(h1, h2, h3, h4, h5, h6, p) {
        margin-bottom: 1em;
    }

    .readme {
        width: calc(600px + 2rem);
        margin: 0 auto;
        box-shadow: var(--primary-shadow);
        padding: 2rem;
    }

    p + img,
    div.readme > img {
        display: block;
        width: 100%;
        margin-bottom: 1em;
    }
</style>
