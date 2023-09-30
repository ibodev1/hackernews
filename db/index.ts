import "https://deno.land/x/xhr@0.1.1/mod.ts";

// @deno-types="https://cdn.skypack.dev/-/firebase@v8.7.0-MrU9zUCxcEMCl2U7Tuz6/dist=es2020,mode=types/index.d.ts"
import firebase from "https://cdn.skypack.dev/firebase@8.7.0/app";
import "https://cdn.skypack.dev/firebase@8.7.0/database";

import firebaseConfig from "./firebaseConfig.ts";

const firebaseApp = firebase.initializeApp(firebaseConfig, "hacker-news");

const db = firebase.database(firebaseApp).ref("v0");

export default db;