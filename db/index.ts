import '@kitsonk/xhr'

// @deno-types="https://cdn.skypack.dev/-/firebase@v8.7.0-MrU9zUCxcEMCl2U7Tuz6/dist=es2020,mode=types/index.d.ts"
import firebase from 'firebase/app'
import 'firebase/database'

import firebaseConfig from './firebaseConfig.ts'

const firebaseApp = firebase.initializeApp(firebaseConfig, 'hacker-news')

const db = firebase.database(firebaseApp).ref('v0')

export default db
