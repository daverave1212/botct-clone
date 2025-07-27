
<style>
    :root {
        --base-nav-height: 70px;
    }
    nav a {
        text-decoration: none;
        line-height: calc(var(--base-nav-height));

        font-size: 1.25rem;
    }
    @media (orientation: landscape) {
        nav {
            width: 100%;
            height: 70px;

            background-color: #333333;
            padding-left: 3rem;
            padding-right: 3rem;
        }
        nav .landscape-only {
            width: 100%;
            height: 100%;

            gap: 3rem;
        }
        nav a {
            color: white;
        }
    }

    @media (orientation: portrait) {
        nav {
            width: 100vw;
            height: 0px;
        }

        .portrait-side-menu-content {
            width: 100%;
            padding: 3rem;

            font-size: 1.25rem;

            display: flex;
            flex-direction: column;
        }

        nav a {
            color: rgb(63, 63, 63);
        }
    }

</style>

<script>

    import SideMenu from "./SideMenu.svelte"

    export let options = []
    export let isBurgerOpen
    export let setIsBurgerOpen

</script>

<nav>
    <div class="landscape-only flex-content">
        {#each options as {name, href}}
            <a href={href}>{name}</a>
        {/each}
    </div>
    <div class="portrait-only">
        <slot></slot>
        <SideMenu isOpen={isBurgerOpen} setIsOpen={setIsBurgerOpen}>
            <div class="portrait-side-menu-content">
                {#each options as {name, href}}
                    <a href={href}>{name}</a>
                {/each}
            </div>
        </SideMenu>
    </div>
</nav>