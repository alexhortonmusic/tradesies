"use strict";

app.factory("ItemFactory", function(FirebaseURL, $q, $http, localStorageService){

// gets all items EXCEPT user items
  let getAllItems = function () {
    let currentUser = localStorageService.get("currentUser");
    let allItems = [];
    return $q(function(resolve, reject) {
      $http.get(`${FirebaseURL}/gear-item.json`)
      .success(function(itemsObject) {
        let allItemsCollection = itemsObject;
        Object.keys(allItemsCollection).forEach(function(key) {
          allItemsCollection[key].id = key;
          if (allItemsCollection[key].uid !== currentUser.uid) {
            allItems.push(allItemsCollection[key]);
          };
        });
        console.log(allItems);
        resolve(allItems);
      });
    });
  };

  let getItems = function() {
		let items = [];
    let currentUser = localStorageService.get("currentUser");
		return $q(function(resolve, reject) {
			$http.get(`${FirebaseURL}/gear-item.json?orderBy="uid"&equalTo="${currentUser.uid}"`)
			.success(function(itemsObject) {
				let itemsCollection = itemsObject;
				// create array from object and loop thru keys - saving fb key for each item inside the obj as an id property
				Object.keys(itemsCollection).forEach(function(key){
					itemsCollection[key].id = key;
					items.push(itemsCollection[key]);
				});
				resolve(items);
			})
			.error(function(error) {
				reject(error);
			});
		});
	};

  let getWishItems = function() {
		let wishItems = [];
    let currentUser = localStorageService.get("currentUser");
		return $q(function(resolve, reject) {
			$http.get(`${FirebaseURL}wish-list.json?orderBy="uidWish"&equalTo="${currentUser.uid}"`)
			.success(function(itemsObject) {
				let wishCollection = itemsObject;
				// create array from object and loop thru keys - saving fb key for each item inside the obj as an id property
				Object.keys(wishCollection).forEach(function(key){
					wishCollection[key].id = key;
					wishItems.push(wishCollection[key]);
				});
				resolve(wishItems);
			})
			.error(function(error) {
				reject(error);
			});
		});
	};

  let addWishItem = function(newItem) {
    return $q(function(resolve, reject) {
      $http.post(`${FirebaseURL}/wish-list.json`, JSON.stringify(newItem))
      .success(function(ObjFromFirebase) {
        console.log(ObjFromFirebase);
        resolve(ObjFromFirebase);
      })
      .error(function (error) {
         reject (error);
      });
    });
  };

  let deleteWishItem = function(removeId) {
    let itemUrl = FirebaseURL + "/wish-list/" + removeId + ".json";
    return $q(function(resolve, reject) {
      $http.delete(itemUrl)
      .success(function() {
        resolve();
      });
    });
  };

  let addItem = function(newItem) {
    return $q(function(resolve, reject) {
      $http.post(`${FirebaseURL}/gear-item.json`, JSON.stringify(newItem))
      .success(function(ObjFromFirebase) {
        console.log(ObjFromFirebase);
        resolve(ObjFromFirebase);
      })
      .error(function (error) {
         reject (error);
      });
    });
  };

  let editItem = function(itemId, event) {
    let uniqueThing = event.currentTarget.id.split("-")[1];
    let titleVal = $('#title-' + uniqueThing).val();
    let descVal = $('#desc-' + uniqueThing).val();
    let urlVal = $('#url-' + uniqueThing).val();
    return firebase.database().ref('gear-item/' + itemId).update({
      title: `${titleVal}`,
      description: `${descVal}`,
      url: `${urlVal}`
    });
  };


  let deleteItem = function(removeId) {
    let itemUrl = FirebaseURL + "/gear-item/" + removeId + ".json";
    return $q(function(resolve, reject) {
      $http.delete(itemUrl)
      .success(function() {
        resolve();
      });
    });
  };
	return {getItems, addItem, deleteItem, editItem, getAllItems, getWishItems, addWishItem, deleteWishItem}
});
