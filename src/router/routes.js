import { authUser, auth } from './auth'
import adminRoutes from './admin'

const routes = [
//Index
{
	path: '/',
	component: () => import('layouts/IndexLayout.vue'),
	children: [
	{ 
		path: '', name: 'Index',
		beforeEnter: authUser,
		component: () => import('pages/IndexPage.vue') 
	},
	]
},
// Admin
{
	path: '/admin',
	component: () => import('layouts/MainLayout.vue'),
	children: [
	{ 
		path: 'home', name: 'Home',
		beforeEnter: auth,
		component: () => import('pages/HomePage.vue'),
		meta: {
			permissions: ['Basic']
		}
	},
	{ 
		path: 'mi-cuenta', name: 'MyAccount',
		beforeEnter: auth,
		component: () => import('pages/user/MyAccount.vue'),
		meta: {
			permissions: ['Basic']
		}
	},
	]
},
// Always leave this as last one,
// but you can also remove it
{
	path: '/:catchAll(.*)*',
	component: () => import('pages/ErrorNotFound.vue')
}
]

routes[1].children = routes[1].children.concat(adminRoutes)

export default routes
