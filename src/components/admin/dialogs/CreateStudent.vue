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
								<q-input 
								v-model="form.dni"
								type="number" label="DNI"
								lazy-rules :rules="[ val => (val !== null && val !== '') || 'Ingrese el DNI', val => (val+'').length == 8 || 'Ingrese correctamente el número de DNI']"
								/>
							</div>
						</div>

						<div class="row">
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
						type="text" label="Dirección"
						hint="Opcional"
						/>

						<q-input v-model="form.email"
						type="email" label="Correo electrónico"
						hint="Opcional"
						/>

						<q-input v-model="form.phone" 
						type="number" label="Número de celular"
						lazy-rules :rules="[ val => val && val > 0 || 'Ingrese el número de celular']"
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
const typePeopleSelected = ref(null)
const form = ref({
	id: 1,
	dni: '',
	name: '',
	last_name: '',
	address: '',
	email: '',
	phone: '',
})

provide('typePeopleSelected', typePeopleSelected)

const openDialog = () => {
	typePeopleSelected.value = null
	form.value.dni = ''
	form.value.name = ''
	form.value.last_name = ''
	form.value.address = ''
	form.value.email = ''
	form.value.phone = ''
	dialog.value = true
	isUpdate.value = false
}

const initUpdate = () => {
	if(isUpdate.value) {
		typePeopleSelected.value = props.selectRow.type_people
		form.value.id = props.selectRow.id
		form.value.dni = props.selectRow.dni
		form.value.name = props.selectRow.name
		form.value.last_name = props.selectRow.last_name
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
	post('admin/student', form.value).then(response => {
		console.log('register', response)
		if(response.status >= 200 && response.status < 300) {
			let students = [response.data.data, ...dataTablePinia.students]
			dataTablePinia.setStudents(students)
			dialog.value = false
		}
	}).finally(() => {
		loadingBtn.value = false
	})
}

const update = () => {
	loadingBtn.value = true
	setData()
	const url = `admin/student/${props.selectRow.id}`
	put(url, form.value).then((response) => {
		console.log('update', response)
		if(response.status >= 200 && response.status < 300) {
			let students = dataTablePinia.students.map((item) => {
				if(item.id == response.data.data.id)
					item = response.data.data
				return item
			})
			dataTablePinia.setStudents(students)
			dialog.value = false
		}
	}).finally(() => {
		loadingBtn.value = false
	})
}

const setData = () => {
	form.value.type_people_id = typePeopleSelected.value.value
}
</script>
