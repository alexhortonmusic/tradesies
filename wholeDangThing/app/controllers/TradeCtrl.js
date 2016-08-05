'use strict';

app.controller('TradeCtrl', function($scope, $location, ItemFactory, UserFactory, localStorageService, TradeFactory) {
  let currentUser = localStorageService.get("currentUser");
  $scope.user = currentUser;
  $scope.ShowAcceptedTrade = false;

  // gets all messages (both received and sent)
  TradeFactory.getReceivedMessages ()
  .then(function(messageCollection) {
    $scope.receivedMessages = messageCollection;
    TradeFactory.getSentMessages ()
    .then(function(sentMessageCollection) {
      $scope.sentMessages = sentMessageCollection;
      $scope.messages = messageCollection.concat(sentMessageCollection);
      $scope.messageNum = $scope.messages.length;
    })
  });

  TradeFactory.getAcceptedTrades ()
  .then(function(acceptedTrades) {
    TradeFactory.getSentAcceptedTrades ()
    .then(function(sentAcceptedTrades) {
      $scope.trades = acceptedTrades.concat(sentAcceptedTrades);
    });
  });

  // sender cancels trade proposal
  $scope.cancelTrade = function (removeId) {
    TradeFactory.cancelTrade(removeId)
    .then(function () {
      TradeFactory.getReceivedMessages ()
      .then(function(messageCollection) {
        $scope.receivedMessages = messageCollection;
        TradeFactory.getSentMessages ()
        .then(function(sentMessageCollection) {
          $scope.sentMessages = sentMessageCollection;
          $scope.messages = messageCollection.concat(sentMessageCollection);
          $scope.messageNum = $scope.messages.length;
        })
      })
    })
  };

  // recipient rejects trade offer. This cancels trade
  $scope.rejectTrade = function (removeId) {
    TradeFactory.cancelTrade(removeId)
    .then(function () {
      TradeFactory.getReceivedMessages ()
      .then(function(messageCollection) {
        $scope.receivedMessages = messageCollection;
        TradeFactory.getSentMessages ()
        .then(function(sentMessageCollection) {
          $scope.sentMessages = sentMessageCollection;
          $scope.messages = messageCollection.concat(sentMessageCollection);
          $scope.messageNum = $scope.messages.length;
        })
      })
    });
  };

  // recipent accepts trade. This tells sender that trade is accepted and sends contact info to sender
  $scope.acceptTrade = function(messageId, senderUid) {
    TradeFactory.acceptTrade(messageId, senderUid)
    .then(function() {
      TradeFactory.shareInfo(messageId)
      .then(function(acceptedTradeInfo) {
        $scope.tradeInfo = acceptedTradeInfo;
        console.log('trade', $scope.tradeInfo);
        $scope.ShowAcceptedTrade = true;
        TradeFactory.getReceivedMessages ()
        .then(function(messageCollection) {
          $scope.receivedMessages = messageCollection;
          TradeFactory.getSentMessages ()
          .then(function(sentMessageCollection) {
            $scope.sentMessages = sentMessageCollection;
            $scope.messages = $scope.receivedMessages.concat($scope.sentMessages);
            $scope.messageNum = $scope.messages.length;
            TradeFactory.getAcceptedTrades ()
            .then(function(acceptedTrades) {
              TradeFactory.getSentAcceptedTrades()
              .then(function(sentAcceptedTrades) {
                $scope.trades = acceptedTrades.concat(sentAcceptedTrades);
                console.log($scope.trades);
              });
            });
          });
        });
      });
    });
  };

});
