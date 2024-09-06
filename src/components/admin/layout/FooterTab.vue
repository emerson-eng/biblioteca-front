<template>
	<q-footer>
		<q-tabs v-model="tab" shrink outside-arrows class="text-white">
			<q-route-tab v-if="can('Recepción')" name="Home" :to="{ name: 'Home' }">
				<q-icon name="fa-solid fa-house" size="20px" />
			</q-route-tab>

			<q-route-tab v-if="can('Reservaciones')" name="ReservationAllPage" :to="{ name: 'ReservationAllPage' }">
				<q-icon name="fa-regular fa-calendar-days" size="20px" />
			</q-route-tab>

			<q-route-tab v-if="can('Clientes')" name="ClientPage" :to="{ name: 'ClientPage' }">
				<q-icon name="fa-solid fa-users" size="20px" />
			</q-route-tab>

			<q-route-tab v-if="can('Compras')" name="BuysPage" :to="{ name: 'BuysPage' }">
				<q-icon name="fa-solid fa-boxes-stacked" size="20px" />
			</q-route-tab>

			<q-route-tab v-if="can('Usuario')" name="UsersPage" :to="{ name: 'UsersPage' }">
				<q-icon name="fa-solid fa-user-gear" size="20px" />
			</q-route-tab>

			<q-route-tab v-if="can('Reportes')" name="ReportPage" :to="{ name: 'ReportPage' }">
				<q-icon name="fa-solid fa-chart-column" size="20px" />
			</q-route-tab>
		</q-tabs>
	</q-footer>
</template>

<style scoped>
.q-tab {
	padding: 0 8px; 
}
</style>

<script setup>
import { ref } from 'vue'
import userPermission from 'utils/permissions'

const { can, canany } = userPermission()

const tab = ref('Home')
</script>