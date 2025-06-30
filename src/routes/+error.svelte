<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    
    $: status = $page.status;
    $: message = $page.error?.message || 'Something went wrong';
    
    // Different Pokemon for different error types
    $: errorPokemon = status === 404 ? {
        id: 54, // Psyduck - confused Pokemon for 404
        name: 'Psyduck',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png'
    } : {
        id: 25, // Pikachu for other errors
        name: 'Pikachu', 
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
    };
    
    $: errorTitle = status === 404 ? 'Page Not Found!' : `Error ${status}`;
    $: errorDescription = status === 404 
        ? "Oops! This page seems to have wandered off like a wild Pokemon. Let's get you back on track!"
        : "Something unexpected happened. Our Pokemon are working to fix this!";
</script>

<svelte:head>
    <title>{errorTitle} - PokeFolio</title>
    <meta name="description" content={errorDescription} />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center px-4">
    <div class="max-w-2xl mx-auto text-center">
        <!-- Animated Pokemon -->
        <div class="relative mb-8">
            <div class="absolute -inset-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur opacity-20 animate-pulse"></div>
            <div class="relative bg-white/10 backdrop-blur-sm rounded-full p-8 border border-white/20 inline-block">
                <img
                    src={errorPokemon.sprite}
                    alt={errorPokemon.name}
                    class="w-32 h-32 mx-auto object-contain drop-shadow-2xl animate-bounce"
                    width="128" 
                    height="128"
                />
            </div>
        </div>
        
        <!-- Error Code -->
        <div class="relative mb-6">
            <div class="absolute -inset-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg blur opacity-25"></div>
            <h1 class="relative text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500 mb-2">
                {status}
            </h1>
        </div>
        
        <!-- Error Title -->
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            {errorTitle}
        </h2>
        
        <!-- Error Description -->
        <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
            <p class="text-lg text-gray-200 leading-relaxed mb-6">
                {errorDescription}
            </p>
            
            {#if status === 404}
                <div class="text-sm text-gray-400 mb-4">
                    <strong class="text-yellow-400">{errorPokemon.name}</strong> is just as confused as you are! 🤔
                </div>
            {/if}
        </div>
        
        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
                class="btn btn-lg bg-gradient-to-r from-green-600 to-blue-600 border-none hover:from-green-700 hover:to-blue-700 text-white transform hover:scale-105 transition-all duration-200 shadow-xl"
                on:click={() => goto('/')}
            >
                🏠 Go Home
            </button>
            
            <button 
                class="btn btn-lg btn-outline border-white/30 text-white hover:bg-white/10 hover:border-white/50 transform hover:scale-105 transition-all duration-200"
                on:click={() => history.back()}
            >
                ⬅️ Go Back
            </button>
        </div>
        
        <!-- Fun Pokemon fact -->
        <div class="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p class="text-sm text-gray-400">
                💡 <strong class="text-blue-400">Fun Fact:</strong> 
                {#if status === 404}
                    Psyduck's constant headaches make it perfect for representing 404 errors!
                {:else}
                    Even Pokemon trainers encounter unexpected challenges on their journey!
                {/if}
            </p>
        </div>
        
        <!-- Additional Help -->
        <div class="mt-6 text-xs text-gray-500">
            <p>
                If you keep seeing this error, try 
                <button 
                    class="text-blue-400 hover:text-blue-300 underline"
                    on:click={() => location.reload()}
                >
                    refreshing the page
                </button>
                or 
                <a href="/" class="text-blue-400 hover:text-blue-300 underline">
                    return to the homepage
                </a>
            </p>
        </div>
    </div>
</div>

<style>
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
            transform: translateY(0);
        }
        40%, 43% {
            transform: translateY(-15px);
        }
        70% {
            transform: translateY(-7px);
        }
        90% {
            transform: translateY(-3px);
        }
    }
    
    .animate-bounce {
        animation: bounce 2s infinite;
    }
</style> 