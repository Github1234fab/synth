<script>
	import * as Tone from 'tone';

	let synth;
	let autoWah;
	let chorus;
	let reverb;
	let useReverb = false;
	let useChorus = false;
	let useWah = false;
	let decay = 2;

	let activeReverb = false;
	let activeChorus = false;
	let activeWah = false;

	let activeNote = 'Note'; // Variable pour stocker la note jouée

	// Contrôles pour les oscillateurs
	const oscillatorTypes = ['sine', 'square', 'sawtooth', 'triangle'];
	let selectedOscillator = 'sine';
	let frequency = 440;
	let detune = 0;
	// let pulseWidth = 0.5;
	let attack = 0.01;
	let release = 1;

	function play(note) {
		if (Tone.context.state !== 'running') {
			Tone.start();
		}

		activeNote = note;

		if (!synth) {
			synth = new Tone.Synth({
				oscillator: { type: selectedOscillator },
				envelope: { attack, release }
			});
		} else {
			synth.oscillator.type = selectedOscillator;

			synth.oscillator.frequency.value = frequency;
			synth.oscillator.detune.value = detune;
			synth.envelope.attack = attack;
			synth.envelope.release = release;
		}

		if (!autoWah) autoWah = new Tone.AutoWah(50, 6, -90);
		if (!chorus) chorus = new Tone.Chorus(10, 4.5, 0.5);
		if (!reverb) reverb = new Tone.Reverb({ decay }).toDestination();

		// Connect effects conditionally
		synth.disconnect();

		let effectsChain = synth;

		if (useWah) {
			effectsChain.connect(autoWah);
			effectsChain = autoWah;
		}
		if (useChorus) {
			effectsChain.connect(chorus);
			effectsChain = chorus;
		}
		if (useReverb) {
			effectsChain.connect(reverb);
		} else {
			effectsChain.connect(Tone.Destination);
		}

		synth.triggerAttackRelease(note, '8n');
	}

	function toggleReverb() {
		useReverb = !useReverb;
		activeReverb = !activeReverb;
	}

	function toggleChorus() {
		useChorus = !useChorus;
		activeChorus = !activeChorus;
	}

	function toggleWah() {
		useWah = !useWah;
		activeWah = !activeWah;
	}
</script>

<!-- -----------------------------Clavier-------------------------------------------- -->

<div class="container">
	<div class="container-interface">
		<div class="wrapper__oscillator">
			<label for="oscillator-type">Type d'oscillateur :</label>
			<select id="oscillator-type" bind:value={selectedOscillator}>
				{#each oscillatorTypes as type}
					<option value={type}>{type}</option>
				{/each}
			</select>

			<label>
				Fréquence (Hz): {frequency}
				<input class="slider" type="range" min="20" max="2000" step="1" bind:value={frequency} />
			</label>

			<label>
				Détune (cents): {detune}
				<input class="slider" type="range" min="-1200" max="1200" step="1" bind:value={detune} />
			</label>

			<label>
				Attaque: {attack}s
				<input class="slider" type="range" min="0.01" max="2" step="0.01" bind:value={attack} />
			</label>
			<label>
				Relâchement: {release}s
				<input class="slider" type="range" min="0.1" max="5" step="0.1" bind:value={release} />
			</label>
		</div>
		<div class="wrapper__buttonEffects">
			<button on:click={toggleReverb} class={activeReverb ? 'active-button' : 'button-effect'}>
				Reverb
			</button>
			<button on:click={toggleChorus} class={activeChorus ? 'active-button' : 'button-effect'}>
				Chorus
			</button>
			<button on:click={toggleWah} class={activeWah ? 'active-button' : 'button-effect'}>
				Wah
			</button>
		</div>
	</div>

	<div class="keyboard">
		{#each ['C#4 - DO#4', 'D#4 - RÉ#4', 'F#4 - F#4', 'G#4 - SOL#4', 'A#4 - LA#4', 'C#5 - DO#4', 'D#5 - RÉ#5'] as note}
			<button on:click={() => play(note)} class="touch-black">{note}</button>
		{/each}

		{#each ['C4 - DO4', 'D4 - RÉ4', 'E4 - MI4', 'F4 - FA4', 'G4 - SOL4', 'A4 - LA4', 'B4 - SI4', 'C5 - DO5', 'D5 - RÉ5', 'E5 - MI5', 'F5 - FA5'] as note}
			<button on:click={() => play(note)} class="touch">{note}</button>
		{/each}
	</div>

	<p class="activeNoteDisplay">{activeNote}</p>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		height: 100vh;
		background-color: #0b0b0b;
	}
	.active-button {
		background: linear-gradient(to top, #4136e4, #a8afe8);
		color: black;
		padding: 10px 30px;
		max-width: 100px;
		border: none;
		box-shadow: inset 0px 0px 10px 0px #000000;
	}
	.button-effect {
		background: linear-gradient(to top, #ffd700, #d8ce90);
		color: black;
		padding: 10px 30px;
		max-width: 100px;
		border: none;
		box-shadow: inset 0px 0px 10px 0px #000000;
		font-weight: 400;
	}
	.container-interface {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 700px;
		height: 500px;
		gap: 1rem;
		margin-top: 50px;
	}
	.wrapper__oscillator {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 0px;
		padding: 20px 20px;
		border: 1px solid rgb(54, 53, 53);
		border-radius: 10px;
		box-shadow: 0px 0px 10px 0px #000000;
	}
	select {
		appearance: none; /* Supprime le style natif */
		-webkit-appearance: none; /* Supprime le style natif pour Webkit */
		-moz-appearance: none; /* Supprime le style natif pour Firefox */
		color: black;
		padding: 7px 10px;
		text-align: center;
		max-width: 100px;
		border: none;
		box-shadow: inset 0px 0px 10px 1px #000000;
		font-weight: 400;
		background: linear-gradient(to top, #ffd700, #d8ce90);
	}

	select:focus {
		outline: none;
		border-color: #007bff; /* Couleur de bordure au focus */
		box-shadow: 0 0 4px #007bff;
	}

	.slider {
		appearance: none;
		-webkit-appearance: none;
		width: 50%; /* Largeur complète */
		height: 5px; /* Épaisseur de la barre */
		background: #2c2c2c; /* Couleur de la barre */
		border-radius: 4px; /* Bords arrondis */
		outline: none; /* Retirer la bordure lors de la sélection */
		transition: background 0.3s; /* Animation sur la couleur */
		box-shadow: inset 0 2px 3px 1px rgba(0, 0, 0, 0.3); /* Ombre légère */
		border: 1px solid rgb(52, 52, 52);
	}

	.slider:hover {
		background: #323232; /* Changement de couleur au survol */
	}

	/* Style pour le bouton (thumb) */
	.slider::-webkit-slider-thumb {
		-webkit-appearance: none; /* Désactiver le style par défaut pour Safari */
		appearance: none;
		width: 20px;
		height: 20px;
		background: linear-gradient(45deg, #222222, #565656);
		border-radius: 20%;
		cursor: pointer;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
	}

	.slider::-moz-range-thumb {
		width: 20px;
		height: 20px;
		background: linear-gradient(45deg, #222222, #565656);
		border-radius: 20%;
		cursor: pointer;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
	}

	/* Pour un effet visuel lorsqu'il est actif */
	.slider::-webkit-slider-thumb:active {
		transform: scale(1.2); /* Agrandir légèrement le bouton */
		background: linear-gradient(45deg, #3d3d3d, #e36565);
	}

	.wrapper__buttonEffects {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		height: 50px;
		width: auto;
		padding: 20px;
		border: 1px solid rgb(54, 53, 53);
		border-radius: 10px;
		box-shadow: 0px 0px 10px 0px #000000;
	}

	label {
		color: rgba(126, 126, 126, 0.703);
		padding: 9px;
		font-family: Arial, Helvetica, sans-serif;
		font-size: 0.7rem;
	}

	.keyboard {
		position: relative;
		display: flex;
		align-items: center;
		width: 600px;
		height: 250px;
		background:  #ffd90024;
		gap: 2px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		margin-top: 60px;
		border: 10px solid rgb(25, 16, 16);
		border-radius: 8px;
	}


	.touch {
		flex: 1; /* Équilibre les touches blanches */
		height: 100%;
		background: linear-gradient(45deg, rgb(216, 216, 194), #3c3838);
		border: 1px solid #000;
		box-shadow: inset 0 -2px 3px rgba(0, 0, 0, 0.3);
		color: transparent;
		border-bottom-left-radius: 5px;
		border-bottom-right-radius: 5px;
		z-index: 1;
		border: none;
	}
	.touch:active {
		background: linear-gradient(45deg, #0e2f7b, rgb(80, 89, 208));
		color: transparent;
		display: flex;
		align-items: last baseline;
		justify-content: center;
		text-align: center;
	}

	.touch-black {
		color: transparent;
		position: absolute;
		width: 40px;
		height: 60%;
		background: linear-gradient(45deg, rgb(37, 37, 37), #000000);
		box-shadow: inset 0 -2px 3px rgba(0, 0, 0, 0.5);
		z-index: 2;
		border: none;
		border-bottom-left-radius: 5px;
		border-bottom-right-radius: 5px;
	}
	.touch-black:active {
		background: linear-gradient(45deg, #bbb910, rgb(138, 179, 5));
		color: transparent;
		display: flex;
		align-items: last baseline;
		justify-content: center;
		text-align: center;
	}

	.touch-black:nth-child(1) {
		left: 32px; /* Ajuste pour aligner avec la touche blanche */
		top: 0;
	}

	.touch-black:nth-child(2) {
		left: 86px;
		top: 0;
	}

	.touch-black:nth-child(3) {
		left: 195px;
		top: 0;
	}
	.touch-black:nth-child(4) {
		left: 250px;
		top: 0;
	}
	.touch-black:nth-child(5) {
		left: 303px;
		top: 0;
	}
	.touch-black:nth-child(6) {
		left: 412px;
		top: 0;
	}
	.touch-black:nth-child(7) {
		left: 467px;
		top: 0;
	}
        	.activeNoteDisplay {
		color: rgb(155, 153, 153);
		font-size: 1rem;
		margin-top: 20px;
		font-family: 'Courier New', Courier, monospace;
		border: 1px solid rgb(62, 62, 62);
		padding: 10px 15px;
		min-width: 200px;
		text-align: center;
		border-radius: 8px;
	}

@media screen and (max-width: 768px)  {
        .container-interface{
                margin-top: 5px;
        }
     .wrapper__oscillator {
        flex-direction: row;
                width: 75%;
        }
        .keyboard {
                margin-top: 100px;
                width: 500px;
                height: 150px;
        }
        .touch-black {
                width: 30px;
        }
      
        .touch-black:nth-child(1) {
		left: 26px; 
		top: 0;
	}

	.touch-black:nth-child(2) {
		left: 73px;
		top: 0;
	}

	.touch-black:nth-child(3) {
		left: 160px;
		top: 0;
	}
	.touch-black:nth-child(4) {
		left: 205px;
		top: 0;
	}
	.touch-black:nth-child(5) {
		left: 245px;
		top: 0;
	}
	.touch-black:nth-child(6) {
		left: 332px;
		top: 0;
	}
	.touch-black:nth-child(7) {
		left: 382px;
		top: 0;
	}
        	.activeNoteDisplay {
		color: rgb(155, 153, 153);
		font-size: 0.5rem;
		margin-top: 45px;
		font-family: 'Courier New', Courier, monospace;
                border: none;
		padding: 10px 15px;
		min-width: 200px;
		text-align: center;
		border-radius: 8px;
	}

}

</style>


