<template>
	<q-input
	v-model="form.dni"
	debounce="300"
	@update:model-value="searchPerson()"
	:loading="loadingSearch"
	:disable="loadingSearch"
	type="number" label="DNI"
	:hint="loadingSearch ? 'Buscando...' : ''"
	lazy-rules :rules="[ val => (val !== null && val !== '') || 'Ingrese el DNI', val => (val+'').length == 8 || 'Ingrese correctamente el número de DNI']"
	/>
</template>

<script setup>
import { ref, inject } from 'vue'
import useApiReniec from 'utils/apiReniec'
import useAlerts from 'utils/alerts'

const { apiReniec } = useApiReniec()
const { alertNotify } = useAlerts()

const form = inject('form')

const loadingSearch = ref(false)

const searchPerson = () => {
	if(form.value.dni.length == 8) {
		loadingSearch.value = true
		apiReniec(form.value.dni).then(response => {
			console.log('apiReniec', response)
			if(response.data.success) {
				alertNotify('Datos encontrados correctamente.', 'positive')
				const data = response.data.data
				if(response.data.success) {
					form.value.name = data.nombres
					form.value.last_name = data.apellido_paterno + ' ' + data.apellido_materno
					form.value.address = data.direccion
				}
			}
			else {
				form.value.name = ''
				form.value.last_name = ''
				form.value.address = ''
				alertNotify('No se encontró el DNI.', 'negative')
			}
		}).catch((error) => {
			console.log(error)
			alertNotify('Ocurrio un error, vuelve intentarlo mas tarde.', 'negative')
		}).finally(() => {
			loadingSearch.value = false
		})
	}
}
</script>
