var lmsApp = angular.module('lmsApp', ['ui.bootstrap']);

lmsApp.controller('mainController',['$scope','$http', function($scope, $http, audio) {
    $scope.currentBranch;
    $scope.formData = {};
    $scope.searchResults = [];
    $scope.checkoutData = [];
    $scope.checkinData = [];
    $scope.checkoutISBN = '';
    $scope.checkoutBranch = '';
    $scope.checkoutCardNo = '';
    $scope.checkinCardNo = '';
    $scope.cardNo = '';
    $scope.checkinStatus = '';
    $scope.fineResults = [];
    $scope.newBorrower = {};
    $scope.createdBorrower;
    $scope.isAdvanced = false;
    $scope.searchType = 'Advanced';

    // $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    //   // On tab active do something here
    // });


    $(".dropdown-menu").on('click', 'li a', function(){
      $(".btn:first-child").text($(this).text());
      $(".btn:first-child").val($(this).attr('value'));
      $scope.currentBranch = $(this).attr('value');
      $('#exTab1').removeClass('hide').addClass('show');
    });

    $scope.toggleSearchType = function () {
      $scope.isAdvanced = !$scope.isAdvanced;
      if ($scope.isAdvanced) $scope.searchType = 'Simple';
      else $scope.searchType = 'Advanced';
    }

    $scope.search = function(query) {
      if (!$scope.currentBranch) {
        alert('Please select a branch to continue');
        return false;
      }
      var searchQuery;
      if ($scope.isAdvanced) {
        searchQuery = 'isbn=' + $scope.isbn_as + '&title=' + $scope.title_as + '&author=' + $scope.author_as + '&type=and';
      } else {
        searchQuery = 'q=' + query;
      }
      $http.get('/book/search?' + searchQuery + '&branch=' + $scope.currentBranch)
          .success(function(data) {
              $scope.searchResults = data;
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });
    };

    $scope.searchFines = function() {
      if (!$scope.cardNo) return false;
      if (!$scope.currentBranch) {
        alert('Please select a branch to continue');
        return false;
      }
      $http.get('/fine?cardno=' + $scope.cardNo + '&branch=' + $scope.currentBranch)
          .success(function(data) {
            $scope.fineResults = [];
            if (data.message) alert(data.message);
            if (!data.message) $scope.fineResults = data.fines;
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
            if (data.message) alert(data.message);
            $scope.fineResults = data;
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });
    };

    $scope.isValid = function () {
      if (!$scope.checkoutISBN || !$scope.checkoutCardNo) {
        $scope.checkoutStatus = '* Please fill all required fields';
        return false;
      }
      $scope.checkoutStatus = '';
      return true;
    }

    $scope.checkout = function() {
      // var branch = $("#checkOut .btn:first-child").val();
      // $scope.checkoutBranch = branch;
      if (!$scope.currentBranch) {
        alert('Please select a branch to continue');
        return false;
      }
      if (!$scope.isValid()) return false;
      var formData = {
        isbn: $scope.checkoutISBN,//checkout - isbn GUI
        branch: $scope.currentBranch,
        cardno: $scope.checkoutCardNo
      }
      $http.post('/bookloan/checkout', formData)
        .success(function(data) {
          if (data.message) alert(data.message);
          $scope.checkoutData = data;
        })
        .error(function(data) {
          if (data) $scope.checkoutStatus = data.message;
          console.log('Error: ' + data);
        });
    };

    $scope.checkedOutBooks = function(type) {
      if (!$scope.currentBranch) {
        alert('Please select a branch to continue');
        return false;
      }
      var cardno = type === 'in' ? $scope.checkinCardNo : $scope.checkoutCardNo;
      if (!cardno) return false;
      $http.get('/bookloan/checkout?cardno=' +cardno + '&branch=' + $scope.currentBranch)
        .success(function(data) {
          $scope.checkoutStatus = ''
          if (data.message) alert(data.message);
          $scope.checkoutData = [];
          $scope.checkinData = [];
          if (data.message) $scope.checkoutStatus = data.message;
          else {
            if (type === "in") $scope.checkinData = data;
            else $scope.checkoutData = data;
          }
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    };

    $scope.checkin = function(loanid, bookid) {
      if (!$scope.currentBranch) {
        alert('Please select a branch to continue');
        return false;
      }
      if (!$scope.checkinCardNo) {
        $scope.checkinStatus = 'Please enter card number'
        return false;
      }
      $http.post('/bookloan/checkin/', {
        cardno: $scope.checkinCardNo,
        loanid: loanid,
        branch: $scope.currentBranch
      })
      .success(function(data) {
        if (data.message) alert(data.message);
        $scope.checkinStatus = 'Check in successful'
        $scope.checkinData = data.books;
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
    };

    $scope.addBorrower = function (form) {
      if (!form.$valid) return false;
      $http.post('/borrower/', $scope.newBorrower)
      .success(function (result) {
        $scope.newBorrower = {};
        $scope.borrowerStatus = result.message;
        $scope.createdBorrower = result.data;
      })
      .error(function (error) {
        console.log('Error: ', error);
      });
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
