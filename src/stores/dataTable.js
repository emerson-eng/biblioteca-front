import { defineStore } from 'pinia'

export const useDataTableStore = defineStore('dataTable', {
	state: () => ({
		//Loans
		loans: [],
		//Students
		students: [],
		typePersons: [],
		//Books
		books: [],
		//User
		users: [],
		roles: [],
		//Setting
		setting: null,
		matters: [],
		authors: [],
		editorials: [],
	}),
	
	actions: {
		setLoans(val) {
			this.loans = val
		},
		
		setStudents(val) {
			this.students = val
		},
		setTypePersons(val) {
			this.typePersons = val
		},

		setBooks(val) {
			this.books = val
		},
		
		setUsers(val) {
			this.users = val
		},
		setRoles(val) {
			this.roles = val
		},

		setSetting(val) {
			this.setting = val
		},
		setMatters(val) {
			this.matters = val
		},
		setAuthors(val) {
			this.authors = val
		},
		setEditorials(val) {
			this.editorials = val
		},
	}
})
