<script lang="ts">
    export let data;
    import { goto } from '$app/navigation';

    let { supabase, session } = data
    $: ({ supabase, session } = data)

    // Redirect if already logged in
    $: if (session) {
        goto(`/${session.user.email}`)
    }

    let email = '';
    let loading = false;
    let errorMessage = '';
    let successMessage = '';

    async function handleResetPassword() {
        if (!email) {
            errorMessage = 'Please enter your email address';
            return;
        }

        loading = true;
        errorMessage = '';
        successMessage = '';

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`
            });

            if (error) {
                errorMessage = error.message;
            } else {
                successMessage = 'Password reset email sent! Check your inbox for further instructions.';
                email = '';
            }
        } catch (err) {
            errorMessage = 'An unexpected error occurred';
        } finally {
            loading = false;
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            handleResetPassword();
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
                        🔑 Reset Password
                    </h1>
                    <div class="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg blur opacity-25"></div>
                </div>
                <p class="text-gray-300">Enter your email to receive a password reset link</p>
            </div>

            <!-- Reset Card -->
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

                <form on:submit|preventDefault={handleResetPassword} class="space-y-6">
                    <div class="form-control">
                        <label class="label" for="email">
                            <span class="label-text text-white font-medium">📧 Email Address</span>
                        </label>
                        <input
                            id="email"
                            type="email"
                            bind:value={email}
                            on:keydown={handleKeydown}
                            placeholder="Enter your email address"
                            class="input input-bordered w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:bg-white/20 transition-all duration-200"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div class="form-control mt-8">
                        <button 
                            type="submit" 
                            class="btn btn-primary w-full bg-gradient-to-r from-purple-600 to-blue-600 border-none hover:from-purple-700 hover:to-blue-700 text-white font-semibold transform hover:scale-105 transition-all duration-200 shadow-xl"
                            disabled={loading}
                        >
                            {#if loading}
                                <span class="loading loading-spinner loading-sm"></span>
                                Sending reset email...
                            {:else}
                                📧 Send Reset Email
                            {/if}
                        </button>
                    </div>
                </form>

                <div class="text-center mt-8 space-y-3">
                    <p class="text-sm text-gray-400">
                        Remember your password? 
                        <a href="/login" class="text-blue-400 hover:text-blue-300 underline font-medium">Sign in</a>
                    </p>
                    <p class="text-sm text-gray-400">
                        Don't have an account? 
                        <a href="/register" class="text-green-400 hover:text-green-300 underline font-medium">Sign up</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</div> 