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
			</div>
		</div>

		<full-calendar
		ref="fullCalendarRef"
		:options="calendarOptions"
		class="q-mt-md"
		:class="$q.screen.width > 700 ? 'q-px-md' : ''"
		/>

		<show-detail 
		:selectRow="selectRow"
		/>
	</div>
</template>

<style>
.event-cont {
	padding: 4px 4px 4px 8px;
	white-space: normal;
}
.fc-toolbar-title {
	text-align: center!important;
	line-height: 30px!important;
}
</style>

<script setup>
import { ref, provide } from 'vue'
import { useQuasar } from 'quasar'
import useHttpService from 'utils/httpService'
import SelectStudent from 'components/admin/form/SelectStudent.vue'
import SelectBook from 'components/admin/form/SelectBook.vue'
import SelectUser from 'components/admin/form/SelectUser.vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import esLocale from '@fullcalendar/core/locales/es'
import ShowDetail from 'components/admin/dialogs/report/ShowDetail.vue'
import moment from 'moment'

const $q = useQuasar()
const { post } =  useHttpService()

const form = ref({
	start: moment().startOf('month').format('YYYY-MM-DD'),
	end: moment().endOf('month').format('YYYY-MM-DD'),
})
const selectRow = ref({})

const studentSelected = ref(null)
const bookSelected = ref(null)
const userSelected = ref(null)

const dialogShowDetail = ref(false)

const fullCalendarRef = ref(null)
const calendarOptions = ref({
	height: 'auto',
	plugins: [ dayGridPlugin, interactionPlugin, timeGridPlugin ],
	initialView: 'dayGridMonth',
	headerToolbar: {
		left: 'today,prev,next',
		center: 'title',
		right: 'dayGridMonth,dayGridWeek'
	},
	locale: esLocale,
	dayHeaderFormat: { weekday: $q.screen.width < 700 ? 'short' : 'long' },
	selectable: true,
	longPressDelay: $q.screen.width < 700 ? 1 : 1000,
	events: [],
	eventContent: function (arg) {
		return {
			html: `<div class="event-container event-cont cursor-pointer">
			${arg.event.title}
			</div>`
		}
	},
	eventClick: function (info) {
		selectRow.value = info.event.extendedProps
		dialogShowDetail.value = true
	},
})

provide('studentSelected', studentSelected)
provide('bookSelected', bookSelected)
provide('userSelected', userSelected)
provide('dialogShowDetail', dialogShowDetail)

const getTitleEvent = (state, val) => {
	let nameClient = val.student.name +' '+ val.student.last_name
	let title = `<div><i class="fas fa-calendar"></i> (${state.name})</div> ${val.book.name} <div>${nameClient}</div>`

	return title
}

const getState = (state) => {
	if(state == 2)
		return { name: 'Devolución vencida', color: '#f44336'}
	if(state == 1)
		return { name: 'Devuelto', color: '#00c853'}
	else 
		return { name: 'Prestado', color: '#90a4ae'}
}

const formatData = (val) => {
	calendarOptions.value.events = []
	for(let i = 0; i < val.length; i++) {
		const state = getState(val[i].state)
		calendarOptions.value.events.push({
			title: getTitleEvent(state, val[i]),
			start: val[i].loan_date,
			end: val[i].return_date,
			extendedProps: val[i],
			backgroundColor: state.color,
			borderColor: '#eeeeee',
		})
	}
}

const getData = () => {
	$q.loading.show({delay: 100 })
	form.value.student_id = studentSelected.value ? studentSelected.value.value : 0
	form.value.book_id = bookSelected.value ? bookSelected.value.value : 0
	form.value.user_id = userSelected.value ? userSelected.value.value : 0
	post('admin/loan/report', form.value, false).then((response) => {
		console.log('loan/report', response)
		if(response.status >= 200 && response.status < 300) {
			formatData(response.data.data)
		}
	}).finally(() => {
		$q.loading.hide()
	})
}
getData()

</script>
