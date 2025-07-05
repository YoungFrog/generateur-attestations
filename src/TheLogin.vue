<script setup lang="ts">
import { ref } from 'vue';
import { initialize } from './json_client';

const isLoggedIn = ref(false)
const isLoading = ref(false)
const login = ref('')
const password = ref('')
const error = ref('')

function submitCredentials() {
	isLoading.value = true
	error.value = ''
	initialize(login.value, password.value)
		.then(() => isLoggedIn.value = true)
		.catch((e) => {
			error.value = e.toString()
			isLoggedIn.value = false
		})
		.finally(() => isLoading.value = false)
}

defineExpose({ isLoading, isLoggedIn })
</script>

<template>
	<div class="error" v-if="error">{{ error }}</div>

	<form id="login-form" @submit.prevent="submitCredentials">
		<span v-if="isLoggedIn">(Logged in)</span>

		Login: <input type="text" name="username" v-model="login" />

		Password: <input type="password" name="password" v-model="password" />

		<button :disabled="isLoggedIn || isLoading">Login</button>
	</form>
</template>
