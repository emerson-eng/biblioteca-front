<template>
	<q-page padding>
		<div class="row justify-center q-mb-md">
			<div class="col-12 col-md-9 ">
				<q-card class="q-pb-md">
					<q-card-section class="q-pb-xs q-px-lg">
						<div class="text-h6 text-color-dark text-bold">Mis Datos</div>
					</q-card-section>

					<q-card-section class="q-pb-xs q-px-lg">
						<div class="text-subtitle1 text-color-dark text-bold">Datos de mi cuenta</div>
						<q-list padding>
							<q-item clickable @click="updateName">
								<q-item-section avatar style="width: 150px;">
									<q-item-label class="text-subtitle2 text-weight-light">Nombre</q-item-label>
								</q-item-section>
								<q-item-section class="text-center">
									{{ userPinia.user.name }}
								</q-item-section>
								<q-item-section side>
									<q-icon size="xs"
									name="fa-solid fa-angle-right" 
									color="secondary"
									/>
								</q-item-section>
							</q-item>

							<q-item clickable @click="dialogUpdatePassword = true">
								<q-item-section avatar style="width: 150px;">
									<q-item-label class="text-subtitle2 text-weight-light">Contraseña</q-item-label>
								</q-item-section>
								<q-item-section class="text-center">
									*************
								</q-item-section>
								<q-item-section side>
									<q-icon size="xs"
									name="fa-solid fa-angle-right" 
									color="secondary"
									/>
								</q-item-section>
							</q-item>
						</q-list>
					</q-card-section>
				</q-card>
			</div>
		</div>

		<dialog-update-password />
	</q-page>
</template>

<script setup>
import { ref, provide } from 'vue'
import { useUserStore } from 'stores/user'
import { useQuasar, LocalStorage } from 'quasar'
import useHttpService from 'utils/httpService'
import useCrypto from  'utils/crypto'
import DialogUpdatePassword from 'components/user/dialogs/UpdatePassword.vue'

const $q = useQuasar()
const userPinia = useUserStore()
const { put } =  useHttpService()
const { encrypt } = useCrypto()

const dialogUpdatePassword = ref(false)

provide('dialogUpdatePassword', dialogUpdatePassword)

const updateName = () => {
	$q.dialog({
		title: 'Actualizar',
		message: 'Actualizar nombre',
		prompt: {
			model: userPinia.user.name,
			isValid: val => val.length > 4, 
			type: 'text'
		},
		cancel: true,
		persistent: true,
		ok: {
			label: 'Actualizar',
		}
	}).onOk(val => {
		const url = `user/user/${userPinia.user.id}`
		const form = {
			name: val,
		}
		put(url, form).then(response => {
			//console.log('updateName', response)
			let user = userPinia.user
			user.name = response.data.data.name 
			LocalStorage.set('user', encrypt(user))
			userPinia.setUser(user)
		})
	})
}

</script>
