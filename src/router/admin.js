import { auth } from './auth'

let adminRoutes = [

// Student
{ 
	path: 'estudiantes', name: 'StudentPage',
	beforeEnter: auth,
	component: () => import('pages/admin/StudentPage.vue'),
	meta: {
		permissions: ['Estudiantes']
	}
},
// Book
{ 
	path: 'libros', name: 'BooksPage',
	beforeEnter: auth,
	component: () => import('pages/admin/BooksPage.vue'),
	meta: {
		permissions: ['Libros']
	}
},
// User
{ 
	path: 'usuario', name: 'UsersPage',
	beforeEnter: auth,
	component: () => import('pages/admin/UsersPage.vue'),
	meta: {
		permissions: ['Usuario']
	}
},
// Report
{ 
	path: 'reportes', name: 'ReportPage',
	beforeEnter: auth,
	component: () => import('pages/admin/ReportPage.vue'),
	meta: {
		permissions: ['Reportes']
	}
},
// Setting


]

export default adminRoutes
