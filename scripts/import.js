/* eslint-disable @typescript-eslint/no-var-requires */
// Imports
const firestoreService = require('firestore-export-import');
const serviceAccount = require('../serviceAccount.json');

// NOTE: run this with node scripts/import.js

// JSON To Firestore
const jsonToFirestore = async () => {
    try {
        console.log('Initialzing Firebase');
        await firestoreService.initializeApp(serviceAccount);
        console.log('Firebase Initialized');
        // import-data.json should be add the root level
        await firestoreService.restore('./import-data.json');
        console.log('Upload Success');
    } catch (error) {
        console.log(error);
    }
};

jsonToFirestore();
