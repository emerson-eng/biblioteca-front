<template>
	<q-btn @click="openNotification" round dense flat icon="notifications">
		<q-badge :color="nNotificationsNew == 0 ? 'light-blue' : 'red'" text-color="white" floating>
			{{ nNotificationsNew }}
		</q-badge>
		<q-tooltip>Notificaciones</q-tooltip>

		<q-menu auto-close :offset="[110, 0]">
			<q-list :style="$q.screen.width < 700 ? '' : 'width: 320px'">
				<q-item-label header>Notificaciones</q-item-label>
				<span v-for="notification in notifications" :key="notification.id">
					<q-item :clickable="notification.link ? true : false" :to="notification.link ? notification.link : ''">
						<q-item-section>
							<q-item-label class="text-bold q-pb-sm">{{ notification.title }}</q-item-label>
							<q-item-label>
								<span v-html="notification.description"></span>
							</q-item-label>
							<div class="q-mt-xs">
								<span class="text-caption">
									{{ formatDateFromNow(notification.created_at) }}
								</span>
								<span class="q-pl-md">
									<q-badge
									v-if="notification.stateAux === 0"
									rounded
									color="blue"
									/>
								</span>
							</div>
						</q-item-section>
					</q-item>
					<q-separator class="q-my-xs" />
				</span>

				<q-item v-if="notifications.length === 0">
					<q-item-section>
						<q-item-label caption class="center">
							No hay notificaciones
						</q-item-label>
					</q-item-section>
				</q-item>

				<q-item v-if="!seeMore && notifications.length === 5">
					<q-item-section>
						<q-btn
						@click="getNotifications(10, true)"
						flat
						no-caps
						label="Ver más"
						/>
					</q-item-section>
				</q-item>
			</q-list>
		</q-menu>
	</q-btn>
</template>

<style scoped>
.center {
	margin: auto;
	width: 50%;
	padding: 10px;
}
</style>

<style>
.q-item__label p {
	margin: 0 0 4px !important;
}
</style>

<script setup>
import { ref, computed } from 'vue'
import { api } from 'boot/axios'
import { useQuasar, LocalStorage, SessionStorage } from 'quasar'
import { useRouter } from 'vue-router'
import { useUserStore } from 'stores/user'
import useHttpService from 'utils/httpService'
import useFormartDate from 'utils/formatDate'

const $q = useQuasar()
const router = useRouter()
const userPinia = useUserStore()
const { put } =  useHttpService()
const { formatDateFromNow } = useFormartDate()

const notifications = ref([])
const seeMore = ref(false)

const nNotificationsNew = computed(() => {
	let n = 0;
	for (let i = 0; i < notifications.value.length; i++) {
		if (notifications.value[i].state === 0) 
			n++
	}
	return n
})

const logout = () => {
	LocalStorage.remove('token')
	LocalStorage.remove('user')
	SessionStorage.clear()
	router.push({name: 'Index'})
	window.location.reload(true)
}

const getNotifications = (limit, seemore = false) => {
	const url = `user/notification/${limit}`
	api.get(url, {
		headers: { 
			Authorization: `Bearer ${userPinia.token}`,
		}
	}).then((response) => {
		console.log('notifications', response)
		notifications.value = response.data.data
		seeMore.value = seemore
		for(let i = 0; i < notifications.value.length; i++) {
			if(notifications.value[i].state === 0)
				notifications.value[i].stateAux = 0
			else 
				notifications.value[i].stateAux = 1
		}
	}).catch(error => {
		if(error.response.status === 401 && error.response.statusText == 'Unauthorized') {
			logout()
		}
	})
}
getNotifications(5)

const openNotification = () => {
	if (nNotificationsNew.value > 0) {
		let form = {
			notifications: [],
		}
		for (let i = 0; i < notifications.value.length; i++) {
			if(notifications.value[i].state === 0)
				form.notifications.push(notifications.value[i]);
			notifications.value[i].state = 1;
		}
		put('user/notification/1', form, false).then((response) => {
			console.log('notification', response)
		})
	}
}
</script>