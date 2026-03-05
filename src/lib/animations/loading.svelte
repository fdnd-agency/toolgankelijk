<script>
	let { itemArray = [], urlCount, urlTotal, type } = $props();

	let logCount = $derived(itemArray.length);
	let logList;
	let prevLen = 0;

      <path id="loader-1" d="M48,0C21.49,0,0,21.49,0,48s21.49,48,48,48,48-21.49,48-48S74.51,0,48,0ZM48,83.312c-19.502,0-35.312-15.81-35.312-35.312S28.498,12.688,48,12.688s35.312,15.81,35.312,35.312-15.81,35.312-35.312,35.312Z"/>
        <path id="loader-2" d="M28.257,18.719c5.636-3.807,12.43-6.031,19.743-6.031V0c-10.121,0-19.511,3.133-27.252,8.481C8.213,17.141,0,31.612,0,48h12.688c0-12.189,6.176-22.935,15.569-29.281Z"/>
</svg>

<style>
    #loader {
        width: 32px;
        height: 32px;
        animation: turning 2s infinite;
    }

    #loader-1 {
        fill: var(--color-primary);
    }

    #loader-2 {
        fill: var(--color-primary-light);
    }

    @keyframes turning {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}
</style>