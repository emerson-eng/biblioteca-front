const password = 'Mund0@ud1099Nov3las00Pr0j3ct'

export default function () {

	const encrypt = (data) => {
		let encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), password)
		return encrypted.toString()
	}

	const decrypt = (data) => {
		let decrypted = CryptoJS.AES.decrypt(data, password)
		return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
	}

	return {
		encrypt,
		decrypt,
	}
}