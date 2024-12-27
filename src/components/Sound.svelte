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

    const oscillatorTypes = ['sine', 'square', 'sawtooth', 'triangle', 'pulse'];
    let selectedOscillator = 'sine';
    let frequency = 440;
    let detune = 0;
    let pulseWidth = 0.5;
    let attack = 0.01;
    let release = 1;

    // Initialisation des effets
    function initEffects() {
        if (!autoWah) autoWah = new Tone.AutoWah(50, 6, -90).toDestination();
        if (!chorus) chorus = new Tone.Chorus(10, 4.5, 0.5).toDestination();
        if (!reverb) reverb = new Tone.Reverb({ decay }).toDestination();
    }

    function updateSynth() {
        // Créer ou mettre à jour le synthétiseur
        if (!synth) {
            synth = new Tone.Synth({
                oscillator: { type: selectedOscillator, width: pulseWidth },
                envelope: { attack, release },
            }).toDestination();
        } else {
            synth.oscillator.type = selectedOscillator;
            if (selectedOscillator === 'pulse') {
                synth.oscillator.width = pulseWidth;
            }
            synth.oscillator.frequency.value = frequency;
            synth.oscillator.detune.value = detune;
            synth.envelope.attack = attack;
            synth.envelope.release = release;
        }

        // Reconnecter les effets si nécessaire
        reconnectEffects();
    }

    function reconnectEffects() {
        // Déconnecter tous les effets
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
    }

    function play(note) {
        if (Tone.context.state !== 'running') {
            Tone.start();
        }

        // Met à jour et joue la note
        updateSynth();
        synth.triggerAttackRelease(note, '8n');
    }

    function toggleReverb() {
        useReverb = !useReverb;
        activeReverb = !activeReverb;
        reconnectEffects();
    }

    function toggleChorus() {
        useChorus = !useChorus;
        activeChorus = !activeChorus;
        reconnectEffects();
    }

    function toggleWah() {
        useWah = !useWah;
        activeWah = !activeWah;
        reconnectEffects();
    }

    // Initialisation
    initEffects();
</script>



        <!-- Interface utilisateur -->
        <div>
                <!-- Contrôle des oscillateurs -->
                <label for="oscillator-type">Type d'oscillateur :</label>
                <select id="oscillator-type" bind:value={selectedOscillator}>
                        {#each oscillatorTypes as type}
                                <option value={type}>{type}</option>
                        {/each}
                </select>

                <!-- Fréquence -->
                <label>
                        Fréquence (Hz): {frequency}
                        <input type="range" min="20" max="2000" step="1" bind:value={frequency} />
                </label>

                <!-- Détune -->
                <label>
                        Détune (cents): {detune}
                        <input type="range" min="-1200" max="1200" step="1" bind:value={detune} />
                </label>

                <!-- Largeur d'impulsion -->
                {#if selectedOscillator === 'pulse'}
                        <label>
                                Largeur d'impulsion: {pulseWidth.toFixed(2)}
                                <input type="range" min="0.01" max="1" step="0.01" bind:value={pulseWidth} />
                        </label>
                {/if}

                <!-- Enveloppe -->
                <label>
                        Attaque: {attack}s
                        <input type="range" min="0.01" max="2" step="0.01" bind:value={attack} />
                </label>
                <label>
                        Relâchement: {release}s
                        <input type="range" min="0.1" max="5" step="0.1" bind:value={release} />
                </label>
        </div>


  <div>
    <button 
        on:click={toggleReverb} 
        class="{activeReverb ? 'active-button' : ''}">
        Reverb
    </button>
    <button 
        on:click={toggleChorus} 
        class="{activeChorus ? 'active-button' : ''}">
        Chorus
    </button>
    <button 
        on:click={toggleWah} 
        class="{activeWah ? 'active-button' : ''}">
        Wah
    </button>
</div>

        <!-- Clavier -->
        <div class="container-keyboard">
                <!-- Notes noires -->
                <div class="keyboard-black up left">
                        {#each ['C#4', 'D#4'] as note}
                                <button on:click={() => play(note)} class="touch-black black border-black">{note}</button>
                        {/each}
                </div>

                <div class="keyboard-black up center">
                        {#each ['F#4', 'G#4', 'A#4'] as note}
                                <button on:click={() => play(note)} class="touch-black black border-black">{note}</button>
                        {/each}
                </div>

                <div class="keyboard-black up right">
                        {#each ['C#5', 'D#5'] as note}
                                <button on:click={() => play(note)} class="touch-black black border-black">{note}</button>
                        {/each}
                </div>

                <!-- Notes blanches -->
                <div class="keyboard down">
                        {#each ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5'] as note}
                                <button on:click={() => play(note)} class="touch white border">{note}</button>
                        {/each}
                </div>
        </div>

        <style>
                .active-button{
                        background-color: blue;
                }
                .container-keyboard {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        width: 80%;
                        height: 400px;
                        position: relative;
                        background-color: rgb(29, 28, 28);
                        margin: 0 auto;
                }
                .keyboard {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: center;
                        gap: 1px;
                }
                .keyboard-black {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: center;
                        gap: 1px;
                        max-height: 90px;
                        position: absolute;
                        top: 105px;
                }
                .left {
                        left: 330px;
                }
                .center {
                        left: 480px;
                }
                .right {
                        left: 680px;
                }
                .down {
                        z-index: 1;
                        position: absolute;
                        bottom: 125px;
                        left: 300px;
                }
                .up {
                        z-index: 2;
                }
                .border {
                        border-top-left-radius: 0px;
                        border-bottom-right-radius: 10px;
                        border-bottom-left-radius: 10px;
                }
                .border-black {
                        border-top-left-radius: 0px;
                        border-top-right-radius: 0px;
                        border-bottom-right-radius: 5px;
                        border-bottom-left-radius: 5px;
                }
                .touch {
                        display: flex;
                        align-items: end;
                        justify-content: end;
                        border: none;
                        width: 50px;
                        height: 170px;
                        font-size: 0.7rem;
                        font-weight: 100;
                }
                .touch-black {
                        display: flex;
                        align-items: end;
                        justify-content: end;
                        border: none;
                        width: 50px;
                        height: 85px;
                        font-size: 0.7rem;
                        font-weight: 100;
                }
                .white {
                        background-color: white;
                }
                .black {
                        background-color: black;
                        color: white;
                }
        </style>
