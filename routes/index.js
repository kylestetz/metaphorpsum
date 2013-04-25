
/*
 * GET home page.
 */

// pull in the adjectives and nouns stored in their JS files
var adjectives = require('./adjectives.js').adjectives;
var nouns = require('./nouns.js').nouns;

//    index route
exports.index = function(req, res){
  res.render('index', { sentences: generate(6) });
};

//    /sentence/:number
exports.generateSentences = function(req, res){
  var numberOfSentences = 4;
  if(req.params.number) numberOfSentences = req.params.number;
  var sentences = generate(numberOfSentences);

  res.send(sentences);
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

    var s = makeSentenceFromTemplate();
    if(cap) s = capitalizeFirstLetter(s);
    sentences += s;
    sentences += ". ";
  }

  return sentences;
}

// get a noun
function noun() {
  return randomSelection(nouns);
}

// get an adjective
function adjective() {
  return randomSelection(adjectives);
}

// get a noun with either 'a' or 'an' in front of it
function nounWithAOrAn() {
  var w = noun();
  if(vowelTest(w[0])) {
    return "an " + w;
  } else {
    return "a " + w;
  }
}

// get an adjective with either 'a' or 'an' in front of it
function adjectiveWithAOrAn() {
  var w = adjective();
  if(vowelTest(w[0])) {
    return "an " + w;
  } else {
    return "a " + w;
  }
}

// is it a vowel?
function vowelTest(s) {
  return s === 'a' || s === 'e' || s === 'i' || s === 'o' || s === 'u';
}

function capitalizeFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// returns a starting phrase about half the time, otherwise it's empty
function randomStartingPhrase() {
  if(Math.random() < 0.5) {
    return phrases[ Math.ceil(Math.random() * phrases.length) ];
  }
  return "";
}

// take an array and return a random selection from it
function randomSelection(l) {
  return l[Math.ceil(Math.random() * l.length - 1)];
}

// ======================= TEMPLATES ==========================
// %a%        : adjective
// %n%        : noun
// (a/an) %a% : adjective with a or an in front
// (a/an) %n% : noun with a or an in front

function makeSentenceFromTemplate() {
  // pick a template
  var t = randomSelection(sentenceTemplates);

  t = replaceAllOccurrences(t, "\\(a/an\\) %n%", nounWithAOrAn);
  t = replaceAllOccurrences(t, "\\(a/an\\) %a%", adjectiveWithAOrAn);
  t = replaceAllOccurrences(t, "%n%", noun);
  t = replaceAllOccurrences(t, "%a%", adjective);
  return t;
}

// here's where the magic happens. We're using regular expressions so that
// in the future we can get pretty complicated with our templates.
function replaceAllOccurrences(template, regexString, generator) {
  // count the instances of the expression in the template
  var count = template.match(new RegExp(regexString, 'g'));
  var modifiedTemplate = template;
  // for each instance of the expression, replace it with whatever generator was passed in
  if(count && count.length) {
    for(var i = 0; i < count.length; i++){
      modifiedTemplate = modifiedTemplate.replace(new RegExp(regexString), generator());
    }
  }
  return modifiedTemplate;
}

// style guide: no periods, no first capital letters.
var sentenceTemplates = [
  "the %n% is (a/an) %n%",
  "(a/an) %n% is (a/an) %a% %n%",
  "the first %a% %n% is, in its own way, (a/an) %n%",
  "their %n% was, in this moment, (a/an) %a% %n%",
  "(a/an) %n% is (a/an) %n% from the right perspective",
  "the literature would have us believe that (a/an) %a% %n% is not but (a/an) %n%",
  "(a/an) %a% %n% is (a/an) %n% of the mind",
  "the %a% %n% reveals itself as (a/an) %a% %n% to those who look",
  "authors often misinterpret the %n% as (a/an) %a% %n%, when in actuality it feels more like (a/an) %a% %n%",
  "we can assume that any instance of (a/an) %n% can be construed as (a/an) %a% %n%",
  "they were lost without the %a% %n% that composed their %n%"
];

// partial phrases to start with. Capitalized.
var phrases = [
  "To be more specific, ",
  "In recent years, ",
  "However, ",
  "Some assert that ",
  "If this was somewhat unclear, ",
  "However, ",
  "Unfortunately, that is wrong. On the contrary, ",
  "Could this be? Perhaps ",
  "This is not to discredit the idea that ",
  "We do know that ",
  "It's an undeniable fact, really; ",
  "Framed in a different way, ",
  "What we don't know for sure is whether or not ",
  "As far as we can estimate, ",
  "The pedantic academic would easily confuse the idea that ",
  "The zeitgeist contends that ",
  "Though we assume the latter, "
];