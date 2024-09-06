<template>
	<q-btn no-caps flat no-wrap class="btn-padd-user">
		<div>
			<span class="q-pr-sm text-capitalize">
				{{ userPinia.user.name }}
			</span>
			<q-avatar square size="30px">
				<img src="/images/avatar-s-11.jpg">
			</q-avatar>
		</div>
		<q-icon name="arrow_drop_down" />

		<q-menu auto-close>
			<q-list class="text-grey-8" style="min-width: 100px">
				<q-item clickable v-ripple active-class="text-primary" :to="{ name: 'MyAccount' }">
					<q-item-section avatar style="min-width: 35px">
						<q-icon name="fas fa-user" size="20px"/>
					</q-item-section>
					<q-item-section>Mi Cuenta</q-item-section>
				</q-item>

				<q-separator />

				<q-item @click="logout" clickable v-ripple active-class="text-primary">
					<q-item-section avatar style="min-width: 35px">
						<q-icon name="fa fa-lock" size="20px"/>
					</q-item-section>
					<q-item-section>Cerrar Sesion</q-item-section>
				</q-item>
			</q-list>
		</q-menu>
	</q-btn>
</template>

<style scoped>
.btn-padd-user {
	padding-left: 12px!important;
	padding-right: 2px!important;
}
</style>

<script>
import { defineComponent } from 'vue'
import { LocalStorage, SessionStorage } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from 'stores/user'
import useHttpService from 'utils/httpService'

export default defineComponent({
	name: 'MenuUser',

	setup() {
		const router = useRouter()
		const route = useRoute()
		const userPinia = useUserStore()
		const { post } =  useHttpService()

		const logout = () => {
			post('logout', {}).then(response => {
				
			}).finally(() => {
				LocalStorage.remove('token')
				LocalStorage.remove('user')
				SessionStorage.clear()
				if(route.name != 'Index')
					router.push({name: 'Index'})
				window.location.reload(true)
			})
		}

		return {
			// Pinia
			userPinia,
			// Function
			logout,
			// Othres

		}
	}

})
</script>
