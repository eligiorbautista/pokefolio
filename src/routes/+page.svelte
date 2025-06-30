<script lang="ts">
    export let data;
    
    let { supabase, session } = data;
    $: ({ supabase, session } = data);
    $: userEmail = session?.user?.email;
</script>

<svelte:head>
    <title>PokeFolio - Create Your Pokemon Portfolio</title>
    <meta name="description" content="Create your own personalized Pokemon profile page with a unique URL. Choose your favorite Pokemon and share them with the world!" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
    <div class="container mx-auto px-4 py-16">
        <div class="max-w-4xl mx-auto text-center">
            <!-- Hero Section -->
            <div class="relative mb-12">
                <div class="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg blur opacity-25"></div>
                <h1 class="relative text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-6">
                    🎮 PokeFolio
                </h1>
            </div>
            
            <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-white/20">
                <p class="text-xl md:text-2xl text-gray-200 leading-relaxed mb-8">
                    Create your own <span class="text-yellow-400 font-semibold">Pokemon profile page</span> with a unique URL!<br/>
                    Share your favorite Pokemon with the world! ✨
                </p>
                
                <!-- Features Grid -->
                <div class="grid md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-white/5 rounded-xl p-6 border border-white/10">
                        <div class="text-4xl mb-3">🎯</div>
                        <h3 class="text-lg font-semibold text-white mb-2">Choose Your Pokemon</h3>
                        <p class="text-gray-300 text-sm">Select up to 3 favorite Pokemon to showcase</p>
                    </div>
                    
                    <div class="bg-white/5 rounded-xl p-6 border border-white/10">
                        <div class="text-4xl mb-3">🌐</div>
                        <h3 class="text-lg font-semibold text-white mb-2">Unique URL</h3>
                        <p class="text-gray-300 text-sm">Get your own personalized Pokemon page</p>
                    </div>
                    
                    <div class="bg-white/5 rounded-xl p-6 border border-white/10">
                        <div class="text-4xl mb-3">📱</div>
                        <h3 class="text-lg font-semibold text-white mb-2">Share Anywhere</h3>
                        <p class="text-gray-300 text-sm">Mobile-friendly and ready to share</p>
                    </div>
                </div>
                
                <!-- CTA Buttons - Show only when not authenticated -->
                {#if !session}
                    <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a 
                            href="/registration" 
                            class="btn btn-lg bg-gradient-to-r from-green-600 to-blue-600 border-none hover:from-green-700 hover:to-blue-700 text-white transform hover:scale-105 transition-all duration-200 shadow-xl"
                        >
                            🚀 Create Account
                        </a>
                        <a 
                            href="/login" 
                            class="btn btn-lg btn-outline border-white/30 text-white hover:bg-white/10 hover:border-white/50 transform hover:scale-105 transition-all duration-200"
                        >
                            🔐 Sign In
                        </a>
                    </div>
                    
                    <p class="text-sm text-gray-400 mt-6">
                        Already have an account? <a href="/login" class="text-blue-400 hover:text-blue-300 underline">Sign in here</a>
                    </p>
                {:else}
                    <!-- Authenticated user options -->
                    <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a 
                            href="/{userEmail}" 
                            class="btn btn-lg bg-gradient-to-r from-purple-600 to-pink-600 border-none hover:from-purple-700 hover:to-pink-700 text-white transform hover:scale-105 transition-all duration-200 shadow-xl"
                        >
                            <img src="/pokeball.png" alt="Pokeball" class="w-5 h-5">
                            View Your PokeFolio
                        </a>
                        <a 
                            href="/settings" 
                            class="btn btn-lg btn-outline border-white/30 text-white hover:bg-white/10 hover:border-white/50 transform hover:scale-105 transition-all duration-200"
                        >
                            ⚙️ Settings
                        </a>
                    </div>
                    
                    <p class="text-sm text-gray-400 mt-6">
                        Welcome back! Ready to update your Pokemon collection?
                    </p>
                {/if}
            </div>
            
            <!-- Demo Section -->
            <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 class="text-2xl font-bold text-white mb-4">✨ Preview Your Collection</h2>
                <p class="text-gray-300 mb-6">Here's what your Pokemon profile page could look like:</p>
                
                <div class="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                    <!-- Charizard Demo Card -->
                    <div class="group relative">
                        <div class="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                        <div class="relative bg-slate-800/90 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-105">
                            <div class="text-center">
                                <div class="relative mb-3">
                                    <img
                                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png"
                                        alt="Charizard"
                                        class="w-24 h-24 mx-auto object-contain drop-shadow-2xl"
                                        width="96" height="96"
                                    />
                                    <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-black/20 rounded-full blur-sm"></div>
                                </div>
                                
                                <h3 class="text-lg font-bold text-white capitalize mb-2">Charizard</h3>
                                
                                <div class="flex flex-wrap justify-center gap-1.5 mb-3">
                                    <span class="px-2 py-1 rounded-full text-xs font-semibold text-white bg-red-500 capitalize">
                                        fire
                                    </span>
                                    <span class="px-2 py-1 rounded-full text-xs font-semibold text-white bg-indigo-400 capitalize">
                                        flying
                                    </span>
                                </div>
                                
                                <div class="grid grid-cols-2 gap-2 text-xs">
                                    <div class="bg-white/10 rounded-lg p-1.5">
                                        <div class="text-gray-400">Height</div>
                                        <div class="text-white font-semibold">1.7m</div>
                                    </div>
                                    <div class="bg-white/10 rounded-lg p-1.5">
                                        <div class="text-gray-400">Weight</div>
                                        <div class="text-white font-semibold">90.5kg</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Blastoise Demo Card -->
                    <div class="group relative">
                        <div class="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                        <div class="relative bg-slate-800/90 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-105">
                            <div class="text-center">
                                <div class="relative mb-3">
                                    <img
                                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png"
                                        alt="Blastoise"
                                        class="w-24 h-24 mx-auto object-contain drop-shadow-2xl"
                                        width="96" height="96"
                                    />
                                    <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-black/20 rounded-full blur-sm"></div>
                                </div>
                                
                                <h3 class="text-lg font-bold text-white capitalize mb-2">Blastoise</h3>
                                
                                <div class="flex flex-wrap justify-center gap-1.5 mb-3">
                                    <span class="px-2 py-1 rounded-full text-xs font-semibold text-white bg-blue-500 capitalize">
                                        water
                                    </span>
                                </div>
                                
                                <div class="grid grid-cols-2 gap-2 text-xs">
                                    <div class="bg-white/10 rounded-lg p-1.5">
                                        <div class="text-gray-400">Height</div>
                                        <div class="text-white font-semibold">1.6m</div>
                                    </div>
                                    <div class="bg-white/10 rounded-lg p-1.5">
                                        <div class="text-gray-400">Weight</div>
                                        <div class="text-white font-semibold">85.5kg</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Venusaur Demo Card -->
                    <div class="group relative">
                        <div class="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                        <div class="relative bg-slate-800/90 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-105">
                            <div class="text-center">
                                <div class="relative mb-3">
                                    <img
                                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png"
                                        alt="Venusaur"
                                        class="w-24 h-24 mx-auto object-contain drop-shadow-2xl"
                                        width="96" height="96"
                                    />
                                    <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-black/20 rounded-full blur-sm"></div>
                                </div>
                                
                                <h3 class="text-lg font-bold text-white capitalize mb-2">Venusaur</h3>
                                
                                <div class="flex flex-wrap justify-center gap-1.5 mb-3">
                                    <span class="px-2 py-1 rounded-full text-xs font-semibold text-white bg-green-500 capitalize">
                                        grass
                                    </span>
                                    <span class="px-2 py-1 rounded-full text-xs font-semibold text-white bg-purple-500 capitalize">
                                        poison
                                    </span>
                                </div>
                                
                                <div class="grid grid-cols-2 gap-2 text-xs">
                                    <div class="bg-white/10 rounded-lg p-1.5">
                                        <div class="text-gray-400">Height</div>
                                        <div class="text-white font-semibold">2.0m</div>
                                    </div>
                                    <div class="bg-white/10 rounded-lg p-1.5">
                                        <div class="text-gray-400">Weight</div>
                                        <div class="text-white font-semibold">100.0kg</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>