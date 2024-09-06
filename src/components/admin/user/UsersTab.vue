<template>
	<div>
		<div class="row justify-end">
			<create-user 
			class="q-mt-sm"
			:selectRow="selectRow" 
			/>
		</div>

		<data-table
		exportName="Usuarios" :keyTable="'users'"
		:loading="loading"
		:columns="columns"
		:rows="dataTablePinia.users"
		:keyName="'id'"
		@editRow="editRow"
		:btnDelete="false"
		class="q-mt-md"
		:toggleSwith="true"
		:loadingSwith="loadingSwith"
		@changeSwith="changeSwith"
		:iconAdditionalColumn2="'lock'"
		:additionalColumnnTitle2="'Restablecer contraseña'"
		@additionalColumn2="resetPassword"
		/>
	</div>
</template>

<script setup>
import { ref, provide } from 'vue'
import { useDataTableStore } from 'stores/dataTable'
import DataTable from 'components/admin/dataTable/DataTable.vue'
import useHttpService from 'utils/httpService'
import useFormatDate from 'utils/formatDate'
import { useQuasar } from 'quasar'
import CreateUser from 'components/admin/dialogs/user/CreateUser.vue'

const $q = useQuasar()
const dataTablePinia = useDataTableStore()
const { get, put } =  useHttpService()
const { formatDateTime } = useFormatDate()

const columns = [
{
	name: 'row-number',
	required: true,
	label: '#',
	align: 'left',
	sortable: false,
},
{ style: 'white-space: normal;', name: 'name', label: 'Nombre', field: 'name', sortable: true, align: 'left' },
{ style: 'white-space: normal;', name: 'user', label: 'Usuario', field: 'user', sortable: true, align: 'left' },
{
	style: 'white-space: normal;',
	name: 'role',
	label: 'Rol',
	field: row => row.role.name,
	sortable: true,
	align: 'left',
},
{
	style: 'white-space: normal;',
	name: 'created_at',
	label: 'Fecha de creación',
	field: row => formatDateTime(row.created_at),
	sortable: true,
	align: 'left',
},
{ 
	name: 'swith', 
	label: 'Estado', 
	field: 'state', 
	align:'center',
	sortable: true,
	sort: (a, b) => parseInt(a, 10) - parseInt(b, 10), 
},
{ name: 'additionalColumn2', label: 'Contraseña', field: '', align: 'center' },
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

const getUsers = () => {
	loading.value = true
	get('admin/user', false).then((response) => {
		console.log('users', response)
		if(response.status >= 200 && response.status < 300) {
			formatStateModels(response.data.data)
			dataTablePinia.setUsers(response.data.data)
		}
	}).finally(() => {
		loading.value = false
	})
}
if(dataTablePinia.users.length === 0) 
	getUsers()
else
	formatStateModels(dataTablePinia.users)

const editRow = (row) => {
	selectRow.value = row
	isUpdate.value = true
	dialog.value = true
}

const changeSwith = (row) => {
	loadingSwith.value = true
	const url = `admin/user/state/${row.id}`
	const form = { state: row.state == 1 ? 0 : 1 }
	put(url, form).then((response) => {
		////console.log('update', response)
		if(response.status >= 200 && response.status < 300) {
			row.state = response.data.data.state
			let users = dataTablePinia.users.map((item) => {
				if(item.id == row.id)
					item = row
				return item
			})
			dataTablePinia.setUsers(users)
		}
	}).finally(() => {
		loadingSwith.value = false
	})
}

const resetPassword = (row) => {
	$q.dialog({
		title: 'Restablecer contraseña',
		message: '¿Está seguro de restablecer la contraseña, ahora sera su Usuario?',
		ok: {
			color: 'primary',
			label: 'Si, restablecer!',
		},
		cancel: {
			flat: true,
			label: 'Cancelar',
		},
		persistent: false,
	}).onOk(() => {
		get(`admin/user/reset-password/${row.id}`)
	})
}
</script>
