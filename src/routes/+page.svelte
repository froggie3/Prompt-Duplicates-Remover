<script>
    import Header from "./Header.svelte";
    import PasteArea from "./PasteArea.svelte";
</script>

<svelte:head>
    <title>Prompt Duplicates Remover</title>
    <meta
        name="description"
        content="This tool allows you to remove every duplicated prompts at once."
    />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta
        property="og:description"
        content="This tool allows you to remove every duplicated prompts at once."
    />
    <!-- <meta property="og:image" content="https://tools.yokkin.com/prompts/img/ogp.png" />
  <meta property="og:site_name" content="Prompt Duplicates Remover" />
  <meta property="og:title" content="Prompt Duplicates Remover" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://tools.yokkin.com/prompts/" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:creator" content="@froggie3_" />
  <meta name="twitter:site" content="@froggie3_" />
  <link href="css/ress.min.css" rel="stylesheet">
  <link href="css/style.css?v=1.0.6b" rel="stylesheet">
  <link rel="manifest" href="site.webmanifest">
  <link rel="apple-touch-icon" href="img/apple-touch-icon.png?v=1.0.6b">
  <link rel="icon" href="img/favicon.ico?v=1.0.6b" sizes="any">
  <link rel="icon" href="img/icon.svg?v=1.0.6b" type="image/svg+xml"> -->
    <meta name="theme-color" content="#333333" />
</svelte:head>

<Header />

<div id="container">
    <PasteArea />
</div>

<style>
    #container {
        animation-duration: 1s;
        animation-fill-mode: both;
        animation-name: slidein;
    }

    #container {
        /* max-width: var(--max-width); */
        /* width: max(65vw, 100%); */
        display: flex;
        flex-direction: column;
        grid-gap: 3rem 0;
        height: max-content;
        margin: 0 auto;
        padding: 0 1rem;
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

    .prompt-information-title {
    }

    @media screen and (max-width: 767px) {
        .paste-area-wrapper {
            padding: 0rem 0rem;
        }

        .prompt-information-title {
        }
    }

    #container > div {
        padding: 2rem;
        /* box-shadow: var(--primary-shadow); */
    }

    @media screen and (max-width: 767px) {
        #container > div {
            box-shadow: none;
            padding: 0rem;
        }
    }
</style>
