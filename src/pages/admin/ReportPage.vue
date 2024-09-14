<template>
	<q-page padding>
		<div class="full-width">
			<q-tabs v-model="tab" :breakpoint="0" dense inline-label mobile-arrows align="left" class="shadow-2 bg-white">
				<q-tab name="GraphicTab" label="Grafico" />
			</q-tabs>

			<q-separator />

			<q-tab-panels v-model="tab" animated class="shadow-2">
				<q-tab-panel name="GraphicTab" class="q-pa-none">
					<graphic-tab />
				</q-tab-panel>
			</q-tab-panels>
		</div>
	</q-page>
</template>

<script setup>
import { ref } from 'vue'
import GraphicTab from 'components/admin/reports/GraphicTab.vue'

const tab = ref('GraphicTab')

</script>
