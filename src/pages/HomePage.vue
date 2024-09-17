<template>
	<q-page padding>
		<h5 class="q-mt-none q-mb-md row justify-between">
			<div>
				<q-icon name="fa-solid fa-indent" size="sm" />
				Prestamos
			</div>
			<create-loan
			:selectRow="selectRow" 
			/>
		</h5>

		<q-card>
			<div class="q-pt-sm">
				<div class="row">
					<div class="col-6 col-sm-3" :class="$q.screen.width < 600 ? 'q-px-sm' : 'q-pl-md q-pr-sm'">
						<q-input v-model="form.start"
						type="date" label="Fecha de inicio"
						@update:model-value="getData"
						/>
					</div>
					<div class="col-6 col-sm-3 q-px-sm">
						<q-input v-model="form.end"
						type="date" label="Fecha fin"
						@update:model-value="getData"
						/>
					</div>
					<div class="col-12 col-sm-3 q-px-sm" :class="$q.screen.width < 600 ? 'q-pt-sm' : ''">
						<select-student
						:useInject="true"
						:useRules="false"
						:useAll="true"
						@isSelected="getData"
						/>
					</div>
					<div class="col-12 col-sm-3" :class="$q.screen.width < 600 ? 'q-px-sm q-pt-sm' : 'q-pl-sm q-pr-md'">
						<select-book
						:useInject="true"
						:useRules="false"
						:useAll="true"
						@isSelected="getData"
						/>
					</div>
				</div>
			</div>

			<data-table
			exportName="Prestamos" :keyTable="'loans'"
			:loading="loading"
			:columns="columns"
			:rows="dataTablePinia.loans"
			:keyName="'id'"
			@editRow="editRow"
			:btnDelete="false"
			/>
		</q-card>
	</q-page>
</template>

<script setup>
import { ref, provide } from 'vue'
import { useDataTableStore } from 'stores/dataTable'
import DataTable from 'components/admin/dataTable/DataTable.vue'
import useHttpService from 'utils/httpService'
import useFormatDate from 'utils/formatDate'
import CreateLoan from 'components/admin/dialogs/CreateLoan.vue'
import SelectStudent from 'components/admin/form/SelectStudent.vue'
import SelectBook from 'components/admin/form/SelectBook.vue'

const dataTablePinia = useDataTableStore()
const { post } =  useHttpService()
const { formatDate, formatCurrentDate } = useFormatDate()

const columns = [
{
	name: 'row-number',
	required: true,
	label: '#',
	align: 'left',
	sortable: false,
},
{
	style: 'white-space: normal;',
	name: 'book', label: 'Libro',
	field: row => row.book.name,
	format: val => `${val}`,
	sortable: true, align: 'left'
},
{
	style: 'white-space: normal;',
	name: 'dni', label: 'DNI',
	field: row => row.student.dni,
	format: val => `${val}`,
	sortable: true, align: 'left'
},
{
	style: 'white-space: normal;',
	name: 'student', label: 'Estudiante',
	field: row => row.student.name +' '+ row.student.last_name,
	format: val => `${val}`,
	sortable: true, align: 'left'
},
{ style: 'white-space: normal;', name: 'loan_date', label: 'Fecha de préstamo', field: 'loan_date', sortable: true, align: 'left' },
{ style: 'white-space: normal;', name: 'return_date', label: 'Fecha de devolución', field: 'return_date', sortable: true, align: 'left' },
{ style: 'white-space: normal;', name: 'quantity', label: 'Cantidad', field: 'quantity', sortable: true, align: 'left' },
{ style: 'white-space: normal;', name: 'observation', label: 'Observación', field: 'observation', sortable: true, align: 'left' },
{ style: 'white-space: normal;', name: 'stateLoan', label: 'Estado', field: 'state', sortable: true, align: 'left' },
{ name: 'actions', label: 'Acciones', field: '', align: 'center' },
]

const form = ref({
	start: formatCurrentDate(),
	end: formatCurrentDate(),
})

const loading = ref(false)
const selectRow = ref({})
const dialog = ref(false)
const isUpdate = ref(false)

const studentSelected = ref(null)
const bookSelected = ref(null)

provide('dialog', dialog)
provide('isUpdate', isUpdate)
provide('studentSelected', studentSelected)
provide('bookSelected', bookSelected)

const getData = () => {
	loading.value = true
	form.value.student_id = studentSelected.value ? studentSelected.value.value : 0
	form.value.book_id = bookSelected.value ? bookSelected.value.value : 0
	post('admin/loans', form.value, false).then((response) => {
		console.log('loans', response)
		if(response.status >= 200 && response.status < 300) {
			dataTablePinia.setLoans(response.data.data)
		}
	}).finally(() => {
		loading.value = false
	})
}
if(dataTablePinia.loans.length === 0) 
	getData()

const editRow = (row) => {
	selectRow.value = row
	isUpdate.value = true
	dialog.value = true
}
</script>
