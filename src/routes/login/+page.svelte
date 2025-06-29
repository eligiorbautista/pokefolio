<script lang="ts">
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { page } from "$app/stores";

    export let data;

    let { supabase, session } = data;
    $: ({ supabase, session } = data);

    let email = "";
    let password = "";
    let loading = false;
    let errorMessage = "";

    const handleLogin = async () => {
        if (!email || !password) {
            errorMessage = "Please fill in all fields";
            return;
        }

        loading = true;
        errorMessage = "";

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                errorMessage = error.message;
            }
        } catch (err) {
            errorMessage = "An unexpected error occurred";
        } finally {
            loading = false;
        }
    };

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            handleLogin();
        }
    }

    // Handle redirect if already logged in
    onMount(() => {
        if (session) {
            goto(`/${session.user.email}`);
        }
    });
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
    <div class="container mx-auto px-4 py-16">
        <div class="max-w-md mx-auto">
            <!-- Header -->
            <div class="text-center mb-8">
                <div class="relative inline-block mb-4">
                    <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                        🎮 Welcome Back
                    </h1>
                    <div class="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg blur opacity-25"></div>
                </div>
                <p class="text-gray-300">Sign in to your Pokemon adventure!</p>
            </div>

            <!-- Login Card -->
            <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
                {#if errorMessage}
                    <div class="alert bg-red-500/20 border border-red-500/30 text-red-200 mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{errorMessage}</span>
                    </div>
                {/if}

                <form on:submit|preventDefault={handleLogin} class="space-y-6">
                    <div class="form-control">
                        <label class="label" for="email">
                            <span class="label-text text-white font-medium">📧 Email</span>
                        </label>
                        <input
                            id="email"
                            type="email"
                            bind:value={email}
                            on:keydown={handleKeydown}
                            placeholder="your.email@example.com"
                            class="input input-bordered w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:bg-white/20 transition-all duration-200"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div class="form-control">
                        <label class="label" for="password">
                            <span class="label-text text-white font-medium">🔒 Password</span>
                        </label>
                        <input
                            id="password"
                            type="password"
                            bind:value={password}
                            on:keydown={handleKeydown}
                            placeholder="Your secure password"
                            class="input input-bordered w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:bg-white/20 transition-all duration-200"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div class="form-control mt-8">
                        <button 
                            type="submit" 
                            class="btn btn-primary w-full bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:from-blue-700 hover:to-purple-700 text-white font-semibold transform hover:scale-105 transition-all duration-200 shadow-xl"
                            disabled={loading}
                        >
                            {#if loading}
                                <span class="loading loading-spinner loading-sm"></span>
                                Signing in...
                            {:else}
                                🚀 Sign In
                            {/if}
                        </button>
                    </div>
                </form>

                <div class="divider text-gray-400 my-6">or</div>

                <div class="text-center space-y-3">
                    <p class="text-sm text-gray-400">
                        Don't have an account?
                        <a href="/register" class="text-blue-400 hover:text-blue-300 underline font-medium">Create one here</a>
                    </p>
                    <p class="text-sm text-gray-400">
                        <a href="/forgot-password" class="text-yellow-400 hover:text-yellow-300 underline font-medium">Forgot your password?</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>