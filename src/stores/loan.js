import { defineStore } from 'pinia'

export const useLoanStore = defineStore('loan', {
	state: () => ({
		//Loans
		books: [],
		//Books
		matters: [],
		authors: [],
		editorials: [],
	}),	
	
	actions: {
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
