<template>
	<q-page padding>
		<h5 class="q-mt-none q-mb-md row justify-between">
			<div>
				<q-icon name="fa-solid fa-indent" size="sm" />
				Materias
			</div>
			<create-matter
			:selectRow="selectRow" 
			/>
		</h5>

		<data-table
		exportName="Materias" :keyTable="'matters'"
		:loading="loading"
		:columns="columns"
		:rows="dataTablePinia.matters"
		:keyName="'id'"
		@editRow="editRow"
		@deleteRow="deleteRow"
		class="q-mt-md"
		:toggleSwith="true"
		:loadingSwith="loadingSwith"
		@changeSwith="changeSwith"
		/>
	</q-page>
</template>

<script setup>
import { ref, provide } from 'vue'
import { useDataTableStore } from 'stores/dataTable'
import { useQuasar } from 'quasar'
import DataTable from 'components/admin/dataTable/DataTable.vue'
import CreateMatter from 'components/admin/dialogs/setting/CreateMatter.vue'
import useHttpService from 'utils/httpService'

const $q = useQuasar()
const dataTablePinia = useDataTableStore()
const { get, put, deleteApi } =  useHttpService()

const columns = [
{
	name: 'row-number',
	required: true,
	label: '#',
	align: 'left',
	sortable: false,
},
{ style: 'white-space: normal;', name: 'name', label: 'Nombre', field: 'name', sortable: true, align: 'left' },
{ 
	name: 'swith', 
	label: 'Estado', 
	field: 'state', 
	align:'center',
	sortable: true,
	sort: (a, b) => parseInt(a, 10) - parseInt(b, 10), 
},
{ name: 'actions', label: 'Acciones', field: '', align: 'center' },
]


const loading = ref(false)
const selectRow = ref({})
const dialog = ref(false)
const isUpdate = ref(false)

const loadingSwith = ref(false)
const swithModels = ref([])

provide('dialog', dialog)
provide('isUpdate', isUpdate)
provide('swithModels', swithModels)

const formatStateModels = (data) => {
	swithModels.value = []
	for(let i = 0; i < data.length; i++) {
		if(data[i].state == 1)
			swithModels.value.push(data[i].id)
	}
}

const getData = () => {
	loading.value = true
	get('admin/matter', false).then((response) => {
		console.log('matter', response)
		if(response.status >= 200 && response.status < 300) {
			formatStateModels(response.data.data)
			dataTablePinia.setMatters(response.data.data)
		}
	}).finally(() => {
		loading.value = false
	})
}
if(dataTablePinia.matters.length === 0) 
	getData()
else
	formatStateModels(dataTablePinia.matters)

const editRow = (row) => {
	selectRow.value = row
	isUpdate.value = true
	dialog.value = true
}

const changeSwith = (row) => {
	loadingSwith.value = true
	const url = `admin/matter/state/${row.id}`
	const form = { state: row.state == 1 ? 0 : 1 }
	put(url, form).then((response) => {
		if(response.status >= 200 && response.status < 300) {
			row.state = response.data.data.state
			let matters = dataTablePinia.matters.map((item) => {
				if(item.id == row.id)
					item = row
				return item
			})
			dataTablePinia.setMatters(matters)
		}
	}).finally(() => {
		loadingSwith.value = false
	})
}

const deleteRow = (row) => {
	const notif = $q.notify({
		type: 'ongoing',
		message: 'Realizando la operación ...',
	})
	const url = `admin/matter/${row.id}`
	deleteApi(url, notif).then((response) => {
		if(response.status >= 200 && response.status < 300) {
			let data = dataTablePinia.matters.filter((item) => item.id != row.id)
			dataTablePinia.setMatters(data)
		}
	})
}

</script>
