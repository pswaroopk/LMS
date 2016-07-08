var lmsApp = angular.module('lmsApp', ['ui.bootstrap']);

lmsApp.controller('mainController',['$scope','$http', function($scope, $http, audio) {
    $scope.formData = {};
    $scope.searchResults = [];
    $scope.checkoutData = [];
    $scope.checkoutISBN = '';
    $scope.checkoutBranch = '';
    $scope.checkoutCardNo = '';

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
        isbn: $scope.checkoutISBN,
        branch: $scope.checkoutBranch,
        cardno: $scope.checkoutCardNo
      }
      // console.log($scope.checkoutISBN, $scope.checkoutBranch, $scope.checkoutCardNo);
      $http.post('/bookloan/checkout', formData)
        .success(function(data) {
            $scope.checkoutData = data;
        })
        .error(function(data) {
          $scope.checkoutStatus = data.message;
          console.log('Error: ' + data);
        });
    };

    $scope.deleteBookmark = function(id) {
        //console.log('delete bm',id);
        $http.delete('/api/bookmarks/' + id)
            .success(function(data) {
                $scope.bookmarks = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.sanitizeAuthors = function (authors) {
      return authors.map(function (author) {
        return author.name;
      })
    }



    //pagination data
    // $scope.filteredResults = []
    // ,$scope.currentPage = 0
    // ,$scope.numPerPage = 12
    // ,$scope.maxSize = 5;

    // $scope.setPage = function (pageNo) {
    //     $scope.currentPage = pageNo;
    // };

    // $scope.$watch('currentPage + numPerPage', function() {
    //     var begin = (($scope.currentPage - 1) * $scope.numPerPage)
    //     , end = begin + $scope.numPerPage;
    //     if($scope.searchResults.length > 0){
    //         $scope.filteredResults = $scope.searchResults.slice(begin, end);
    //     }
    // });

    //selected word
    $scope.setSelectedWord = function(word){
        $scope.selected_word = word;
        $scope.word_selected = 'true';
    };

    $scope.play = function(songPath){
        audio.play(songPath);
    };

}]);

lmsApp.controller('ChildController', ['$scope', function($scope) {

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
