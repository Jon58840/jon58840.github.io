//
// this is just a stub for a function you need to implement
//
function getStats(txt) {
    return {
        nChars: nCharsFunc(txt),
        nWords: nWordsFunc(txt),
        nLines: nLinesFunc(txt),
        nNonEmptyLines: 22,
        averageWordLength: 3.3,
        maxLineLength: 33,
        palindromes: ["12321", "kayak", "mom"],
        longestWords: ["xxxxxxxxx", "123444444"],
        mostFrequentWords: ["hello(7)", "world(1)"]
    };
}

function nCharsFunc(txt)
{
	return txt.length;
}

function nWordsFunc(txt)
{
	var currentString = txt;
	currentString = currentString.toLowerCase();
	var wordArray = currentString.match(/[a-z0-9]+/g);
	
	return wordArray.length;
}

function nLinesFunc(txt)
{
	var lineArray = currentString.match('\n');
	return lineArray.length;
}