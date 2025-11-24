import { defineStore } from 'pinia'

export const useLoanStore = defineStore('loan', {
	state: () => ({
		//Loans
		books: [],
		//Books
		matters: [],
		authors: [],
		editorials: [],
		//Student
		students: [],
		degrees: [],
		sections: [],
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

		setStudents(val) {
			this.students = val
		},
		setDegrees(val) {
			this.degrees = val
		},
		setSections(val) {
			this.sections = val
		},
	}
})
