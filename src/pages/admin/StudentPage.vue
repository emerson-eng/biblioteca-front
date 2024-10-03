<template>
	<q-page padding>
		<h5 class="q-mt-none q-mb-md row justify-between">
			<div>
				<q-icon name="fa-solid fa-indent" size="sm" />
				Estudiantes
			</div>
			<create-student
			:selectRow="selectRow" 
			/>
		</h5>

		<q-card>
			<div class="q-pt-sm">
				<div class="row">
					<div class="col-12 col-sm-3 q-px-sm" :class="$q.screen.width < 600 ? 'q-px-sm' : 'q-pl-md q-pr-sm'">
						<select-degree
						:useInject="true"
						:useRules="false"
						:useAll="true"
						@isSelected="getData"
						/>
					</div>
					<div class="col-12 col-sm-3 q-px-sm">
						<select-section
						:useInject="true"
						:useRules="false"
						:useAll="true"
						@isSelected="getData"
						/>
					</div>
					<div class="col-12 col-sm-6 q-px-sm" :class="$q.screen.width < 600 ? 'q-pt-sm' : ''">
						<q-btn no-caps
						color="primary"
						icon="fa-solid fa-address-card"
						label="Descargar carnet en bloque"
						class="q-mt-md"
						:loading="loadingBtnBlock" 
						:disable="loadingBtnBlock"
						@click="exportBlockPDF"
						/>
					</div>
				</div>
			</div>

			<data-table
			exportName="Estudiantes" :keyTable="'students'"
			:showBtnImport="true"
			@btnImport="btnImport"
			:loading="loading"
			:columns="columns"
			:rows="dataTablePinia.students"
			:keyName="'id'"
			@editRow="editRow"
			@deleteRow="deleteRow"
			:iconAdditionalColumn="'fa-solid fa-address-card'"
			:additionalColumnnTitle="'Imprimir carnet'"
			:currentpush="currentpush"
			:loadingBtndditional="loadingBtndditional"
			@additionalColumn="exportPDF"
			/>
		</q-card>

		<import-student />
		<show-PDF
		:urlPDF="urlPDF"
		titleDialog="Carnet de Estudiante"
		:namePDF="namePDF"
		/>
	</q-page>
</template>

<script setup>
import { ref, provide } from 'vue'
import { useUserStore } from 'stores/user'
import { useDataTableStore } from 'stores/dataTable'
import { useLoanStore } from 'stores/loan'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import DataTable from 'components/admin/dataTable/DataTable.vue'
import CreateStudent from 'components/admin/dialogs/CreateStudent.vue'
import ImportStudent from 'components/admin/import/ImportStudent.vue'
import ShowPDF from 'components/admin/dialogs/ShowPDF.vue'
import useHttpService from 'utils/httpService'
import SelectDegree from 'components/admin/form/SelectDegree.vue'
import SelectSection from 'components/admin/form/SelectSection.vue'
import useAlerts from 'utils/alerts'

const $q = useQuasar()
const userPinia = useUserStore()
const dataTablePinia = useDataTableStore()
const loanPinia = useLoanStore()
const { post, deleteApi } =  useHttpService()
const { alertNotify } = useAlerts()

const columns = [
{
	name: 'row-number',
	required: true,
	label: '#',
	align: 'left',
	sortable: false,
},
{
	style: 'white-space: normal;',
	name: 'type_student', label: 'Tipo',
	field: row => row.type_student.name,
	format: val => `${val}`,
	sortable: true, align: 'left'
},
{ style: 'white-space: normal;', name: 'dni', label: 'DNI', field: 'dni', sortable: true, align: 'left' },
{ style: 'white-space: normal;', name: 'name', label: 'Nombres', field: 'name', sortable: true, align: 'left' },
{ style: 'white-space: normal;', name: 'last_name', label: 'Apellidos', field: 'last_name', sortable: true, align: 'left' },
{
	style: 'white-space: normal;',
	name: 'degree', label: 'Grado',
	field: row => row.degree.name,
	format: val => `${val}`,
	sortable: true, align: 'left'
},
{
	style: 'white-space: normal;',
	name: 'section', label: 'Sección',
	field: row => row.section.name,
	format: val => `${val}`,
	sortable: true, align: 'left'
},
{ style: 'white-space: normal;', name: 'address', label: 'Dirección', field: 'address', sortable: true, align: 'left' },
{ style: 'white-space: normal;', name: 'email', label: 'Correo electrónico', field: 'email', sortable: true, align: 'left' },
{ style: 'white-space: normal;', name: 'phone', label: 'Celular', field: 'phone', sortable: true, align: 'left' },
{ name: 'additionalColumn', label: 'Carnet', field: '', align: 'center' },
{ name: 'actions', label: 'Acciones', field: '', align: 'center' },
]

const loading = ref(false)
const selectRow = ref({})
const dialog = ref(false)
const isUpdate = ref(false)

const degreeSelected = ref(null)
const sectionSelected = ref(null)

const dialogImport = ref(false)

const loadingBtnBlock = ref(false)
const loadingBtndditional = ref(false)
const currentpush = ref(0)

const dialogShowPDF = ref(false)
const urlPDF = ref(null)
const namePDF = ref('')

provide('dialog', dialog)
provide('isUpdate', isUpdate)
provide('degreeSelected', degreeSelected)
provide('sectionSelected', sectionSelected)
provide('dialogImport', dialogImport)
provide('dialogShowPDF', dialogShowPDF)

const getData = () => {
	loading.value = true
	const form = {
		degree_id: degreeSelected.value ? degreeSelected.value.value : 0,
		section_id: sectionSelected.value ? sectionSelected.value.value : 0,
	}
	post('admin/students', form, false).then((response) => {
		console.log('students', response)
		if(response.status >= 200 && response.status < 300) {
			dataTablePinia.setStudents(response.data.data)
		}
	}).finally(() => {
		loading.value = false
	})
}
if(dataTablePinia.students.length === 0) 
	getData()

const editRow = (row) => {
	selectRow.value = row
	isUpdate.value = true
	dialog.value = true
}

const deleteRow = (row) => {
	const notif = $q.notify({
		type: 'ongoing',
		message: 'Realizando la operación ...',
	})
	const url = `admin/student/${row.id}`
	deleteApi(url, notif).then((response) => {
		if(response.status >= 200 && response.status < 300) {
			let data = dataTablePinia.students.filter((item) => item.id != row.id)
			dataTablePinia.setStudents(data)
			loanPinia.setStudents([])
		}
	})
}

const exportPDF = (row) => {
	loadingBtndditional.value = true
	currentpush.value = row.id
	const url = `admin/student-card/${row.id}`
	api.get(url, {
		headers: { Authorization: `Bearer ${userPinia.token}` },
		responseType: 'blob',
	}).then((response) => {
		if(response.status >= 200 && response.status < 300) {
			var fileURL = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}))
			urlPDF.value = fileURL
			dialogShowPDF.value = true
			namePDF.value = row.name+' '+row.last_name
		}
	}).catch((error) => {
		const messageError = error.response.data.message
		alertNotify(messageError ? messageError : 'Ocurrio un error, vuelve intentarlo mas tarde.', 'negative')
	}).finally(() => {
		currentpush.value = 0
		loadingBtndditional.value = false
	})
}

const exportBlockPDF = () => {
	if(degreeSelected.value.value == 0) {
		alertNotify('Seleccione un grado.', 'warning')
		return;
	}
	if(sectionSelected.value.value == 0) {
		alertNotify('Seleccione una sección.', 'warning')
		return;
	}
	loadingBtnBlock.value = true
	const form = {
		degree_id: degreeSelected.value.value,
		section_id: sectionSelected.value.value,
	}
	api.post('admin/students-card', form, {
		headers: { Authorization: `Bearer ${userPinia.token}` },
		responseType: 'blob',
	}).then((response) => {
		if(response.status >= 200 && response.status < 300) {
			var fileURL = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}))
			urlPDF.value = fileURL
			dialogShowPDF.value = true
			namePDF.value = `Estudiantes-${degreeSelected.value.abbreviation}${sectionSelected.value.label}`
		}
	}).catch((error) => {
		const messageError = error.response.data.message
		alertNotify(messageError ? messageError : 'Ocurrio un error, vuelve intentarlo mas tarde.', 'negative')
	}).finally(() => {
		loadingBtnBlock.value = false
	})
}

const btnImport = () => {
	dialog.value = true
	setTimeout(() => {
		dialog.value = false
	}, 100)
	dialogImport.value = true
}
</script>
