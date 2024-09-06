<template>
	<div>
		<q-btn v-if="showIcon"
		color="primary"
		label="Nuevo"
		icon="fa-solid fa-circle-plus"
		@click="openDialog"
		/>
		<q-btn v-else
		color="primary"
		label="Nuevo"
		@click="openDialog"
		/>

		<q-dialog v-model="dialog" :maximized="$q.screen.width < 700 ? true : false" transition-show="slide-up" transition-hide="slide-down" @show="initUpdate">
			<q-card style="width: 650px; max-width: 650px" class="q-px-sm">
				<q-card-section class="row items-center q-pb-none">
					<div class="text-h6 text-color-dark text-bold">Registrar cliente</div>
					<q-space />
					<q-btn icon="close" flat round dense v-close-popup />
				</q-card-section>

				<q-card-section>
					<q-form @submit="methodForm" class="column q-pb-md">
						<div class="row">
							<div class="col-12 col-sm-6" :class="$q.screen.width < 600 ? '' : 'q-pr-sm'">
								
							</div>
							<div class="col-12 col-sm-6" :class="$q.screen.width < 600 ? '' : 'q-pl-sm'">
								<input-ruc v-if="documentTypeSelected == 'RUC'" />
								<input-dni v-else-if="documentTypeSelected == 'DNI'" />
								<q-input v-else
								v-model="form.dni"
								type="text" label="Número de documento"
								lazy-rules :rules="[ val => val && val.length > 0 || 'Ingrese el número del documento']"
								/>
							</div>
						</div>

						<q-input v-if="documentTypeSelected == 'RUC'"
						v-model="form.business_name"
						type="text" label="Nombre o Razón social"
						lazy-rules :rules="[ val => val && val.length > 0 || 'Ingrese el nombre o razón social']"
						/>

						<div v-else class="row">
							<div class="col-12 col-sm-6" :class="$q.screen.width < 600 ? '' : 'q-pr-sm'">
								<q-input v-model="form.name"
								type="text" label="Nombres"
								lazy-rules :rules="[ val => val && val.length > 0 || 'Ingrese los nombres']"
								/>
							</div>
							<div class="col-12 col-sm-6" :class="$q.screen.width < 600 ? '' : 'q-pl-sm'">
								<q-input v-model="form.last_name"
								type="text" label="Apellidos"
								lazy-rules :rules="[ val => val && val.length > 0 || 'Ingrese los apellidos']"
								/>
							</div>
						</div>

						<q-input v-model="form.address"
						type="text" label="Dirección o nacionalidad"
						hint="Opcional"
						/>

						<q-input v-model="form.email"
						type="email" label="Correo electrónico"
						hint="Opcional"
						/>

						<q-input v-model="form.phone" type="number"
						label="Número de celular"
						hint="Opcional"
						/>

						<q-btn rounded :loading="loadingBtn" :disable="loadingBtn" color="primary" type="submit" icon="save" :label="isUpdate ? 'Actualizar' : 'Registrar'" class="q-mt-md">
							<template v-slot:loading>
								<q-spinner-facebook />
							</template>
						</q-btn>
					</q-form>
				</q-card-section>
			</q-card>
		</q-dialog>
	</div>
</template>

<script setup>
import { ref, inject, provide } from 'vue'
import { useDataTableStore } from 'stores/dataTable'
import { useUserStore } from 'stores/user'
import useHttpService from 'utils/httpService'
import InputDni from 'components/admin/form/InputDni.vue'
import InputRuc from 'components/admin/form/InputRuc.vue'

const dataTablePinia = useDataTableStore()
const userPinia = useUserStore()
const { post, put } =  useHttpService()

const props = defineProps({
	selectRow: {
		type: Object,
	},
	showIcon: {
		type: Boolean,
		default: true
	},
})

const dialog = inject('dialog')
const isUpdate = inject('isUpdate')

const loadingBtn = ref(false)
const documentTypeSelected = ref('DNI')
const form = ref({
	id: 1,
	ruc: null,
	dni: '',
	name: '',
	last_name: '',
	business_name: '',
	address: '',
	email: '',
	phone: '',
})

provide('documentTypeSelected', documentTypeSelected)
provide('form', form)

const openDialog = () => {
	documentTypeSelected.value = 'DNI'
	form.value.ruc = null
	form.value.dni = ''
	form.value.name = ''
	form.value.last_name = ''
	form.value.business_name = ''
	form.value.address = ''
	form.value.email = ''
	form.value.phone = ''
	dialog.value = true
	isUpdate.value = false
}

const initUpdate = () => {
	if(isUpdate.value) {
		documentTypeSelected.value = props.selectRow.document_type
		form.value.id = props.selectRow.id
		form.value.ruc = props.selectRow.dni
		form.value.dni = props.selectRow.dni
		form.value.name = props.selectRow.name
		form.value.last_name = props.selectRow.last_name
		form.value.business_name = props.selectRow.business_name
		form.value.address = props.selectRow.address
		form.value.email = props.selectRow.email
		form.value.phone = props.selectRow.phone
	}
}

const methodForm = () => {
	if(isUpdate.value)
		update()
	else
		register()
}

const register = () => {
	loadingBtn.value = true
	setData()
	post('admin/client', form.value).then(response => {
		console.log('register', response)
		if(response.status >= 200 && response.status < 300) {
			let clients = [response.data.data, ...dataTablePinia.clients]
			dataTablePinia.setClients(clients)
			dialog.value = false
		}
	}).finally(() => {
		loadingBtn.value = false
	})
}

const update = () => {
	loadingBtn.value = true
	setData()
	const url = `admin/client/${props.selectRow.id}`
	put(url, form.value).then((response) => {
		console.log('update', response)
		if(response.status >= 200 && response.status < 300) {
			let clients = dataTablePinia.clients.map((item) => {
				if(item.id == response.data.data.id)
					item = response.data.data
				return item
			})
			dataTablePinia.setClients(clients)
			dialog.value = false
		}
	}).finally(() => {
		loadingBtn.value = false
	})
}

const setData = () => {
	form.value.dni = documentTypeSelected.value == 'RUC' ? form.value.ruc : form.value.dni
	form.value.hotel_id = userPinia.user.hotel_id
	form.value.document_type = documentTypeSelected.value
}
</script>
