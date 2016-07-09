var lmsApp = angular.module('lmsApp', ['ui.bootstrap']);

lmsApp.controller('mainController',['$scope','$http', function($scope, $http, audio) {
    $scope.formData = {};
    $scope.searchResults = [];
    $scope.checkoutData = [];
    $scope.checkoutISBN = '';
    $scope.checkoutBranch = '';
    $scope.checkoutCardNo = '';
    $scope.cardNo = '';
    $scope.checkinStatus = '';
    $scope.fineResults = [];

    // $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    //   // On tab active do something here
    // });


    $(".dropdown-menu").on('click', 'li a', function(){
      $(".btn:first-child").text($(this).text());
      $(".btn:first-child").val($(this).attr('value'));
    });

    $scope.search = function(query) {
      var branch = $("#searchTab .btn:first-child").val();
      branch = branch === "" ? '-1' : branch;
      $http.get('/book/search?q=' + query + '&branch=' + branch) // .isbn + '&title=' + query.title + '&author=' + query.author
          .success(function(data) {
              $scope.searchResults = data;
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });
    };

    $scope.searchFines = function() {
      if (!$scope.cardNo) return false;
      $http.get('/fine/' + $scope.cardNo)
          .success(function(data) {
              $scope.fineResults = data;
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });
    };

    $scope.payFine = function(fineid) {
      //add warning message
      if(!confirm('Do you want pay the fine for this book?')) return false;
      $http.put('/fine/' + fineid)
          .success(function(data) {
            $scope.fineResults = data;
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });
    };

    $scope.isValid = function () {
      if (!$scope.checkoutISBN || !$scope.checkoutBranch || !$scope.checkoutCardNo) {
        $scope.checkoutStatus = '* Please fill all required fields';
        return false;
      }
      $scope.checkoutStatus = '';
      return true;
    }

    $scope.checkout = function() {
      var branch = $("#checkOut .btn:first-child").val();
      $scope.checkoutBranch = branch;
      if (!$scope.isValid()) return false;
      var formData = {
        isbn: $scope.checkoutISBN,//checkout - isbn GUI
        branch: $scope.checkoutBranch,
        cardno: $scope.checkoutCardNo
      }
      // console.log($scope.checkoutISBN, $scope.checkoutBranch, $scope.checkoutCardNo);
      $http.post('/bookloan/checkout', formData)
        .success(function(data) {
            $scope.checkoutData = data;
        })
        .error(function(data) {
          if (data) $scope.checkoutStatus = data.message;
          console.log('Error: ' + data);
        });
    };

    $scope.checkedOutBooks = function() {
      if (!$scope.checkoutCardNo) return false;
      $http.get('/bookloan/checkout/' + $scope.checkoutCardNo)
        .success(function(data) {
          $scope.checkoutData = [];
          if (data.message) $scope.checkoutStatus = data.message;
          else $scope.checkoutData = data;
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    };

    $scope.checkin = function(loanid, bookid) {
      if (!$scope.checkoutCardNo) {
        $scope.checkinStatus = 'Please enter card number'
        return false;
      }
      $http.post('/bookloan/checkin/', {
        cardno: $scope.checkoutCardNo,
        loanid: loanid
      })
      .success(function(data) {
          $scope.checkinStatus = 'Check in successful'
          $scope.checkedOutBooks = data;
      })
      .error(function(data) {
        $scope.checkinStatus = 'Check in unsuccessful'
        console.log('Error: ' + data);
      });
    };

    $scope.sanitizeAuthors = function (authors) {
      return authors.map(function (author) {
        return author.name;
      })
    }
}]);
lmsApp.directive('keypress', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.keypress);
                });

                event.preventDefault();
            }
        });
    };
});
