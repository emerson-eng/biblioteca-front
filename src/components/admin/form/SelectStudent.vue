<template>
	<div>
		<q-select
		v-model="studentSelected"
		:disable="disable"
		use-input
		label="Estudiante"
		hide-selected
		fill-input
		input-debounce="0"
		:options="optionsData"
		@filter="filterFn"
		@update:model-value="isSelected"
		lazy-rules
		:rules="getRules()"
		>
		<template v-slot:no-option>
			<q-item>
				<q-item-section class="text-grey">
					Sin resultados
				</q-item-section>
			</q-item>
		</template>
	</q-select>
</div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useDataTableStore } from 'stores/dataTable'
import userHttpService from 'utils/httpService'

const props = defineProps({
	useInject: {
		type: Boolean,
		default: false,
	},
	useRules: {
		type: Boolean,
		default: true,
	},
	useAll: {
		type: Boolean,
		default: false,
	},
	disable: {
		type: Boolean,
		default: false,
	},
})

const emit = defineEmits(['isSelected'])

const dataTablePinia = useDataTableStore()
const { get } = userHttpService()

const studentSelected = props.useInject ? inject('studentSelected') : ref(null)
const students = ref([])
const optionsData = ref([])

const formatData = (data) => {
	let newData = []
	if(props.useAll) {
		newData.push({
			label: 'Todos',
			value: 0
		})
		studentSelected.value = newData[0]
	}
	for(let i = 0; i < data.length; i++) {
		const item = {
			label: `${data[i].name} ${data[i].last_name} - ${data[i].dni}`,
			value: data[i].id
		}
		newData.push(item)
	}
	students.value = newData
	optionsData.value = newData
}

const getData= () => {
	get('admin/student', false).then((response) => {
		console.log('student', response)
		if(response.status >= 200 && response.status < 300) {
			let data = response.data.data
			formatData(data)
			dataTablePinia.setStudents(data)
		}
	})
}
if(dataTablePinia.students.length == 0)
	getData()
else
	formatData(dataTablePinia.students)


const isSelected = (val) => {
	emit('isSelected', val)
}

const filterFn = (val, update, abort) => {
	update(() => {
		const needle = val.toLowerCase()
		optionsData.value = students.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
	})
}

const getRules = () => {
	if(props.useRules)
		return [ val => val && val.label.length > 0 || 'Seleccione un estudiante']
	return []
}
</script>
