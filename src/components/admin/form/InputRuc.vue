<template>
	<q-input
	v-model="form.ruc"
	debounce="300"
	@update:model-value="searchPerson()"
	:loading="loadingSearch"
	:disable="loadingSearch"
	type="number" label="RUC"
	:hint="loadingSearch ? 'Buscando...' : ''"
	lazy-rules :rules="[ val => (val !== null && val !== '') || 'Ingrese el RUC', val => (val+'').length == 11 || 'Ingrese correctamente el número de RUC']"
	/>
</template>

<script setup>
import { ref, inject } from 'vue'
import useApiReniec from 'utils/apiReniec'
import useAlerts from 'utils/alerts'

const { apiRUC } = useApiReniec()
const { alertNotify } = useAlerts()

const form = inject('form')

const loadingSearch = ref(false)

const searchPerson = () => {
	if(form.value.ruc.length == 11) {
		loadingSearch.value = true
		apiRUC(form.value.ruc).then(response => {
			console.log('apiRUC', response)
			if(response.data.success) {
				alertNotify('Datos encontrados correctamente.', 'positive')
				const data = response.data.data
				if(response.data.success) {
					form.value.business_name = data.nombre_o_razon_social
					form.value.ubigeo = data.ubigeo_sunat
					form.value.department = data.departamento
					form.value.province = data.provincia
					form.value.district = data.distrito
					form.value.address = data.direccion_completa
				}
			}
			else {
				form.value.business_name = ''
				form.value.ubigeo = ''
				form.value.department = ''
				form.value.province = ''
				form.value.district = ''
				form.value.address = ''
				alertNotify('No se encontró el RUC.', 'negative')
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
