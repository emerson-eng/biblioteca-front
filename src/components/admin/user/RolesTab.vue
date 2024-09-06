<template>
	<div>
		<div class="row justify-end">
			<create-role
			class="q-mt-sm"
			:selectRow="selectRow" 
			/>
		</div>

		<data-table
		exportName="Detalles" :keyTable="'roles'"
		:loading="loading"
		:columns="columns"
		:rows="dataTablePinia.roles"
		:keyName="'id'"
		@editRow="editRow"
		:btnDelete="false"
		class="q-mt-md"
		/>
	</div>
</template>

<script setup>
import { ref, provide } from 'vue'
import { useDataTableStore } from 'stores/dataTable'
import { useQuasar } from 'quasar'
import DataTable from 'components/admin/dataTable/DataTable.vue'
import CreateRole from 'components/admin/dialogs/user/CreateRole.vue'
import useHttpService from 'utils/httpService'

const $q = useQuasar()
const dataTablePinia = useDataTableStore()
const { get } =  useHttpService()

const columns = [
{
	name: 'row-number',
	required: true,
	label: '#',
	align: 'left',
	sortable: false,
},
{ style: 'white-space: normal;', name: 'name', label: 'Nombre', field: 'name', sortable: true, align: 'left' },
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
	get('admin/role', false).then((response) => {
		console.log('role', response)
		if(response.status >= 200 && response.status < 300) {
			dataTablePinia.setRoles(response.data.data)
		}
	}).finally(() => {
		loading.value = false
	})
}
if(dataTablePinia.roles.length === 0) 
	getData()

const editRow = (row) => {
	selectRow.value = row
	isUpdate.value = true
	dialog.value = true
}

</script>
