<template>
	<div class="row justify-center items-center bg-white q-mx-xs" :style="height()">
		<div class="row justify-center items-center rounded-borders	" style="height: 100px; width: 100px;">
			<q-spinner
			color="primary"
			size="5em"
			/>
		</div>
	</div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const props = defineProps({
	isCenter: {
		type: Boolean,
		default: false,
	}
})

const $q = useQuasar()

const height = () => {
	if(!props.isCenter)
		return 'height: 10px;'
	else
		return `height: ` + $q.screen.height/2 + 'px;'
}

</script>
