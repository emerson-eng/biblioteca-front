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
					<div class="text-h6 text-color-dark text-bold">Registrar usuario</div>
					<q-space />
					<q-btn icon="close" flat round dense v-close-popup />
				</q-card-section>

				<q-card-section>
					<q-form @submit="methodForm" class="column q-pb-md">
						<select-role
						:useInject="true"
						/>

						<q-input v-model="form.name"
						type="text" label="Nombre"
						lazy-rules :rules="[ val => val && val.length > 0 || 'Ingrese un nombre']"
						/>

						<span v-if="!isUpdate">
							<q-input v-model="form.user"
							type="text" label="Usuario"
							hint="Se recomienda usar su DNI o Correo electrónico (email)"
							lazy-rules :rules="[ val => val && val.length > 0 || 'Ingrese el usuario']"
							/>

							<q-input v-model="form.password"
							type="text" label="Contraseña"
							lazy-rules :rules="[ val => val && val.length > 4 || 'Ingrese una contraseña mayor a 5 caracteres']"
							/>	
						</span>

						<q-btn rounded :loading="loadingBtn" :disable="loadingBtn" color="primary" type="submit" label="Registrar" class="q-mt-md">
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
import { useQuasar } from 'quasar'
import useHttpService from 'utils/httpService'
import SelectRole from 'components/admin/form/SelectRole.vue'

const dataTablePinia = useDataTableStore()
const { post, put } =  useHttpService()
const $q = useQuasar()

const props = defineProps({
	selectRow: {
		type: Object,
	},
})

const dialog = inject('dialog')
const isUpdate = inject('isUpdate')
const swithModels = inject('swithModels')

const loadingBtn = ref(false)

const form = ref({
	hotel_id: 1,
	role_id: 1,
	name: '',
	user: '',
	password: '',
})
const roleSelected = ref(null)

provide('roleSelected', roleSelected)

const openDialog = () => {
	roleSelected.value = null
	form.value.name = ''
	form.value.user = ''
	form.value.password = ''
	dialog.value = true
	isUpdate.value = false
}

const initUpdate = () => {
	if(isUpdate.value) {
		roleSelected.value = {
			label: props.selectRow.role.name,
			value: props.selectRow.role.id
		}
		form.value.name = props.selectRow.name
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
	post('admin/user', form.value).then(response => {
		console.log('register', response)
		if(response.status >= 200 && response.status < 300) {
			let data = response.data.data
			data.state = 1
			let users = [data, ...dataTablePinia.users]
			dataTablePinia.setUsers(users)
			swithModels.value.push(data.id)
			dialog.value = false
		}
		else if(response.status === 400 && response.data.data == 400) {
			$q.dialog({
				title: '<div class="text-red">Alerta</div>',
				message: `<div>${response.data.message}</div>`,
				cancel: false,
				ok:  {
					push: true,
					color: 'negative'
				},
				html: true,
				persistent: true
			})
			dialog.value = false
		}
	}).finally(() => {
		loadingBtn.value = false
	})
}

const update = () => {
	loadingBtn.value = true
	setData()
	const url = `admin/user/${props.selectRow.id}`
	put(url, form.value).then((response) => {
		console.log('update', response)
		if(response.status >= 200 && response.status < 300) {
			let users = dataTablePinia.users.map((item) => {
				if(item.id == response.data.data.id)
					item = response.data.data
				return item
			})
			dataTablePinia.setUsers(users)
			dialog.value = false
		}
	}).finally(() => {
		loadingBtn.value = false
	})
}

const setData = () => {
	form.value.role_id = roleSelected.value.value
}
</script>
