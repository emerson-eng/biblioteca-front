<template>
	<q-dialog v-model="dialogGenerateQR" :maximized="$q.screen.width < 700 ? true : false" transition-show="slide-up" transition-hide="slide-down">
		<q-card style="width: 650px; max-width: 650px" class="q-px-sm">
			<q-card-section class="row items-center q-pb-none">
				<div class="text-h6 text-color-dark text-bold">Generar código QR</div>
				<q-space />
				<q-btn icon="close" flat round dense v-close-popup />
			</q-card-section>

			<q-card-section>
				<div class="column q-pb-md">
					<div class="text-center">
						<qrcode-vue 
						:value="textQR" 
						:size="350" 
						level="H" 
						render-as="canvas" 
						ref="qrRef"
						/>
					</div>

					<q-btn @click="downloadQR" rounded color="primary" icon="fa-solid fa-cloud-arrow-down" label="Descargar Código QR" class="q-mt-lg">
						<template v-slot:loading>
							<q-spinner-facebook />
						</template>
					</q-btn>
				</div>
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script setup>
import { ref, inject } from 'vue'
import QrcodeVue from 'qrcode.vue'

const props = defineProps({
	textQR: {
		type: String,
	},
})

const dialogGenerateQR = inject('dialogGenerateQR')

const qrRef = ref(null)

const downloadQR = () => {
	const canvas = qrRef.value.$el
	const image = canvas.toDataURL("image/png")
	const link = document.createElement('a')
	link.download = 'qrcode.png'
	link.href = image
	link.click()
}
</script>
