$( function() {

  function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  $('[data-name="generate"]').click( function() {
    var paragraphs = $('[data-name="paragraphs"]').val();
    var sentences = $('[data-name="sentences"]').val();
    var ptags = $('[data-name="p-tags"]').val();

    if(!isNumber(paragraphs) || !isNumber(sentences) || paragraphs <= 0 || sentences <= 0) {
      $('#error').show();
      return;
    }

    if(ptags == 1) {
      ptags = '?p=true';
    } else {
      ptags = '';
    }

    window.location = '/paragraphs/' + paragraphs + '/' + sentences + ptags;
  });

  $('[data-name="title"]').click( function() {
    $.ajax('/sentences/4').done( function(metaphor) {
      $('.metaphor-text').html(metaphor);
    });
  });

  $('[data-name="title"]').hover( function() {
    $('.metaphor-text').toggleClass('text-red', true);
  }, function() {
    $('.metaphor-text').toggleClass('text-red', false);
  });

});