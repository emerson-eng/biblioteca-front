<template>
	<q-footer>
		<q-tabs v-model="tab" shrink outside-arrows class="text-white">
			<q-route-tab v-if="can('Prestamos')" name="Home" :to="{ name: 'Home' }">
				<q-icon name="fa-solid fa-hourglass-start" size="20px" />
			</q-route-tab>

			<q-route-tab v-if="can('Estudiantes')" name="StudentPage" :to="{ name: 'StudentPage' }">
				<q-icon name="fa-solid fa-users" size="20px" />
			</q-route-tab>

			<q-route-tab v-if="can('Libros')" name="BooksPage" :to="{ name: 'BooksPage' }">
				<q-icon name="fa-solid fa-book" size="20px" />
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