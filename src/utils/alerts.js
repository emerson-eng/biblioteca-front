import { Notify } from 'quasar'

export default function () {

	const alertNotify = (msj, type) => {
		Notify.create({
			type: type,
			message: msj,
		})
	}

	const alertNotifyQR = (msj, type) => {
		Notify.create({
			type: type,
			message: msj,
			position: 'center',
			timeout: 2000,
		})
	}

	return {
		alertNotify,
		alertNotifyQR,
	}
}