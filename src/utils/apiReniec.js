import { axios } from 'boot/axios'

export default function () {

	const apiReniec = (dni) => {
		const url = `https://apiperu.dev/api/dni/${dni}`
		return axios.get(url, {
			headers: { Authorization: `Bearer ba552f7fd18c77f38e526b34024f798123a3865b52538ee96ef689dd0e221fbf` }
		})
	}

	const apiRUC = (number) => {
		const url = `https://apiperu.dev/api/ruc/${number}`
		return axios.get(url, {
			headers: { Authorization: `Bearer ba552f7fd18c77f38e526b34024f798123a3865b52538ee96ef689dd0e221fbf` }
		})
	}

	return {
		apiReniec,
		apiRUC,
	}
}