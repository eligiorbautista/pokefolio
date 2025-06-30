<svelte:head>
    <title>Signing In - PokeFolio</title>
    <meta name="description" content="Completing your PokeFolio authentication. Please wait while we sign you in." />
</svelte:head>

<script lang="ts">
    export let data;
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    let { supabase } = data;
    let loading = true;
    let errorMessage = '';

    onMount(async () => {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) {
                console.error('Auth callback error:', error);
                errorMessage = 'Authentication failed. Please try again.';
                loading = false;
                return;
            }

            if (session?.user) {
                // Successful authentication, redirect to user page
                goto(`/${session.user.email}`);
            } else {
                // No session found, redirect to login
                goto('/login');
            }
        } catch (err) {
            console.error('Unexpected error during auth callback:', err);
            errorMessage = 'An unexpected error occurred. Please try again.';
            loading = false;
        }
    });
</script>

<div class="hero min-h-screen bg-base-300">
    <div class="hero-content w-full max-w-md">
        <div class="card w-full bg-base-100 shadow-xl">
            <div class="card-body text-center">
                {#if loading}
                    <div class="flex flex-col items-center space-y-4">
                        <span class="loading loading-spinner loading-lg"></span>
                        <h2 class="text-xl font-semibold">Completing authentication...</h2>
                        <p class="text-base-content/70">Please wait while we sign you in.</p>
                    </div>
                {:else if errorMessage}
                    <div class="alert alert-error mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{errorMessage}</span>
                    </div>
                    <a href="/login" class="btn btn-primary">Back to Login</a>
                {/if}
            </div>
        </div>
    </div>
</div> 