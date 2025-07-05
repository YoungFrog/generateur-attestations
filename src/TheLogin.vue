<script setup lang="ts">
import { ref } from 'vue';
import { initialize } from './json_client';

const isLoggedIn = ref(false)
const isLoading = ref(false)
const login = ref('')
const password = ref('')

function submitCredentials() {
	isLoading.value = true
	
	// must return the Promise, otherwise it's /floating/ and Vue does not get to handle it in onErrorCaptured()
	return initialize(login.value, password.value)
		.then(() => isLoggedIn.value = true)
		.catch((e) => {
			isLoggedIn.value = false
			throw e
		})
		.finally(() => isLoading.value = false)
}

defineExpose({ isLoading, isLoggedIn })
</script>

<template>
	<form id="login-form" @submit.prevent="submitCredentials">
		<span v-if="isLoggedIn">(Logged in)</span>

		Login: <input type="text" name="username" v-model="login" />

		Password: <input type="password" name="password" v-model="password" />

		<button :disabled="isLoggedIn || isLoading">Login</button>
	</form>
</template>
