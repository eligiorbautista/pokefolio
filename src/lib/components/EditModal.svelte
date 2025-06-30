<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let isOpen = false;
    export let profile: any;
    export let pokemonList: any[] = [];
    export let isSaving = false;

    const dispatch = createEventDispatcher();

    let searchInput = "";

    function closeModal() {
        isOpen = false;
        dispatch('close');
    }

    function saveChanges() {
        dispatch('save', { profile });
    }

    function togglePokemon(newPokemonId: number) {
        let pokemonIDs: number[] = profile.pokemon_ids;

        if (pokemonIDs.length >= 3 && !pokemonIDs.includes(newPokemonId)) {
            alert("You can only have 3 Pokemons!");
            return;
        }

        if (pokemonIDs.includes(newPokemonId)) {
            pokemonIDs = pokemonIDs.filter((id: number) => id !== newPokemonId);
            profile.pokemon_ids = pokemonIDs;
        } else {
            pokemonIDs.push(newPokemonId);
        }
        profile.pokemon_ids = [...pokemonIDs];
    }

    // Filter Pokemon list based on search
    $: filteredPokemonList = pokemonList.filter((pokemon: any) => 
        pokemon.name.toLowerCase().includes(searchInput.toLowerCase())
    );
</script>

<!-- Enhanced Modal -->
<dialog class="modal" class:modal-open={isOpen}>
    <div class="modal-box w-[95vw] sm:w-11/12 max-w-4xl max-h-[95vh] bg-slate-800 border border-white/20 p-3 sm:p-6 mx-2 sm:mx-4">
        <div class="flex justify-between items-start mb-3 sm:mb-6">
            <h2 class="text-lg sm:text-2xl lg:text-3xl font-bold text-white leading-tight pr-2">✨ Edit Your PokePage</h2>
            <button class="btn btn-sm btn-circle btn-ghost text-white flex-shrink-0" on:click={closeModal}>✕</button>
        </div>
        
        <div class="overflow-y-auto max-h-[calc(95vh-7rem)] sm:max-h-[calc(90vh-8rem)]">
            <!-- Description Section -->
            <div class="mb-4 sm:mb-8">
                <label for="profile-description" class="label py-1 sm:py-2">
                    <span class="label-text text-white text-sm sm:text-lg font-semibold">📝 Profile Description</span>
                </label>
                <textarea
                    id="profile-description"
                    bind:value={profile.description}
                    class="textarea textarea-bordered w-full h-20 sm:h-32 bg-slate-700 text-white border-slate-600 focus:border-blue-500 text-sm sm:text-base resize-none"
                    placeholder="Tell everyone about yourself and your favorite Pokemon..."
                ></textarea>
            </div>

            <!-- Pokemon Selection -->
            <div class="mb-3 sm:mb-6">
                <div class="label py-1 sm:py-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                    <span class="label-text text-white text-sm sm:text-lg font-semibold">🎯 Choose Your Pokemon (Max 3)</span>
                    <span class="label-text-alt text-gray-400 text-xs sm:text-sm">{profile.pokemon_ids.length}/3 selected</span>
                </div>
                
                <!-- Search Input -->
                <div class="relative mb-3 sm:mb-4">
                    <input
                        id="pokemon-search"
                        type="text"
                        class="input input-bordered w-full bg-slate-700 text-white border-slate-600 focus:border-blue-500 pl-10 pr-4 text-sm sm:text-base h-10 sm:h-12"
                        placeholder="Search for Pokemon..."
                        bind:value={searchInput}
                    />
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base">🔍</span>
                </div>

                <!-- Pokemon Grid -->
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5 sm:gap-3 max-h-48 sm:max-h-80 overflow-y-auto bg-slate-700/50 rounded-lg p-2 sm:p-4">
                    {#each filteredPokemonList as pokemon, index}
                        <button
                            class="pokemon-selector {profile.pokemon_ids.includes(index + 1) ? 'selected' : ''}"
                            on:click={() => togglePokemon(index + 1)}
                        >
                            <div class="text-center p-1.5 sm:p-3 rounded-lg transition-all duration-200 hover:bg-slate-600 {profile.pokemon_ids.includes(index + 1) ? 'bg-blue-600 ring-1 sm:ring-2 ring-blue-400' : 'bg-slate-700'} min-h-[50px] sm:min-h-[80px] flex flex-col justify-center relative">
                                <h3 class="text-white text-xs sm:text-sm font-medium capitalize truncate leading-tight">
                                    {pokemon.name}
                                </h3>
                                {#if profile.pokemon_ids.includes(index + 1)}
                                    <div class="text-xs text-blue-200 mt-0.5 sm:mt-1">✓</div>
                                {/if}
                            </div>
                        </button>
                    {/each}
                    
                    {#if filteredPokemonList.length === 0}
                        <div class="col-span-full text-center py-4 sm:py-8 text-gray-400 text-xs sm:text-base">
                            No Pokemon found matching "{searchInput}"
                        </div>
                    {/if}
                </div>
            </div>
        </div>

        <!-- Modal Actions -->
        <div class="modal-action mt-3 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
                class="btn btn-ghost text-white w-full sm:w-auto order-2 sm:order-1 h-10 sm:h-12 text-sm sm:text-base"
                on:click={closeModal}
            >
                Cancel
            </button>
            <button
                class="btn btn-primary bg-gradient-to-r from-green-600 to-blue-600 border-none hover:from-green-700 hover:to-blue-700 w-full sm:w-auto order-1 sm:order-2 h-10 sm:h-12 text-sm sm:text-base"
                on:click={saveChanges}
                disabled={isSaving}
            >
                {#if isSaving}
                    <span class="loading loading-spinner loading-sm"></span>
                    <span class="hidden sm:inline">Saving...</span>
                    <span class="sm:hidden">Save...</span>
                {:else}
                    <span class="hidden sm:inline">💾 Save Changes</span>
                    <span class="sm:hidden">💾 Save</span>
                {/if}
            </button>
        </div>
    </div>
    <button 
        type="button"
        class="modal-backdrop bg-black/50" 
        aria-label="Close modal"
        on:click={closeModal}
    ></button>
</dialog>

<style>
    .pokemon-selector {
        @apply transition-all duration-200 transform hover:scale-105;
    }
    
    .pokemon-selector.selected {
        @apply ring-2 ring-blue-400;
    }
</style> 