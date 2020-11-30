import firebase from 'firebase';


class BackendFire {
  messagesRef = null;
  uid = '';
  // initialize Firebase Backend
  constructor() {
    firebase.initializeApp({
      apiKey: "AIzaSyAYO2yzYymcCvozA8C7SlZtf5_U2vp3FfY",
      authDomain: "hamrahsingal.firebaseapp.com",
      databaseURL: "https://hamrahsingal.firebaseio.com",
      projectId: "hamrahsingal",
      storageBucket: "hamrahsingal.appspot.com",
      messagingSenderId: "881993537793",
      appId: "1:881993537793:web:b907554ade6f7a1e2b6300",
      measurementId: "G-YXEXV6Q3CZ"
    });
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setUid(user.uid);
      } else {
        firebase.auth().signInAnonymously().catch((error) => {
          alert(error.message);
        });
      }
    });
  }
  setUid(value) {
    this.uid = value;
  }
  getUid() {
    return this.uid;
  }
  // retrieve the messages from the Backend
  loadMessages(callback) {
    this.messagesRef = firebase.database().ref('messages');
    this.messagesRef.off();
    const onReceive = (data) => {
      const message = data.val();
      callback({
        _id: data.key,
        text: message.text,
        createdAt: new Date(message.createdAt),
        user: {
          _id: message.user._id,
          name: message.user.name,
        },
      });
    };
    this.messagesRef.limitToLast(20).on('child_added', onReceive);
  }
  // send the message to the Backend
  sendMessage(message) {
    for (let i = 0; i < message.length; i++) {
      this.messagesRef.push({
        text: message[i].text,
        user: message[i].user,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      });
    }
  }
  // close the connection to the Backend
  closeChat() {
    if (this.messagesRef) {
      this.messagesRef.off();
    }
  }
}

export default new BackendFire();