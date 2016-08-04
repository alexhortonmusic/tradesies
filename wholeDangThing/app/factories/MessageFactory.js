'use strict';

app.factory("MessageFactory", function(FirebaseURL, $q, $http, localStorageService) {

  let createMessage = function(newMessage) {
    return $q(function(resolve, reject) {
      $http.post(`${FirebaseURL}/message.json`, JSON.stringify(newMessage))
      .success(function(ObjFromFirebase) {
        console.log(ObjFromFirebase);
        resolve(ObjFromFirebase);
      })
      .error(function (error) {
         reject (error);
      });
    });
  };

  let getReceivedMessages = function() {
    let messages = [];
    let currentUser = localStorageService.get("currentUser");
    return $q(function(resolve, reject) {
      $http.get(`${FirebaseURL}/message.json?orderBy="recipientId"&equalTo="${currentUser.uid}"`)
      .success(function(messageObject) {
        let messageCollection = messageObject;
        // create array from object and loop thru keys - saving fb key for each message inside the obj as an id property
        Object.keys(messageCollection).forEach(function(key){
          messageCollection[key].id = key;
          messages.push(messageCollection[key]);
        });
        console.log("Received Messages", messages);
        resolve(messages);
      })
      .error(function(error) {
        reject(error);
      });
    });
  };

  let getSentMessages = function() {
    let sentMessages = [];
    let currentUser = localStorageService.get("currentUser");
    return $q(function(resolve, reject) {
      $http.get(`${FirebaseURL}/message.json?orderBy="senderId"&equalTo="${currentUser.uid}"`)
      .success(function(sentMessageObject) {
        let sentMessageCollection = sentMessageObject;
        // create array from object and loop thru keys - saving fb key for each message inside the obj as an id property
        Object.keys(sentMessageCollection).forEach(function(key){
          sentMessageCollection[key].id = key;
          sentMessages.push(sentMessageCollection[key]);
        });
        console.log("Sent Messages", sentMessages);
        resolve(sentMessages);
      })
      .error(function(error) {
        reject(error);
      });
    });
  };

  let cancelTrade = function(removeId) {
    let itemUrl = FirebaseURL + "/message/" + removeId + ".json";
    return $q(function(resolve, reject) {
      $http.delete(itemUrl)
      .success(function() {
        resolve();
      });
    });
  };

  let acceptTrade = function (messageId) {
    let currentUser = localStorageService.get("currentUser");
    return firebase.database().ref('message/' + messageId).update({
      status: 'Accepted',
      recipientEmail: currentUser.email,
      recipientName: currentUser.displayName,
      recipientImg: currentUser.photoURL
    });
  }




  return {createMessage, getReceivedMessages, getSentMessages, cancelTrade, acceptTrade};
})
