const Twit = require('../config/twit.config');
const TweetSecBot = require('../lib/main');
const userToTweetTo = '@philosophiepass';

var stream = Twit.stream('statuses/filter', { track: userToTweetTo });

stream.on('connect', function(request){
	console.log('Philosophie\'s TweetSec connecting...')
});

// 'tweet' event not capturing any response even when tweeted
stream.on('tweet', function(response) {
	console.log('in tweet')
	var username = response.user.screen_name;
	var password = response.text.replace(userToTweetTo, '');	
	
	TweetSecBot.checkPasswordStrength(password)
	.then((result) => {
		console.log('Done!', result)

		Twit.post('statuses/update', { status: `Hey ${username}, your password is ${result}.` }, function(err, data, response) {
			if(err) console.log(err)
		})
	})
	.catch((err) => {
		console.log(err)
	})
});