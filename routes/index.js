var Sentencer = require('sentencer');
var randy = require('randy');

function constrain(input, max) {
  return Math.min(input, max);
}

// this is our validation middleware to ensure that any requests stay below our limits
function validate(req, res, next) {
  if(req.params.number) {
    req.params.number = constrain(req.params.number, 999);
  }
  if(req.params.sentences) {
    req.params.sentences = constrain(req.params.sentences, 50);
  }
  if(req.params.paragraphs) {
    req.params.paragraphs = constrain(req.params.paragraphs, 20);
  }
  next();
};

module.exports = function(app) {

  app.get('/', validate, function(req, res){
    res.render('index', { sentences: generate(4) });
  });

  app.get('/sentences/:number', validate, function(req, res){
    var numberOfSentences = req.params.number || 4;
    var sentences = generate(numberOfSentences);
    res.setHeader("Content-Type", "text/plain");
    res.send(sentences);
  });

  app.get('/paragraphs/:paragraphs', validate, generateParagraphs);
  app.get('/paragraphs/:paragraphs/:sentences', validate, generateParagraphs);
};

// does the sentence generating
function generate(numberOfSentences) {
  var sentences = capitalizeFirstLetter(makeSentenceFromTemplate());
  sentences += ". ";

  // if we get a phrase back from randomStartingPhrase()
  // we do not have to capitalize the first letter of the sentence.
  var cap = true;
  for(var i = 0; i < numberOfSentences - 1; i++) {
    var phrase = randomStartingPhrase();

    if(phrase){ cap = false; sentences += phrase; }
    else { cap = true; }

    // make a sentence!
    var s = makeSentenceFromTemplate();

    // capitalize the first letter if that's what we should be doing.
    // then add a period and toss it on to the heap.
    if(cap) s = capitalizeFirstLetter(s);
    sentences += s;
    sentences += ".";

    // this is to ensure that our set of sentences doesn't end with a trailing space.
    if(i < numberOfSentences - 2) {
      sentences += " ";
    }
  }

  return sentences;
}

function generateParagraphs(req, res) {
  var random = false;
  if(!req.params.sentences) {
    random = true;
  }
  var numOfParagraphs = req.params.paragraphs || 2;
  var numberOfSentences = req.params.sentences || 4;
  var pTags = req.query.p || false;

  var paragraphString = "";
  for(var i = 0; i < numOfParagraphs; i++) {
    if(i > 0) {
      paragraphString += "\n\n";
    }
    if(pTags) {
      paragraphString += "<p>";
    }
    if(random) {
      paragraphString += generate( Math.ceil( 3 + Math.random() * 5 ) );
    } else {
      paragraphString += generate(numberOfSentences);
    }
    if(pTags) {
      paragraphString += "</p>";
    }
  }

  res.setHeader("Content-Type", "text/plain");
  res.send(paragraphString);
}

function makeSentenceFromTemplate() {
  return Sentencer.make( randy.choice(sentenceTemplates) );
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// returns a starting phrase about half the time, otherwise it's empty
function randomStartingPhrase() {
  if(Math.random() < 0.4) {
    return randy.choice(phrases);
  }
  return "";
}

// style guide: no periods, no first capital letters.
var sentenceTemplates = [
  "the {{ noun }} is {{ a_noun }}",
  "{{ a_noun }} is {{ an_adjective }} {{ noun }}",
  "the first {{ adjective }} {{ noun }} is, in its own way, {{ a_noun }}",
  "their {{ noun }} was, in this moment, {{ an_adjective }} {{ noun }}",
  "{{ a_noun }} is {{ a_noun }} from the right perspective",
  "the literature would have us believe that {{ an_adjective }} {{ noun }} is not but {{ a_noun }}",
  "{{ an_adjective }} {{ noun }} is {{ a_noun }} of the mind",
  "the {{ adjective }} {{ noun }} reveals itself as {{ an_adjective }} {{ noun }} to those who look",
  "authors often misinterpret the {{ noun }} as {{ an_adjective }} {{ noun }}, when in actuality it feels more like {{ an_adjective}} {{ noun }}",
  "we can assume that any instance of {{ a_noun }} can be construed as {{ an_adjective }} {{ noun }}",
  "they were lost without the {{ adjective }} {{ noun }} that composed their {{ noun }}",
  "the {{ adjective }} {{ noun }} comes from {{ an_adjective }} {{ noun }}",
  "{{ a_noun }} can hardly be considered {{ an_adjective }} {{ noun }} without also being {{ a_noun }}",
  "few can name {{ an_adjective }} {{ noun }} that isn't {{ an_adjective }} {{ noun }}",
  "some posit the {{ adjective }} {{ noun }} to be less than {{ adjective }}",
  "{{ a_noun }} of the {{ noun }} is assumed to be {{ an_adjective }} {{ noun }}",
  "{{ a_noun }} sees {{ a_noun }} as {{ an_adjective }} {{ noun }}",
  "the {{ noun }} of {{ a_noun }} becomes {{ an_adjective }} {{ noun }}",
  "{{ a_noun }} is {{ a_noun }}'s {{ noun }}",
  "{{ a_noun }} is the {{ noun }} of {{ a_noun }}",
  "{{ an_adjective }} {{ noun }}'s {{ noun }} comes with it the thought that the {{ adjective }} {{ noun }} is {{ a_noun }}",
  "{{ nouns }} are {{ adjective }} {{ nouns }}",
  "{{ adjective }} {{ nouns }} show us how {{ nouns }} can be {{ nouns }}",
  "before {{ nouns }}, {{ nouns }} were only {{ nouns }}",
  "those {{ nouns }} are nothing more than {{ nouns }}"
];

// partial phrases to start with. Capitalized.
var phrases = [
  "To be more specific, ",
  "In recent years, ",
  "However, ",
  "Some assert that ",
  "If this was somewhat unclear, ",
  "However, ",
  "Unfortunately, that is wrong; on the contrary, ",
  "This could be, or perhaps ",
  "This is not to discredit the idea that ",
  "We know that ",
  "It's an undeniable fact, really; ",
  "Framed in a different way, ",
  "What we don't know for sure is whether or not ",
  "As far as we can estimate, ",
  "The zeitgeist contends that ",
  "Though we assume the latter, ",
  "Far from the truth, "
];