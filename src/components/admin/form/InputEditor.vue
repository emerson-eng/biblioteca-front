<template>
	<div>
		<q-editor v-if="defaultEditor" 
		v-model="qEditor"
		placeholder="Ingrese un texto y personalízalo como en Word"
		/>

		<q-editor v-else
		v-model="qEditor"
		placeholder="Ingrese un texto y personalízalo como en Word"
		:toolbar="toolbar"
		:fonts="{
			arial: 'Arial',
			arial_black: 'Arial Black',
			comic_sans: 'Comic Sans MS',
			courier_new: 'Courier New',
			impact: 'Impact',
			lucida_grande: 'Lucida Grande',
			times_new_roman: 'Times New Roman',
			verdana: 'Verdana',
		}"
		/>
	</div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useQuasar } from 'quasar'

export default defineComponent({
	name: 'EditorComponent',
	
	props: { 
		'modelValue': String, 
		'defaultEditor': {
			type: Boolean,
			default: true,
		},
	},

	setup(props, { emit }) {
		const $q = useQuasar()

		const qEditor = computed({ 
			get: () => props.modelValue, 
			set: (value) => emit('update:modelValue', value) 
		}) 

		const toolbar = ref([
			[
			{
				label: $q.lang.editor.align,
				icon: $q.iconSet.editor.align,
				fixedLabel: true,
				list: 'only-icons',
				options: ['left', 'center', 'right', 'justify']
			},
			{
				label: $q.lang.editor.align,
				icon: $q.iconSet.editor.align,
				fixedLabel: true,
				options: ['left', 'center', 'right', 'justify']
			}
			],
			['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
			['token', 'hr', 'link', 'custom_btn'],
			['print', 'fullscreen'],
			[
			{
				label: $q.lang.editor.formatting,
				icon: $q.iconSet.editor.formatting,
				list: 'no-icons',
				options: [
				'p',
				'h1',
				'h2',
				'h3',
				'h4',
				'h5',
				'h6',
				'code'
				]
			},
			{
				label: $q.lang.editor.fontSize,
				icon: $q.iconSet.editor.fontSize,
				fixedLabel: true,
				fixedIcon: true,
				list: 'no-icons',
				options: [
				'size-1',
				'size-2',
				'size-3',
				'size-4',
				'size-5',
				'size-6',
				'size-7'
				]
			},
			{
				label: $q.lang.editor.defaultFont,
				icon: $q.iconSet.editor.font,
				fixedIcon: true,
				list: 'no-icons',
				options: [
				'default_font',
				'arial',
				'arial_black',
				'comic_sans',
				'courier_new',
				'impact',
				'lucida_grande',
				'times_new_roman',
				'verdana'
				]
			},
			'removeFormat'
			],
			['quote', 'unordered', 'ordered', 'outdent', 'indent'],

			['undo', 'redo'],
			['viewsource']
			])


		return {
			// Pinia

			// Function

			// Othres
			qEditor,
			toolbar,

		}
	}

})
</script>
