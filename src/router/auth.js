import { SessionStorage, LocalStorage } from 'quasar'
import useCrypto from  'utils/crypto'

const { decrypt } = useCrypto()

// Tiene que estar autentificado
const auth = (to, from, next) => {
	let user = LocalStorage.getItem('user')
	if(SessionStorage.getItem('user')) 
		user = SessionStorage.getItem('user')

	if (user) {
		user = decrypt(user)
		let hasPermission = false
		const modules = user.role.permissions.split(',')
		for (let i = 0; i < to.meta.permissions.length; i++) {
			if (modules.includes(to.meta.permissions[i])) {
				hasPermission = true
				break
			}
		}
		if (hasPermission) {
			return next()
		}
		else
			return next({ name: 'Home' })
	} 
	else 
		return next({ name: 'Index' })
}

const authUser = (to, from, next) => {
	if (LocalStorage.getItem('user') || SessionStorage.getItem('user'))
		return next({ name: 'Home' })
	else
		return next()
}

export { auth, authUser }
