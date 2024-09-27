<template>
	<div class="qr-container">
		<div v-if="error" class="text-red text-subtitle1 q-mb-sm">
			{{ error }}
		</div>
		<div class="camera-container">
			<qrcode-stream 
			:track="paintBoundingBox" 
			@detect="onDetect" 
			@error="onError" 
			/>
		</div>
	</div>
</template>

<style scoped>
.qr-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
}
.camera-container {
	width: 100%;
	height: 400px;
	aspect-ratio: 1 / 1; 
	overflow: hidden; 
	border: 2px solid black;
}
.camera-container :deep(video) {
	width: 100%;
	height: 100%;
	object-fit: cover;
}
</style>

<script setup>
import { ref } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'

const emit = defineEmits(['resultQR'])

const error = ref('')

function onDetect(detectedCodes) {
	emit('resultQR', JSON.stringify(detectedCodes.map(code => code.rawValue)))
}

function paintBoundingBox(detectedCodes, ctx) {
	for (const detectedCode of detectedCodes) {
		const {
			boundingBox: { x, y, width, height }
		} = detectedCode
		ctx.lineWidth = 2
		ctx.strokeStyle = '#007bff'
		ctx.strokeRect(x, y, width, height)
	}
}

function onError(err) {
	if (err.name === 'NotAllowedError') 
		error.value = 'ERROR: No tienes permiso para usar la cámara'
	else if (err.name === 'NotFoundError') 
		error.value = 'ERROR: No se encontró ninguna cámara'
	else if (err.name === 'NotSupportedError') 
		error.value = 'ERROR: La página no está siendo servida a través de HTTPS'
	else if (err.name === 'NotReadableError') 
		error.value = 'ERROR: La cámara ya está siendo usada'
	else if (err.name === 'OverconstrainedError') 
		error.value = 'ERROR: Las cámaras instaladas no son adecuadas'
	else if (err.name === 'StreamApiNotSupportedError') 
		error.value = 'ERROR: Este navegador no soporta la captura de stream'
	else if (err.name === 'InsecureContextError') 
		error.value = 'ERROR: El acceso a la cámara solo está permitido en un contexto seguro. Utilice HTTPS en lugar de HTTP'
	else 
		error.value = err.message
}
</script>
