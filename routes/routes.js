module.exports = function (app) {

	// app.get('/test', function (req,res) {
	// 	res.render('site');
	// });

	app.get('*', function (req,res) {
		res.render('site');
	});
};
