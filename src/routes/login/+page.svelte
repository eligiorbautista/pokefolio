<script lang="ts">
    export let data;
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    let { supabase, session } = data
    $: ({ supabase, session } = data)

    // Redirect if already logged in
    $: if (session) {
        goto(`/${session.user.email}`)
    }

    let email = '';
    let password = '';
    let loading = false;
    let errorMessage = '';

    async function handleLogin() {
        if (!email || !password) {
            errorMessage = 'Please fill in all fields';
            return;
        }

        loading = true;
        errorMessage = '';

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                errorMessage = error.message;
            } else {
                // Redirect will happen automatically due to session reactivity
            }
        } catch (err) {
            errorMessage = 'An unexpected error occurred';
        } finally {
            loading = false;
        }
    }

    async function handleGoogleLogin() {
        loading = true;
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            });
            if (error) {
                errorMessage = error.message;
            }
        } catch (err) {
            errorMessage = 'An unexpected error occurred';
        } finally {
            loading = false;
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            handleLogin();
        }
    }
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
    <div class="container mx-auto px-4 py-16">
        <div class="max-w-md mx-auto">
            <!-- Header -->
            <div class="text-center mb-8">
                <div class="relative inline-block mb-4">
                    <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                        🔐 Welcome Back
                    </h1>
                    <div class="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg blur opacity-25"></div>
                </div>
                <p class="text-gray-300">Sign in to your PokePage account</p>
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
                            placeholder="Enter your email"
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
                            placeholder="Enter your password"
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

                <div class="divider text-gray-400 my-6">OR</div>

                <button 
                    type="button"
                    on:click={handleGoogleLogin}
                    class="btn btn-outline w-full border-white/30 text-white hover:bg-white/10 hover:border-white/50 transform hover:scale-105 transition-all duration-200"
                    disabled={loading}
                >
                    <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                </button>

                <div class="text-center mt-8 space-y-3">
                    <p class="text-sm text-gray-400">
                        Don't have an account? 
                        <a href="/register" class="text-blue-400 hover:text-blue-300 underline font-medium">Sign up</a>
                    </p>
                    <p class="text-sm text-gray-400">
                        <a href="/forgot-password" class="text-yellow-400 hover:text-yellow-300 underline">Forgot your password?</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>