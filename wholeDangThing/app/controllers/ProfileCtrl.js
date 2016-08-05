'use strict';

app.controller('ProfileCtrl', function($scope, $location, ItemFactory, UserFactory, localStorageService, TradeFactory) {
	let currentUser = localStorageService.get("currentUser");
	let ownerId;
	$scope.user = currentUser;
	$scope.ShowNewItem = false;
  $scope.editing = [];
	$scope.ShowNewMessage = false;

	ItemFactory.getItems()
	.then(function(itemsCollection) {
		$scope.items = itemsCollection;
    $scope.itemNum = $scope.items.length;
	})
  .then(function(){
    console.log($scope.items);
  });

	ItemFactory.getWishItems()
	.then(function(wishCollection) {
		$scope.wishItems = wishCollection;
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


  $scope.createItem = function() {
    let currentUser = localStorageService.get("currentUser");
    let newItem = {
        title: $scope.itemTitle,
        url: $scope.itemUrl,
        uid: currentUser.uid,
        description: $scope.itemDescription
    };
    ItemFactory.addItem(newItem)
    .then(function () {
      $scope.ShowNewItem = false;
			$scope.itemUrl = '';
			$scope.itemDescription = '';
			$scope.itemTitle = '';
    	ItemFactory.getItems()
      .then(function (itemsCollection) {
  			$scope.items = itemsCollection;
        $scope.itemNum = $scope.items.length;
  		});
    });
  };

  $scope.showEdit = function ($index) {
		$scope.editing[$index] = true;
		console.log($scope.editing);
	}

  $scope.Edit = function (itemId,event, $index) {
    ItemFactory.editItem(itemId, event)
    .then(function() {
			$scope.editing[$index] = false;
      ItemFactory.getItems()
      .then(function(itemsCollection) {
        $scope.items = itemsCollection;
        $scope.itemNum = $scope.items.length;
      })
    })
  }

  $scope.Remove = function (removeId) {
    ItemFactory.deleteItem(removeId)
  	.then(function () {
  		ItemFactory.getItems()
  		.then(function (itemsCollection) {
    		$scope.items = itemsCollection;
        $scope.itemNum = $scope.items.length;
  		});
  	});
  };

  $scope.wishRemove = function (removeId) {
    ItemFactory.deleteWishItem(removeId)
  	.then(function () {
			ItemFactory.getWishItems()
			.then(function(wishCollection) {
				$scope.wishItems = wishCollection;
  		});
  	});
  };



});
