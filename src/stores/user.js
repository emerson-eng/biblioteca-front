import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
	state: () => ({
		user: null,
		token: null,
	}),

	getters: {
		isAuthenticated: (state) => !! state.user,
	},
	
	actions: {
		setUser(user) {
			this.user = user
		},

		setToken(token) {
			this.token = token
		},
		
	},
});
