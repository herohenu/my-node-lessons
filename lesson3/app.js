var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio')

var app = express();
app.get('/', function (req, res, next) {
	var url = 'https://cnodejs.org/';
	superagent.get(url)
		.end(function (err, sres) {
			if (err) {
				return next(err);
			}

			var $ = cheerio.load(sres.text);
			var items = [];
			$('#topic_list .topic_title').each(function (idx, element) {
				var $element = $(element);
				console.log("   elem is  :", $element);
				items.push({
					title: $element.attr('title'),
					href: $element.attr('href')
				})
			});
			console.log(" items:", items);
			res.send(items);
		});
});


app.listen(5000,function(req ,res){
	console.log('app is running  5000');
})

