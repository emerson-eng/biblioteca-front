import { auth } from './auth'

let adminRoutes = [

// UsersPage
{ 
	path: 'usuario', name: 'UsersPage',
	beforeEnter: auth,
	component: () => import('pages/admin/UsersPage.vue'),
	meta: {
		permissions: ['Usuario']
	}
},

]

export default adminRoutes
