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
		setUser(val) {
			this.user = val
		},

		setToken(val) {
			this.token = val
		},
		
	},
});
