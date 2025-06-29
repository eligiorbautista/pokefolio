<!--  localhost:5173/dev.elibautista@gmail.com -->
<script lang="ts">
    export let data;
    import { page } from "$app/stores";
    import { getPokemonList, getPokemon } from "$lib/pokemonAPI";
    let { supabase, session } = data;
    $: ({ supabase, session } = data);
    $: email = $page.params.email;

    let pokemonList: any = [];
    let pokemonData: any = [];
    let profile: any = {
        description:
            "This is your profile description, feel free to write about yourself or your favorite Pokemons.",
        pokemon_ids: [1, 2, 3],
    };
    let isModalOpen = false;
    let searchInput = "";
    let isLoading = true;
    let isSaving = false;

    // profiles in Supabase which has columns for a description, pokemon_ids, and email
    // from this page, we can use the supabase object to th)en save to our database (grab data)

    async function refreshPokemonData() {
        try {
            // Get all Pokemon data at once
            const promises = profile.pokemon_ids.map((id: number) => {
                return getPokemon(id.toString());
            });

            // We use Promise.all to wait for all async operations to complete and add the data to the pokemonData array;
            pokemonData = await Promise.all(promises);
        } catch (error) {
            console.error("Error loading Pokemon:", error);
            pokemonData = [];
        }
    }

    async function saveProfile() {
        const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("email", email);

        if (profileData?.length === 0 && email === session?.user?.email) {
            // create a new row in the profiles table
            const { data, error } = await supabase.from("profiles").insert({
                ...profile,
                user_id: session?.user?.id,
                email: session?.user?.email,
            });
        } else {
            // update the existing row in the profiles table
            const { data, error } = await supabase
                .from("profiles")
                .update(profile) // description, pokemon_ids
                .eq("user_id", session?.user?.id);
        }
    }

    page.subscribe(async () => {
        isLoading = true;
        pokemonList = await getPokemonList();

        // Try to grab the current profile (dev.elibautista@gmail.com)
        const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("description, pokemon_ids")
            .eq("email", email);

        // If the profileData is undefined, then we need to create a new profile
        if (profileData?.length === 0 && email === session?.user?.email) {
            // save profile
            console.log("SAVE PROFILE");
            await saveProfile();
        } else if (profileData != null && profileData.length > 0) {
            // show existing user's data
            profile = profileData[0];
        } else {
            // say NO PROFILE
            console.log("NO PROFILE");
            profile = {
                description: "User does not have a profile.",
                pokemon_ids: [],
            };
        }

        // If profileData exist and it has data inside of it show existing user's data
        // If no data exists, say NO PROFILE
        await refreshPokemonData();
        isLoading = false;
    });

    async function savePageEdits() {
        console.log("SAVING EDITS");
        isSaving = true;
        await saveProfile();
        await refreshPokemonData();
        isSaving = false;
        isModalOpen = false;
    }

    async function togglePokemon(newPokemonId: number) {
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

    function getTypeColor(type: string): string {
        const typeColors: { [key: string]: string } = {
            normal: 'bg-gray-400',
            fire: 'bg-red-500',
            water: 'bg-blue-500',
            electric: 'bg-yellow-400',
            grass: 'bg-green-500',
            ice: 'bg-blue-200',
            fighting: 'bg-red-700',
            poison: 'bg-purple-500',
            ground: 'bg-yellow-600',
            flying: 'bg-indigo-400',
            psychic: 'bg-pink-500',
            bug: 'bg-green-400',
            rock: 'bg-yellow-800',
            ghost: 'bg-purple-700',
            dragon: 'bg-indigo-700',
            dark: 'bg-gray-800',
            steel: 'bg-gray-500',
            fairy: 'bg-pink-300'
        };
        return typeColors[type] || 'bg-gray-400';
    }

    // Filter Pokemon list based on search
    $: filteredPokemonList = pokemonList.filter((pokemon: any) => 
        pokemon.name.toLowerCase().includes(searchInput.toLowerCase())
    );
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
    <div class="container mx-auto px-4 py-8">
        <!-- Header Section -->
        <div class="text-center mb-12">
            <div class="relative inline-block">
                <h1 class="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">
                    {email.split('@')[0]}'s PokePage
                </h1>
                <div class="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg blur opacity-25"></div>
            </div>
            
            {#if isLoading}
                <div class="flex justify-center items-center py-8">
                    <div class="loading loading-spinner loading-lg text-primary"></div>
                    <span class="ml-3 text-white text-lg">Loading Pokemon data...</span>
                </div>
            {:else}
                <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto border border-white/20">
                    <p class="text-lg text-gray-200 leading-relaxed">{profile.description}</p>
                </div>
            {/if}
        </div>

        {#if !isLoading}
            <!-- Pokemon Cards Section -->
            <div class="mb-12">
                <h2 class="text-3xl font-bold text-white text-center mb-8">Featured Pokemon</h2>
                
                {#if pokemonData.length === 0}
                    <div class="text-center py-12">
                        <div class="text-6xl mb-4">🚫</div>
                        <p class="text-xl text-gray-300">No Pokemon selected yet!</p>
                        {#if email === session?.user?.email}
                            <p class="text-gray-400 mt-2">Click "Edit Page" to add your favorite Pokemon</p>
                        {/if}
                    </div>
                {:else}
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {#each pokemonData as pokemon, index}
                            <div class="group relative">
                                <div class="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                                <div class="relative bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-105">
                                <div class="text-center">
                                        <div class="relative mb-4">
                                    <img
                                        src={pokemon.sprites.front_default}
                                                alt={pokemon.name}
                                                class="w-32 h-32 mx-auto object-contain drop-shadow-2xl"
                                        width="128"
                                        height="128"
                                    />
                                            <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-3 bg-black/20 rounded-full blur-sm"></div>
                                        </div>
                                        
                                        <h3 class="text-2xl font-bold text-white capitalize mb-3">
                                        {pokemon.name}
                                        </h3>
                                        
                                        <div class="flex flex-wrap justify-center gap-2 mb-4">
                                            {#each pokemon.types as typeInfo}
                                                <span class="px-3 py-1 rounded-full text-sm font-semibold text-white {getTypeColor(typeInfo.type.name)} capitalize">
                                                    {typeInfo.type.name}
                                                </span>
                                            {/each}
                                        </div>
                                        
                                        <div class="grid grid-cols-2 gap-4 text-sm">
                                            <div class="bg-white/10 rounded-lg p-2">
                                                <div class="text-gray-400">Height</div>
                                                <div class="text-white font-semibold">{pokemon.height / 10}m</div>
                                            </div>
                                            <div class="bg-white/10 rounded-lg p-2">
                                                <div class="text-gray-400">Weight</div>
                                                <div class="text-white font-semibold">{pokemon.weight / 10}kg</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        {/each}
                        </div>
                {/if}
            </div>

            <!-- Edit Button -->
            {#if email === session?.user?.email}
                <div class="text-center">
                <button
                        class="btn btn-primary btn-lg bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-xl"
                        onclick={() => (isModalOpen = true)}
                    >
                        ✨ Edit Page
                    </button>
                </div>

                <!-- Enhanced Modal -->
                <dialog class="modal" class:modal-open={isModalOpen}>
                    <div class="modal-box max-w-4xl bg-slate-800 border border-white/20">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-3xl font-bold text-white">✨ Edit Your PokePage</h2>
                            <button class="btn btn-sm btn-circle btn-ghost text-white" onclick={() => (isModalOpen = false)}>✕</button>
                        </div>
                        
                        <!-- Description Section -->
                        <div class="mb-8">
                            <label for="profile-description" class="label">
                                <span class="label-text text-white text-lg font-semibold">📝 Profile Description</span>
                            </label>
                        <textarea
                            id="profile-description"
                            bind:value={profile.description}
                                class="textarea textarea-bordered w-full h-32 bg-slate-700 text-white border-slate-600 focus:border-blue-500"
                                placeholder="Tell everyone about yourself and your favorite Pokemon..."
                        ></textarea>
                        </div>

                        <!-- Pokemon Selection -->
                        <div class="mb-6">
                            <label for="pokemon-search" class="label">
                                <span class="label-text text-white text-lg font-semibold">🎯 Choose Your Pokemon (Max 3)</span>
                                <span class="label-text-alt text-gray-400">{profile.pokemon_ids.length}/3 selected</span>
                            </label>
                            
                            <!-- Search Input -->
                            <div class="relative mb-4">
                                <input
                                    id="pokemon-search"
                                    type="text"
                                    class="input input-bordered w-full bg-slate-700 text-white border-slate-600 focus:border-blue-500 pl-10"
                                    placeholder="🔍 Search for Pokemon..."
                                    bind:value={searchInput}
                                />
                                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                            </div>

                            <!-- Pokemon Grid -->
                            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-80 overflow-y-auto bg-slate-700/50 rounded-lg p-4">
                                {#each filteredPokemonList as pokemon, index}
                                <button
                                        class="pokemon-selector {profile.pokemon_ids.includes(index + 1) ? 'selected' : ''}"
                                    onclick={() => togglePokemon(index + 1)}
                                >
                                        <div class="text-center p-3 rounded-lg transition-all duration-200 hover:bg-slate-600 {profile.pokemon_ids.includes(index + 1) ? 'bg-blue-600 ring-2 ring-blue-400' : 'bg-slate-700'}">
                                            <h3 class="text-white text-sm font-medium capitalize truncate">
                                            {pokemon.name}
                                            </h3>
                                            {#if profile.pokemon_ids.includes(index + 1)}
                                                <div class="text-xs text-blue-200 mt-1">✓ Selected</div>
                                            {/if}
                                        </div>
                                    </button>
                                {/each}
                                
                                {#if filteredPokemonList.length === 0}
                                    <div class="col-span-full text-center py-8 text-gray-400">
                                        No Pokemon found matching "{searchInput}"
                                    </div>
                                {/if}
                            </div>
                        </div>

                        <!-- Modal Actions -->
                        <div class="modal-action">
                            <button
                                class="btn btn-ghost text-white"
                                onclick={() => (isModalOpen = false)}
                            >
                                Cancel
                            </button>
                        <button
                                class="btn btn-primary bg-gradient-to-r from-green-600 to-blue-600 border-none hover:from-green-700 hover:to-blue-700"
                                onclick={() => savePageEdits()}
                                disabled={isSaving}
                            >
                                {#if isSaving}
                                    <span class="loading loading-spinner loading-sm"></span>
                                    Saving...
                                {:else}
                                    💾 Save Changes
                                {/if}
                            </button>
                        </div>
                    </div>
                    <button 
                        type="button"
                        class="modal-backdrop bg-black/50" 
                        aria-label="Close modal"
                        onclick={() => (isModalOpen = false)}
                    ></button>
                </dialog>
            {/if}
        {/if}
    </div>
</div>

<style>
    .pokemon-selector {
        @apply transition-all duration-200 transform hover:scale-105;
    }
    
    .pokemon-selector.selected {
        @apply ring-2 ring-blue-400;
    }
</style>
