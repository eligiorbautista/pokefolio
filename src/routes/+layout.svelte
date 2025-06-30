<script lang="ts">
    export let data;
    import { goto, invalidateAll } from "$app/navigation";
    import "../app.css";

    import { onMount } from "svelte";
    import { page } from "$app/stores";

    let { supabase } = data;
    let session = data.session;

    $: isInPasswordResetPage = $page.url.pathname === "/reset-password";
    $: user_email = session?.user?.email;
    $: isInLogInPage = $page.url.pathname === "/login";

    // Hamburger menu state
    let navOpen = false;

    function closeNav() {
        navOpen = false;
    }

    // If session is null, if session is null we have no user. If it is not null, we have a user.
    supabase.auth.onAuthStateChange(async (event, newSession) => {
        session = newSession;
        if (event === "SIGNED_IN") {
            invalidateAll();
        }

        if (event === "SIGNED_OUT") {
            await goto("login");
            invalidateAll();
        }
    });
</script>

{#if !isInPasswordResetPage}
    <!-- Navbar -->
    <nav
        class="bg-slate-900/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 shadow-xl border-b border-white/10"
    >
        <div class="navbar max-w-6xl mx-auto flex items-center px-4">
            <!-- Brand and My Page (left) -->
            <div class="flex items-center space-x-2">
                <a
                    href="/"
                    class="btn btn-ghost text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 transition-all duration-200"
                >
                    🎮 PokeFolio
                </a>
                {#if session !== null}
                    <a
                        href="/{user_email}"
                        class="btn btn-ghost text-white hover:bg-white/10 transition-all duration-200 border border-white/20 hover:border-white/40"
                        >✨ My Page</a
                    >
                {/if}
            </div>
            <!-- Spacer -->
            <div class="flex-1"></div>
            <!-- Desktop Nav (right) -->
            <div class="hidden md:flex items-center space-x-4">
                {#if session == null}
                    {#if !isInLogInPage}
                        <button
                            aria-label="Login"
                            class="btn btn-primary bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-200"
                            on:click={() => goto("/login")}>🔐 Login</button
                        >
                    {/if}
                {:else}
                    <div
                        class="flex items-center bg-white/10 rounded-full px-4 py-2 border border-white/20 hover:border-white/40"
                    >
                        <div
                            class="w-2 h-2 bg-green-400 rounded-full mr-2"
                        ></div>
                        <span class="text-white text-sm font-medium"
                            >{user_email}</span
                        >
                    </div>
                    {#if session !== null}
                        <a
                            href="/settings"
                            class="btn btn-ghost text-white hover:bg-white/10 transition-all duration-200"
                            >⚙️ Settings</a
                        >
                    {/if}
                    <button
                        class="btn btn-outline border-red-400 text-red-400 hover:bg-red-400 hover:text-white transition-all duration-200"
                        aria-label="Logout"
                        on:click={async () => {
                            await supabase.auth.signOut();
                        }}
                    >
                        🚪 Logout
                    </button>
                {/if}
            </div>
            <!-- Hamburger (Mobile) -->
            <button
                class="md:hidden btn btn-ghost text-white hover:bg-white/10"
                aria-label="Open navigation menu"
                on:click={() => (navOpen = !navOpen)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6h16M4 12h16M4 18h16"
                    /></svg
                >
            </button>
        </div>
        <!-- Mobile Nav Drawer -->
        {#if navOpen}
            <!-- Overlay -->
            <div
                class="md:hidden fixed inset-0 bg-black/60 z-40"
                on:click={closeNav}
                on:keydown={(e) => {
                    if (e.key === "Enter" || e.key === " ") closeNav();
                }}
                tabindex="0"
                role="button"
                aria-label="Close navigation menu overlay"
            ></div>
            
            <!-- Drawer -->
            <div class="md:hidden fixed top-0 right-0 w-80 h-screen bg-gray-900 shadow-2xl z-50 animate-slide-in">
                <!-- Header -->
                <div class="flex items-center justify-between p-6 border-b border-gray-700">
                    <h2 class="text-xl font-bold text-white">Menu</h2>
                    <button
                        class="p-2 rounded-lg hover:bg-gray-800 text-white transition-colors"
                        on:click={closeNav}
                        aria-label="Close navigation menu"
                    >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <!-- Navigation Items -->
                <div class="p-6 space-y-2">
                    <a
                        href="/"
                        class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-white"
                        on:click={closeNav}
                    >
                        <span class="text-xl">🏠</span>
                        <span class="font-medium">Home</span>
                    </a>

                    {#if session !== null}
                        <a
                            href="/{user_email}"
                            class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-white"
                            on:click={closeNav}
                        >
                            <span class="text-xl">✨</span>
                            <span class="font-medium">My Page</span>
                        </a>

                        <a
                            href="/settings"
                            class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-white"
                            on:click={closeNav}
                        >
                            <span class="text-xl">⚙️</span>
                            <span class="font-medium">Settings</span>
                        </a>
                    {/if}

                    {#if session == null}
                        {#if !isInLogInPage}
                            <button
                                class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-white w-full text-left"
                                on:click={() => {
                                    closeNav();
                                    goto("/login");
                                }}
                                aria-label="Login"
                            >
                                <span class="text-xl">🔐</span>
                                <span class="font-medium">Login</span>
                            </button>
                        {/if}
                    {:else}
                        <!-- User Info -->
                        <div class="border-t border-gray-700 my-4 pt-4">
                            <div class="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                                <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                                <span class="text-sm text-gray-300">{user_email}</span>
                            </div>
                        </div>

                        <!-- Logout -->
                        <button
                            class="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-900/30 transition-colors text-red-400 w-full text-left"
                            on:click={async () => {
                                await supabase.auth.signOut();
                                closeNav();
                            }}
                            aria-label="Logout"
                        >
                            <span class="text-xl">🚪</span>
                            <span class="font-medium">Logout</span>
                        </button>
                    {/if}
                </div>
            </div>
        {/if}
    </nav>
{:else}
    <!-- Navbar -->
    <nav
        class="bg-slate-900/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 shadow-xl border-b border-white/10"
    >
        <div class="navbar max-w-6xl mx-auto flex items-center px-4">
            <div class="flex items-center space-x-2">
                <button
                    on:click={async () => {
                        await supabase.auth.signOut();
                    }}
                    class="btn btn-ghost text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 transition-all duration-200"
                >
                    🎮 PokeFolio
                </button>
            </div>
            <!-- Spacer -->
            <div class="flex-1"></div>
        </div>
    </nav>
{/if}

<div class="pt-20 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
    <slot />
</div>

<style>
    @media (max-width: 768px) {
        .animate-slide-in {
            animation: slide-in 0.3s ease-out;
        }
        @keyframes slide-in {
            from {
                transform: translateX(100%);
            }
            to {
                transform: translateX(0);
            }
        }
    }
</style>
