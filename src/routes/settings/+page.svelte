<svelte:head>
    <title>Settings - PokeFolio</title>
    <meta name="description" content="Manage your PokeFolio account settings, update your profile, and security preferences." />
</svelte:head>

<script lang="ts">
    export let data;
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    let { supabase, session } = data;
    $: ({ supabase, session } = data);

    // Redirect if not logged in
    $: if (!session) {
        goto("/login");
    }

    // Check if user is using a third-party provider
    $: hasProvider =
        session?.user?.app_metadata?.provider &&
        session?.user?.app_metadata?.provider !== "email";
    $: providerName = session?.user?.app_metadata?.provider;

    // Form states
    let newEmail = session?.user?.email || "";
    let currentPassword = "";
    let newPassword = "";
    let confirmPassword = "";

    // UI states
    let emailMessage = "";
    let passwordMessage = "";
    let emailLoading = false;
    let passwordLoading = false;
    let deleteLoading = false;
    let showDeleteConfirm = false;
    let deleteConfirmText = "";

    // User info
    let userCreatedAt = "";
    let lastSignIn = "";

    onMount(() => {
        if (session?.user) {
            userCreatedAt = new Date(
                session.user.created_at,
            ).toLocaleDateString();
            lastSignIn = session.user.last_sign_in_at
                ? new Date(session.user.last_sign_in_at).toLocaleDateString()
                : "Unknown";
        }
    });

    async function updateEmail() {
        if (hasProvider) {
            emailMessage =
                "Email changes are not allowed for accounts using third-party providers";
            return;
        }

        if (!newEmail || newEmail === session?.user?.email) {
            emailMessage = "Please enter a different email address";
            return;
        }

        emailLoading = true;
        emailMessage = "";

        try {
            const { error } = await supabase.auth.updateUser({
                email: newEmail,
            });
            if (error) {
                emailMessage = error.message;
            } else {
                emailMessage =
                    "Email update requested. Please check your new email for a confirmation link.";
            }
        } catch (err) {
            emailMessage = "An unexpected error occurred";
        } finally {
            emailLoading = false;
        }
    }

    async function updatePassword() {
        if (hasProvider) {
            passwordMessage =
                "Password changes are not allowed for accounts using third-party providers";
            return;
        }

        if (!newPassword || !confirmPassword) {
            passwordMessage = "Please fill in all password fields";
            return;
        }

        if (newPassword !== confirmPassword) {
            passwordMessage = "New passwords do not match";
            return;
        }

        if (newPassword.length < 6) {
            passwordMessage = "Password must be at least 6 characters long";
            return;
        }

        passwordLoading = true;
        passwordMessage = "";

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) {
                passwordMessage = error.message;
            } else {
                passwordMessage = "Password updated successfully";
                currentPassword = "";
                newPassword = "";
                confirmPassword = "";
            }
        } catch (err) {
            passwordMessage = "An unexpected error occurred";
        } finally {
            passwordLoading = false;
        }
    }

    async function signOutAllDevices() {
        try {
            await supabase.auth.signOut({ scope: "global" });
            goto("/login");
        } catch (err) {
            console.error("Error signing out:", err);
        }
    }

    async function deleteAccount() {
        if (deleteConfirmText !== "DELETE") {
            return;
        }

        deleteLoading = true;

        try {
            // Note: Account deletion typically requires server-side implementation
            // This is a placeholder for the UI flow
            const { error } = await supabase.rpc("delete_user_account");

            if (error) {
                console.error("Delete account error:", error);
                alert("Account deletion failed. Please contact support.");
            } else {
                alert("Account deleted successfully");
                goto("/");
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            alert("An unexpected error occurred. Please contact support.");
        } finally {
            deleteLoading = false;
            showDeleteConfirm = false;
            deleteConfirmText = "";
        }
    }
</script>

<div
    class="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"
>
    <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="text-center mb-12">
            <div class="relative inline-block mb-4">
                <h1
                    class="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500"
                >
                    ⚙️ Account Settings
                </h1>
                <div
                    class="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg blur opacity-25"
                ></div>
            </div>
            <p class="text-gray-300 text-lg">
                Manage your account information and preferences
            </p>
        </div>

        <div class="max-w-4xl mx-auto">
            <div class="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
                <!-- Account Information Card -->
                <div
                    class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl"
                >
                    <h2
                        class="flex items-center text-2xl font-bold text-white mb-6"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6 mr-3 text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                        Account Information
                    </h2>

                    <div class="space-y-4">
                        <div
                            class="bg-white/5 rounded-xl p-4 border border-white/10"
                        >
                            <dt class="text-sm font-medium text-gray-400 mb-1">
                                Email Address
                            </dt>
                            <dd class="text-lg font-semibold text-white">
                                {session?.user?.email || "Not available"}
                            </dd>
                        </div>

                        <div
                            class="bg-white/5 rounded-xl p-4 border border-white/10"
                        >
                            <dt class="text-sm font-medium text-gray-400 mb-1">
                                Account Created
                            </dt>
                            <dd class="text-lg font-semibold text-white">
                                {userCreatedAt}
                            </dd>
                        </div>

                        <div
                            class="bg-white/5 rounded-xl p-4 border border-white/10"
                        >
                            <dt class="text-sm font-medium text-gray-400 mb-1">
                                Last Sign In
                            </dt>
                            <dd class="text-lg font-semibold text-white">
                                {lastSignIn}
                            </dd>
                        </div>

                        <div
                            class="bg-white/5 rounded-xl p-4 border border-white/10"
                        >
                            <dt class="text-sm font-medium text-gray-400 mb-1">
                                User ID
                            </dt>
                            <dd
                                class="text-sm font-mono break-all text-gray-300"
                            >
                                {session?.user?.id || "Not available"}
                            </dd>
                        </div>
                    </div>
                </div>

                <!-- Update Email Card -->
                <div
                    class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl"
                >
                    <h2
                        class="flex items-center text-2xl font-bold text-white mb-6"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6 mr-3 text-green-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                        📧 Update Email
                    </h2>

                    {#if emailMessage}
                        <div
                            class="alert {emailMessage.includes('Error') ||
                            emailMessage.includes('Please')
                                ? 'bg-red-500/20 border-red-500/30 text-red-200'
                                : 'bg-green-500/20 border-green-500/30 text-green-200'} mb-6"
                        >
                            <span>{emailMessage}</span>
                        </div>
                    {/if}

                    <form
                        on:submit|preventDefault={updateEmail}
                        class="space-y-6"
                    >
                        {#if hasProvider}
                            <div
                                class="alert bg-blue-500/20 border-blue-500/30 text-blue-200 mb-4"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="stroke-current shrink-0 h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span class="text-sm"
                                    >Your email is managed by {providerName
                                        ? providerName.charAt(0).toUpperCase() +
                                          providerName.slice(1)
                                        : "your provider"} and cannot be changed
                                    here.</span
                                >
                            </div>
                        {/if}

                        <div class="form-control">
                            <label class="label" for="email-input">
                                <span class="label-text text-white font-medium"
                                    >New Email Address</span
                                >
                            </label>
                            <input
                                id="email-input"
                                type="email"
                                bind:value={newEmail}
                                placeholder={hasProvider
                                    ? "Email managed by provider"
                                    : "Enter new email address"}
                                class="input input-bordered w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:bg-white/20 transition-all duration-200"
                                class:opacity-50={hasProvider}
                                class:cursor-not-allowed={hasProvider}
                                required
                                disabled={!!(emailLoading || hasProvider)}
                            />
                        </div>

                        <button
                            type="submit"
                            class="btn w-full bg-gradient-to-r from-green-600 to-blue-600 border-none hover:from-green-700 hover:to-blue-700 text-white font-semibold transform hover:scale-105 transition-all duration-200 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            disabled={!!(emailLoading || hasProvider)}
                        >
                            {#if emailLoading}
                                <span class="loading loading-spinner loading-sm"
                                ></span>
                                Updating Email...
                            {:else}
                                📧 Update Email
                            {/if}
                        </button>
                    </form>
                </div>

                <!-- Update Password Card -->
                <div
                    class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl lg:col-span-2"
                >
                    <h2
                        class="flex items-center text-2xl font-bold text-white mb-6"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6 mr-3 text-purple-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                        🔒 Update Password
                    </h2>

                    {#if passwordMessage}
                        <div
                            class="alert {passwordMessage.includes('Error') ||
                            passwordMessage.includes('not match') ||
                            passwordMessage.includes('fill in') ||
                            passwordMessage.includes('least')
                                ? 'bg-red-500/20 border-red-500/30 text-red-200'
                                : 'bg-green-500/20 border-green-500/30 text-green-200'} mb-6"
                        >
                            <span>{passwordMessage}</span>
                        </div>
                    {/if}

                    {#if hasProvider}
                        <div
                            class="alert bg-blue-500/20 border-blue-500/30 text-blue-200 mb-6"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="stroke-current shrink-0 h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span class="text-sm"
                                >Your password is managed by {providerName
                                    ? providerName.charAt(0).toUpperCase() +
                                      providerName.slice(1)
                                    : "your provider"} and cannot be changed here.</span
                            >
                        </div>
                    {/if}

                    <form
                        on:submit|preventDefault={updatePassword}
                        class="grid gap-4 md:grid-cols-2"
                    >
                        <div class="form-control">
                            <label class="label" for="new-password">
                                <span class="label-text text-white font-medium"
                                    >New Password</span
                                >
                            </label>
                            <input
                                id="new-password"
                                type="password"
                                bind:value={newPassword}
                                placeholder={hasProvider
                                    ? "Password managed by provider"
                                    : "Enter new password (min. 6 characters)"}
                                class="input input-bordered w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:bg-white/20 transition-all duration-200"
                                class:opacity-50={hasProvider}
                                class:cursor-not-allowed={hasProvider}
                                required
                                minlength="6"
                                disabled={!!(passwordLoading || hasProvider)}
                            />
                        </div>

                        <div class="form-control">
                            <label class="label" for="confirm-password">
                                <span class="label-text text-white font-medium"
                                    >Confirm New Password</span
                                >
                            </label>
                            <input
                                id="confirm-password"
                                type="password"
                                bind:value={confirmPassword}
                                placeholder={hasProvider
                                    ? "Password managed by provider"
                                    : "Confirm new password"}
                                class="input input-bordered w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:bg-white/20 transition-all duration-200"
                                class:opacity-50={hasProvider}
                                class:cursor-not-allowed={hasProvider}
                                required
                                disabled={!!(passwordLoading || hasProvider)}
                            />
                        </div>

                        <div class="md:col-span-2">
                            <button
                                type="submit"
                                class="btn w-full bg-gradient-to-r from-purple-600 to-blue-600 border-none hover:from-purple-700 hover:to-blue-700 text-white font-semibold transform hover:scale-105 transition-all duration-200 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                disabled={!!(passwordLoading || hasProvider)}
                            >
                                {#if passwordLoading}
                                    <span
                                        class="loading loading-spinner loading-sm"
                                    ></span>
                                    Updating Password...
                                {:else}
                                    🔒 Update Password
                                {/if}
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Security Actions Card -->
                <div
                    class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl lg:col-span-2"
                >
                    <h2
                        class="flex items-center text-2xl font-bold text-white mb-6"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6 mr-3 text-orange-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                        </svg>
                        🛡️ Security & Account Management
                    </h2>

                    <div class="grid gap-6 md:grid-cols-2">
                        <!-- Sign Out All Devices -->
                        <div
                            class="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6"
                        >
                            <h3
                                class="font-semibold text-white mb-2 flex items-center"
                            >
                                <span class="mr-2">📱</span>
                                Sign Out All Devices
                            </h3>
                            <p class="text-sm text-gray-300 mb-4">
                                Sign out from all devices and browsers where
                                you're currently logged in.
                            </p>
                            <button
                                on:click={signOutAllDevices}
                                class="btn bg-gradient-to-r from-yellow-600 to-orange-600 border-none hover:from-yellow-700 hover:to-orange-700 text-white font-semibold transform hover:scale-105 transition-all duration-200"
                            >
                                🚪 Sign Out Everywhere
                            </button>
                        </div>

                        <!-- Delete Account -->
                        <div
                            class="bg-red-500/10 border border-red-500/20 rounded-xl p-6"
                        >
                            <h3
                                class="font-semibold text-red-400 mb-2 flex items-center"
                            >
                                <span class="mr-2">⚠️</span>
                                Delete Account
                            </h3>
                            <p class="text-sm text-gray-300 mb-4">
                                Permanently delete your account and all
                                associated data. This action cannot be undone.
                            </p>

                            {#if !showDeleteConfirm}
                                <button
                                    on:click={() => (showDeleteConfirm = true)}
                                    class="btn bg-gradient-to-r from-red-600 to-red-700 border-none hover:from-red-700 hover:to-red-800 text-white font-semibold transform hover:scale-105 transition-all duration-200"
                                >
                                    🗑️ Delete Account
                                </button>
                            {:else}
                                <div class="space-y-4">
                                    <div
                                        class="alert bg-red-500/20 border border-red-500/30 text-red-200"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            class="stroke-current shrink-0 h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 15c-.77.833.192 2.5 1.732 2.5z"
                                            />
                                        </svg>
                                        <span class="text-sm"
                                            >This will permanently delete your
                                            account!</span
                                        >
                                    </div>
                                    <input
                                        type="text"
                                        bind:value={deleteConfirmText}
                                        placeholder="Type DELETE to confirm"
                                        class="input input-bordered w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-red-400"
                                    />
                                    <div class="flex gap-3">
                                        <button
                                            on:click={deleteAccount}
                                            disabled={deleteConfirmText !==
                                                "DELETE" || deleteLoading}
                                            class="btn flex-1 bg-gradient-to-r from-red-600 to-red-700 border-none hover:from-red-700 hover:to-red-800 text-white font-semibold disabled:opacity-50"
                                        >
                                            {#if deleteLoading}
                                                <span
                                                    class="loading loading-spinner loading-sm"
                                                ></span>
                                            {:else}
                                                ✅ Confirm Delete
                                            {/if}
                                        </button>
                                        <button
                                            on:click={() => {
                                                showDeleteConfirm = false;
                                                deleteConfirmText = "";
                                            }}
                                            class="btn btn-outline border-white/30 text-white hover:bg-white/10"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Back to Profile Link -->
            <div class="mt-8 text-center">
                <a
                    href="/{session?.user?.email}"
                    class="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 underline font-medium transform hover:scale-105 transition-all duration-200"
                >
                    <span>←</span>
                    <span>Back to My PokeFolio</span>
                </a>
            </div>
        </div>
    </div>
</div>
