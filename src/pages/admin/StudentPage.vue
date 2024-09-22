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
		:iconAdditionalColumn="'fa-solid fa-qrcode'"
		:additionalColumnnTitle="'Generar código QR'"
		@additionalColumn="openGenerateQr"
		/>

		<import-student />
		<generate-qr 
		:textQR="textQR" 
		/>
	</q-page>
</template>

<script setup>
import { ref, provide } from 'vue'
import { useDataTableStore } from 'stores/dataTable'
import { useQuasar } from 'quasar'
import DataTable from 'components/admin/dataTable/DataTable.vue'
import CreateStudent from 'components/admin/dialogs/CreateStudent.vue'
import GenerateQr from 'components/admin/dialogs/GenerateQr.vue'
import ImportStudent from 'components/admin/import/ImportStudent.vue'
import useHttpService from 'utils/httpService'

const $q = useQuasar()
const dataTablePinia = useDataTableStore()
const { get, deleteApi } =  useHttpService()

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
{ style: 'white-space: normal;', name: 'address', label: 'Dirección', field: 'address', sortable: true, align: 'left' },
{ style: 'white-space: normal;', name: 'email', label: 'Correo electrónico', field: 'email', sortable: true, align: 'left' },
{ style: 'white-space: normal;', name: 'phone', label: 'Celular', field: 'phone', sortable: true, align: 'left' },
{ name: 'additionalColumn', label: 'QR', field: '', align: 'center' },
{ name: 'actions', label: 'Acciones', field: '', align: 'center' },
]

const loading = ref(false)
const selectRow = ref({})
const dialog = ref(false)
const isUpdate = ref(false)

const dialogImport = ref(false)

const dialogGenerateQR = ref(false)
const textQR = ref('')

provide('dialog', dialog)
provide('isUpdate', isUpdate)
provide('dialogImport', dialogImport)
provide('dialogGenerateQR', dialogGenerateQR)

const getData = () => {
	loading.value = true
	get('admin/student', false).then((response) => {
		console.log('student', response)
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
		}
	})
}

const openGenerateQr = (row) => {
	textQR.value = row.dni
	dialogGenerateQR.value = true
}

const btnImport = () => {
	dialogImport.value = true
}
</script>
