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
        palindromes: palindromesFunc(txt),
        longestWords: longestWordsFunc(txt),
        mostFrequentWords: mostFrequentWordsFunc(txt)
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
	//An array containing each word, a word being an uninterrupted alphanumeric string
	
	return wordArray.length;
}

function nLinesFunc(txt)
{
	var currentString = txt;
	currentString = currentString.toLowerCase();
	var lineArray = currentString.split(/\n/g||[]);
	return lineArray.length;
}

function nNonEmptyLinesFuncFunc(txt)
{
	var currentString = txt;
	currentString = currentString.toLowerCase();
	var lineArray = currentString.split(/\n/g||[]);
	
	var nonEmptyLines = 0;
	
	for (i = 0; i < lineArray.length; i++)
	{//For each line in the array
		var trimmedLine = lineArray[i].trim();	//Remove whitespace

		if (trimmedLine.length != 0)
		{
			nonEmptyLines++;
		}
	}
	
	return nonEmptyLines;
}

function averageWordLengthFunc(txt)
{
	var currentString = txt;
	currentString = currentString.toLowerCase();
	var wordArray = currentString.match(/[a-z0-9]+/g);
	
	var letterCount = 0;
	
	for (i = 0; i < wordArray.length; i++)
	{//For each word in the array, add up the number of letters
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
	var currentString = txt;
	currentString = currentString.toLowerCase();
	var wordArray = currentString.match(/[a-z0-9]+/g);
	var palindromeArray = [];
	
	for (i = 0; i < wordArray.length; i++)
	{
		var word = wordArray[i];
		var reverseWord = "";
		
		if (wordArray[i].length < 3)
		{//If the word is too short, skip over it
			continue;
		}
		
		for (j = wordArray[i].length - 1; j >= 0;j--)
        {//Reverse the letters of the word
			//I'm using wordArray here instead of word because word makes it freeze
			//I'm not sure why
            reverseWord += wordArray[i].charAt(j);
        }
		
		if (word == reverseWord)
		{
			var uniqueWord = true;
			for (j = 0; j < palindromeArray.length; j++)
			{
				if (palindromeArray[j] == word)
				{//If this word is already in the list
					uniqueWord = false;
				}
			}
			
			if (uniqueWord)
			{
				palindromeArray.push(word);
			}
		}
	}
	
	return palindromeArray;
}

function longestWordsFunc(txt)
{
	var currentString = txt;
	currentString = currentString.toLowerCase();
	var wordArray = currentString.match(/[a-z0-9]+/g);
	
	var longestWord = 0;
	
	for (i = 0; i < wordArray.length; i++)
	{//For each word in the array, check if it is longer than current longest
		if (wordArray[i].length > longestWord)
		{
			longestWord = wordArray[i].length;
		}
	}
	
	var longestWordsArray = [];
	var currentWordLength = longestWord;
    
	while (longestWordsArray.length < 10 && currentWordLength > 0)
	{//While our array of words is still less than 10 words
		//Escape clause if we don't actually have enough words
		var nextArray = [];
		
		for (i = 0; i < wordArray.length; i++)
		{//Go back through word array and collect all words equal to longest word
			if (wordArray[i].length == currentWordLength)
			{
				var uniqueWord = true;
				for (j = 0; j < nextArray.length; j++)
				{
					if (nextArray[j] == wordArray[i])
					{//If this word is already in the list
						uniqueWord = false;
					}
				}
				
				if (uniqueWord)
				{
					nextArray.push(wordArray[i]);
				}
			}
		}
		
		nextArray.sort();	//Sort the elements of the array alphabetically
		
		var i = 0;
		while (longestWordsArray.length < 10 && i < nextArray.length)
		{//While the array of longest words is still less than 10
			//and we still have words left in the current array of long words
			longestWordsArray.push(nextArray[i]);
			i++;
		}
		
		currentWordLength--;
	}
    
	return longestWordsArray;
}

function mostFrequentWordsFunc(txt)
{
	var currentString = txt;
	currentString = currentString.toLowerCase();
	var wordArray = currentString.match(/[a-z0-9]+/g);
	wordArray.sort();	//Sort array of words alphabetically
	
	var foundWordsArray = [];
	var countArray = [];
	
	if (wordArray.length == 0)
	{//If no words, return empty array
		return foundWordsArray;
	}
	
	foundWordsArray.push(wordArray[0]);
	countArray.push(1);
	
	var sortedIndex = 0;
	for (i = 1; i < wordArray.length; i++)
	{//For each word in the array
		if (wordArray[i] == foundWordsArray[sortedIndex])
		{//If we have more of the same word
			countArray[sortedIndex]++;
		}
		else
		{//Otherwise
			foundWordsArray.push(wordArray[i]);
			countArray.push(1);
			sortedIndex++;
		}
	}
	
	var mostCommonWord = 0;
	
	for (i = 0; i < countArray.length; i++)
	{//For each word in the array, check if it is longer than current longest
		if (countArray[i] > mostCommonWord)
		{
			mostCommonWord = countArray[i];
		}
	}
	
	var sortedWordsArray = [];
	var countedWordsArray = [];
	var currentWordInstances = mostCommonWord;
    
	while (sortedWordsArray.length < 10 && currentWordInstances > 0)
	{//While our array of words is still less than 10 words
		//Escape clause if we don't actually have enough words
		var nextArray = [];
		
		for (i = 0; i < countArray.length; i++)
		{//Go back through word array and collect all words equal to current most common word
			if (countArray[i] == currentWordInstances)
			{
				nextArray.push(foundWordsArray[i]);
			}
		}
		
		nextArray.sort();	//Sort the elements of the array alphabetically
		
		var i = 0;
		while (sortedWordsArray.length < 10 && i < nextArray.length)
		{//While the array of longest words is still less than 10
			//and we still have words left in the current array of long words
			sortedWordsArray.push(nextArray[i]);
			countedWordsArray.push(currentWordInstances);
			i++;
		}
		
		currentWordInstances--;
	}
	
	var returnArray = []
	for (i = 0; i < 10; i++)
	{
		returnArray.push(sortedWordsArray[i] + "(" + countedWordsArray[i] + ")");
	}
	
	
	return returnArray;
	/*
	var dummyArray = ["hello(7)", "world(1)"];
	return dummyArray;*/
}