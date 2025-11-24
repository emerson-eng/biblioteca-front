<template>
	<q-page padding>
		<div class="full-width">
			<q-tabs v-model="tab" :breakpoint="0" dense inline-label mobile-arrows align="left" class="shadow-2 bg-white">
				<q-tab name="UsersTab" label="Usuarios" />
				<q-tab name="RolesTab" label="Roles" />
			</q-tabs>

			<q-separator />

			<q-tab-panels v-model="tab" animated class="shadow-2">
				<q-tab-panel name="UsersTab" class="q-pa-none">
					<users-tab />
				</q-tab-panel>
				<q-tab-panel name="RolesTab" class="q-pa-none">
					<roles-tab />
				</q-tab-panel>
			</q-tab-panels>
		</div>
	</q-page>
</template>

<script setup>
import { ref } from 'vue'
import UsersTab from 'components/admin/user/UsersTab.vue'
import RolesTab from 'components/admin/user/RolesTab.vue'

const tab = ref('UsersTab')

</script>
