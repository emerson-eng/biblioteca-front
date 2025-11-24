<template>
	<div>
		<q-select
		v-model="typeStudentSelected"
		:options="optionsData"
		label="Tipo"
		lazy-rules
		:rules="[ val => val && val.label.length > 0 || 'Seleccione un tipo']"
		@update:model-value="isSelected"
		/>
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
	selected: {
		type: Boolean,
		default: false,
	},
})

const emit = defineEmits(['isSelected'])

const dataTablePinia = useDataTableStore()
const { get } = userHttpService()


const typeStudentSelected = props.useInject ? inject('typeStudentSelected') : ref(null)
const optionsData = ref([])


const formatData = (data) => {
	let newData = []
	for(let i = 0; i < data.length; i++) {
		const item = {
			label: data[i].name,
			value: data[i].id
		}
		newData.push(item)
	}
	optionsData.value = newData
	if(props.selected) {
		typeStudentSelected.value = newData[0]
	}
}

const getData= () => {
	get('admin/type-student', false).then((response) => {
		console.log('type-student', response)
		if(response.status >= 200 && response.status < 300) {
			let data = response.data.data
			formatData(data)
			dataTablePinia.setTypeStudents(data)
		}
	})
}
if(dataTablePinia.typeStudents.length == 0)
	getData()
else
	formatData(dataTablePinia.typeStudents)

const isSelected = (val) => {
	emit('isSelected', val)
}

</script>
