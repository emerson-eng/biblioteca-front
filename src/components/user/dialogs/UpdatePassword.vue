<template>
	<q-dialog v-model="dialogUpdatePassword" :maximized="$q.screen.width < 700 ? true : false" transition-show="slide-up" transition-hide="slide-down" :persistent="$q.screen.width < 700 ? false : true">
		<q-card style="width: 400px; max-width: 400px;" class="q-px-sm">
			<q-card-section class="row items-center q-pb-none">
				<div class="text-h6">Cambiar contraseña</div>
				<q-space />
				<q-btn icon="close" flat round dense v-close-popup />
			</q-card-section>

			<q-card-section>
				<q-form @submit="updatePassword" class="q-gutter-y-sm column q-pb-sm">
					<q-input v-model="form.current_password" color="primary" :type="isCurrentPwd ? 'password' : 'text'" label="Contraseña actual" lazy-rules :rules="[ val => val && val.length > 0 || 'Ingrese la contraseña actual']">
						<template v-slot:append>
							<q-icon
							:name="isCurrentPwd ? 'visibility_off' : 'visibility'"
							class="cursor-pointer"
							@click="isCurrentPwd = !isCurrentPwd"
							/>
						</template>
					</q-input>

					<q-input v-model="form.password" color="primary" :type="isPwd ? 'password' : 'text'" label="Nueva contraseña" lazy-rules :rules="[ val => val && val.length > 4 || 'Ingrese la nueva contraseña mayor a 5 caracteres']">
						<template v-slot:append>
							<q-icon
							:name="isPwd ? 'visibility_off' : 'visibility'"
							class="cursor-pointer"
							@click="isPwd = !isPwd"
							/>
						</template>
					</q-input>

					<q-input v-model="form.confirmPassword" color="primary" :type="isConfirmPwd ? 'password' : 'text'" label="Confirma tu nueva contraseña" lazy-rules :rules="[ val => val && val.length > 4 || 'Ingrese la nueva contraseña', val => val && val == form.password || 'Las contraseñas no coinciden']">
						<template v-slot:append>
							<q-icon
							:name="isConfirmPwd ? 'visibility_off' : 'visibility'"
							class="cursor-pointer"
							@click="isConfirmPwd = !isConfirmPwd"
							/>
						</template>
					</q-input>

					<q-btn rounded :loading="loadingBtn" :disable="loadingBtn" color="primary" type="submit" label="Actualizar contraseña">
						<template v-slot:loading>
							<q-spinner-facebook />
						</template>
					</q-btn>
				</q-form>
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useUserStore } from 'stores/user'
import useHttpService from 'utils/httpService'


const userPinia = useUserStore()
const { put } =  useHttpService()


const dialogUpdatePassword = inject('dialogUpdatePassword')


const loadingBtn = ref(false)
const isCurrentPwd = ref(true)
const isPwd = ref(true)
const isConfirmPwd = ref(true)
const form = ref({
	current_password: '',
	password: '',
	confirmPassword: '',
})


const updatePassword = () => {
	loadingBtn.value = true
	const url = `user/update-password/${userPinia.user.id}`
	put(url, form.value).then(response => {
		//console.log('updatePassword', response)
		if(response.status >= 200 && response.status < 300) {
			dialogUpdatePassword.value = false
			form.value = {
				current_password: '',
				password: '',
				confirmPassword: '',
			}
		}
	}).finally(() => {
		loadingBtn.value = false
	})
}

</script>
