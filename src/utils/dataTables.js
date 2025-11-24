import { Notify, exportFile } from 'quasar'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import { applyPlugin } from 'jspdf-autotable'
applyPlugin(jsPDF)

function wrapCsvValue (val, formatFn, row) {
	let formatted = formatFn !== void 0
	? formatFn(val, row)
	: val

	formatted = formatted === void 0 || formatted === null
	? ''
	: String(formatted)

	formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}

const filterColumns = (col, rows) => {
	let columnsExport = []
	for(let i = 0; i < col.length; i++) {
		if(col[i].name != 'row-number' && col[i].name != 'actions' && col[i].name != 'swith' && col[i].name != 'imageZoom' && col[i].name != 'additionalColumn' && col[i].name != 'additionalColumn2' && col[i].name != 'additionalColumnBadge' && col[i].name != 'additionalColumnBadgeCertificate' && col[i].name != 'additionalColumnModules' && col[i].name != 'actionanother' && col[i].name != 'actionanotherone') {
			columnsExport.push(col[i])
		}
	}

	let columnsFunct = []
	for(let i = 0; i < col.length; i++) {
		if(typeof col[i]['field'] === 'function')
			columnsFunct.push(col[i])
	}

	let rowsExport = []
	for(let i = 0; i < rows.length; i++) {
		let item = { ...rows[i] }
		for(let j = 0; j < columnsFunct.length; j++) {
			item[columnsFunct[j].name] = columnsFunct[j].field(item)
		}
		rowsExport.push(item)
	}
	return { columnsExport, rowsExport }
}

export default function () {

	const ExportTableCSV = (columns, rows, exportName) => {
		const { columnsExport } = filterColumns(columns, rows)

		const content = [columnsExport.map(col => wrapCsvValue(col.label))].concat(
			rows.map(row => columnsExport.map(col => wrapCsvValue(
				typeof col.field === 'function'
				? col.field(row)
				: row[ col.field === void 0 ? col.name : col.field ],
				col.format,
				row
				)).join(','))
			).join('\r\n')

		const status = exportFile(
			exportName + '-export.csv',
			content,
			'text/csv'
			)

		if (status !== true) {
			Notify.create({
				message: 'Navegador denegó la descarga de archivo ...',
				color: 'negative',
				icon: 'warning'
			})
		}
	}

	function ExportToPDF(columns, rows, exportName) {
		const { columnsExport, rowsExport } = filterColumns(columns, rows)
		let columnsHeard = []
		for(let i = 0; i < columnsExport.length; i++) {
			columnsHeard.push({
				title: columnsExport[i]['label'],
				dataKey: columnsExport[i]['name'],
			})
		}

		let orientation = 'p'
		if(columns.length > 7)
			orientation = 'l'

		const doc = new jsPDF({ orientation: orientation })
		doc.autoTable({
			head: [columnsHeard.map(column => column.title)],
			body: rowsExport.map(row => columnsHeard.map(column => row[column.dataKey])),
		})

		doc.save(exportName + '.pdf')
	}

	function ExportToExcel(columns, rows, exportName) {
		const { columnsExport, rowsExport } = filterColumns(columns, rows)
		let columnsHeard = []
		let columnsHeardAux = []
		for(let i = 0; i < columnsExport.length; i++) {
			columnsHeard.push(columnsExport[i]['label'])
			columnsHeardAux.push({
				title: columnsExport[i]['label'],
				dataKey: columnsExport[i]['name'],
			})
		}

		const sortedData = rowsExport.map(row => {
			const sortedRow = {}
			columnsHeardAux.forEach(item => {
				sortedRow[item.dataKey] = row[item.dataKey] || ''; 
			})
			return sortedRow
		})

		var myFile = exportName + '.xlsx'
		const wb = XLSX.utils.book_new()
		const ws = XLSX.utils.json_to_sheet([])

		XLSX.utils.sheet_add_aoa(ws, [columnsHeard])
		XLSX.utils.sheet_add_json(ws, sortedData, { origin: 'A2', skipHeader: true })
		XLSX.utils.book_append_sheet(wb, ws, 'Hoja1', true)

		XLSX.writeFile(wb, myFile)
	}

	return {
		ExportTableCSV,
		ExportToPDF,
		ExportToExcel,
	}
}