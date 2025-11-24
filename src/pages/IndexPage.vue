<template>
	<q-page padding>
		<div class="row items-center justify-center" :style="height()">
			<div class="col-12 col-md-6">
				<login-card />
			</div>
		</div>
	</q-page>
</template>

<script setup>
import { useQuasar } from 'quasar'
import LoginCard from 'components/admin/LoginCard.vue'

const $q = useQuasar()

const height = () => {
	let heightN = $q.screen.height-140
	return `height: ` + heightN + 'px;'
}
</script>
