<template>
	<q-page padding>
		<h5 class="q-mt-none q-mb-md row justify-between">
			<div>
				<q-icon name="fa-solid fa-indent" size="sm" />
				Clientes
			</div>
			<create-client
			:selectRow="selectRow" 
			/>
		</h5>

		<data-table
		exportName="Clientes" :keyTable="'clients'"
		:loading="loading"
		:columns="columns"
		:rows="dataTablePinia.clients"
		:keyName="'id'"
		@editRow="editRow"
		@deleteRow="deleteRow"
		/>
	</q-page>
</template>

<script setup>
import { ref, provide } from 'vue'
import { useDataTableStore } from 'stores/dataTable'
import { useQuasar } from 'quasar'
import DataTable from 'components/admin/dataTable/DataTable.vue'
import CreateClient from 'components/admin/dialogs/CreateClient.vue'
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
{ style: 'white-space: normal;', name: 'document_type', label: 'Tipo de doc.', field: 'document_type', sortable: true, align: 'left' },
{ style: 'white-space: normal;', name: 'dni', label: 'Número de doc.', field: 'dni', sortable: true, align: 'left' },
{
	style: 'white-space: normal;',
	name: 'name', label: 'Nombres',
	field: row => row.document_type == 'RUC' ? row.business_name : row.name,
	format: val => `${val}`,
	sortable: true, align: 'left'
},
{ style: 'white-space: normal;', name: 'last_name', label: 'Apellidos', field: 'last_name', sortable: true, align: 'left' },
{ style: 'white-space: normal;', name: 'address', label: 'Dirección', field: 'address', sortable: true, align: 'left' },
{ style: 'white-space: normal;', name: 'email', label: 'Correo electrónico', field: 'email', sortable: true, align: 'left' },
{ style: 'white-space: normal;', name: 'phone', label: 'Celular', field: 'phone', sortable: true, align: 'left' },
{ name: 'actions', label: 'Acciones', field: '', align: 'center' },
]


const loading = ref(false)
const selectRow = ref({})
const dialog = ref(false)
const isUpdate = ref(false)

provide('dialog', dialog)
provide('isUpdate', isUpdate)


const getData = () => {
	loading.value = true
	get('admin/client', false).then((response) => {
		console.log('client', response)
		if(response.status >= 200 && response.status < 300) {
			dataTablePinia.setClients(response.data.data)
		}
	}).finally(() => {
		loading.value = false
	})
}
if(dataTablePinia.clients.length === 0) 
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
	const url = `admin/client/${row.id}`
	deleteApi(url, notif).then((response) => {
		if(response.status >= 200 && response.status < 300) {
			let data = dataTablePinia.clients.filter((item) => item.id != row.id)
			dataTablePinia.setClients(data)
		}
	})
}

</script>
