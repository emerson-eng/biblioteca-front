<template>
	<div>
		<q-select
		v-model="userSelected"
		use-input
		label="Usuario"
		hide-selected
		fill-input
		input-debounce="0"
		:options="optionsData"
		@update:model-value="isSelected"
		@filter="filterFn"
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
})

const emit = defineEmits(['isSelected'])

const dataTablePinia = useDataTableStore()
const { get } = userHttpService()

const userSelected = props.useInject ? inject('userSelected') : ref(null)
const users = ref([])
const optionsData = ref([])

const formatData = (data) => {
	let newData = []
	if(props.useAll) {
		newData.push({
			label: 'Todos',
			value: 0
		})
		userSelected.value = newData[0]
	}
	for(let i = 0; i < data.length; i++) {
		const item = {
			label: data[i].name,
			value: data[i].id
		}
		newData.push(item)
	}
	users.value = newData
	optionsData.value = newData
}

const getData= () => {
	get('admin/user', false).then((response) => {
		console.log('user', response)
		if(response.status >= 200 && response.status < 300) {
			let data = response.data.data
			formatData(data)
			dataTablePinia.setUsers(data)
		}
	})
}
if(dataTablePinia.users.length == 0)
	getData()
else
	formatData(dataTablePinia.users)


const isSelected = (val) => {
	emit('isSelected', val)
}

const filterFn = (val, update, abort) => {
	update(() => {
		const needle = val.toLowerCase()
		optionsData.value = users.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
	})
}

const getRules = () => {
	if(props.useRules)
		return [ val => val && val.label.length > 0 || 'Seleccione una usuario']
	return []
}
</script>
