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
{ 
	path: 'configuracion/institucion', name: 'InstitutionPage',
	beforeEnter: auth,
	component: () => import('pages/admin/setting/InstitutionPage.vue'),
	meta: {
		permissions: ['Configuración/Institución']
	}
},
{ 
	path: 'configuracion/estantes', name: 'MattersPage',
	beforeEnter: auth,
	component: () => import('pages/admin/setting/MattersPage.vue'),
	meta: {
		permissions: ['Configuración/Estantes']
	}
},
{ 
	path: 'configuracion/autores', name: 'AuthorsPage',
	beforeEnter: auth,
	component: () => import('pages/admin/setting/AuthorsPage.vue'),
	meta: {
		permissions: ['Configuración/Autores']
	}
},
{ 
	path: 'configuracion/editoriales', name: 'EditorialsPage',
	beforeEnter: auth,
	component: () => import('pages/admin/setting/EditorialsPage.vue'),
	meta: {
		permissions: ['Configuración/Editoriales']
	}
},
{ 
	path: 'configuracion/grados', name: 'DegreesPage',
	beforeEnter: auth,
	component: () => import('pages/admin/setting/DegreesPage.vue'),
	meta: {
		permissions: ['Configuración/Grados']
	}
},
{ 
	path: 'configuracion/secciones', name: 'SectionsPage',
	beforeEnter: auth,
	component: () => import('pages/admin/setting/SectionsPage.vue'),
	meta: {
		permissions: ['Configuración/Secciones']
	}
},

]

export default adminRoutes
