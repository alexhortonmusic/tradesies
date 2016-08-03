'use strict';

app.controller('MessageCtrl', function($scope, $location, ItemFactory, UserFactory, localStorageService, MessageFactory) {
  let currentUser = localStorageService.get("currentUser");
  $scope.user = currentUser;

  console.log(currentUser);

  MessageFactory.getReceivedMessages ()
  .then(function(messageCollection) {
    $scope.messages = messageCollection;
    $scope.messageNum = $scope.messages.length;
  });

  MessageFactory.getSentMessages ()
  .then(function(sentMessageCollection) {
    $scope.sentMessages = sentMessageCollection;
    $scope.sentMessageNum = $scope.sentMessages.length;
  });

  // sender cancels trade proposal
  $scope.cancelTrade = function (removeId) {
    MessageFactory.cancelTrade(removeId)
    .then(function () {
      MessageFactory.getSentMessages ()
      .then(function(sentMessageCollection) {
        $scope.sentMessages = sentMessageCollection;
        $scope.sentMessageNum = $scope.sentMessages.length;
      });
    });
  };

  // recipient rejects trade offer. This cancels trade
  $scope.rejectTrade = function (removeId) {
    MessageFactory.cancelTrade(removeId)
    .then(function () {
      MessageFactory.getReceivedMessages ()
      .then(function(messageCollection) {
        $scope.messages = messageCollection;
        $scope.messageNum = $scope.messages.length;
      });
    });
  };

  // recipent accepts trade. This tells sender that trade is accepted and sends contact info to sender
  $scope.acceptTrade = function(messageId) {
    MessageFactory.acceptTrade(messageId)
    .then(function() {
      MessageFactory.getReceivedMessages ()
      .then(function(messageCollection) {
        $scope.messages = messageCollection;
        $scope.messageNum = $scope.messages.length;
      });
    })
  }

})
