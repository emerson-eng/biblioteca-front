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
							<div class="col-6 q-pr-sm">
								<select-degree
								:useInject="true"
								/>
							</div>
							<div class="col-6 q-pl-sm">
								<select-section
								:useInject="true"
								/>
							</div>
						</div>

						<div class="row">
							<div class="col-12 col-sm-6" :class="$q.screen.width < 600 ? '' : 'q-pr-sm'">
								<select-type-student
								:useInject="true"
								:selected="true"
								/>
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
import { useLoanStore } from 'stores/loan'
import useHttpService from 'utils/httpService'
import SelectTypeStudent from 'components/admin/form/SelectTypeStudent.vue'
import SelectDegree from 'components/admin/form/SelectDegree.vue'
import SelectSection from 'components/admin/form/SelectSection.vue'

const dataTablePinia = useDataTableStore()
const loanPinia = useLoanStore()
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

const typeStudentSelected = ref(null)
const degreeSelected = ref(null)
const sectionSelected = ref(null)

const form = ref({
	id: 1,
	dni: '',
	name: '',
	last_name: '',
	address: '',
	email: '',
	phone: '',
})

provide('typeStudentSelected', typeStudentSelected)
provide('degreeSelected', degreeSelected)
provide('sectionSelected', sectionSelected)

const openDialog = () => {
	typeStudentSelected.value = null
	degreeSelected.value = null
	sectionSelected.value = null
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
		typeStudentSelected.value = {
			label: props.selectRow.type_student.name,
			value: props.selectRow.type_student.id,
		}
		degreeSelected.value = {
			label: props.selectRow.degree.name,
			value: props.selectRow.degree.id,
		}
		sectionSelected.value = {
			label: props.selectRow.section.name,
			value: props.selectRow.section.id,
		}
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
	loanPinia.setStudents([])
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
	form.value.type_student_id = typeStudentSelected.value.value
	form.value.degree_id = degreeSelected.value.value
	form.value.section_id = sectionSelected.value.value
}
</script>
