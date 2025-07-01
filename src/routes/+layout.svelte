<script lang="ts">
    export let data;
    import { goto, invalidateAll } from "$app/navigation";
    import "../app.css";

    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { Toaster, toast } from "svelte-sonner";

    let { supabase } = data;
    let session = data.session;

    $: isInPasswordResetPage = $page.url.pathname === "/reset-password";
    $: user_email = session?.user?.email;
    $: isInLogInPage = $page.url.pathname === "/login";
    $: isOnMyProfile = $page.url.pathname === `/${user_email}`;
    $: isOnSettings = $page.url.pathname === "/settings";
    $: isOnHome = $page.url.pathname === "/";

    // Hamburger menu state
    let navOpen = false;

    // Get current year for footer
    let currentYear = new Date().getFullYear();

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
        class="bg-slate-900/95 backdrop-blur-md fixed top-0 left-0 right-0 z-50 shadow-2xl border-b border-white/10"
    >
        <div class="navbar max-w-7xl mx-auto flex items-center px-4 py-2">
            <!-- Brand and My Page (left) -->
            <div class="flex items-center space-x-3">
                <a
                    href="/"
                    class="btn btn-ghost text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 hover:from-yellow-300 hover:via-orange-300 hover:to-red-400 transition-all duration-300 transform hover:scale-105"
                >
                    🎮 PokeFolio
                </a>
                {#if session !== null}
                    <a
                        href="/{user_email}"
                        class="btn btn-sm {isOnMyProfile
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-none hover:from-purple-700 hover:to-pink-700 text-white shadow-lg'
                            : 'btn-ghost text-white hover:bg-white/10 border border-white/20 hover:border-white/40'} font-medium transition-all duration-200 transform hover:scale-105"
                    >
                        <img
                            src="/pokeball.png"
                            alt="Pokeball"
                            class="w-4 h-4"
                        />
                        My PokeFolio
                    </a>
                {/if}
            </div>
            <!-- Spacer -->
            <div class="flex-1"></div>
            <!-- Desktop Nav (right) -->
            <div class="hidden md:flex items-center space-x-3">
                {#if session == null}
                    {#if !isInLogInPage}
                        <button
                            aria-label="Login"
                            class="btn btn-sm bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                            on:click={() => goto("/login")}>🔐 Login</button
                        >
                    {/if}
                {:else}
                    <div
                        class="flex items-center bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-green-400/30 hover:border-green-400/50 transition-all duration-200"
                    >
                        <div class="relative">
                            <div
                                class="w-2.5 h-2.5 bg-green-400 rounded-full mr-3"
                            ></div>
                            <div
                                class="absolute inset-0 w-2.5 h-2.5 bg-green-400 rounded-full mr-3 animate-ping opacity-75"
                            ></div>
                        </div>
                        <span class="text-green-100 text-sm font-medium"
                            >{user_email}</span
                        >
                    </div>
                    <a
                        href="/settings"
                        class="btn btn-sm {isOnSettings
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-none hover:from-purple-700 hover:to-pink-700 text-white shadow-lg'
                            : 'btn-ghost text-white hover:bg-white/10 border border-white/20 hover:border-white/40'} font-medium transition-all duration-200 transform hover:scale-105"
                        >⚙️ Settings</a
                    >
                    <button
                        class="btn btn-sm btn-ghost text-red-500 hover:bg-red-500/10 border border-red-600/20 hover:border-red-500/40 transition-all duration-200 transform hover:scale-105"
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
                class="md:hidden btn btn-ghost text-white hover:bg-white/10 border border-white/20 hover:border-white/40 transition-all duration-200"
                aria-label="Open navigation menu"
                on:click={() => (navOpen = !navOpen)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
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
            <div
                class="md:hidden fixed top-0 right-0 w-80 h-screen bg-gradient-to-b from-slate-900 to-gray-900 shadow-2xl z-50 animate-slide-in border-l border-white/10"
            >
                <!-- Header -->
                <div
                    class="flex items-center justify-between p-6 border-b border-white/20 bg-gradient-to-r from-purple-900/30 to-pink-900/30"
                >
                    <h2
                        class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500"
                    >
                        🎮 Menu
                    </h2>
                    <button
                        class="p-2 rounded-lg hover:bg-white/10 text-white transition-colors border border-white/20 hover:border-white/40"
                        on:click={closeNav}
                        aria-label="Close navigation menu"
                    >
                        <svg
                            class="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <!-- Navigation Items -->
                <div class="p-6 space-y-3">
                    <a
                        href="/"
                        class="flex items-center space-x-3 p-4 rounded-xl {isOnHome
                            ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/40 hover:to-pink-600/40 border border-purple-400/30 hover:border-purple-400/50'
                            : 'hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 border border-transparent hover:border-white/20'} transition-all duration-200 text-white"
                        on:click={closeNav}
                    >
                        <span class="text-xl">🏠</span>
                        <span class="font-medium">Home</span>
                    </a>

                    {#if session}
                        <a
                            href="/{user_email}"
                            class="flex items-center space-x-3 p-4 rounded-xl {isOnMyProfile
                                ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/40 hover:to-pink-600/40 border border-purple-400/30 hover:border-purple-400/50'
                                : 'hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 border border-transparent hover:border-white/20'} transition-all duration-200 text-white"
                            on:click={closeNav}
                        >
                            <img
                                src="/pokeball.png"
                                alt="Pokeball"
                                class="w-5 h-5"
                            />
                            <span class="font-medium">My PokeFolio</span>
                        </a>

                        <a
                            href="/settings"
                            class="flex items-center space-x-3 p-4 rounded-xl {isOnSettings
                                ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/40 hover:to-pink-600/40 border border-purple-400/30 hover:border-purple-400/50'
                                : 'hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 border border-transparent hover:border-white/20'} transition-all duration-200 text-white"
                            on:click={closeNav}
                        >
                            <span class="text-xl">⚙️</span>
                            <span class="font-medium">Settings</span>
                        </a>
                    {/if}

                    {#if session == null}
                        {#if !isInLogInPage}
                            <button
                                class="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-blue-600/30 to-purple-600/30 hover:from-blue-600/40 hover:to-purple-600/40 transition-all duration-200 text-white w-full text-left border border-blue-400/30 hover:border-blue-400/50"
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
                        <div class="border-t border-white/20 my-4 pt-4">
                            <div
                                class="flex items-center space-x-3 p-4 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-xl border border-green-400/30"
                            >
                                <div class="relative">
                                    <div
                                        class="w-3 h-3 bg-green-400 rounded-full"
                                    ></div>
                                    <div
                                        class="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75"
                                    ></div>
                                </div>
                                <div class="flex-1">
                                    <p class="text-xs text-green-200 mb-1">
                                        Signed in as
                                    </p>
                                    <p
                                        class="text-sm text-green-100 font-medium break-all"
                                    >
                                        {user_email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Logout -->
                        <button
                            class="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-red-500/30 to-red-600/30 hover:from-red-500/40 hover:to-red-600/40 transition-all duration-200 text-red-100 hover:text-white w-full text-left border border-red-400/30 hover:border-red-400/50 shadow-lg hover:shadow-red-500/20"
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

<div
    class="min-h-screen flex flex-col pt-20 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"
>
    <div class="flex-1">
        <slot />
    </div>

    <!-- Footer -->
    <footer
        class="mt-auto border-t border-white/10 bg-slate-900/50 backdrop-blur-sm"
    >
        <div class="max-w-6xl mx-auto px-4 py-4 md:py-6">
            <div class="text-center space-y-3 md:space-y-2">
                <p class="text-gray-300 text-xs md:text-sm">
                    © {currentYear} PokeFolio. Developed by
                    <a
                        href="https://eligiobautista.dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 font-semibold transition-all duration-200 hover:underline"
                    >
                        Eli Bautista
                    </a>
                </p>
                <div
                    class="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-gray-400 text-xs"
                >
                    <span class="flex items-center space-x-1">
                        <img
                            src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/svelte.svg"
                            alt="Svelte"
                            class="w-3 h-3 md:w-4 md:h-4"
                            style="filter: invert(1);"
                        />
                        <span class="text-xs">SvelteKit</span>
                    </span>
                    <span class="flex items-center space-x-1">
                        <img
                            src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/typescript.svg"
                            alt="TypeScript"
                            class="w-3 h-3 md:w-4 md:h-4"
                            style="filter: invert(36%) sepia(61%) saturate(4799%) hue-rotate(202deg) brightness(97%) contrast(97%);"
                        />
                        <span class="text-xs">TypeScript</span>
                    </span>
                    <span class="flex items-center space-x-1">
                        <img
                            src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/tailwindcss.svg"
                            alt="Tailwind CSS"
                            class="w-3 h-3 md:w-4 md:h-4"
                            style="filter: invert(56%) sepia(93%) saturate(1159%) hue-rotate(159deg) brightness(94%) contrast(101%);"
                        />
                        <span class="text-xs">Tailwind</span>
                    </span>
                    <span class="flex items-center space-x-1">
                        <img
                            src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/daisyui.svg"
                            alt="DaisyUI"
                            class="w-3 h-3 md:w-4 md:h-4"
                            style="filter: invert(71%) sepia(18%) saturate(2773%) hue-rotate(285deg) brightness(106%) contrast(97%);"
                        />
                        <span class="text-xs">DaisyUI</span>
                    </span>
                    <span class="flex items-center space-x-1">
                        <img
                            src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/supabase.svg"
                            alt="Supabase"
                            class="w-3 h-3 md:w-4 md:h-4"
                            style="filter: invert(72%) sepia(14%) saturate(1870%) hue-rotate(104deg) brightness(96%) contrast(82%);"
                        />
                        <span class="text-xs">Supabase</span>
                    </span>
                    <a
                        href="https://pokeapi.co"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="flex items-center space-x-1 hover:text-yellow-400 transition-colors duration-200"
                    >
                        <span class="text-sm md:text-lg">⚡</span>
                        <span class="text-xs">PokéAPI</span>
                    </a>
                </div>
            </div>
        </div>
    </footer>
</div>

<Toaster position="bottom-right" richColors />

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
