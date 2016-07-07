$(document).ready(function() {
  $('#search').on('keyup', function(event) {
    $.ajax('/book/search?q=' + event.target.value, function (data) {
      console.log(data);
    })
  })
})
