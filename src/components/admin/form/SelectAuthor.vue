<template>
	<div>
		<q-select
		v-model="authorSelected"
		use-input
		label="Autor"
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
import { useLoanStore } from 'stores/loan'
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

const loanPinia = useLoanStore()
const { get } = userHttpService()


const authorSelected = props.useInject ? inject('authorSelected') : ref(null)
const authors = ref([])
const optionsData = ref([])

const formatData = (data) => {
	let newData = []
	if(props.useAll) {
		newData.push({
			label: 'Todos',
			value: 0
		})
		authorSelected.value = newData[0]
	}
	for(let i = 0; i < data.length; i++) {
		const item = {
			label: data[i].name,
			value: data[i].id
		}
		newData.push(item)
	}
	authors.value = newData
	optionsData.value = newData
}

const getData= () => {
	get('admin/author/filter', false).then((response) => {
		console.log('author', response)
		if(response.status >= 200 && response.status < 300) {
			let data = response.data.data
			formatData(data)
			loanPinia.setAuthors(data)
		}
	})
}
if(loanPinia.authors.length == 0)
	getData()
else
	formatData(loanPinia.authors)


const isSelected = (val) => {
	emit('isSelected', val)
}

const filterFn = (val, update, abort) => {
	update(() => {
		const needle = val.toLowerCase()
		optionsData.value = authors.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
	})
}

const getRules = () => {
	if(props.useRules)
		return [ val => val && val.label.length > 0 || 'Seleccione un autor']
	return []
}
</script>
