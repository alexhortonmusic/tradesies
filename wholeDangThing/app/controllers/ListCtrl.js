'use strict';

app.controller('ListCtrl', function($scope, $location, ItemFactory, UserFactory, localStorageService) {
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
