const express = require('express');
const app = express();
const Twit = require('../config/twit.config');
const TweetSecBot = require('../lib/main');
const userToTweetTo = '@philosophiepass';
const port = 3000;

var stream = Twit.stream('statuses/filter', { track: userToTweetTo });

stream.on('connect', (request) => {
	console.log('Philosophie\'s TweetSec connecting...');
});

// 'tweet' event not capturing any response even when tweeted
stream.on('tweet', (response) => {
	var username = response.user.screen_name; // need to change this
	var password = response.text.replace(userToTweetTo, '');	
	
	// Works
	TweetSecBot.checkPasswordStrength(password)
		.then((result) => {
			console.log('Done!', result)

			Twit.post('statuses/update', { status: `Hey ${username}, your password is ${result}.` }, (err, data, response) => {
				if(err) console.log(err)
			})
		})
		.catch((err) => {
			console.log(err)
		})
});

app.listen(port, () => console.log('Listening on port 3000'));