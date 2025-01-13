import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()]
});


// import { sveltekit } from '@sveltejs/kit/vite';
// import { defineConfig } from 'vite';

// export default defineConfig({
//   plugins: [sveltekit()],
//   server: {
//     watch: {
//       usePolling: true, // Active le polling pour surveiller les fichiers
//       interval: 500,    // Intervalle en millisecondes
//     },
//   },
// });