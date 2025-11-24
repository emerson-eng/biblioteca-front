<template>
	<q-table
	:table-style="'counter-reset: cssRowCounter ' + ((pagination.page - 1) * pagination.rowsPerPage) + ';'"
	:rows="rows"
	:columns="columns"
	:row-key="keyName"
	:filter="filter"
	:loading="loading"
	:rows-per-page-options="getRowsPerPageOption()"
	v-model:pagination="pagination"
	dense
	:visible-columns="visibleColumns"
	>

	<template v-slot:body-cell-row-number="">
		<q-td>
			<span class="rowNumber"/>
		</q-td>
	</template>

	<template v-slot:loading>
		<q-inner-loading showing color="primary" />
	</template>

	<template v-slot:top-left>
		<div class="q-mt-sm" :class="$q.screen.width > 700 ? 'input-style' : 'input-style-phone'">
			<q-input outlined dense debounce="300" v-model="filter" placeholder="Buscar">
				<template v-slot:append>
					<q-icon name="search" />
				</template>
			</q-input>
		</div>
	</template>

	<template v-slot:top-right>
		<div v-if="showBtnImport">
			<q-btn
			v-if="$q.screen.width < 800 ? false : true"
			color="primary"
			icon="unarchive"
			label="Importar Excel"
			no-caps
			@click="btnImport"
			class="q-mr-md"
			/>
		</div>

		<q-btn-dropdown v-if="showBtnExport && $q.screen.width > 700" no-caps color="primary" label="Exportar" icon="archive">
			<q-list>
				<q-item clickable v-close-popup @click="ExportToPDF(columns, rows, exportName)">
					<q-item-section avatar>
						<q-avatar icon="picture_as_pdf" color="primary" text-color="white" />
					</q-item-section>
					<q-item-section>
						<q-item-label>PDF</q-item-label>
					</q-item-section>
				</q-item>
				<q-item clickable v-close-popup @click="ExportTableCSV(columns, rows, exportName)">
					<q-item-section avatar>
						<q-avatar icon="fas fa-file-csv" color="primary" text-color="white" />
					</q-item-section>
					<q-item-section>
						<q-item-label>CSV</q-item-label>
					</q-item-section>
				</q-item>
				<q-item clickable v-close-popup @click="ExportToExcel(columns, rows, exportName)">
					<q-item-section avatar>
						<q-avatar icon="fas fa-file-excel" color="primary" text-color="white" />
					</q-item-section>
					<q-item-section>
						<q-item-label>XLSX</q-item-label>
					</q-item-section>
				</q-item>
			</q-list>
		</q-btn-dropdown>

		<q-select
		v-model="visibleColumns"
		ref="visibleColumnsRef"
		multiple
		dense
		options-dense
		:display-value="$q.lang.table.columns"
		emit-value
		map-options
		:options="columns"
		option-value="name"
		options-cover
		hide-selected
		class="absolute-top-right select-column"
		@update:model-value="saveVisibleColumns"
		@popup-hide="selectHide"
		/>
		<q-btn v-if="showSelectColumn" flat dense round icon="fa-solid fa-gear" @click="showSelectColumns" class="q-ml-sm">
			<q-tooltip>
				Configurar columnas visibles
			</q-tooltip>
		</q-btn>
	</template>

	<template v-slot:body-cell-stateLoan="props">
		<q-td :props="props">
			<q-badge v-if="props.row.state == 2" color="red" label="Devolución vencida" />
			<q-badge v-else-if="props.row.state == 1" color="green-14" label="Devuelto" />
			<q-badge v-else color="blue-grey-4" label="Prestado" />
		</q-td>
	</template>

	<template v-slot:body-cell-swith="props">
		<q-td :props="props">
			<q-toggle 
			v-model="swithModels"
			:val="props.key"
			:disable="loadingSwith"
			@update:model-value="changeSwith(props.row)"
			/>
		</q-td>
	</template>

	<template v-slot:body-cell-image="props">
		<q-td :props="props">
			<q-btn @click="zoomImageEmit(props.row)" dense flat>
				<q-tooltip>
					{{ zoomImageTitle }}
				</q-tooltip>
				<q-img v-if="props.row.image" :src="urlImg + props.row.image" spinner-color="primary" width="40px" height="40px" />
				<q-img v-else src="/images/11-Libro.jpg" spinner-color="primary" width="40px" height="40px" />
			</q-btn>
		</q-td>
	</template>

	<template v-slot:body-cell-additionalColumn="props">
		<q-td :props="props">
			<q-btn dense round flat color="info" @click="additionalColumn(props.row)" :icon="iconAdditionalColumn" :loading="props.row.id == currentpush ? true: false" :disable="loadingBtndditional">
				<q-tooltip>
					{{ additionalColumnnTitle }}
				</q-tooltip>
			</q-btn>
		</q-td>
	</template>

	<template v-slot:body-cell-additionalColumn2="props">
		<q-td :props="props">
			<q-btn dense round flat color="info" @click="additionalColumn2(props.row)" :icon="iconAdditionalColumn2">
				<q-tooltip>
					{{ additionalColumnnTitle2 }}
				</q-tooltip>
			</q-btn>
		</q-td>
	</template>

	<template v-slot:body-cell-additionalColumnLoan="props">
		<q-td :props="props">
			<q-btn v-if="props.row.state != 1" dense round flat color="info" @click="additionalColumn(props.row)" :icon="iconAdditionalColumn">
				<q-tooltip>
					{{ additionalColumnnTitle }}
				</q-tooltip>
			</q-btn>
		</q-td>
	</template>

	<template v-slot:body-cell-actions="props">
		<q-td :props="props">
			<q-btn v-if="btnEdit" dense round flat color="grey" @click="editRow(props.row)" icon="edit" aria-label="editar">
				<q-tooltip>
					Editar
				</q-tooltip>
			</q-btn>
			<q-btn v-if="btnDelete" dense round flat color="grey" @click="deleteRow(props.row)" icon="delete" aria-label="eliminar">
				<q-tooltip>
					Eliminar
				</q-tooltip>
			</q-btn>
		</q-td>
	</template>
</q-table>
</template>

<style>
.rowNumber::before {
	counter-increment: cssRowCounter;
	content: counter(cssRowCounter) ". ";
}
</style>

<style scoped>
.select-column {
	right: 140px; 
	top: 100px; 
	visibility: hidden;
}
.input-style {
	width: 300px;
	height: 50px;
}
.input-style-phone {
	width: 250px;
	height: 50px;
}
</style>

<script setup>
import { ref, inject } from 'vue'
import { useQuasar, LocalStorage } from 'quasar'
import { urlImg } from 'boot/axios'
import dataTables from 'utils/dataTables'

const props = defineProps({
	keyTable: {
		type: String,
		default: () => 'enrolleds'
	},
	showSelectColumn: {
		type: Boolean,
		default: () => true,
	},
	exportName: {
		type: String,
		default: () => 'table-export'
	},
	showBtnExport: {
		type: Boolean,
		default: () => true
	},
	showBtnImport: {
		type: Boolean,
		default: () => false
	},
	loading: {
		type: Boolean,
		default: () => false
	},
	columns: {
		type: Array,
		default: () => []
	},
	rows: {
		type: Array,
		default: () => []
	},
	keyName: {
		type: String,
		default: () => 'id'
	},
	deleteMsm: {
		type: String,
		default: () => '¿Estás seguro que desea eliminarlo?'
	},
	btnDelete: {
		type: Boolean,
		default: () => true
	},
	btnEdit: {
		type: Boolean,
		default: () => true
	},
	rowsPerPageOption: {
		type: Number,
		default: () => 1
	},
	// zoomImage
	zoomImageTitle: {
		type: String,
		default: () => 'Ver imagen'
	},

	// AdditionalColumn
	iconAdditionalColumn: {
		type: String,
		default: () => 'people'
	},
	additionalColumnnTitle: {
		type: String,
		default: () => 'Boton'
	},
	loadingBtndditional: {
		type: Boolean,
		default: () => false
	},
	// AdditionalColumn
	iconAdditionalColumn2: {
		type: String,
		default: () => 'people'
	},
	additionalColumnnTitle2: {
		type: String,
		default: () => 'Boton'
	},
	// Swith
	toggleSwith: {
		type: Boolean,
		default: () => false
	},
	loadingSwith: {
		type: Boolean,
		default: () => false
	},
	//Others
	currentpush:{
		type: Number,
		default: () => -1
	},
	custompagination:{
		type: Number,
		default: () => 10
	},
})

const emit = defineEmits([
	'editRow',
	'deleteRow',
	'changeSwith',
	'zoomImageEmit',
	'btnImport',
	'additionalColumn',
	'additionalColumn2',
	])


const $q = useQuasar()
const { ExportTableCSV, ExportToPDF, ExportToExcel } = dataTables()

const filter = ref('')
const pagination = ref({
	sortBy: 'desc',
	descending: false,
	page: 1,
	rowsPerPage: props.custompagination
})

const swithModels = props.toggleSwith ? inject('swithModels') : ref([])

const visibleColumns = ref([])
const visibleColumnsRef = ref(null)
const isPopup = ref(false)

const setVisibleColumns = () => {
	visibleColumns.value = []
	for(let i = 0; i < props.columns.length; i++) {
		visibleColumns.value.push(props.columns[i].name)
	}
}

const init = () => {
	let visibleColumnsStorage = LocalStorage.getItem('visibleColumnsRoot')
	if(visibleColumnsStorage) {
		if(visibleColumnsStorage.hasOwnProperty(props.keyTable) && props.showSelectColumn)
			visibleColumns.value = visibleColumnsStorage[props.keyTable]
		else
			setVisibleColumns()
	}
	else 
		setVisibleColumns()
}
init()

const editRow = (row) => {
	emit('editRow', row)
}

const changeSwith = (row) => {
	emit('changeSwith', row)
}

const btnImport = () => {
	emit('btnImport')
}

const additionalColumn = (row) =>{
	emit('additionalColumn', row)
}

const additionalColumn2 = (row) =>{
	emit('additionalColumn2', row)
}

const zoomImageEmit = (row) => {
	emit('zoomImageEmit', row)
}

const getRowsPerPageOption = () => {
	if(props.rowsPerPageOption == 1)
		return [10, 15, 25, 50, 0]
	else if(props.rowsPerPageOption == 2)
		return [5, 7, 10, 15, 0]
}

const deleteRow = (row) => {
	$q.dialog({
		title: 'Eliminar',
		message: props.deleteMsm,
		ok: {
			color: 'primary',
			label: 'Si, eliminar!'
		},
		cancel: {
			flat: true,
			label: 'Cancelar'
		},
		persistent: false
	}).onOk(() => {
		emit('deleteRow', row)
	})
}


const saveVisibleColumns = (val) => {
	let visibleColumnsStorage = LocalStorage.getItem('visibleColumnsRoot')
	if(visibleColumnsStorage) {
		visibleColumnsStorage[props.keyTable] = val
	}
	else {
		visibleColumnsStorage =  new Object()
		visibleColumnsStorage[props.keyTable] = val
	}
	LocalStorage.set('visibleColumnsRoot', visibleColumnsStorage)
}

const showSelectColumns = () => {
	if(isPopup.value) 
		visibleColumnsRef.value.hidePopup()
	else {
		visibleColumnsRef.value.showPopup()
		isPopup.value = true
	}
}

const selectHide = () => {
	setTimeout(() => {
		isPopup.value = false
	}, 300)
}

</script>
