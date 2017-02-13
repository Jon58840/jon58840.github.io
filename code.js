//
// this is just a stub for a function you need to implement
//
function getStats(txt) {
    return {
        nChars: nCharsFunc(txt),
        nWords: nWordsFunc(txt),
        nLines: nLinesFunc(txt),
        nNonEmptyLines:  nNonEmptyLinesFuncFunc(txt),
        averageWordLength: averageWordLengthFunc(txt),
        maxLineLength: maxLineLengthFunc(txt),
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
{/*
	var lineArray = currentString.match('\n');
	var lineCount = 1 + lineArrray.length;
	return lineCount;*/
	
	return 10;
}

function nNonEmptyLinesFuncFunc(txt)
{
	return 22;
}

function averageWordLengthFunc(txt)
{
	var currentString = txt;
	currentString = currentString.toLowerCase();
	var wordArray = currentString.match(/[a-z0-9]+/g);
	
	var letterCount = 0;
	
	for (i = 0; i < wordArray.length; i++)
	{
		letterCount += wordArray[i].length;
	}
	
	return letterCount / wordArray.length;
}

function maxLineLengthFunc(txt)
{
	return 33;
}

function palindromesFunc(txt)
{
	return 0;
}

function longestWordsFunc(txt)
{
	return 0;
}

function mostFrequentWordsFunc(txt)
{
	return 0;
}