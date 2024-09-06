<template>
	<q-layout :view="$q.platform.is.mobile ? 'lHh Lpr lFf' : 'hHh Lpr fff'" class="bg-body">
		<q-header elevated class="bg-primary">
			<q-toolbar v-if="userPinia.isAuthenticated">
				<q-btn v-if="$q.screen.width < 1024"
				flat dense round
				icon="menu"
				@click="toggleLeftDrawer"
				/>
				<q-btn v-else
				flat dense round
				icon="menu"
				@click="miniState = !miniState"
				/>

				<q-space />

				<menu-user />
				<notification-user />
			</q-toolbar>

			<q-toolbar v-else>
				<q-btn round flat class="q-ml-md">
					<q-avatar size="xl">
						<img src="/logo/logo.png">
					</q-avatar>
				</q-btn>
			</q-toolbar>
		</q-header>

		<q-drawer v-if="userPinia.isAuthenticated" v-model="leftDrawerOpen" :mini="miniState" :width="$q.screen.width < 700 ? 270 : 250" show-if-above>
			<q-list padding>
				<q-item v-ripple class="q-mt-xs" :class="miniState ? '' : 'q-mx-sm'">
					<q-item-section v-if="miniState" avatar>
						<q-avatar size="xl">
							<q-img 
							src="/logo/logo.png"
							spinner-color="primary" 
							/>
						</q-avatar>
					</q-item-section>
					<q-img v-else
					src="/logo/logo-baner.png"
					spinner-color="primary" 
					/>
				</q-item>
				<q-separator class="q-my-md bg-primary" />

				<essential-Link></essential-Link>
			</q-list>
		</q-drawer>

		<q-page-container class="page-wrapper-admin">
			<router-view />
		</q-page-container>

		<footer-componente v-if="$q.screen.width > 700"></footer-componente>
		<footer-tab v-if="$q.platform.is.mobile && userPinia.isAuthenticated" />
	</q-layout>
</template>

<style scoped>
.text-height-plan {
	line-height: 11pt!important;
}
</style>

<script setup>
import { defineAsyncComponent, ref, provide } from 'vue'
import { useUserStore } from 'stores/user'
import { urlImg } from 'boot/axios'
import useFormatDate from 'utils/formatDate'
import EssentialLink from 'components/admin/layout/EssentialLink.vue'
import MenuUser from 'components/user/dialogs/MenuUser.vue'
import NotificationUser from 'components/user/NotificationUser.vue'
import FooterTab from 'components/admin/layout/FooterTab.vue'
const FooterComponente = defineAsyncComponent(() => import('components/admin/layout/FooterComponent.vue')) 

const userPinia = useUserStore()
const { formatDatePlan } = useFormatDate()

const leftDrawerOpen = ref(false)
const miniState = ref(false)

provide('miniState', miniState)

const toggleLeftDrawer = () => {
	leftDrawerOpen.value = !leftDrawerOpen.value
}

</script>
