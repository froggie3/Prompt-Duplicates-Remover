<div class="header-wrapper">
    <a href="/">
        <h1 class="header-title">Prompt Duplicates Remover</h1>
    </a>
</div>

<style>
    a {
        color: white;
        font-style: normal;
        text-decoration: none;
    }
    .header-title::before {
        content: "";
        background-image: url(../img/icon/icon-192.png);
        background-size: 100%;
        width: 1.5rem;
        height: 1.5rem;
        display: inline-block;
        margin-right: 0.25em;
        position: relative;
        vertical-align: bottom;
    }

    .header-wrapper {
        background-color: var(--text-color-black);
        box-shadow: var(--primary-shadow);
        color: var(--background-color-white);
        margin-bottom: 3rem;
        padding: 1rem 1rem;
        width: max(65vw, 100%);
        max-width: 100%;
        display: flex;
        place-items: baseline;
    }

    @media screen and (max-width: 767px) {
        .header-title {
            font-size: 1em;
        }

        .header-wrapper {
            justify-content: space-between;
            margin-bottom: 2rem;
            padding: 1rem 1rem;
        }
    }
</style>
