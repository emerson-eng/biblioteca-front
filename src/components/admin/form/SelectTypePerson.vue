<template>
	<div>
		<q-select
		v-model="typePersonSelected"
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


const typePersonSelected = props.useInject ? inject('typePersonSelected') : ref(null)
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
		typePersonSelected.value = newData[0]
	}
}

const getData= () => {
	get('admin/type-person', false).then((response) => {
		console.log('type-person', response)
		if(response.status >= 200 && response.status < 300) {
			let data = response.data.data
			formatData(data)
			dataTablePinia.setTypePersons(data)
		}
	})
}
if(dataTablePinia.typePersons.length == 0)
	getData()
else
	formatData(dataTablePinia.typePersons)

const isSelected = (val) => {
	emit('isSelected', val)
}

</script>
