<template>
	<router-view />
</template>

<script>
import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'
import { useUserStore } from 'stores/user'
import useCrypto from  'utils/crypto'

export default defineComponent({
	name: 'App',

	setup() {
		const $q = useQuasar()
		const userPinia = useUserStore()
		const { decrypt } = useCrypto()

		let userStorage = null
		let token = null

		if($q.sessionStorage.getItem('user')) {
			userStorage = decrypt($q.sessionStorage.getItem('user'))
			token = decrypt($q.sessionStorage.getItem('token'))
		}
		else if ($q.localStorage.getItem('user')) {
			userStorage = decrypt($q.localStorage.getItem('user'))
			token = decrypt($q.localStorage.getItem('token'))
		}

		if(userStorage) {
			userPinia.setUser(userStorage)
			userPinia.setToken(token)
		}
	}
})
</script>
