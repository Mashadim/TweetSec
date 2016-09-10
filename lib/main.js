const dictionary = require('./dictionary/dictionary');

// everything works except I need to update with new dictionary because it doesn't
// include words like 'per'.

const checkPasswordStrength = (password) => {
	return new Promise((resolve, reject) => {	
					console.log('in main.js')
		if(!password) reject(foundError('Password is undefined'));
		
		findPossibleWordOrWords(password)
			.then((result) => {
				var characterTypes;
				var passwordStrength = '';
				var usedForPassWordLength = '';
			
				if(result.possibleWordOrWords.length){
					// if found words
					result.passwordToLaterReplaceWordWithLetter.forEach((word) => { 
						if(dictionary[word]) {
							usedForPassWordLength += 'a';
						}else {
							usedForPassWordLength += word;
						}
					});
				}else { // if no words found
					usedForPassWordLength = password;
				};
			
				characterTypes = findNumberOfCharacterTypes(usedForPassWordLength);
				passwordStrength = getPasswordStrength(usedForPassWordLength.length, characterTypes);
				if(passwordStrength !== '') {
					resolve(passwordStrength);
				}else {
					reject(foundError);
				}
			})
	});
};

function getPasswordStrength(passwordLength, characterTypes) {
	var strength = passwordLength * characterTypes;

	switch(true) {
		case (strength >= 50):
			return 'Strong';
		case (strength > 10 && strength < 50):
			return 'Weak';
		case (strength <= 10):
			return 'Unacceptable'
		default:
			return;
	};
};

function findNumberOfCharacterTypes(password) {
	var punctuationAndUnicode = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/;
	var checkCharacter = [/[a-zA-Z]/, /\d/, /\s/, punctuationAndUnicode];
	var count = 0;
	
	checkCharacter.forEach((regex) => {
		if(regex.test(password)) {
			count++;
		}
	});

	return count;
};

function findPossibleWordOrWords(password) {
	return new Promise((resolve, reject) => {
		var passwordArray = password.split('');
		var passwordToLaterReplaceWordWithLetter = [];
		var possibleWordOrWords = [];
		var possibleWord = '';

		passwordArray.forEach((character, index) => {
			if (/[a-zA-Z]/.test(character)) {
				possibleWord += character;

				if(index === passwordArray.length-1) {
					possibleWordOrWords.push(possibleWord);
					passwordToLaterReplaceWordWithLetter.push(possibleWord);
					possibleWord = '';
				};
			}else {
				passwordToLaterReplaceWordWithLetter.push(character);
				
				if(possibleWord !== '') {
					possibleWordOrWords.push(possibleWord);
					passwordToLaterReplaceWordWithLetter.push(possibleWord);
					possibleWord = '';
				};
			};
			
			if(index === passwordArray.length-1) {
				resolve({
					passwordToLaterReplaceWordWithLetter,
					possibleWordOrWords
				});
			}	
		});
	});
};

function foundError(error) {
	return error;
};

module.exports = {
	checkPasswordStrength
};