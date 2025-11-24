import { api } from 'boot/axios'
import { Notify } from 'quasar'
import { useUserStore } from 'stores/user'


const alertNotify = (msj, type) => {
	Notify.create({
		type: type,
		message: msj
	})
}

const header = () => {
	const userPinia = useUserStore()
	return {
		timeout: 35000,
		headers: { 
			Authorization: `Bearer ${userPinia.token}`,
			userId: userPinia.user?.id,
		}
	}
}

const extractData = (response, showNotify) => {
	if(showNotify && response.data.message) 
		alertNotify(response.data.message, 'positive')
	return response
}

const handleError = (error, showNotifyCatch) => {
	//console.log('handleError', error)
	const errorMessage = JSON.stringify(error.message)
	if(showNotifyCatch) {
		if(errorMessage == '"timeout of 35000ms exceeded"')
			alertNotify('Error, Se ha detectado baja señal de red.', 'negative')
		if(errorMessage == '"Network Error"')
			alertNotify('Error, servidor desconectado', 'negative')
		if(error.response) {
			if(error.response.status == 0)
				alertNotify('Error, servidor desconectado.', 'negative')
			else {
				let messageError = error.response.data.message
				alertNotify(messageError ? messageError : 'Ocurrio un error, vuelve intentarlo mas tarde.', 'negative')
			}
		}
	}
	return error.response
}


const extractDataDelete = (response, notif, showNotify) => {
	if(showNotify) {
		notif({
			type: 'positive',
			message: response.data.message
		})
	}
	return response
}

const handleErrorDelete = (error, notif, showNotifyCatch) => {
	//console.log('handleErrorDelete', error.response)
	const errorMessage = JSON.stringify(error.message)
	if(showNotifyCatch) {
		if(errorMessage == '"timeout of 35000ms exceeded"') {
			notif({
				type: 'negative',
				message: 'Error, Se ha detectado baja señal de red.'
			})
		}
		if(errorMessage == '"Network Error"') {
			notif({
				type: 'negative',
				message: 'Error, servidor desconectado.'
			})
		}
		if(error.response) {
			if(error.response.status == 0) {
				notif({
					type: 'negative',
					message: 'Error, servidor desconectado.'
				})
			}
			else {
				let messageError = error.response.data.message
				notif({
					type: 'negative',
					message: messageError ? messageError : 'Ocurrio un error, vuelve intentarlo mas tarde.'
				})
			}
		}
	}
	return error.response
}


export default function () {

	const get = async (endpoint, showNotify = true, showNotifyCatch = true) => {
		const response = await api.get(endpoint, header())
		.then(response => extractData(response, showNotify))
		.catch(error => handleError(error, showNotifyCatch))
		return response
	}

	const post = async (endpoint, form, showNotify = true, showNotifyCatch = true) => {
		const response = await api.post(endpoint, form, header())
		.then(response => extractData(response, showNotify))
		.catch(error => handleError(error, showNotifyCatch))
		return response
	}

	const put = async (endpoint, form, showNotify = true, showNotifyCatch = true) => {
		const response = await api.put(endpoint, form, header())
		.then(response => extractData(response, showNotify))
		.catch(error => handleError(error, showNotifyCatch))
		return response
	}

	const deleteApi = async (endpoint, notif, showNotify = true, showNotifyCatch = true) => {
		const response = await api.delete(endpoint, header())
		.then(response => extractDataDelete(response, notif, showNotify))
		.catch(error => handleErrorDelete(error, notif, showNotifyCatch))
		return response
	}

	const deleteApiNoNotify = async (endpoint, showNotify = true, showNotifyCatch = true) => {
		const response = await api.delete(endpoint, header())
		.then(response => extractData(response, showNotify))
		.catch(error => handleError(error, showNotifyCatch))
		return response
	}

	return {
		get,
		post,
		put,
		deleteApi,
		deleteApiNoNotify,

	}
}