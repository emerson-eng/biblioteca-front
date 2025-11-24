<template>
	<div>
		<q-select
		v-model="roleSelected"
		:options="optionsData"
		label="Rol"
		lazy-rules
		:rules="[ val => val && val.label.length > 0 || 'Seleccione un rol']"
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
})

const emit = defineEmits(['isSelected'])

const dataTablePinia = useDataTableStore()
const { get } = userHttpService()

const roleSelected = props.useInject ? inject('roleSelected') : ref(null)
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
}

const getData= () => {
	get('admin/role', false).then((response) => {
		console.log('role', response)
		if(response.status >= 200 && response.status < 300) {
			let data = response.data.data
			formatData(data)
			dataTablePinia.setRoles(data)
		}
	})
}
if(dataTablePinia.roles.length == 0)
	getData()
else
	formatData(dataTablePinia.roles)

const isSelected = (val) => {
	emit('isSelected', val)
}

</script>
