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
					<div class="text-h6 text-color-dark text-bold">Registrar libro</div>
					<q-space />
					<q-btn icon="close" flat round dense v-close-popup />
				</q-card-section>

				<q-card-section>
					<q-form @submit="methodForm" class="column q-pb-md">
						<select-matter
						:useInject="true"
						/>
						<select-author
						:useInject="true"
						/>
						<select-editorial
						:useInject="true"
						/>

						<q-input v-model="form.name"
						type="text" label="Nombre"
						lazy-rules :rules="[ val => val && val.length > 0 || 'Ingrese un nombre']"
						/>

						<div class="row">
							<div class="col-12 col-sm-4" :class="$q.screen.width < 600 ? '' : 'q-pr-sm'">
								<q-input v-model="form.quantity" 
								type="number"
								label="Cantidad de ejemplares"
								lazy-rules :rules="[ val => val && val > 0 || 'Ingrese la cantidad de ejemplares']"
								/>
							</div>
							<div class="col-12 col-sm-4" :class="$q.screen.width < 600 ? '' : 'q-px-sm'">
								<q-input v-model="form.year_publication" 
								type="date"
								label="Año de publicación"
								lazy-rules :rules="[ val => val && val.length > 0 || 'Ingrese el año de publicación']"
								/>
							</div>
							<div class="col-12 col-sm-4" :class="$q.screen.width < 600 ? '' : 'q-pl-sm'">
								<q-input v-model="form.page_number" 
								type="number"
								label="Número de paginas"
								lazy-rules :rules="[ val => val && val > 0 || 'Ingrese el número de paginas']"
								/>
							</div>
						</div>

						<q-input v-model="form.description"
						type="textarea" label="Descripción breve"
						class="q-mb-md"
						/>

						<q-file v-model="form.image" label="Imagen" counter accept=".jpg, image/*" max-file-size="512000" @rejected="onRejectedImage" hint="El tamaño maximo de la imagen no debe superar los 512 KB">
							<template v-slot:prepend>
								<q-icon name="cloud_upload" />
							</template>
						</q-file>

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
import useHttpService from 'utils/httpService'
import SelectMatter from 'components/admin/form/SelectMatter.vue'
import SelectAuthor from 'components/admin/form/SelectAuthor.vue'
import SelectEditorial from 'components/admin/form/SelectEditorial.vue'
import useAlerts from 'utils/alerts'

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
const swithModels = inject('swithModels')

const loadingBtn = ref(false)
const form = ref({
	matter_id: 1,
	author_id: 1,
	editorial_id: 1,
	name: '',
	quantity: 1,
	year_publication: '',
	page_number: 0,
	description: '',
	image: null,
})
const matterSelected = ref(null)
const authorSelected = ref(null)
const editorialSelected = ref(null)

provide('matterSelected', matterSelected)
provide('authorSelected', authorSelected)
provide('editorialSelected', editorialSelected)

const openDialog = () => {
	matterSelected.value = null
	authorSelected.value = null
	editorialSelected.value = null
	form.value = {
		matter_id: 1,
		author_id: 1,
		editorial_id: 1,
		name: '',
		quantity: 1,
		year_publication: '',
		page_number: 0,
		description: '',
		image: null,
	}
	dialog.value = true
	isUpdate.value = false
}

const initUpdate = () => {
	if(isUpdate.value) {
		matterSelected.value = {
			label: props.selectRow.matter.name,
			value: props.selectRow.matter.id
		}
		authorSelected.value = {
			label: props.selectRow.author.name,
			value: props.selectRow.author.id
		}
		editorialSelected.value = {
			label: props.selectRow.editorial.name,
			value: props.selectRow.editorial.id
		}
		form.value = {...props.selectRowdo}
		form.value.image = null
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
	post('admin/book', formatData()).then(response => {
		console.log('register', response)
		if(response.status >= 200 && response.status < 300) {
			let data = response.data.data
			data.state = 1
			let books = [data, ...dataTablePinia.books]
			dataTablePinia.setBooks(books)
			swithModels.value.push(data.id)
			dialog.value = false
		}
	}).finally(() => {
		loadingBtn.value = false
	})
}

const update = () => {
	loadingBtn.value = true
	const url = `admin/book/${props.selectRow.id}`
	put(url, formatData()).then((response) => {
		console.log('update', response)
		if(response.status >= 200 && response.status < 300) {
			let books = dataTablePinia.books.map((item) => {
				if(item.id == response.data.data.id)
					item = response.data.data
				return item
			})
			dataTablePinia.setBooks(books)
			dialog.value = false
		}
	}).finally(() => {
		loadingBtn.value = false
	})
}

const formatData = () => {
	const fd = new FormData() 
	fd.append('matter_id', matterSelected.value.value)
	fd.append('author_id', authorSelected.value.value)
	fd.append('editorial_id', editorialSelected.value.value)
	fd.append('name', form.value.name)
	fd.append('quantity', form.value.quantity)
	fd.append('year_publication', form.value.year_publication)
	fd.append('page_number', form.value.page_number)
	fd.append('description', form.value.description)
	fd.append('image', form.value.image)
	return fd
}

const onRejectedImage = (rejectedEntries) => {
	if(rejectedEntries[0].failedPropValidation == 'max-file-size') {
		alertNotify('El tamaño maximo de la imagen no debe superar los 512 KB.', 'warning')
	}
}
</script>
