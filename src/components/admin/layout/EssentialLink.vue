<template>
	<span>
		<q-item v-if="can('Recepción')" clickable exact v-ripple :to="{ name: 'Home' }" active-class="text-primary" class="q-pl-lg">
			<q-item-section avatar>
				<q-icon name="fa-solid fa-house" size="28px"/>
			</q-item-section>
			<q-item-section>Recepción</q-item-section>
		</q-item>

		<q-item v-if="can('Reservaciones')" clickable exact v-ripple :to="{ name: 'ReservationAllPage' }" active-class="text-primary" class="q-pl-lg">
			<q-item-section avatar>
				<q-icon name="fa-regular fa-calendar-days" size="28px"/>
			</q-item-section>
			<q-item-section>Reservaciones</q-item-section>
		</q-item>

		<q-item v-if="can('Clientes')" clickable exact v-ripple :to="{ name: 'ClientPage' }" active-class="text-primary" class="q-pl-lg">
			<q-item-section avatar>
				<q-icon name="fa-solid fa-users" size="28px"/>
			</q-item-section>
			<q-item-section>Clientes</q-item-section>
		</q-item>

		<q-item v-if="can('Compras')" clickable exact v-ripple :to="{ name: 'BuysPage' }" active-class="text-primary" class="q-pl-lg">
			<q-item-section avatar>
				<q-icon name="fa-solid fa-boxes-stacked" size="28px"/>
			</q-item-section>
			<q-item-section>Compras</q-item-section>
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

		<q-expansion-item v-if="canany(['Configuración/Habitación', 'Configuración/Producto', 'Configuración/Compra', 'Configuración/Hotel', 'Configuración/Pagina Web'])" :model-value="isExpansionItem(['RoomPage', 'ProductPage', 'BuyPage', 'WebPage', 'HotelPage'])" :content-inset-level="0.5" expand-separator @click="miniState = false">
			<template v-slot:header>
				<q-item-section avatar>
					<q-avatar>
						<q-icon name="fa-solid fa-gear" size="28px" />
					</q-avatar>
				</q-item-section>
				<q-item-section>Configuración</q-item-section>
			</template>
			<q-item v-if="can('Configuración/Habitación')" clickable v-ripple :to="{ name: 'RoomPage' }" active-class="text-primary">
				<q-item-section avatar>
					<q-icon name="fa-solid fa-bed" size="28px"/>
				</q-item-section>
				<q-item-section>Habitación</q-item-section>
			</q-item>
			<q-item v-if="can('Configuración/Producto')" clickable v-ripple :to="{ name: 'ProductPage' }" active-class="text-primary">
				<q-item-section avatar>
					<q-icon name="fa-solid fa-cart-shopping" size="28px"/>
				</q-item-section>
				<q-item-section>Producto</q-item-section>
			</q-item>
			<q-item v-if="can('Configuración/Compra')" clickable v-ripple :to="{ name: 'BuyPage' }" active-class="text-primary">
				<q-item-section avatar>
					<q-icon name="fa-solid fa-box" size="28px"/>
				</q-item-section>
				<q-item-section>Compra</q-item-section>
			</q-item>

			<q-item v-if="can('Configuración/Hotel')" clickable v-ripple :to="{ name: 'HotelPage' }" active-class="text-primary">
				<q-item-section avatar>
					<q-icon name="fa-solid fa-hotel" size="28px"/>
				</q-item-section>
				<q-item-section>Hotel</q-item-section>
			</q-item>
			<q-item v-if="can('Configuración/Pagina Web')" clickable v-ripple :to="{ name: 'WebPage' }" active-class="text-primary">
				<q-item-section avatar>
					<q-icon name="fa-solid fa-globe" size="28px"/>
				</q-item-section>
				<q-item-section>Pagina Web</q-item-section>
			</q-item>
		</q-expansion-item>

		<q-item v-if="userPinia.user.id === 1" clickable v-ripple :to="{ name: 'HotelsPage' }" active-class="text-primary" class="q-pl-lg">
			<q-item-section avatar>
				<q-icon name="fa-solid fa-hotel" size="28px"/>
			</q-item-section>
			<q-item-section>Hoteles</q-item-section>
		</q-item>
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
