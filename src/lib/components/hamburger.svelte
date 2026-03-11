<a href="#main-nav" aria-label="open menu" class="hamburger-link">
    <p>Menu</p>
    <svg width="29" height="18" viewBox="0 0 29 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="28.125" height="2.25" rx="1.125" fill="currentColor"/>
        <rect y="7.875" width="28.125" height="2.25" rx="1.125" fill="currentColor"/>
        <rect y="15.75" width="28.125" height="2.25" rx="1.125" fill="currentColor"/>
    </svg>
</a>

<style>
    .hamburger-link {
        display: flex;
        gap: 0.5em;
        align-items: center;
        text-decoration: none;
        color: var(--color-primary);
        z-index: 20;
        grid-column: 3;
        margin-left: auto;

        p {
            font-weight: 700;
        }
    }
    
    @media (min-width: 1260px) {
        .hamburger-link { 
            display: none; 
        }
    }
</style>