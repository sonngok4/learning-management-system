const admin = require('firebase-admin');

// Đọc key từ file JSON được tải từ Firebase Console
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'your-bucket-name.appspot.com'
});

const bucket = admin.storage().bucket();

module.exports = { admin, bucket };