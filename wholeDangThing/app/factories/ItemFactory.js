"use strict";

app.factory("ItemFactory", function(FirebaseURL, $q, $http, localStorageService){

  let getItems = function() {
		let items = [];
    let currentUser = localStorageService.get("currentUser");
		return $q(function(resolve, reject) {
			$http.get(`${FirebaseURL}/gear-item.json?orderBy="uid"&equalTo="${currentUser.uid}"`)
			.success(function(itemsObject) {
				let itemsCollection = itemsObject;
				// create array from object and loop thru keys - saving fb key for each item inside the obj as an id property
				Object.keys(itemsCollection).forEach(function(key){
					itemsCollection[key].id=key;
					items.push(itemsCollection[key]);
				});
				resolve(items);
			})
			.error(function(error) {
				reject(error);
			});
		});
	};

	let saveItemsId = function(items) {
		console.log(items);
		return $q(function(resolve, reject) {
      $http.patch(`${FirebaseURL}/gear-item/${items[0].id}.json`, JSON.stringify({"id": `${items[0].id}`}))
      .success(function(ObjFromFirebase) {
        console.log(ObjFromFirebase);
        resolve(ObjFromFirebase);
      })
      .error(function (error) {
        reject (error);
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

  let deleteItem = function(removeId) {
    let itemUrl = FirebaseURL + "/gear-item/" + removeId + ".json";
    return $q(function(resolve, reject) {
      $http.delete(itemUrl)
      .success(function() {
        resolve();
      });
    });
  };
	return {getItems, saveItemsId, addItem, deleteItem}
});
