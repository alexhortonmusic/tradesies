'use strict';

app.factory("TradeFactory", function(FirebaseURL, $q, $http, localStorageService) {

  let createMessage = function(newMessage) {
    return $q(function(resolve, reject) {
      $http.post(`${FirebaseURL}/message.json`, JSON.stringify(newMessage))
      .success(function(ObjFromFirebase) {
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
        resolve(sentMessages);
      })
      .error(function(error) {
        reject(error);
      });
    });
  };

  let getAcceptedTrades = function () {
    let acceptedTrades = [];
    let currentUser = localStorageService.get("currentUser");
    return $q(function(resolve, reject) {
      $http.get(`${FirebaseURL}/message.json?orderBy="recipientId"&equalTo="${currentUser.uid}--accept"`)
      .success(function(acceptedTradeObj) {
        let acceptedTradeCollection = acceptedTradeObj;
        Object.keys(acceptedTradeCollection).forEach(function(key) {
          acceptedTradeCollection[key].id = key;
          acceptedTrades.push(acceptedTradeCollection[key]);
        });
        console.log(acceptedTrades);
        resolve(acceptedTrades);
      })
      .error(function(error) {
        reject(error);
      });
    });
  };

  let getSentAcceptedTrades = function () {
    let sentAcceptedTrades = [];
    let currentUser = localStorageService.get("currentUser");
    return $q(function(resolve, reject) {
      $http.get(`${FirebaseURL}/message.json?orderBy="senderId"&equalTo="${currentUser.uid}--accept"`)
      .success(function(sentAcceptedTradeObj) {
        let sentAcceptedTradeCollection = sentAcceptedTradeObj;
        Object.keys(sentAcceptedTradeCollection).forEach(function(key) {
          sentAcceptedTradeCollection[key].id = key;
          sentAcceptedTrades.push(sentAcceptedTradeCollection[key]);
        });
        resolve(sentAcceptedTrades);
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

  let acceptTrade = function (messageId, senderUid) {
    let currentUser = localStorageService.get("currentUser");
    return firebase.database().ref('message/' + messageId).update({
      status: 'Accepted',
      recipientEmail: currentUser.email,
      recipientName: currentUser.displayName,
      recipientImg: currentUser.photoURL,
      recipientId: currentUser.uid + '--accept',
      senderId: senderUid + '--accept'
    });
  };

  let shareInfo = function (messageId) {
    return $q(function(resolve, reject) {
      $http.get(`${FirebaseURL}/message/${messageId}.json`)
      .success(function(messageObject) {
        let acceptedTradeInfo = messageObject;
        console.log("Accepted Trade Info", acceptedTradeInfo);
        resolve(acceptedTradeInfo);
      })
      .error(function(error) {
        reject(error);
      });
    });
  };


  return {createMessage, getReceivedMessages, getSentMessages, getAcceptedTrades, getSentAcceptedTrades, cancelTrade, acceptTrade, shareInfo};
})
