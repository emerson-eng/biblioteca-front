import { defineStore } from 'pinia'

export const useDataTableStore = defineStore('dataTable', {
	state: () => ({
		//Client
		clients: [],
		//User
		users: [],
		roles: [],
	}),
	
	actions: {
		setClients(clients) {
			this.clients = clients
		},
		
		setUsers(users) {
			this.users = users
		},
		setRoles(roles) {
			this.roles = roles
		},

	}
})
