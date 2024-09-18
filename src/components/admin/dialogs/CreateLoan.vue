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
					<div class="text-h6 text-color-dark text-bold">Registrar préstamo</div>
					<q-space />
					<q-btn icon="close" flat round dense v-close-popup />
				</q-card-section>

				<q-card-section>
					<q-form @submit="methodForm" class="column q-pb-md">
						<div class="row">
							<div class="col-12 col-sm-9" :class="$q.screen.width < 600 ? '' : 'q-pr-sm'">
								<select-book
								:useInject="true"
								:disable="isUpdate"
								@isSelected="isSelectedBook"
								/>
							</div>
							<div class="col-12 col-sm-3" :class="$q.screen.width < 600 ? '' : 'q-pl-sm'">
								<q-input v-model="form.quantity" 
								:disable="isUpdate"
								type="number" label="Cantidad"
								lazy-rules :rules="[ val => val && val > 0 || 'Ingrese la cantidad']"
								style="padding-bottom: 10px!important;"
								/>
								<q-badge v-if="bookSelected && !isUpdate"
								color="blue" 
								:label="'Disponible: ' + quantityAvailable" 
								/>
							</div>
						</div>

						<select-student
						:useInject="true"
						:disable="isUpdate"
						/>

						<div class="row">
							<div class="col-12 col-sm-6" :class="$q.screen.width < 600 ? '' : 'q-pr-sm'">
								<q-input v-model="form.loan_date"
								:disable="form.state == 1"
								type="date" label="Fecha de préstamo"
								lazy-rules :rules="[ val => val && val.length > 0 || 'Ingrese la fecha de préstamo']"
								/>
							</div>
							<div class="col-12 col-sm-6" :class="$q.screen.width < 600 ? '' : 'q-pl-sm'">
								<q-input v-model="form.return_date"
								:disable="form.state == 1"
								type="date" label="Fecha de devolución"
								lazy-rules :rules="[ val => val && val.length > 0 || 'Ingrese la fecha de devolución']"
								/>
							</div>
						</div>

						<q-input v-model="form.observation"
						type="textarea" label="Observación"
						hint="Opcional"
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
import { ref, inject, provide } from 'vue'
import { useDataTableStore } from 'stores/dataTable'
import { useLoanStore } from 'stores/loan'
import { useUserStore } from 'stores/user'
import useFormatDate from 'utils/formatDate'
import useHttpService from 'utils/httpService'
import SelectBook from 'components/admin/form/SelectBook.vue'
import SelectStudent from 'components/admin/form/SelectStudent.vue'

const dataTablePinia = useDataTableStore()
const userPinia = useUserStore()
const loanPinia = useLoanStore()
const { post, put } =  useHttpService()
const { formatCurrentDate } = useFormatDate()

const props = defineProps({
	selectRow: {
		type: Object,
	},
})

const dialog = inject('dialog')
const isUpdate = inject('isUpdate')

const loadingBtn = ref(false)
const form = ref({
	student_id: 1,
	book_id: 1,
	loan_date: formatCurrentDate(),
	return_date: formatCurrentDate(),
	quantity: 1,
	observation: '',
})
const quantityAvailable = ref([])
const bookSelected = ref(null)
const studentSelected = ref(null)

provide('bookSelected', bookSelected)
provide('studentSelected', studentSelected)

const openDialog = () => {
	bookSelected.value = null
	studentSelected.value = null
	form.value = {
		student_id: 1,
		book_id: 1,
		loan_date: formatCurrentDate(),
		return_date: formatCurrentDate(),
		quantity: 1,
		observation: '',
	}
	dialog.value = true
	isUpdate.value = false
}

const initUpdate = () => {
	if(isUpdate.value) {
		bookSelected.value = {
			label: props.selectRow.book.name,
			value: props.selectRow.book.id,
		}
		studentSelected.value = {
			label: `${props.selectRow.student.name} ${props.selectRow.student.last_name} - ${props.selectRow.student.dni}`,
			value: props.selectRow.student.id
		}
		form.value = {...props.selectRow}
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
	post('admin/loan', form.value).then(response => {
		console.log('register', response)
		if(response.status >= 200 && response.status < 300) {
			let loans = [response.data.data, ...dataTablePinia.loans]
			dataTablePinia.setLoans(loans)
			dataTablePinia.setBooks([])
			dialog.value = false

			let books = loanPinia.books.map((item) => {
				if(item.id == response.data.book.id)
					item = response.data.book
				return item
			})
			loanPinia.setBooks(books)
		}
	}).finally(() => {
		loadingBtn.value = false
	})
}

const update = () => {
	loadingBtn.value = true
	setData()
	const url = `admin/loan/${props.selectRow.id}`
	put(url, form.value).then((response) => {
		console.log('update', response)
		if(response.status >= 200 && response.status < 300) {
			let loans = dataTablePinia.loans.map((item) => {
				if(item.id == response.data.data.id)
					item = response.data.data
				return item
			})
			dataTablePinia.setLoans(loans)
			dialog.value = false
		}
	}).finally(() => {
		loadingBtn.value = false
	})
}

const setData = () => {
	form.value.book_id = bookSelected.value.value
	form.value.student_id = studentSelected.value.value
	form.value.user_id = userPinia.user.id
}

const isSelectedBook = (val) => {
	let book = loanPinia.books.find(item => item.id == val.value)
	quantityAvailable.value = book.quantity
}
</script>
