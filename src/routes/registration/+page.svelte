<svelte:head>
    <title>Join PokeFolio - Create Account</title>
    <meta name="description" content="Create your PokeFolio account and start building your Pokemon portfolio today!" />
</svelte:head>

<script lang="ts">
    export let data;
    import { goto } from '$app/navigation';
    import { toast } from 'svelte-sonner';

    let { supabase, session } = data
    $: ({ supabase, session } = data)

    // Redirect if already logged in
    $: if (session) {
        goto(`/${session.user.email}`)
    }

    let email = '';
    let password = '';
    let confirmPassword = '';
    let loading = false;
    let googleLoading = false;
    let errorMessage = '';
    let successMessage = '';

    async function handleRegister() {
        if (!email || !password || !confirmPassword) {
            errorMessage = 'Please fill in all fields';
            toast.error(errorMessage);
            return;
        }

        if (password !== confirmPassword) {
            errorMessage = 'Passwords do not match';
            toast.error(errorMessage);
            return;
        }

        if (password.length < 6) {
            errorMessage = 'Password must be at least 6 characters long';
            toast.error(errorMessage);
            return;
        }

        loading = true;
        errorMessage = '';
        successMessage = '';

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password
            });

            if (error) {
                errorMessage = error.message;
                toast.error(errorMessage);
            } else {
                successMessage = 'Registration successful! Please check your email for verification.';
                toast.success(successMessage);
                // Clear form
                email = '';
                password = '';
                confirmPassword = '';
            }
        } catch (err) {
            errorMessage = 'An unexpected error occurred';
            toast.error(errorMessage);
        } finally {
            loading = false;
        }
    }

    async function handleGoogleRegister() {
        googleLoading = true;
        errorMessage = '';

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            });
            
            if (error) {
                errorMessage = error.message;
                googleLoading = false;
                toast.error(errorMessage);
            } else {
                toast.success("Redirecting to Google...");
            }
            // Note: If successful, user will be redirected to Google, so we don't set googleLoading to false here
        } catch (err) {
            errorMessage = 'An unexpected error occurred with Google sign-up';
            googleLoading = false;
            toast.error(errorMessage);
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            handleRegister();
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
                        🎮 Join PokeFolio
                    </h1>
                    <div class="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg blur opacity-25"></div>
                </div>
                <p class="text-gray-300">Create your Pokemon profile today!</p>
            </div>

            <!-- Register Card -->
            <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
                {#if errorMessage}
                    <div class="alert bg-red-500/20 border border-red-500/30 text-red-200 mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{errorMessage}</span>
                    </div>
                {/if}

                {#if successMessage}
                    <div class="alert bg-green-500/20 border border-green-500/30 text-green-200 mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{successMessage}</span>
                    </div>
                {/if}

                <form on:submit|preventDefault={handleRegister} class="space-y-6">
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
                            disabled={loading || googleLoading}
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
                            placeholder="Create a password (min. 6 characters)"
                            class="input input-bordered w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:bg-white/20 transition-all duration-200"
                            required
                            disabled={loading || googleLoading}
                        />
                    </div>

                    <div class="form-control">
                        <label class="label" for="confirmPassword">
                            <span class="label-text text-white font-medium">🔐 Confirm Password</span>
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            bind:value={confirmPassword}
                            on:keydown={handleKeydown}
                            placeholder="Confirm your password"
                            class="input input-bordered w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:bg-white/20 transition-all duration-200"
                            required
                            disabled={loading || googleLoading}
                        />
                    </div>

                    <div class="form-control mt-8">
                        <button 
                            type="submit" 
                            class="btn btn-primary w-full bg-gradient-to-r from-green-600 to-blue-600 border-none hover:from-green-700 hover:to-blue-700 text-white font-semibold transform hover:scale-105 transition-all duration-200 shadow-xl"
                            disabled={loading || googleLoading}
                        >
                            {#if loading}
                                <span class="loading loading-spinner loading-sm"></span>
                                Creating account...
                            {:else}
                                🚀 Create Account
                            {/if}
                        </button>
                    </div>
                </form>

                <div class="divider text-gray-400 my-6">or</div>

                <!-- Google Sign-Up Button -->
                <div class="mb-6">
                    <button 
                        type="button"
                        on:click={handleGoogleRegister}
                        disabled={googleLoading || loading}
                        class="btn w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold border border-gray-300 shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                        {#if googleLoading}
                            <span class="loading loading-spinner loading-sm"></span>
                            Signing up with Google...
                        {:else}
                            <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Continue with Google
                        {/if}
                    </button>
                </div>

                <div class="text-center space-y-3 mt-8">
                    <p class="text-sm text-gray-400">
                        Already have an account?
                        <a href="/login" class="text-blue-400 hover:text-blue-300 underline font-medium">Sign in here</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</div> 