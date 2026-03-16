<a href="#" class="close-menu" aria-label="Sluit menu">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect 
            x="2" y="0.5" 
            width="28" height="3" 
            rx="1.5" 
            transform="rotate(45 2 0.5)"/>
        <rect 
            x="0" y="20.5" 
            width="28" height="3" 
            rx="1.5" 
            transform="rotate(-45 0 20.5)" />
    </svg>
</a>

<style>
    .close-menu {
        grid-column: 3;
        text-decoration: none;
        color: var(--color-primary);
        font-weight: bold;
        display: none;
        z-index: 20;

        rect {
            fill: var(--color-primary);
        }
    }

    @media (min-width: 1260px) {
        .close-menu {
            display: none;
        }
    }
</style>