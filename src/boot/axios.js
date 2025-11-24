import { boot } from 'quasar/wrappers'
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.API || '/api/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// si tu backend devuelve imágenes, setear esta ruta
const urlImg = process.env.urlImg || ''

// versión opcional
const versionCode = process.env.versionCode || '1.0.0'

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { axios, api, urlImg, versionCode }
