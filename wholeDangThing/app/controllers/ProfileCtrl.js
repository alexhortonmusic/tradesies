'use strict';

app.controller('ProfileCtrl', function($scope, $location, ItemFactory, UserFactory, localStorageService, MessageFactory) {
	let currentUser = localStorageService.get("currentUser");
	let ownerId;
	$scope.user = currentUser;
	$scope.ShowNewItem = false;
  $scope.editing = false;
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

	$scope.beginMessage = function(item) {
		$scope.ShowNewMessage = true;
		ownerId = item.ownerId;
		console.log('ownerId', ownerId);
	};

	$scope.sendMessage = function () {
    let newMessage = {
        subject: $scope.messageSubject,
        imgUrl: $scope.messageUrl,
        messageid: currentUser.uid + ownerId,
        body: $scope.messageBody,
				senderId: currentUser.uid,
				recipientId: ownerId,
				status: "Pending",
				senderEmail: currentUser.email,
				senderName: currentUser.displayName,
				senderImg: currentUser.photoURL
    };
		MessageFactory.createMessage(newMessage)
		.then(function() {
			$scope.ShowNewMessage = false;
			$scope.messageSubject = '';
			$scope.messageUrl = '';
			$scope.messageBody = '';
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

  $scope.showEdit = function () {
		$scope.editing = true;
	}

  $scope.Edit = function (itemId,event) {
    ItemFactory.editItem(itemId, event)
    .then(function() {
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
