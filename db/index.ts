import '@kitsonk/xhr';
import { installGlobals } from 'virtualstorage';
installGlobals();

// @deno-types="https://cdn.skypack.dev/-/firebase@v8.10.1-bgVDWWI0b6V8DPkEFxe0/dist=es2020,mode=types/index.d.ts"
import firebase from 'firebase/app';
import 'firebase/database';

import firebaseConfig from './firebase-config.ts';

const firebaseApp = firebase.initializeApp(firebaseConfig, 'hacker-news');

const db = firebase.database(firebaseApp).ref('v0');

export default db;
