<template>
	<q-dialog v-model="dialogImport" :maximized="$q.screen.width < 700 ? true : false" transition-show="slide-up" transition-hide="slide-down" @show="initUpdate" @hide="closeDialog">
		<q-card style="width: 850px; max-width: 850px" class="q-px-sm">
			<q-card-section class="row items-center q-pb-none">
				<div class="text-h6 text-color-dark text-bold">Importar Excel</div>
				<q-space />
				<q-btn icon="close" flat round dense v-close-popup />
			</q-card-section>

			<q-card-section>
				<div class="q-mb-sm">
					<div class="text-subtitle1 text-bold">
						Ejemplo de la estructura del Excel
					</div>
					<q-img 
					src="/images/import/book.jpg"
					spinner-color="primary" 
					/>
				</div>
				<div class="column q-pb-md">
					<q-list v-if="showResult" class="rounded-borders">
						<div class="text-subtitle1 text-bold">
							Resultados
						</div>
						<q-item>
							<q-item-section avatar>
								<q-icon name="fa-solid fa-triangle-exclamation" color="positive" />
							</q-item-section>
							<q-item-section>
								<div>
									<span class="text-subtitle1 q-pr-sm">{{ respondeData.rows }}</span> Libros registrados con éxito
								</div>
							</q-item-section>
						</q-item>
						<q-expansion-item v-if="respondeData.rowDuplicates.length > 0" expand-separator>
							<template v-slot:header>
								<q-item-section avatar>
									<q-icon name="fa-solid fa-triangle-exclamation" color="negative" />
								</q-item-section>
								<q-item-section>
									<div>
										<span class="text-subtitle1 q-pr-sm">{{ respondeData.rowDuplicates.length }}</span> Libros ya registrados en el sistema
									</div>
								</q-item-section>
							</template>
							<q-card>
								<q-card-section class="q-pt-none">
									<ul v-for="(item, index) in  respondeData.rowDuplicates" :key="index">
										<li>{{ item.name }}</li>
									</ul>
								</q-card-section>
							</q-card>
						</q-expansion-item>
					</q-list>

					<q-btn
					:loading="loadingImport" :disable="loadingImport"
					color="primary"
					icon-right="unarchive"
					label="Importar xlsx"
					no-caps
					class="q-mt-lg"
					@click="importExcel"
					/>
				</div>
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useLoanStore } from 'stores/loan'
import readXlsxFile from 'read-excel-file'
import useHttpService from 'utils/httpService'
import useAlerts from 'utils/alerts'

const loanPinia = useLoanStore()
const { post } =  useHttpService()
const { alertNotify } = useAlerts()

const dialogImport = inject('dialogImport')

const loadingImport = ref(false)
const showResult = ref(false)
const respondeData = ref({
	rowDuplicates: [],
})

const initUpdate = () => {
	showResult.value = false
}

const register = (form) => {
	loadingImport.value = true
	post('admin/book-import', form).then(response => {
		console.log('register', response)
		if(response.status >= 200 && response.status < 300) {
			respondeData.value.rows = form.rows.length - response.data.rowDuplicates.length
			respondeData.value.rowDuplicates = response.data.rowDuplicates
			showResult.value = true
		}
	}).finally(() => {
		loadingImport.value = false
	})
}

const closeDialog = () => {
	if(showResult.value)
		window.location.reload(true)
}

const importExcel = () => {
	try {
		let input = document.createElement('input')
		input.type = 'file'
		input.accept = '.xls, .xlsx'
		input.onchange = _ => {
			let files = Array.from(input.files)
			loadingImport.value = true
			readXlsxFile(files[0]).then((rows) => {
				console.log(rows)
				var vals = []
				for(let i = 0; i < rows.length; i++) {
					if(i > 0) {
						vals.push({
							matter_id: findMatter(rows[i][0]),
							author_id: findAuthor(rows[i][1]),
							editorial_id: findEditorial(rows[i][2]),
							name: rows[i][3],
							quantity: rows[i][4],
							year_publication: rows[i][5],
							page_number: rows[i][6],
							description: rows[i][7],
						})
					}
				}
				register({ rows: vals })
			})
		}
		input.click()
	}
	catch {
		alertNotify('El Excel a importar no se encuentra en un formato adecuado.', 'warning')
	}
}

const findMatter = (val) => {
	let data = loanPinia.matters.find((item) => item.name.toLowerCase() == val.toLowerCase())
	return data ? data.id : 1
}

const findAuthor = (val) => {
	let data = loanPinia.authors.find((item) => item.name.toLowerCase() == val.toLowerCase())
	return data ? data.id : 1
}

const findEditorial = (val) => {
	let data = loanPinia.editorials.find((item) => item.name.toLowerCase() == val.toLowerCase())
	return data ? data.id : 1
}

</script>