var _ = require('underscore');
var articles = require('Articles');
var lingo = require('lingo').en;
var adjectives = null;
var nouns = null;
var templateList = [];

// --------------- setters ----------------- //

exports.setNouns = function(_nouns) {
  nouns = _nouns;
}

exports.setAdjectives = function(_adjectives) {
  adjectives = _adjectives;
}

exports.setTemplateList = function(_templateList) {
  templateList = _templateList;
}

exports.extend = function(options) {
  wordsmith = _.defaults(wordsmith, options);
}

// --------------- wordsmith --------------- //

var wordsmith = {
  noun: function() {
    return randomSelection(nouns);
  },
  a_noun: function() {
    return articles.articlize( this.noun() );
  },
  nouns: function() {
    return lingo.pluralize( randomSelection(nouns) );
  },
  adjective: function() {
    return randomSelection(adjectives);
  },
  an_adjective: function() {
    return articles.articlize( this.adjective() );
  }
};

// ----------- public functions ------------ //

exports.make = function(sentence) {
  return makeSentenceFromTemplate(sentence);
}

exports.randomSentence = function() {
  makeSentenceFromTemplate( randomSelection(templateList) );
}

function makeSentenceFromTemplate(template) {
  var sentence = template;
  var occurrences = template.match(/\{\{(.+?)\}\}/g);

  if(occurrences && occurrences.length) {
    for(var i = 0; i < occurrences.length; i++) {
      var action = occurrences[i].replace('{{', '').replace('}}', '').replace(/\s/g, '');
      sentence = sentence.replace(occurrences[i], wordsmith[action]() );
    }
  }
  return sentence;
}

function randomSelection(l) {
  return l[Math.ceil(Math.random() * l.length - 1)];
}