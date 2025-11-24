<template>
	<q-page padding>
		<h5 class="q-mt-none q-mb-md row justify-between">
			<div>
				<q-icon name="fa-solid fa-indent" size="sm" />
				Institución
			</div>
		</h5>

		<q-card>
			<q-card-section>
				<q-form @submit="update" class="column q-pa-md">
					<q-input v-model="form.name"
					type="text" label="Nombre de la institución"
					lazy-rules :rules="[ val => val && val.length > 0 || 'Ingrese el nombre']"
					/>

					<q-input v-model="form.address"
					type="text" label="Dirección de la institución"
					lazy-rules :rules="[ val => val && val.length > 0 || 'Ingrese la dirección']"
					/>

					<div class="row">
						<div class="col-12 col-sm-6" :class="$q.screen.width < 600 ? '' : 'q-pr-sm'">
							<q-input v-model="form.email"
							type="email" label="Correo electrónico"
							lazy-rules :rules="[ val => val && val.length > 0 || 'Ingrese el correo electrónico']"
							/>
						</div>
						<div class="col-12 col-sm-6" :class="$q.screen.width < 600 ? '' : 'q-pl-sm'">
							<q-input v-model="form.phone" type="tel"
							label="Número de celular"
							lazy-rules :rules="[ val => val && val.length > 0 || 'Ingrese el número de celular', val => val.length == 9 || 'Ingrese correctamente el número de celular']"
							/>
						</div>
					</div>

					<div class="row justify-end">
						<q-btn rounded :loading="loadingBtn" :disable="loadingBtn" color="primary" type="submit" label="Guardar Cambios" class="q-mt-lg">
							<template v-slot:loading>
								<q-spinner-facebook />
							</template>
						</q-btn>
					</div>
				</q-form>
			</q-card-section>
		</q-card>
	</q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useDataTableStore } from 'stores/dataTable'
import userHttpService from 'utils/httpService'

const dataTablePinia = useDataTableStore()
const { get, put } = userHttpService()

const loadingBtn = ref(false)
const form = ref({
	id: 1,
	name: '',
	phone: '',
	address: '',
	email: '',
})

const getData = () => {
	get('admin/setting', false).then((response) => {
		console.log('setting', response)
		if(response.status >= 200 && response.status < 300) {
			const data = response.data.data
			form.value = data
			dataTablePinia.setSetting(data)
		}
	})
}
if(!dataTablePinia.setting)
	getData()
else 
	form.value = dataTablePinia.setting

const update = () => {
	loadingBtn.value = true
	put(`admin/setting/${form.value.id}`, form.value).then((response) => {
		console.log('update', response)
		if(response.status >= 200 && response.status < 300) {
			dataTablePinia.setSetting(response.data.data)
		}
	}).finally(() => {
		loadingBtn.value = false
	})
}
</script>
