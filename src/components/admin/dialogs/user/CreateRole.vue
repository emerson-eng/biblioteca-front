<template>
	<div>
		<q-btn
		color="primary"
		label="Nuevo"
		icon="fa-solid fa-circle-plus"
		@click="openDialog"
		/>

		<q-dialog v-model="dialog" :maximized="$q.screen.width < 700 ? true : false" transition-show="slide-up" transition-hide="slide-down" @show="initUpdate">
			<q-card style="width: 650px; max-width: 650px" class="q-px-sm">
				<q-card-section class="row items-center q-pb-none">
					<div class="text-h6 text-color-dark text-bold">Registrar rol</div>
					<q-space />
					<q-btn icon="close" flat round dense v-close-popup />
				</q-card-section>

				<q-card-section>
					<q-form @submit="methodForm" class="column q-pb-md">
						<q-input v-model="form.name"
						type="text" label="Nombre"
						lazy-rules :rules="[ val => val && val.length > 0 || 'Ingrese un nombre']"
						/>

						<div class="text-subtitle1">Permisos</div>
						<q-option-group
						v-model="permissionsModel"
						:options="permissions"
						type="checkbox"
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
import { ref, inject } from 'vue'
import { useDataTableStore } from 'stores/dataTable'
import useHttpService from 'utils/httpService'
import useAlerts from 'utils/alerts'
import { permissions } from 'composables/permissions'

const dataTablePinia = useDataTableStore()
const { post, put } =  useHttpService()
const { alertNotify } = useAlerts()

const props = defineProps({
	selectRow: {
		type: Object,
	},
})

const dialog = inject('dialog')
const isUpdate = inject('isUpdate')

const loadingBtn = ref(false)
const form = ref({
	name: '',
	permissions: '',
})
const permissionsModel = ref(['Basic', 'Prestamos', 'Estudiantes', 'Libros'])

const openDialog = () => {
	permissionsModel.value = ['Basic', 'Prestamos', 'Estudiantes', 'Libros']
	form.value.name = ''
	dialog.value = true
	isUpdate.value = false
}

const initUpdate = () => {
	if(isUpdate.value) {
		permissionsModel.value = props.selectRow.permissions.split(',')
		form.value.name = props.selectRow.name
	}
}

const methodForm = () => {
	if(permissionsModel.value.length === 1) 
		alertNotify('Seleccione como minino el permiso de Prestamos.', 'warning')
	else {
		if(isUpdate.value)
			update()
		else
			register()
	}
}

const register = () => {
	loadingBtn.value = true
	setData()
	post('admin/role', form.value).then(response => {
		console.log('register', response)
		if(response.status >= 200 && response.status < 300) {
			let roles = [response.data.data, ...dataTablePinia.roles]
			dataTablePinia.setRoles(roles)
			dialog.value = false
		}
	}).finally(() => {
		loadingBtn.value = false
	})
}

const update = () => {
	loadingBtn.value = true
	setData()
	const url = `admin/role/${props.selectRow.id}`
	put(url, form.value).then((response) => {
		console.log('update', response)
		if(response.status >= 200 && response.status < 300) {
			let roles = dataTablePinia.roles.map((item) => {
				if(item.id == response.data.data.id)
					item = response.data.data
				return item
			})
			dataTablePinia.setRoles(roles)
			dialog.value = false
		}
	}).finally(() => {
		loadingBtn.value = false
	})
}

const setData = () => {
	form.value.permissions = permissionsModel.value.join(',')
}
</script>
