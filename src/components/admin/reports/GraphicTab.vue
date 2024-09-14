<template>
	<div>
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
				<div class="col-12 col-sm-3 q-pt-sm" :class="$q.screen.width < 600 ? 'q-px-sm' : 'q-pl-md q-pr-sm'">
					<select-user
					:useInject="true"
					:useRules="false"
					:useAll="true"
					@isSelected="getData"
					/>
				</div>
				<div class="col-12 col-sm-3 q-px-sm q-my-auto" :class="$q.screen.width < 600 ? 'q-pt-md' : ''">
					<div class="text-h6 text-center text-primary text-weight-bold">
						Total Libros: {{ total.toFixed(2) }}
					</div>
				</div>
			</div>
		</div>

		<vue-apex-charts
		width="100%"
		:height="$q.screen.width < 600 ? 270 : 350"
		type="bar"
		:options="chart.chartOptions"
		:series="chart.series"
		/>

		<data-table
		exportName="Reporte-de-prestamos" :keyTable="'report-graphic'"
		:loading="loading"
		:columns="columns"
		:rows="reports"
		:keyName="'id'"
		/>
	</div>
</template>

<script setup>
import { ref, provide } from 'vue'
import DataTable from 'components/admin/dataTable/DataTable.vue'
import useHttpService from 'utils/httpService'
import useFormatDate from 'utils/formatDate'
import SelectStudent from 'components/admin/form/SelectStudent.vue'
import SelectBook from 'components/admin/form/SelectBook.vue'
import SelectUser from 'components/admin/form/SelectUser.vue'
import VueApexCharts from 'vue3-apexcharts'

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
	name: 'created_at', label: 'Fecha',
	field: row => row.created_at,
	format: val => `${val}`,
	sortable: true, align: 'left'
},
{ style: 'white-space: normal;', name: 'name', label: 'Nombre', field: 'name', sortable: true, align: 'left' },
{
	style: 'white-space: normal;',
	name: 'dni', label: 'N. de doc.',
	field: row => row.provider.dni,
	format: val => `${val}`,
	sortable: true, align: 'left'
},
{
	style: 'white-space: normal;',
	name: 'provider', label: 'Proveedor',
	field: row => row.provider.document_type == 'RUC' ? row.provider.business_name : row.provider.name + ' ' + row.provider.last_name,
	format: val => `${val}`,
	sortable: true, align: 'left'
},
{
	style: 'white-space: normal;',
	name: 'total', label: 'Libros',
	field: row => row.total.toFixed(2),
	format: val => `${val}`,
	sortable: true, align: 'left'
},
{ style: 'white-space: normal;', name: 'note', label: 'Observación', field: 'note', sortable: true, align: 'left' },
{
	style: 'white-space: normal;',
	name: 'user', label: 'Usuario',
	field: row => row.user.name,
	format: val => `${val}`,
	sortable: true, align: 'left'
},
]

const form = ref({
	start: formatCurrentDate(),
	end: formatCurrentDate(),
})
const chart = ref({
	chartOptions: {},
	series: []
})
const reports = ref([])
const total = ref(0)
const loading = ref(false)

const studentSelected = ref(null)
const bookSelected = ref(null)
const userSelected = ref(null)

provide('studentSelected', studentSelected)
provide('bookSelected', bookSelected)
provide('userSelected', userSelected)

const formatReport = (data) => {
	total.value = 0
	for(let i = 0; i < data.length; i++) {
		total.value += data[i].total
		data[i].created_at = formatDate(data[i].created_at)
	}
	reports.value = data

	const grouped = {}
	data.forEach(obj => {
		const date = obj.created_at
		if (grouped[date]) 
			grouped[date] += obj.total
		else 
			grouped[date] = obj.total
	})

	const dates = Object.keys(grouped)
	chart.value.chartOptions = {
		chart: {
			id: 'Libros',
			toolbar: { show: false }
		},
		xaxis: { 
			categories: dates
		}
	} 
	chart.value.series = [{
		data: dates.map(date => grouped[date]),
		name: 'Libros'
	}]
}

const getData = () => {
	loading.value = true
	form.value.student_id = studentSelected.value ? studentSelected.value.value : 0
	form.value.book_id = bookSelected.value ? bookSelected.value.value : 0
	form.value.user_id = userSelected.value ? userSelected.value.value : 0
	post('admin/report-expenses', form.value, false).then((response) => {
		console.log('report-expenses', response)
		if(response.status >= 200 && response.status < 300) {
			formatReport(response.data.data)
		}
	}).finally(() => {
		loading.value = false
	})
}
getData()

</script>
