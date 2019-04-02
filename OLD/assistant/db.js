var admin = require("firebase-admin");

var serviceAccount = require("./FIREACCESS.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://assistant-bot-dab4e.firebaseio.com"
});
admin.firestore().settings({timestampsInSnapshots: true})
const db = admin.firestore()
exports.database = db;
