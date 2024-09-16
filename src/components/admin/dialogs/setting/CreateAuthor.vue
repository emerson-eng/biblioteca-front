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
					<div class="text-h6 text-color-dark text-bold">Registrar autor</div>
					<q-space />
					<q-btn icon="close" flat round dense v-close-popup />
				</q-card-section>

				<q-card-section>
					<q-form @submit="methodForm" class="column q-pb-md">
						<q-input v-model="form.name"
						type="text" label="Nombre"
						lazy-rules :rules="[ val => val && val.length > 0 || 'Ingrese un nombre']"
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
import { useLoanStore } from 'stores/loan'
import useHttpService from 'utils/httpService'

const dataTablePinia = useDataTableStore()
const loanPinia = useLoanStore()
const { post, put } =  useHttpService()

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
	name: '',
})

const openDialog = () => {
	form.value.name = ''
	dialog.value = true
	isUpdate.value = false
}

const initUpdate = () => {
	if(isUpdate.value) {
		form.value.name = props.selectRow.name
	}
}

const methodForm = () => {
	if(isUpdate.value)
		update()
	else
		register()
	loanPinia.setAuthors([])
}

const register = () => {
	loadingBtn.value = true
	post('admin/author', form.value).then(response => {
		console.log('register', response)
		if(response.status >= 200 && response.status < 300) {
			let data = response.data.data
			data.state = 1
			let authors = [data, ...dataTablePinia.authors]
			dataTablePinia.setAuthors(authors)
			swithModels.value.push(data.id)
			dialog.value = false
		}
	}).finally(() => {
		loadingBtn.value = false
	})
}

const update = () => {
	loadingBtn.value = true
	const url = `admin/author/${props.selectRow.id}`
	put(url, form.value).then((response) => {
		console.log('update', response)
		if(response.status >= 200 && response.status < 300) {
			let authors = dataTablePinia.authors.map((item) => {
				if(item.id == response.data.data.id)
					item = response.data.data
				return item
			})
			dataTablePinia.setAuthors(authors)
			dialog.value = false
		}
	}).finally(() => {
		loadingBtn.value = false
	})
}

</script>
