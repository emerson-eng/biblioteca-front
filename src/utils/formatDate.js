import { date } from 'quasar'
import moment from 'moment'
import 'moment/dist/locale/es'
moment.locale('es')

export default function () {
	// Quasar
	const formatDate = (timeStamp) => {
		return date.formatDate(timeStamp, 'DD-MM-YYYY')
	}

	const formatDatePlan = (timeStamp) => {
		return date.formatDate(timeStamp, 'DD/MM/YYYY')
	}

	const formatDateToInput = (timeStamp) => {
		return date.formatDate(timeStamp, 'YYYY-MM-DD')
	}

	const formatTimeToInpu = (timeStamp) => {
		return date.formatDate(timeStamp, 'HH:mm:ss')
	}

	const formatCurrentDate = () => {
		const timeStamp = Date.now()
		return date.formatDate(timeStamp, 'YYYY-MM-DD')
	}

	const formatCurrentTime = () => {
		const timeStamp = Date.now()
		return date.formatDate(timeStamp, 'HH:mm:ss')
	}

	const formatDateTime = (timeStamp) => {
		return date.formatDate(timeStamp, 'D MMM YYYY HH:mm')
	}

	const getCurrentYear = () => {
		const timeStamp = Date.now()
		return date.formatDate(timeStamp, 'YYYY')
	}

	const differenceDates = (date1, date2, unit = 'days') => {
		const diff = date.getDateDiff(date1, date2, unit)
		return diff
	}

	const addToDate = (time, addTime) => {
		return date.addToDate(time, addTime)
	}

	const subtractFromDate = (time, addTime) => {
		return date.subtractFromDate(time, addTime)
	}

	const formatMonth = (time) => {
		const [year, month] = time.split('-')
		const monthFormat = date.formatDate(`${year}-${month}-01 00:00:00`, 'MMM')
		return `${monthFormat} ${year}`;
	}

	// moment
	const formatDateFromNow = (timeStamp) => {
		return moment(timeStamp).fromNow()
	}

	const getDayDiff = (timeStamp1, timeStamp2) => {
		const date1 = moment(timeStamp1)
		const date2 = moment(timeStamp2)

		return date1.diff(date2, 'days')
	}

	return {
		// quasar
		formatDate,
		formatDatePlan,
		formatDateToInput,
		formatTimeToInpu,
		formatCurrentDate,
		formatCurrentTime,
		formatDateTime,
		getCurrentYear,
		differenceDates,
		addToDate,
		subtractFromDate,
		formatMonth,
		// moment
		formatDateFromNow,
		getDayDiff,
	}
}