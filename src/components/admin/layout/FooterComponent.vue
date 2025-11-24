<template>
	<q-footer elevated class="bg-primary">
		<q-toolbar>
			<q-toolbar-title class="text-center text-subtitle2">
				© Copyright {{ getCurrentYear() }}. Todos los derechos reservados.
			</q-toolbar-title>
		</q-toolbar>
	</q-footer>
</template>

<style scoped>
</style>

<script setup>
import useFormartDate from 'utils/formatDate'

const { getCurrentYear } = useFormartDate()

</script>

