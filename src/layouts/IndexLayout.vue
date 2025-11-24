<template>
	<q-layout view="hHh Lpr fff" class="bg-body">
		<q-header elevated class="bg-primary">
			<q-toolbar>
				<q-btn round flat class="q-ml-md">
					<q-avatar size="xl">
						<img src="/logo/logo.png">
					</q-avatar>
				</q-btn>
			</q-toolbar>
		</q-header>

		<q-page-container class="page-wrapper-admin">
			<router-view />
		</q-page-container>

		<footer-componente v-if="$q.screen.width > 700"></footer-componente>
	</q-layout>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
const FooterComponente = defineAsyncComponent(() => import('components/admin/layout/FooterComponent.vue')) 

</script>
