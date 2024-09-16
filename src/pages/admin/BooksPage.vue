<template>
	<q-page padding>
		<h5 class="q-mt-none q-mb-md row justify-between">
			<div>
				<q-icon name="fa-solid fa-indent" size="sm" />
				Libros
			</div>
			<create-book
			:selectRow="selectRow" 
			/>
		</h5>

		<data-table
		exportName="Libros" :keyTable="'books'"
		:loading="loading"
		:columns="columns"
		:rows="dataTablePinia.books"
		:keyName="'id'"
		@editRow="editRow"
		@deleteRow="deleteRow"
		class="q-mt-md"
		:toggleSwith="true"
		:loadingSwith="loadingSwith"
		@changeSwith="changeSwith"
		@zoomImageEmit="zoomImageEmit"
		/>

		<zoom-image 
		:image="image"
		/>
	</q-page>
</template>

<script setup>
import { ref, provide } from 'vue'
import { useDataTableStore } from 'stores/dataTable'
import { useLoanStore } from 'stores/loan'
import { useQuasar } from 'quasar'
import DataTable from 'components/admin/dataTable/DataTable.vue'
import CreateBook from 'components/admin/dialogs/CreateBook.vue'
import ZoomImage from 'components/admin/dialogs/ZoomImage.vue'
import useHttpService from 'utils/httpService'
import useHelpers from 'utils/helpers'

const $q = useQuasar()
const dataTablePinia = useDataTableStore()
const loanPinia = useLoanStore()
const { get, put, deleteApi } =  useHttpService()
const { maxText } =  useHelpers()

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
	style: 'white-space: normal;',
	name: 'matter', label: 'Materia',
	field: row => row.matter.name,
	format: val => `${val}`,
	sortable: true, align: 'left'
},
{
	style: 'white-space: normal;',
	name: 'author', label: 'Autor',
	field: row => row.author.name,
	format: val => `${val}`,
	sortable: true, align: 'left'
},
{
	style: 'white-space: normal;',
	name: 'editorial', label: 'Editorial',
	field: row => row.editorial.name,
	format: val => `${val}`,
	sortable: true, align: 'left'
},
{ style: 'white-space: normal;', name: 'quantity', label: 'Cantidad', field: 'quantity', sortable: true, align: 'left' },
{ style: 'white-space: normal;', name: 'year_publication', label: 'Año de publicación', field: 'year_publication', sortable: true, align: 'left' },
{ style: 'white-space: normal;', name: 'page_number', label: 'N. de paginas', field: 'page_number', sortable: true, align: 'left' },
{
	style: 'white-space: normal;',
	name: 'description', label: 'Descripción',
	field: row => maxText(row.description, 100),
	format: val => `${val}`,
	sortable: true, align: 'left'
},
{ name: 'image', label: 'Imagen', field: '', align: 'center' },
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

const image = ref('')
const dialogZoomImage = ref(false)

provide('dialog', dialog)
provide('isUpdate', isUpdate)
provide('swithModels', swithModels)
provide('dialogZoomImage', dialogZoomImage)

const formatStateModels = (data) => {
	swithModels.value = []
	for(let i = 0; i < data.length; i++) {
		if(data[i].state == 1)
			swithModels.value.push(data[i].id)
	}
}

const getData = () => {
	loading.value = true
	get('admin/book', false).then((response) => {
		console.log('book', response)
		if(response.status >= 200 && response.status < 300) {
			formatStateModels(response.data.data)
			dataTablePinia.setBooks(response.data.data)
		}
	}).finally(() => {
		loading.value = false
	})
}
if(dataTablePinia.books.length === 0) 
	getData()
else
	formatStateModels(dataTablePinia.books)

const editRow = (row) => {
	selectRow.value = row
	isUpdate.value = true
	dialog.value = true
}

const changeSwith = (row) => {
	loadingSwith.value = true
	const url = `admin/book/state/${row.id}`
	const form = { state: row.state == 1 ? 0 : 1 }
	put(url, form).then((response) => {
		if(response.status >= 200 && response.status < 300) {
			row.state = response.data.data.state
			let books = dataTablePinia.books.map((item) => {
				if(item.id == row.id)
					item = row
				return item
			})
			dataTablePinia.setBooks(books)
			loanPinia.setBooks([])
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
	const url = `admin/book/${row.id}`
	deleteApi(url, notif).then((response) => {
		if(response.status >= 200 && response.status < 300) {
			let data = dataTablePinia.books.filter((item) => item.id != row.id)
			dataTablePinia.setBooks(data)
			loanPinia.setBooks([])
		}
	})
}

const zoomImageEmit = (row) => {
	image.value = row.image
	dialogZoomImage.value = true
}
</script>
