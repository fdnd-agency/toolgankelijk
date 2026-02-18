<script>
    import { gsap } from "gsap";
    import { onMount } from 'svelte';

    gsap.registerPlugin(MorphSVGPlugin)

    let tlError = gsap.timeline();

    onMount(() => {
    tlError
    .to("#loader-error", {duration: 2, rotate: 360})

    .to("#loader-error-1",{duration: 0.1, morphSVG: "M82.962,13.023h0c2.343,2.343,2.343,6.142,0,8.485l-61.468,61.468c-2.343,2.343-6.142,2.343-8.485,0h0c-2.343-2.343-2.343-6.142,0-8.485L74.477,13.023c2.343-2.343,6.142-2.343,8.485,0Z", stagger: 0.1})

    .to("#loader-error-2",{duration: 0.1, morphSVG: "M82.991,82.977h0c-2.343,2.343-6.142,2.343-8.485,0L13.038,21.509c-2.343-2.343-2.343-6.142,0-8.485h0c2.343-2.343,6.142-2.343,8.485,0l61.468,61.468c2.343,2.343,2.343,6.142,0,8.485Z",fill: "#b9005f"})
        });

</script>

    <svg id="loader-error" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
      
      <path id="loader-error-1" d="M48,0C21.49,0,0,21.49,0,48s21.49,48,48,48,48-21.49,48-48S74.51,0,48,0ZM48,83.312c-19.502,0-35.312-15.81-35.312-35.312S28.498,12.688,48,12.688s35.312,15.81,35.312,35.312-15.81,35.312-35.312,35.312Z"/>   
      
       <path id="loader-error-2" d="M28.257,18.719c5.636-3.807,12.43-6.031,19.743-6.031V0c-10.121,0-19.511,3.133-27.252,8.481C8.213,17.141,0,31.612,0,48h12.688c0-12.189,6.176-22.935,15.569-29.281Z"/>
    </svg>

<style>

    #loader-error {
        width: 96px;
        height: 96px;
    }

    #loader-error-1 {
        fill: var(--color-primary);
    }

    #loader-error-2 {
        fill: var(--color-primary-light);
    }
</style>