<template>
	<q-dialog v-model="dialogShowDetail" :maximized="$q.screen.width < 700 ? true : false" transition-show="slide-up" transition-hide="slide-down">
		<q-card style="width: 650px; max-width: 650px" class="q-px-sm">
			<q-card-section class="row items-center q-pb-none">
				<div class="text-h6 text-color-dark text-bold">Detalles del préstamo</div>
				<q-space />
				<q-btn icon="close" flat round dense v-close-popup />
			</q-card-section>

			<q-card-section>
				<div class="column q-pb-md">
					<q-list v-if="selectRow" dense class="rounded-borders text-color-dark text-bold">
						<q-item>
							<q-item-section avatar>
								<q-item-label style="width: 150px;">Libro:</q-item-label>
							</q-item-section>
							<q-item-section class="text-subtitle2">
								<q-item-label>{{ selectRow.book.name }}</q-item-label>
							</q-item-section>
						</q-item>
						<q-separator />

						<q-item>
							<q-item-section avatar>
								<q-item-label style="width: 150px;">Cantidad:</q-item-label>
							</q-item-section>
							<q-item-section class="text-subtitle2">
								<q-item-label>{{ selectRow.quantity }}</q-item-label>
							</q-item-section>
						</q-item>
						<q-separator />

						<q-item>
							<q-item-section avatar>
								<q-item-label style="width: 150px;">Estudiante:</q-item-label>
							</q-item-section>
							<q-item-section class="text-subtitle2">
								<q-item-label>{{ selectRow.student.name +' '+ selectRow.student.last_name }}</q-item-label>
							</q-item-section>
						</q-item>
						<q-separator />

						<q-item>
							<q-item-section avatar>
								<q-item-label style="width: 150px;">DNI:</q-item-label>
							</q-item-section>
							<q-item-section class="text-subtitle2">
								<q-item-label>{{ selectRow.student.dni }}</q-item-label>
							</q-item-section>
						</q-item>
						<q-separator />

						<q-item>
							<q-item-section avatar>
								<q-item-label style="width: 150px;">Fecha de préstamo:</q-item-label>
							</q-item-section>
							<q-item-section>
								<q-item-label class="text-subtitle2">{{ selectRow.loan_date }}</q-item-label>
							</q-item-section>
							<q-item-section avatar>
								<q-item-label style="width: 150px;">Fecha de devolución:</q-item-label>
							</q-item-section>
							<q-item-section>
								<q-item-label class="text-subtitle2">{{ selectRow.return_date }}</q-item-label>
							</q-item-section>
						</q-item>
						<q-separator />

						<q-item>
							<q-item-section avatar>
								<q-item-label style="width: 150px;">Observación:</q-item-label>
							</q-item-section>
							<q-item-section class="text-subtitle2">
								<q-item-label>{{ selectRow.observation }}</q-item-label>
							</q-item-section>
						</q-item>
						<q-separator />

						<q-item>
							<q-item-section avatar>
								<q-item-label style="width: 150px;">Estado:</q-item-label>
							</q-item-section>
							<q-item-section class="text-subtitle2">
								<q-item-label>
									<q-badge v-if="selectRow.state == 2" color="red" label="Devolución vencida" />
									<q-badge v-else-if="selectRow == 1" color="green-14" label="Devuelto" />
									<q-badge v-else color="blue-grey-4" label="Prestado" />
								</q-item-label>
							</q-item-section>
						</q-item>
						<q-separator />
					</q-list>
				</div>
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script setup>
import { ref, inject } from 'vue'

const props = defineProps({
	selectRow: {
		type: Object,
	},
})

const dialogShowDetail = inject('dialogShowDetail')

</script>
