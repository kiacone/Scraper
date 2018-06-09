// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'><a href='" + data[i].link + "' target='_blank'>" + data[i].title + "</a></p>");
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].excerpt + "<br />" + "</p>");
    $("#articles").append("<button id='take-note' data-id='" + data[i]._id + "' type='button' class='btn btn-primary' data-toggle='modal' data-target='#notes'>Take a Note</button><hr>");
  }
});


// Whenever someone clicks a p tag
$(document).on("click", "#take-note", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);

      // $("#notes").append("hello");
      $("#notes").append("<h4>" + data.title + "</h4>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' placeholder='Title of Note' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body' placeholder='Type Note'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// $(document).on("click", ".delete", function() {
//   // Save the p tag that encloses the button
//   var selected = $(this).parent();
//   // Make an AJAX GET request to delete the specific note
//   // this uses the data-id of the p-tag, which is linked to the specific note
//   $.ajax({
//     type: "GET",
//     url: "/delete/" + selected.attr("data-id"),

//     // On successful call
//     success: function(response) {
//       // Remove the p-tag from the DOM
//       selected.remove();
//       // Clear the note and title inputs
//       $("#note").val("");
//       $("#title").val("");
//       // Make sure the #action-button is submit (in case it's update)
//       $("#action-button").html("<button id='make-new'>Submit</button>");
//     }
//   });
// });

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
