'use strict';

app.controller('ListCtrl', function($scope, $location, ItemFactory, UserFactory, localStorageService, TradeFactory) {
  let currentUser = localStorageService.get("currentUser");
	$scope.user = currentUser;

  ItemFactory.getAllItems()
  .then(function(allItemsCollection){
    $scope.allItems = allItemsCollection;
    $scope.allItemsNumber = $scope.allItems.length;
    console.log("all item num", $scope.allItemsNumber);
  });

  ItemFactory.getItems()
  .then(function(itemsCollection) {
    $scope.items = itemsCollection;
    $scope.itemNum = $scope.items.length;
  })
  .then(function(){
  });

  // assigns ownerId so message can be directed based on user who owns item
	$scope.beginMessage = function(item) {
		$scope.ShowNewMessage = true;
		ownerId = item.ownerId;
		console.log('ownerId', ownerId);
	};

	// user hits 'Send Request' button
	$scope.sendMessage = function () {
    let newMessage = {
        itemToTradeFor: $scope.messageTradeFor,
				itemToTradeWith: $scope.messageTradeWith,
        imgUrl: $scope.messageUrl,
				senderId: currentUser.uid,
				recipientId: ownerId,
				status: "Pending",
				senderEmail: currentUser.email,
				senderName: currentUser.displayName,
				senderImg: currentUser.photoURL
    };
		TradeFactory.createMessage(newMessage)
		.then(function() {
			$scope.ShowNewMessage = false;
			$scope.messageTradeFor = '';
			$scope.messageUrl = '';
			$scope.messageTradeWith = '';
		});
  }

  

  $scope.addWish = function (item) {
    let productId = item.id;
    let wishUrl = item.url;
    let wishTitle = item.title;
    let wishDesc = item.description;
    let ownerId = item.uid;
    let wishItem = {
      url: `${wishUrl}`,
      title: `${wishTitle}`,
      description: `${wishDesc}`,
      ownerId: `${ownerId}`,
      uidWish: currentUser.uid,
      itemId: `${productId}`
    };
    ItemFactory.addWishItem(wishItem)
    .then(function() {
      console.log('Added wish item');
    })
  };

});
