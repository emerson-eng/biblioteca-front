import { useUserStore } from 'stores/user'

export default function () {

	const can = (permissionName) => {
		const userPinia = useUserStore()
		if(userPinia.user) {
			const modules = userPinia.user.role.permissions.split(',')
			return modules.includes(permissionName)
		}
		return false
	}

	const canany = (permissionNames) => {
		const userPinia = useUserStore()
		if(userPinia.user) {
			const modules = userPinia.user.role.permissions.split(',')
			for(let i = 0; i < permissionNames.length; i++) {
				return modules.includes(permissionNames[i])
			}
		}
		return false
	}

	return {
		can,
		canany,
	}
}