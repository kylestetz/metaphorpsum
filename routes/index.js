
/*
 * GET home page.
 */

var adjectives = require('./adjectives.js').adjectives;
var nouns = require('./nouns.js').nouns;

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.generateSentences = function(req, res){
  var numberOfSentences = 4;
  if(req.params.number) numberOfSentences = req.params.number;
  var sentences = "";

  for(var i = 0; i < numberOfSentences; i++) {
    sentences += capitalizeFirstLetter(makeSentenceFromTemplate());
    sentences += ". ";
  }

  res.send(sentences);

  // var cap = true;
  // for(var i = 0; i < numberOfSentences; i++) {
  //   // maybe add a starting phrase...
  //   if(i != 0) {
  //     var phrase = randomStartingPhrase();
  //     if(phrase){
  //       cap = false;
  //       sentences += phrase;
  //     } else {
  //       cap = true;
  //     }
  //   }

  //   if(cap){
  //     sentences += capitalizeFirstLetter(nounWithAOrAn()) + " is like " + nounWithAOrAn() + " in " + nounWithAOrAn() + ".";
  //   } else {
  //     sentences += nounWithAOrAn() + " is like " + nounWithAOrAn() + " in " + nounWithAOrAn() + ".";
  //   }

  //   if(i < numberOfSentences - 1) {
  //     sentences += " ";
  //   }
  // }
  // res.send(sentences);
};

function noun() {
  return randomSelection(nouns);
}

function adjective() {
  return randomSelection(adjectives);
}

function nounWithAOrAn() {
  var w = noun();
  if(vowelTest(w[0])) {
    return "an " + w;
  } else {
    return "a " + w;
  }
}

function adjectiveWithAOrAn() {
  var w = adjective();
  if(vowelTest(w[0])) {
    return "an " + w;
  } else {
    return "a " + w;
  }
}

function vowelTest(s) {
  return s === 'a' || s === 'e' || s === 'i' || s === 'o' || s === 'u';
}

function capitalizeFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function randomStartingPhrase() {
  if(Math.random() < 0.5) {
    return phrases[ Math.ceil(Math.random() * phrases.length) ];
  }
  return "";
}

function randomSelection(l) {
  return l[Math.ceil(Math.random() * l.length - 1)];
}

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
  "As far as we can estimate, "
];

// TEMPLATES
// A noun is an adjective noun.
//   (a/an) %n is (a/an) %a %n.
// The most %a %n is, in its own way, (a/an) %n.
// Their %n was, in this moment, (a/an) %a %n.

function makeSentenceFromTemplate() {
  // pick a template
  var t = randomSelection(sentenceTemplates);
  // take it apart
  // console.log(replaceAllOccurrences("(a/an) %n% is (a/an) %n% from the right perspective.", "\\(a/an\\) %n%", nounWithAOrAn));
  t = replaceAllOccurrences(t, "\\(a/an\\) %n%", nounWithAOrAn);
  t = replaceAllOccurrences(t, "\\(a/an\\) %a%", adjectiveWithAOrAn);
  // t = t.replace(/\(a\/an\) %a%/, adjectiveWithAOrAn());
  t = replaceAllOccurrences(t, "%n%", noun);
  t = replaceAllOccurrences(t, "%a%", adjective);
  // t = t.replace(/%n%/, noun());
  // t = t.replace(/%a%/, adjective());
  return t;
}

function replaceAllOccurrences(template, regexString, generator) {
  var count = template.match(new RegExp(regexString, 'g'));
  var modifiedTemplate = template;
  if(count && count.length) {
    for(var i = 0; i < count.length; i++){
      modifiedTemplate = modifiedTemplate.replace(new RegExp(regexString), generator());
    }
  }
  return modifiedTemplate;
}

// style guide: no periods, no first capital letters. we can add these things dynamically
// when we introduce partial phrases.

var sentenceTemplates = [
  "the %n% is (a/an) %n%",
  "(a/an) %n% is (a/an) %a% %n%",
  "the first %a% %n% is, in its own way, (a/an) %n%",
  "their %n% was, in this moment, (a/an) %a% %n%",
  "(a/an) %n% is (a/an) %n% from the right perspective"
];