var DbService = require('./models/dbservice');
var config = require('../config');
var jwt = require('express-jwt');

var auth = jwt({
  secret: config.secretKey,
  userProperty: 'payload'
});

module.exports = function(app) {

	app.post('/addMasterDealer', auth, DbService.AddMasterDealer);
	app.post('/deleteMasterDealer', auth, DbService.DeleteMasterDealerbyId);
	app.post('/editMasterDealer', auth, DbService.EditMasterDealerbyId);
	app.post('/getMasterDealer', auth, DbService.GetAllMasterDealers);

	app.post('/addDealer', auth, DbService.AddDealer);
	app.post('/deleteDealer', auth, DbService.DeleteDealerbyId);
	app.post('/editDealer', auth, DbService.EditDealerbyId);
	app.post('/getDealerByMId', auth, DbService.GetDealersbyMasterId);

	app.post('/addRetailer', auth, DbService.AddRetailer);
	app.post('/deleteRetailer', auth, DbService.DeleteRetailerbyId);
	app.post('/editRetailer', auth, DbService.EditRetailerById);
	app.post('/getRetailerByDId', auth, DbService.GetRetailerByDealerId);
	app.post('/getRetailerByMId', auth, DbService.GetRetailerByMasterId);

	app.post('/getRetailerType', auth, DbService.GetAllRetailerType);
	app.post('/addRetailerType', auth, DbService.AddNewRetailerType);
	app.post('/editRetailerType', auth, DbService.EditRetailerTypebyId);
	app.post('/deleteRetailerType', auth, DbService.DeleteRetailerTypebyId);

	app.post('/addScheme', auth, DbService.AddNewScheme);
	app.post('/editScheme', auth, DbService.EditSchemebyId);
	app.post('/deleteScheme', auth, DbService.DeleteSchemebyId);
	app.post('/getScheme', auth, DbService.GetSchemebyType);
	app.post('/getAllScheme', auth, DbService.GetAllScheme);

	app.post('/addTransaction', auth, DbService.AddNewTransaction);
	app.post('/deleteTransaction', auth, DbService.DeleteTransactionbyId);
	app.post('/editTransaction', auth, DbService.EditTransactionbyId);
	app.post('/getTransaction', auth, DbService.GetTransactionByDateAndUserId);

	app.post('/changePassword', auth, DbService.changePassword);

	app.post('/loginValidate', DbService.loginValidate);
	app.post('/getMIdByDId', auth, DbService.GetMIdByDId);
    app.post('/getBalanceAmount', auth, DbService.GetBalanceAmount);
	app.post('/addMoneyTransferDetails', auth, DbService.MoneyTransferDetails); 
	app.post('/recharge', auth, DbService.Recharge);  
	app.get('/rechargeCallback', DbService.RechargeCallback);
	app.post('/getRechargesByRId', auth, DbService.GetRechargeDetailsByRetailerId); 
	app.post('/checkStatusByTxnId', auth, DbService.CheckStatusByTxnId);   
	app.post('/checkBalance', auth, DbService.CheckMainBalance);
	app.post('/getAllReports', auth, DbService.GetAllReports);
	app.post('/getAccountReports', auth, DbService.GetAccountReportsById);
	app.post('/getRefundReports', auth, DbService.GetRefundDetailsByRetailerId);
	app.post('/sendComplain', auth, DbService.SendComplain);
	app.post('/getComplains', auth, DbService.GetComplains);
	app.post('/complainsResponse', auth, DbService.ComplainsResponse);
	app.post('/getRetailersRecharge', auth, DbService.GetRetailersRechargeByDId);
	app.post('/sendFundRequest', auth, DbService.SendFundRequest);
	app.post('/getSentFundRequest', auth, DbService.GetSentFundRequest);   
    app.post('/getRecievedFundRequest', auth, DbService.GetRecievedFundRequest);
	app.post('/respondFundRequest', auth, DbService.RespondFundRequest);
	app.post('/logout', DbService.Logout);
	app.post('/revertTransaction', auth, DbService.RevertTransaction);
	app.post('/getRevertTransactions', auth, DbService.GetRevertTransactions);
	app.get('/downloadApk', DbService.DownloadApk);     

    app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});   

    app.use(function (err, req, res, next) {
	//	console.log(req);
		console.log('entered use authentication error');
		console.log(err);
      if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.send({"message" : err.name + ": " + err.message, loggedIn:"false"});
      }
    });
};