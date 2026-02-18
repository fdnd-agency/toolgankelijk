<script>
    import { gsap } from "gsap";
    import { onMount } from 'svelte';


    onMount(() => {
        gsap.registerPlugin(MorphSVGPlugin)

        let tlSuccess = gsap.timeline();

        tlSuccess
            .to("#loader-success", {duration: 2, rotate: 360})
            .to("#loader-success-1", {duration: 0.1, morphSVG: "M3.051,66.5h0c2.343-2.343,6.142-2.343,8.485,0l19.257,19.257c2.343,2.343,2.343,6.142,0,8.485h0c-2.343,2.343-6.142,2.343-8.485,0L3.051,74.986c-2.343-2.343-2.343-6.142,0-8.485Z", stagger: 0.1})
            .to("#loader-success-2", {duration: 0.1, morphSVG: "M92.89,23.812h0c2.343,2.343,2.343,6.142,0,8.485l-61.468,61.468c-2.343,2.343-6.142,2.343-8.485,0h0c-2.343-2.343-2.343-6.142,0-8.485l61.468-61.468c2.343-2.343,6.142-2.343,8.485,0Z", fill: "#b9005f"})
    });

</script>

    <svg id="loader-success" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
      
      <path id="loader-success-1" d="M48,0C21.49,0,0,21.49,0,48s21.49,48,48,48,48-21.49,48-48S74.51,0,48,0ZM48,83.312c-19.502,0-35.312-15.81-35.312-35.312S28.498,12.688,48,12.688s35.312,15.81,35.312,35.312-15.81,35.312-35.312,35.312Z"/>   
      
       <path id="loader-success-2" d="M28.257,18.719c5.636-3.807,12.43-6.031,19.743-6.031V0c-10.121,0-19.511,3.133-27.252,8.481C8.213,17.141,0,31.612,0,48h12.688c0-12.189,6.176-22.935,15.569-29.281Z"/>
</svg>

<style>

    #loader-success {
        width: 96px;
        height: 96px;
    }

    #loader-success-1 {
        fill: var(--color-primary);
    }

    #loader-success-2 {
        fill: var(--color-primary-light);
    }

</style>