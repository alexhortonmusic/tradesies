'use strict';

app.controller('ProfileCtrl', function($scope, $location, ItemFactory, UserFactory, localStorageService) {
	// ItemFactory.getAllItems()
	// .then(function(items){
	// 	$scope.itemNumber = items.length;
	// 	console.log("item num", $scope.itemNumber)
	// })
	ItemFactory.getItems()
	.then(function(itemsCollection) {
		$scope.items = itemsCollection;
    $scope.pinNum = $scope.items.length;
	})
  .then(function(){
    console.log($scope.items);
  })

  let currentUser = localStorageService.get("currentUser");
	$scope.user = currentUser;

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
        $scope.pinNum = $scope.items.length;
  		});
    });
  };
  $scope.showNewItem = false;

  $scope.Check = function() {
    console.log('did this work?');
  }


  $scope.Remove = function (removeId) {
    ItemFactory.deleteItem(removeId)
  	.then(function () {
  		ItemFactory.getItems()
  		.then(function (itemsCollection) {
    		$scope.items = itemsCollection;
        $scope.pinNum = $scope.items.length;
  		});
  	});
  };
});
