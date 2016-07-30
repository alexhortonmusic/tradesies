'use strict';

app.factory("UserFactory", function($http,$q,FirebaseURL){
  // gets current user's gear list
		let getUserList = function(){
  		let users = [];
      return $q(function(resolve, reject) {
        $http.get(`${FirebaseURL}/users.json`)
        .success(function(usersArray) {
          if (usersArray) {
            let userList = usersArray;
            Object.keys(userList).forEach(function(key) {
              userList[key].id=key;
              users.push(userList[key]);
            });
          }
          resolve(users)
        })
        .error(function(error) {
          reject(error);
        })
      });
    }

    // creates a new user if they have not logged in before
	  let createUser = function(newUser) {
    return $q(function(resolve, reject) {
      $http.post(`${FirebaseURL}/users.json`, ////////this posts to FB database///////////
        JSON.stringify(newUser))
      .success(function(ObjFromFirebase) {
        resolve(ObjFromFirebase)    ////////this posts to FB database///////////
      })
      .error(function(error) {
        reject(error);
      });
    });
  };

	return {getUserList, createUser}
})
