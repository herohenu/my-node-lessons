var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var fs = require('fs');

var cnodeUrl = 'https://cnodejs.org/';

superagent.get(cnodeUrl)
	.end(function (err, res) {
		if (err){
			return console.err("   err is :", err);
		}
		console.log(" now get url  ",cnodeUrl);
		var topicUrls = [];
		var $ = cheerio.load(res.text);

		$('#topic_list  .topic_title').each(function (idx, element) {
			var $element = $(element);
			var href = url.resolve(cnodeUrl, $element.attr('href'));
			topicUrls.push(href);
		});

		console.log("topicUrls:", topicUrls);
		var ep = new eventproxy();
		ep.after('topic_html', topicUrls.length, function (topics) {
			topics = topics.map(function (topicPair) {
				var topicUrl = topicPair[0];
				var topicHtml = topicPair[1];
				var $ = cheerio.load(topicHtml);
				return ({
					titile: $('.topic_full_title').text().trim(),//topic_full_title
					href: topicUrl,
					comment1: $('.reply_content').eq(0).text().trim()
				});
			});

			console.log("final topics :\n", topics);

		});

		topicUrls.forEach(function (topicUrl) {
			superagent.get(topicUrl)
				.end(function (err, res) {
					console.log("   fetch url :", topicUrl);
					ep.emit('topic_html', [topicUrl, res.text]);
				})
		});

	});

//comment
//如何存储到数据库或者写入文件