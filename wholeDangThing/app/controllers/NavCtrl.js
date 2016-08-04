'use strict';

app.controller("NavCtrl", function($scope, $location, UserFactory, localStorageService, $rootScope) {
  let currentUser = null;
  let userExists = false;

  $rootScope.searchText = {};
  $rootScope.searchText.search = "";

  $scope.login = function(){
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then(function(user){
      UserFactory.getUserList()
      .then(function(userList){
        currentUser = firebase.auth().currentUser;
        let currentUid = firebase.auth().currentUser.uid;
        console.log("currentUser", currentUser.displayName);
        let userArray = [];
        for (user in userList){
          let index = userList[user];
          if(currentUid === index.uid){
              userExists = true;
          }
        }
      })
      .then(function(){
        if(userExists === false){
          let userObject = {
            name: currentUser.displayName,
            email: currentUser.email,
            uid: currentUser.uid,
            avatar: currentUser.photoURL
          }
          console.log(userObject);
          UserFactory.createUser(userObject)
        }
      })
      .then(function () {
        $location.url('/profile')
      })
    })
  };

  $scope.logout = function(){
		firebase.auth().signOut();
		$location.path("/");
		console.log("signed out");
	};

  firebase.auth().onAuthStateChanged(function(user){
    if(user){
      localStorageService.set("currentUser", user)
      $scope.$apply(function(){
        $scope.loggedin = true;
      })
    } else {
      $scope.$apply(function(){
        $scope.loggedin = false;
      })
      localStorageService.set("currentUser", "null")
    };
  });
});
