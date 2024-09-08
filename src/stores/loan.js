import { defineStore } from 'pinia'

export const useLoanStore = defineStore('loan', {
	state: () => ({
		loans: [],
		//Loans
		students: [],
		books: [],
		//Books
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
		setBooks(val) {
			this.books = val
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
