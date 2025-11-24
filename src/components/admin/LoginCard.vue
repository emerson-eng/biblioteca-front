<template>
	<q-card dark class="card-border bg-primary q-pt-lg q-mb-md">
		<q-card-section class="q-py-lg">
			<div class="text-center">
				<q-icon size="100px" name="account_circle" />
				<h4 class="text-weight-bolder q-my-md">Iniciar sesión</h4>
			</div>

			<q-form @submit="login" class="column q-gutter-y-md q-pa-md">
				<q-input quare outlined v-model="form.user" color="primary" bg-color="white" type="text" label="Usuario" lazy-rules :rules="[ val => val && val.length > 0 || 'Ingrese su usuario']">
					<template v-slot:prepend>
						<q-icon name="fa-solid fa-user" size="22px" />
					</template>
				</q-input>

				<q-input quare outlined v-model="form.password" color="primary" bg-color="white" :type="isPwd ? 'password' : 'text'" label="Contraseña" lazy-rules :rules="[ val => val && val.length > 0 || 'Ingrese su contraseña']">
					<template v-slot:prepend>
						<q-icon name="vpn_key" />
					</template>
					<template v-slot:append>
						<q-icon
						:name="isPwd ? 'visibility_off' : 'visibility'"
						class="cursor-pointer"
						@click="isPwd = !isPwd"
						/>
					</template>
				</q-input>

				<q-btn rounded :loading="loadingBtn" :disable="loadingBtn" color="primary" type="submit" class="q-mt-md" label="Iniciar sesión">
					<template v-slot:loading>
						<q-spinner-facebook />
					</template>
				</q-btn>
			</q-form>
		</q-card-section>
	</q-card>
</template>

<style scoped>
.card-border {
	border-radius: 25px;
}
</style>

<script setup>
import { ref } from 'vue'
import { useUserStore } from 'stores/user'
import { useQuasar, LocalStorage, SessionStorage } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'
import useCrypto from  'utils/crypto'
import useAlerts from 'utils/alerts'

const $q = useQuasar()
const userPinia = useUserStore()
const router = useRouter()
const { encrypt } = useCrypto()
const { alertNotify } = useAlerts()

// Login
const loadingBtn = ref(false)
const isPwd = ref(true)
const form = ref({
	user: '',
	password: '',
})

const login = () => {
	loadingBtn.value = true
	api.post('login', form.value).then((response) => {
		console.log('login', response)
		if ($q.screen.width < 700) {
			LocalStorage.set('user', encrypt(response.data.user))
			LocalStorage.set('token', encrypt(response.data.token))
		}
		else {
			SessionStorage.set('user', encrypt(response.data.user))
			SessionStorage.set('token', encrypt(response.data.token))
		}
		userPinia.setUser(response.data.user)
		userPinia.setToken(response.data.token)
		router.push({ name: 'Home' })
	}).catch(error => {
		let messageError = error.response.data.message
		alertNotify(messageError ? messageError : 'Ocurrio un error, vuelve intentarlo mas tarde.', 'negative')
	}).finally(() => {
		loadingBtn.value = false
	})
}

</script>
