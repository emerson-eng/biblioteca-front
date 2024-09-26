<template>
	<div>
		<p class="text-red text-subtitle1">{{ error }}</p>
		<p>Last result: <b>{{ result }}</b></p>

		<div style="border: 2px solid black">
			<qrcode-stream 
			:track="paintBoundingBox" 
			@detect="onDetect" 
			@error="onError" 
			/>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'

const result = ref('')
const error = ref('')

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
	console.log('error', err)
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

function onDetect(detectedCodes) {
	result.value = JSON.stringify(detectedCodes.map(code => code.rawValue))
}
</script>
