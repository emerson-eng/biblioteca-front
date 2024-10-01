<template>
	<span>
		<q-item v-if="can('Prestamos')" clickable exact v-ripple :to="{ name: 'Home' }" active-class="text-primary" class="q-pl-lg">
			<q-item-section avatar>
				<q-icon name="fa-solid fa-hourglass-start" size="28px"/>
			</q-item-section>
			<q-item-section>Prestamos</q-item-section>
		</q-item>

		<q-item v-if="can('Estudiantes')" clickable exact v-ripple :to="{ name: 'StudentPage' }" active-class="text-primary" class="q-pl-lg">
			<q-item-section avatar>
				<q-icon name="fa-solid fa-users" size="28px"/>
			</q-item-section>
			<q-item-section>Estudiantes</q-item-section>
		</q-item>

		<q-item v-if="can('Libros')" clickable exact v-ripple :to="{ name: 'BooksPage' }" active-class="text-primary" class="q-pl-lg">
			<q-item-section avatar>
				<q-icon name="fa-solid fa-book" size="28px"/>
			</q-item-section>
			<q-item-section>Libros</q-item-section>
		</q-item>

		<q-item v-if="can('Usuario')" clickable v-ripple :to="{ name: 'UsersPage' }" active-class="text-primary" class="q-pl-lg">
			<q-item-section avatar>
				<q-icon name="fa-solid fa-user-gear" size="28px"/>
			</q-item-section>
			<q-item-section>Usuario</q-item-section>
		</q-item>

		<q-item v-if="can('Reportes')" clickable v-ripple :to="{ name: 'ReportPage' }" active-class="text-primary" class="q-pl-lg">
			<q-item-section avatar>
				<q-icon name="fa-solid fa-chart-column" size="28px"/>
			</q-item-section>
			<q-item-section>Reportes</q-item-section>
		</q-item>

		<q-expansion-item v-if="canany(['Configuración/Institución', 'Configuración/Estantes', 'Configuración/Autores', 'Configuración/Editoriales'])" :model-value="isExpansionItem(['InstitutionPage', 'MattersPage', 'AuthorsPage', 'EditorialsPage', 'DegreesPage', 'SectionsPage'])" :content-inset-level="0.5" expand-separator @click="miniState = false">
			<template v-slot:header>
				<q-item-section avatar>
					<q-avatar>
						<q-icon name="fa-solid fa-gear" size="28px" />
					</q-avatar>
				</q-item-section>
				<q-item-section>Configuración</q-item-section>
			</template>

			<q-item v-if="can('Configuración/Institución')" clickable v-ripple :to="{ name: 'InstitutionPage' }" active-class="text-primary">
				<q-item-section avatar>
					<q-icon name="fa-solid fa-school" size="28px"/>
				</q-item-section>
				<q-item-section>Institución</q-item-section>
			</q-item>
			<q-separator class="q-ml-sm" />
			<q-item v-if="can('Configuración/Estantes')" clickable v-ripple :to="{ name: 'MattersPage' }" active-class="text-primary">
				<q-item-section avatar>
					<q-icon name="fa-solid fa-tags" size="28px"/>
				</q-item-section>
				<q-item-section>Estantes</q-item-section>
			</q-item>
			<q-item v-if="can('Configuración/Autores')" clickable v-ripple :to="{ name: 'AuthorsPage' }" active-class="text-primary">
				<q-item-section avatar>
					<q-icon name="fa-solid fa-user-pen" size="28px"/>
				</q-item-section>
				<q-item-section>Autores</q-item-section>
			</q-item>
			<q-item v-if="can('Configuración/Editoriales')" clickable v-ripple :to="{ name: 'EditorialsPage' }" active-class="text-primary">
				<q-item-section avatar>
					<q-icon name="fa-solid fa-newspaper" size="28px"/>
				</q-item-section>
				<q-item-section>Editoriales</q-item-section>
			</q-item>
			<q-separator class="q-ml-sm" />
			<q-item v-if="can('Configuración/Grados')" clickable v-ripple :to="{ name: 'DegreesPage' }" active-class="text-primary">
				<q-item-section avatar>
					<q-icon name="fa-solid fa-graduation-cap" size="28px"/>
				</q-item-section>
				<q-item-section>Grados</q-item-section>
			</q-item>
			<q-item v-if="can('Configuración/Secciones')" clickable v-ripple :to="{ name: 'SectionsPage' }" active-class="text-primary">
				<q-item-section avatar>
					<q-icon name="fa-solid fa-people-roof" size="28px"/>
				</q-item-section>
				<q-item-section>Secciones</q-item-section>
			</q-item>
		</q-expansion-item>
	</span>
</template>

<script setup>
import { inject } from 'vue'
import userPermission from 'utils/permissions'
import { useRoute,useRouter } from 'vue-router'
import { useUserStore } from 'stores/user'

const { can, canany } = userPermission()
const route = useRoute()
const userPinia = useUserStore()
const miniState = inject('miniState')

const isExpansionItem = (routeNames) => {
	for(let i = 0; i < routeNames.length; i++) {
		if(route.name == routeNames[i])
			return true
	}
	return false
}

</script>
