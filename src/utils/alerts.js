import { Notify } from 'quasar'

export default function () {

	const alertNotify = (msj, type) => {
		Notify.create({
			type: type,
			message: msj
		})
	}

	return {
		alertNotify,

	}
}