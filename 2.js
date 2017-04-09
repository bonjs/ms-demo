var seneca = require('seneca')();


seneca.add({
	a: 'math',
	b: 'sum:*'
}, function(msg, callback) {
	var sum = msg.left + msg.right;
	callback(null, {answer: sum});
});

seneca.act({
	a: 'math',
	b: 'sum:afdsafds',
	left: 221,
	right: 112,
}, function(err, result) {
	console.log(result);
});
seneca.use(test);
function test(v) {
	console.log('********', v);
};