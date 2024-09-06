<template>
	<q-dialog v-model="dialogShowPDF" :maximized="fullscreen" transition-show="slide-up" transition-hide="slide-down" :persistent="$q.screen.width < 800 ? false : true" @show="isOpenDialog()">
		<q-card :style="styleScreen()" class="q-px-sm q-pb-sm">
			<q-card-section class="row items-center q-pb-none">
				<div class="text-h6">{{ titleDialog }}</div>
				<q-space />
				<q-btn @click="fullscreen = !fullscreen" dense flat icon="crop_square" />
				<q-btn @click="closeDialog" dense flat icon="close" />
			</q-card-section>

			<q-card-section>
				<div class="container">
					<iframe 
					class="responsive-iframe"  
					:src="urlPDF" 
					height="100%" width="100%" 
					/>
				</div>
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<style scoped>
.container2 {
	max-width: 50%;
	max-height: 70%;
	min-width: 400px;
	min-height: 600px;
	width: 100%;
	height: 100%;
}
.container {
	position: relative;
	overflow: hidden;
	width: 100%;
	padding-top: 97%
}
.responsive-iframe {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	width: 100%;
	height: 100%;
}
</style>

<script setup>
import { ref, inject } from 'vue'

const props = defineProps({
	urlPDF: {
		type: String,
		default: () => ''
	},
	titleDialog: {
		type: String,
		default: () => ''
	},
})

const fullscreen = ref(true)

const dialogShowPDF = inject('dialogShowPDF')

const closeDialog = () => {
	fullscreen.value = true
	dialogShowPDF.value = false
}

const styleScreen = () => {
	if (fullscreen.value)
		return ''
	else
		return 'width: 800px; max-width: 800px;'
}

const isOpenDialog = () => {
	fullscreen.value = true
}

</script>
