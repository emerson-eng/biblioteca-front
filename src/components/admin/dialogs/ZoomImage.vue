<template>
	<q-dialog v-model="dialog" :maximized="fullscreen" transition-show="slide-up" transition-hide="slide-down">
		<q-card :style="styleScreen()" class="q-px-sm q-pb-sm">
			<q-card-section class="row items-center q-pb-none">
				<div class="text-h6">Imagen</div>
				<q-space />
				<q-btn @click="fullscreen = !fullscreen" dense flat icon="crop_square" />
				<q-btn @click="closeDialog" dense flat icon="close" />
			</q-card-section>

			<q-card-section>
				<q-img v-if="image"
				:src="urlImg + image"
				spinner-color="primary"
				width="100%"
				/>
				<q-img v-else
				src="/images/11-Libro.jpg"
				spinner-color="primary"
				width="100%"
				/>
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script setup>
import { ref, inject } from 'vue'
import { urlImg } from 'boot/axios'

const props = defineProps({
	image: {
		type: String,
		default: '',
	},
})

const fullscreen = ref(false)

const dialog = inject('dialogZoomImage')

const closeDialog = () => {
	fullscreen.value = false
	dialog.value = false
}

const styleScreen = () => {
	if (fullscreen.value)
		return ''
	else
		return 'width: 600px; max-width: 800px;'
}
</script>
