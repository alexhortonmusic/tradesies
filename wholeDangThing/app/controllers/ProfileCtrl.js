'use strict';

app.controller('ProfileCtrl', function($scope, $location, ItemFactory, UserFactory, localStorageService) {
	let currentUser = localStorageService.get("currentUser");
	$scope.user = currentUser;
	$scope.showNewItem = false;
  $scope.editing = false;

	ItemFactory.getItems()
	.then(function(itemsCollection) {
		$scope.items = itemsCollection;
    $scope.itemNum = $scope.items.length;
	})
  .then(function(){
    console.log($scope.items);
  })

	ItemFactory.getWishItems()
	.then(function(wishCollection) {
		$scope.wishItems = wishCollection;
	})



  $scope.createItem = function(){
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
