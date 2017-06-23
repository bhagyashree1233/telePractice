var mysql      = require('mysql');
var jwtoken = require('jsonwebtoken');
var config = require('../../config');
var querystring = require('querystring');
var request = require('request');
var fs = require('fs');

var dbConfig = {  
  host     : 'uttamtelecom.ckvfkfhxn6y7.us-east-2.rds.amazonaws.com',  
  user     : 'uttam',  
  password : 'Uttam123',  
  database : 'uttamtelecom',
  connectionLimit : 100,
    connectTimeout  : 60 * 60 * 1000,
    aquireTimeout   : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000
};
var pool = mysql.createPool(dbConfig);  

/*
function reconnect(connection){
    console.log("\n New connection tentative...");
    if(connection) connection.destroy();

    connection = mysql.createConnection(dbConfig);
    connection.connect(function(err){
        if(err) {
            setTimeout(reconnect, 2000);
        }else {
            console.log("\n\t *** New connection established with the database. ***")
            return connection;
        }
    });
}
*/

function generateToken(user) {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  console.log(user);
  return jwtoken.sign({
    userId: user.Id,
    locationUrl:user.locationUrl,
    exp: parseInt(expiry.getTime() / 1000),
  }, config.secretKey); // DO NOT KEEP YOUR SECRET IN THE CODE!
};


function createTables(query, tname) {
  
  pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
   //    return res.send({data:"server busy", done:false});
   }

   connection.query(query, function (err, result) {
    connection.release();
    if (err) {
      console.log('unable to create '+tname+' table');
      console.log(err);
      return;
    };
    console.log( tname+" Table created");
  });
 }) 
}


  function updateBalance(amount, id, tName) {
	 amount = Number(amount);
	 console.log(amount);
	 	
   var sql = "UPDATE "+tName+" SET Balance = '" + amount +"' WHERE id = "+id;
   console.log('update balance function');   
   console.log(sql); 
   pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", done:false});
   }

    connection.query(sql, function (err, result) {
     connection.release();
     if (err) {
        console.log('unable to update balance');
        console.log(err);
        //   return res.send({message:"unable to update balance.. try again", done:false});  
     };
     
      console.log(result.affectedRows + " record(s) updated");
    });
   })  	
	}
  /*
pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", done:false});
   }
*/
//  console.log('connected as id ' + connection.threadId);
/*
    var adminTable = "CREATE TABLE IF NOT EXISTS Admin (                   " +
      "  Id INT UNSIGNED  NOT NULL DEFAULT '123',                          " +
      "	 Password VARCHAR(25) NOT NULL DEFAULT 'Chegu@578',                " +
	    "	 Balance DECIMAL(10,3) NOT NULL DEFAULT 50000,                     " +
	    "	 Name VARCHAR(50) NOT NULL DEFAULT 'Admin',                      " +
	    "	 Address VARCHAR(255) NOT NULL DEFAULT 'Vijaynagar, Bangalore, 560091',  " +
	    "	 Mobile VARCHAR(25) NOT NULL DEFAULT '0000000000'                  " +
      " );                                                                 ";



//var admsql = "INSERT INTO Admin (Balance) VALUES ( 50000)";
//  connection.query(admsql, function (err, result) {
//    if (err) {console.log('unable to insert into admin table');
//      return;
//    };
//    console.log("Admin Table values inserted");
 // });

    
    var sqlMasterTable = "CREATE TABLE IF NOT EXISTS MasterDealer (         " +
      "  Id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,  " +
      "  Name  VARCHAR(50) NOT NULL DEFAULT '',                " +
      "  Mobile VARCHAR(15)   NOT NULL DEFAULT '',             " +
      "  State VARCHAR(25)  NOT NULL DEFAULT '',               " +
      "  City VARCHAR(25)  NOT NULL DEFAULT '',                " +
      "  EmailId VARCHAR(50) NOT NULL DEFAULT '',              " +
	    "	 Balance DECIMAL(10,3) DEFAULT NUll,                   " +
	    "	 LoginStatus VARCHAR(10) NOT NULL DEFAULT '',          " +
	    "	 Address VARCHAR(255) NOT NULL DEFAULT '',             " +
	    "	 RetailerType VARCHAR(30) NOT NULL,                    " +
	    "	 PanNo VARCHAR(30) NOT NULL DEFAULT '',                " +
	    "	 PinCode VARCHAR(10) NOT NULL DEFAULT '',              " +
	    "	 LandLine VARCHAR(15) NOT NULL DEFAULT '',             " +
	    "	 ContactPerson VARCHAR(50) NOT NULL DEFAULT '',        " +
	    "	 Scheme VARCHAR(50) NOT NULL DEFAULT '',               " +
      "	 Password VARCHAR(25) NOT NULL DEFAULT ''              " +
      " ) ENGINE=InnoDB AUTO_INCREMENT=1001 ;                  ";


   var sqlDealerTable = "CREATE TABLE IF NOT EXISTS Dealer (         " +
      "  Id INT UNSIGNED  NOT NULL AUTO_INCREMENT PRIMARY KEY, " +
      "  Name  VARCHAR(50) NOT NULL DEFAULT '',                " +
      "  Mobile VARCHAR(15)   NOT NULL DEFAULT '',             " +
      "  State VARCHAR(25)  NOT NULL DEFAULT '',               " +
      "  City VARCHAR(25)  NOT NULL DEFAULT '',                " +
      "  EmailId VARCHAR(50) NOT NULL DEFAULT '',              " +
	  "	 Balance DECIMAL(10,3) DEFAULT Null,                   " +
	  "	 LoginStatus VARCHAR(10) NOT NULL DEFAULT '',          " +
	  "	 Address VARCHAR(255) NOT NULL DEFAULT '',             " +
	  "	 RetailerType VARCHAR(30) NOT NULL,                    " +
	  "	 PanNo VARCHAR(30) NOT NULL DEFAULT '',                " +
	  "	 PinCode VARCHAR(10) NOT NULL DEFAULT '',              " +
	  "	 LandLine VARCHAR(15) NOT NULL DEFAULT '',             " +
	  "	 ContactPerson VARCHAR(50) NOT NULL DEFAULT '',        " +
	  "	 Scheme VARCHAR(50) NOT NULL DEFAULT '' ,               " +
    "	 Password VARCHAR(25) NOT NULL DEFAULT '',             " +
	  "  ParentMasterDealerId INT UNSIGNED  NOT NULL,          " +
    "	 FOREIGN KEY fk_mid(ParentMasterDealerId) REFERENCES MasterDealer(Id) ON UPDATE CASCADE ON DELETE CASCADE " +
    " ) ENGINE=InnoDB AUTO_INCREMENT=5000001 ;                 ";


  var sqlRetailerTable = "CREATE TABLE IF NOT EXISTS Retailer (         " +
      "  Id INT UNSIGNED  NOT NULL AUTO_INCREMENT PRIMARY KEY, " +
      "  Name  VARCHAR(50) NOT NULL DEFAULT '',                " +
      "  Mobile VARCHAR(15)   NOT NULL DEFAULT '',             " +
      "  State VARCHAR(25)  NOT NULL DEFAULT '',               " +
      "  City VARCHAR(25)  NOT NULL DEFAULT '',                " +
      "  EmailId VARCHAR(50) NOT NULL DEFAULT '',              " +
	    "	 Balance DECIMAL(10,3) DEFAULT Null,                   " +
	    "	 LoginStatus VARCHAR(10) NOT NULL DEFAULT '',          " +
	    "	 Address VARCHAR(255) NOT NULL DEFAULT '',             " +
	    "	 RetailerType VARCHAR(30) NOT NULL,                  " +
	  "	 PanNo VARCHAR(30) NOT NULL DEFAULT '',                " +
	  "	 PinCode VARCHAR(10) NOT NULL DEFAULT '',              " +
	  "	 LandLine VARCHAR(15) NOT NULL DEFAULT '',             " +
	  "	 ContactPerson VARCHAR(50) NOT NULL DEFAULT '',        " +
	  "	 Scheme VARCHAR(50) NOT NULL DEFAULT '',               " +
    "	 Password VARCHAR(25) NOT NULL DEFAULT '',             " +
	  "  ParentDealerId INT UNSIGNED  NOT NULL,                " +
	  "	 ParentMasterDealerId INT UNSIGNED  NOT NULL,           " +
    "	 FOREIGN KEY fk_pdid(ParentDealerId) REFERENCES Dealer(Id) ON UPDATE CASCADE ON DELETE CASCADE,            " +
	  "	 FOREIGN KEY fk_pmid(ParentMasterDealerId) REFERENCES MasterDealer(Id) ON UPDATE CASCADE ON DELETE CASCADE " +
    " ) ENGINE=InnoDB AUTO_INCREMENT=10000001 ;                 ";


   var sqlRetailerTypeTable = " CREATE TABLE IF NOT EXISTS RetailerType (  " +
            "  Id INT UNSIGNED  NOT NULL AUTO_INCREMENT PRIMARY KEY,  " +
    	      "  Name VARCHAR(50) NOT NULL DEFAULT ''                   " +
            " );  		                                                ";
*/
/*
  var sqlTransactionTable = " CREATE TABLE IF NOT EXISTS Transaction (  " +
    "     PaymentId INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,    " +
    "	    UserId INT UNSIGNED NOT NULL,                                  " +
  	"	    PaymentDate DATE NOT NULL,                                     " +
    "     PaymentTo INT UNSIGNED NOT NULL,                               " +  
    "     UserType VARCHAR(25) NOT NULL DEFAULT '',                      " + 
    "     TransactionType VARCHAR(25) NOT NULL DEFAULT '',               " +
    "     PaymentType VARCHAR(25) NOT NULL DEFAULT '',                   " +
    "     Description VARCHAR(255) NOT NULL DEFAULT '',                  " +
    "     Remark VARCHAR(25) NOT NULL DEFAULT '',                        " +
    "     CreditAmount DECIMAL(10,3),                                    " +
    "     DebitAmount DECIMAL(10,3),                                     " +
    "     Balance DECIMAL(10,3)     		                                " +  
    "    );  		 		" ;
*/
/*
    var sqlSchemeTable = "	CREATE TABLE IF NOT EXISTS Scheme (	 " +
    "   Id INT UNSIGNED  NOT NULL AUTO_INCREMENT PRIMARY KEY,    " +
    "   Name  VARCHAR(50) NOT NULL DEFAULT '',                   " +
	  "   Type VARCHAR(25) NOT NULL DEFAULT ''                     " +
    " );	                                                       ";

 var sqlRechargeTable = " CREATE TABLE IF NOT EXISTS RechargeDetails (   " +
    "     TransactionId VARCHAR(30) ,                                    " +
  	"	    RetailerId INT UNSIGNED NOT NULL,                              " +
    "	    Status VARCHAR(15) NOT NULL,                                   " +
  	"	    OrderId VARCHAR(30) PRIMARY KEY,                               " + 
    "     OperatorId VARCHAR(50),                                        " + 
    "     MobileNo VARCHAR(10) NOT NULL,                                 " + 
    "     RechargeType VARCHAR(15) NOT NULL,                             " +
    "     RechargeAmount DECIMAL(10,3) NOT NULL,                         " +
    "     CustomerName VARCHAR(50),                                      " +
    "     Company VARCHAR(50) NOT NULL DEFAULT '',                       " +
	  "     OperatorCode VARCHAR(50) NOT NULL,                             " +	
	  "     RechargeDate BIGINT NOT NULL                                   " +
    "    );  		 		                                                     " ;

    var sqlMoneyTransferTable = " CREATE TABLE IF NOT EXISTS MoneyTransfer (  " +
    "   TransferId INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,     " +
    "	  SenderId INT UNSIGNED NOT NULL,                                  " +
	  "   RecieverId INT UNSIGNED NOT NULL,                                " +
    "   SenderMobileNo VARCHAR(11) NOT NULL,                             " +
    "   RecieverMobileNo VARCHAR(11) NOT NULL,                           " +
  	"	  TransferDate BIGINT NOT NULL,                                    " +
    "   TransferAmount DECIMAL(10,3),                                    " +
    "   SenderBalance DECIMAL(10,3),         		                         " +
    "   RecieverBalance DECIMAL(10,3)         		                       " +
    "   );         		 		                                               " ;
  
    var sqlRefundTable = " CREATE TABLE IF NOT EXISTS RefundDetails (    " +
    "     TransactionId VARCHAR(30) ,                                    " +
	  "	    RetailerId INT UNSIGNED NOT NULL,                              " +
  	"	    OrderId VARCHAR(30) PRIMARY KEY,                               " + 
    "     MobileNo VARCHAR(10) NOT NULL,                                 " + 
    "     RechargeType VARCHAR(15) NOT NULL,                             " +
    "     RechargeAmount DECIMAL(10,3) NOT NULL,                         " +
	  "     RefundAmount DECIMAL(10,3) NOT NULL,                           " +
	  "     Balance DECIMAL(10,3) NOT NULL,                                " +
    "     CustomerName VARCHAR(50),                                      " +
    "     Company VARCHAR(50) NOT NULL DEFAULT '',                       " +	
	  "     RechargeDate BIGINT NOT NULL                                   " +
    "    );  		 		                                                     " ;

    var sqlComplainTable = " CREATE TABLE IF NOT EXISTS Complain (  " +
    "     ComplainId INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,   " +
   	"     RetailerId INT UNSIGNED NOT NULL ,                             " +
	  "	    Message VARCHAR(255) NOT NULL,                                 " +
  	"	    OrderId VARCHAR(30),                                           " + 
	  "     Number VARCHAR(25),                                            " + 
    "     RechargeType VARCHAR(15),                                      " +
    "     RechargeAmount DECIMAL(10,3),                                  " +
	  "     RechargeStatus VARCHAR(10),                                    " +
    "     Company VARCHAR(50),                                           " +	
	  "     RechargeDate BIGINT UNSIGNED,                                  " + 
	  "     SolveDate BIGINT UNSIGNED,                                     " + 
    "	    ResponseMessage VARCHAR(255),                                  " +	
	  "	    Status VARCHAR(10)                                             " +	
    "    );  		 		                                                     " ;

    var sqlFundRequestTable = " CREATE TABLE IF NOT EXISTS FundRequest ( " +
   	"	    RequestId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,             " +
    "	    RequestSenderId INT UNSIGNED NOT NULL,                         " +
    "	    RequestRecieverId INT UNSIGNED NOT NULL,                       " +
    "	    PaymentDate BIGINT NOT NULL,                                   " +
  	"	    Amount DECIMAL(10,3) NOT NULL,                                 " + 
    "     PaymentMode VARCHAR(20) NOT NULL,                              " + 
    "     DepositTime VARCHAR(10),                                       " + 
    "     BankName VARCHAR(30) NOT NULL,                                 " +
    "     BankCharge DECIMAL(10,3) NOT NULL,                             " +
    "     Remarks VARCHAR(255),                                          " +
	  "	    DDChequeDate BIGINT NOT NULL,                                  " +
    "	    DDChequeNumber VARCHAR(50) NOT NULL,                           " +
    "     ResponseMessage VARCHAR(255),                                  " +
    "	    RequestDate BIGINT NOT NULL,                                   " +
    "	    ResponseDate BIGINT NOT NULL,                                  " +		
	  "     Status VARCHAR(50)                                             " + 
    "    );  		 		                                                     " ;
    
    var sqlRevertTransactionTable = " CREATE TABLE IF NOT EXISTS RevertTransactionDetails (  " +
    "     TransactionId INT UNSIGNED NOT NULL,                                   " +
    "	    RevertFrom INT UNSIGNED NOT NULL,                                      " +
	  "     RevertTo INT UNSIGNED NOT NULL,                                        " +
  	"	    RevertDate BIGINT NOT NULL,                                            " +
    "     TransferedAmount DECIMAL(10,3),                                        " +
	  "     RevertedAmount DECIMAL(10,3),                                          " +
	  "     RevertedFromBalance DECIMAL(10,3),                                     " +
	  "     RevertedToBalance DECIMAL(10,3)                                       " +
    "    );  		 		                                                             " ;

     createTables(adminTable, 'admin'); 
     createTables(sqlMasterTable, 'MasterDealer'); 
     createTables(sqlDealerTable, 'Dealer'); 
     createTables(sqlRetailerTable, 'Retailer'); 
     createTables(sqlRetailerTypeTable, 'RetailerType'); 
 //    createTables(sqlTransactionTable, 'Transaction'); 
     createTables(sqlSchemeTable, 'Scheme'); 
     createTables(sqlRechargeTable, 'RechargeDetails'); 
     createTables(sqlMoneyTransferTable, 'MoneyTransfer'); 
     createTables(sqlRefundTable, 'RefundDetails'); 
     createTables(sqlComplainTable, 'Complain'); 
     createTables(sqlFundRequestTable, 'FundRequest'); 
     createTables(sqlRevertTransactionTable, 'RevertTransactionDetails');  
// });  
*/


exports.AddMasterDealer = function (req, res) {
  
   console.log('add master dealer func');
   /*  
      var name = req.body.Name;
      var mobile = req.body.Mobile; 
      var state = req.body.State;
      var city = req.body.City;
      var email = req.body.EmailId; 
      var balance = parseFloat(req.body.Balance); 
      var loginStatus = req.body.LoginStatus; 
      var address = req.body.Address;
      var retailerType = req.body.RetailerType; 
      var panNo = req.body.PanNo;
      var pinCode = req.body.PinCode; 
      var landline = req.body.LandLine; 
      var contactPerson = req.body.ContactPerson; 
      var password = req.body.Password;
      var scheme = req.body.Scheme;
   */
      var mDealerObj = req.body;

      var transferDetails = {};
	    transferDetails["SenderId"] = mDealerObj.SenderId;
      transferDetails["RecieverId"] = 0;
      transferDetails["Amount"] = mDealerObj.Balance;

      delete mDealerObj["Cpassword"];
      delete mDealerObj["SenderId"];
 
      console.log(mDealerObj);

   //var sql = "INSERT INTO MasterDealer (Name, Mobile, State, City, EmailID, Balance, LoginStatus, Address, RetailerType, PanNo, PinCode, Landline, ContactPerson, Scheme, Password) VALUES ( '" + name + "','" + mobile + "','" + state + "','" + city + "','" + email + "'," + balance + ",'" + loginStatus + "','" + address + "','" + retailerType + "','" + panNo + "','" + pinCode + "','" + landline + "','" + contactPerson + "','" + scheme + "','" + password + "')";
   //var sql = ; 
 pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

 var sql1 = "select Balance from "+ getTableName(transferDetails.SenderId) +" WHERE Id = "+transferDetails.SenderId;  
 connection.query(sql1, function (err1, result1) {
 //   connection.release();
    if (err1) { 
       console.log('unable to add master dealer');
       console.log(err);
       return res.send({message:"unable to add master dealer", done:false});   
    }
    console.log(result1);
   
    if(!result1) {
       console.log('unable to add master dealer');
       return res.send({message:"unable to add master dealer", done:false});   
    } else if((result1[0].Balance - transferDetails.Amount) < 0) {
      // min balance 0 for master dealer and admin
       console.log('Insufficient balance');
       return res.send({message:"You don't have enough balance", done:false});   
    } else {
       //this balance is updated in moneytransfer again, so make it 0
       mDealerObj.Balance = 0;
       connection.query("INSERT INTO MasterDealer SET ?", mDealerObj, function (err, result) {
        connection.release();
        if (err) {
           console.log('unable to add masterDealer');
           console.log(err);
           res.send({data:"failure", "message":"unable to add", done:false});
        } else {
       
           console.log("master dealer inserted");
           console.log(result.insertId);
          
           if(transferDetails.Amount > 0) {
             transferDetails["RecieverId"] = result.insertId;
             var newReq = {"body": transferDetails};
             exports.MoneyTransferDetails(newReq, res);
           } else {
             return res.send({data:"Master Dealer added successfully", "message":"Master Dealer added successfully", done:true});
           }
      //  res.send({data:"success", "lastId":result.insertId});
        }
       });

     }  
   })   
 }) 
}


exports.DeleteMasterDealerbyId = function (req, res) {

  var id = parseInt(req.body.Id);

  var sql = "DELETE FROM MasterDealer WHERE Id = ?";

pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

  connection.query(sql, [id], function (err, result) {
    connection.release();
    if (err) {
       console.log('unable to delete masterDealer');
       console.log(err);
       res.send({data:"failure", "message":"unable to delete", "done":false});
    } else {
       console.log("Number of records deleted: " + result.affectedRows);
       res.send({data:"success", "message":"deleted successfully", "done":true}); 
    };
  });
 }) 
}

exports.EditMasterDealerbyId = function (req, res) {
//  if(!connection) {
//   reconnect(connection);
// }
  /*
      var id = parseInt(req.body.Id);
      var name = req.body.Name;
      var mobile = req.body.Mobile; 
      var state = req.body.State;
      var city = req.body.City;
      var email = req.body.EmailId; 
      var balance = parseFloat(req.body.Balance); 
      var loginStatus = req.body.LoginStatus; 
      var address = req.body.Address;
      var retailerType = req.body.RetailerType; 
      var panNo = req.body.PanNo;
      var pinCode = req.body.PinCode; 
      var landline = req.body.LandLine; 
      var contactPerson = req.body.ContactPerson; 
      var scheme = req.body.Scheme;
 */
      var mDealerObj = req.body;

//  var sql = "UPDATE MasterDealer SET Name = '" + name + "', Mobile = '" + mobile + "', State = '" + state + "', City = '" + city + "', EmailId = '" + email + "', Balance = " + balance + ", LoginStatus = '" + loginStatus + "', Address = '" + address + "', RetailerType = '" + retailerType + "', PanNo = '" + panNo + "', PinCode = '" + pinCode + "', Landline = '" + landline + "', ContactPerson = '" + contactPerson + "', Scheme = '" + scheme + "' WHERE Id = " + id + "";
 var sql = "UPDATE MasterDealer SET Name = ?, Mobile = ?, State = ?, City = ?, EmailId = ?, Balance = ?, LoginStatus = ?, Address = ?, RetailerType = ?, PanNo = ?, PinCode = ?, Landline = ?, ContactPerson = ?, Scheme = ? WHERE Id = ?";
  
 pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   } 
  connection.query(sql, [mDealerObj.Name, mDealerObj.Mobile, mDealerObj.State, mDealerObj.City, mDealerObj.EmailId, mDealerObj.Balance, mDealerObj.LoginStatus, mDealerObj.Address, mDealerObj.RetailerType, mDealerObj.PanNo, mDealerObj.PinCode, mDealerObj.LandLine, mDealerObj.ContactPerson, mDealerObj.Scheme, mDealerObj.Id],function (err, result) {
    connection.release();
    if (err) {
       console.log('unable to edit masterDealer');
       console.log(err);
       res.send({data:"failure","message":"unable to edit", done:false}); 
    } else {
       console.log(result.affectedRows + " record(s) updated"); 
       res.send({data:"success", "message":"edited successfully", done:true}); 
    };
  });
 }) 
}

exports.GetAllMasterDealers = function (req, res) {
  var count = Number(req.body.count);
  console.log('get all master dealer func');
  
 pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

  connection.query("SELECT * FROM MasterDealer LIMIT "+count+",20", [], function (err, result) {
    connection.release();
    if (err) {
       console.log('unable to get masterDealer');
       console.log(err);
       res.send({data:"failure", "message":"unable to get master dealers", done:false});
    } else {
       console.log(result);
       res.send({data:result, "message":"success", done:true});
    };
  });
 }) 
}

//-----------------

exports.AddDealer = function (req, res) {

 /*
      var name = req.body.Name;
      var mobile = req.body.Mobile; 
      var state = req.body.State;
      var city = req.body.City;
      var email = req.body.EmailId; 
      var balance = parseFloat(req.body.Balance); 
      var loginStatus = req.body.LoginStatus; 
      var address = req.body.Address;
      var retailerType = req.body.RetailerType; 
      var panNo = req.body.PanNo;
      var pinCode = req.body.PinCode; 
      var landline = req.body.LandLine; 
      var contactPerson = req.body.ContactPerson; 
      var password = req.body.Password;
      var scheme = req.body.Scheme;
      var parentMasterDealerId = parseInt(req.body.ParentMasterDealerId);
 */
      var dealerObj = req.body;
      var transferDetails = {};
	    transferDetails["SenderId"] = dealerObj.SenderId;
      transferDetails["RecieverId"] = 0;
      transferDetails["Amount"] = dealerObj.Balance;

      delete dealerObj["Cpassword"];
      delete dealerObj["SenderId"]; 

      console.log(dealerObj);
  
 // var sql = "INSERT INTO Dealer (Name, Mobile, State, City, EmailID, Balance, LoginStatus, Address, RetailerType, PanNo, PinCode, Landline, ContactPerson, Scheme, Password, ParentMasterDealerId) VALUES ( '" + name + "','" + mobile + "','" + state + "','" + city + "','" + email + "'," + balance + ",'" + loginStatus + "','" + address + "','" + retailerType + "','" + panNo + "','" + pinCode + "','" + landline + "','" + contactPerson + "','" + scheme + "','" +password + "'," + parentMasterDealerId + ")";
  
pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

 var sql1 = "select Balance from "+ getTableName(transferDetails.SenderId) +" WHERE Id = "+transferDetails.SenderId;  
 connection.query(sql1, function (err1, result1) {
 //   connection.release();
    if (err1) { 
       console.log('unable to add master dealer');
       console.log(err);
       return res.send({message:"unable to add master dealer", done:false});   
    }
    console.log(result1);
   
    if(!result1) {
       console.log('unable to add master dealer');
       return res.send({message:"unable to add master dealer", done:false});   
    } else if((result1[0].Balance - transferDetails.Amount) < 0) {
      // min balance 0 for master dealer and admin
       console.log('Insufficient balance');
       return res.send({message:"You don't have enough balance", done:false});   
    } else {
      dealerObj.Balance = 0;
      connection.query("INSERT INTO Dealer SET ?", dealerObj, function (err, result) {
       connection.release();
       if (err) {
         console.log('unable to add Dealer');
         console.log(err);
         return res.send({data:"failure", "message":"unable to insert dealer", done:false});
       } else {
         console.log("Dealer added successfully");
         
         if(transferDetails.Amount > 0) {
            transferDetails["RecieverId"] = result.insertId;
            var newReq = {"body": transferDetails};
            console.log(newReq);
            exports.MoneyTransferDetails(newReq, res);
         } else {
           return res.send({data:"Dealer added successfully", "message":"Dealer added successfully", done:true});
         }
        };
      });
    }
  })     
 }) 
}

exports.DeleteDealerbyId = function (req, res) {

  var id = parseInt(req.body.Id);

//  var sql = "DELETE FROM Dealer WHERE Id = " + id + "";
  
pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

  connection.query("DELETE FROM Dealer WHERE Id = ? ",[id], function (err, result) {
    connection.release();
    if (err) {
       console.log('unable to delete Dealer');
       console.log(err);
       res.send({data:"failure", "message":"unable to delete dealer", done:false});
    } else {
       console.log("Number of records deleted: " + result.affectedRows);
       res.send({data:"success", "message":"deleted successfully", done:true});
    };
  });
 }) 
}

exports.EditDealerbyId = function (req, res) {

      var id = parseInt(req.body.Id);
      var name = req.body.Name; 
      var mobile = req.body.Mobile; 
      var state = req.body.State;
      var city = req.body.City;
      var email = req.body.EmailId; 
      var balance = parseFloat(req.body.Balance); 
      var loginStatus = req.body.LoginStatus; 
      var address = req.body.Address;
      var retailerType = req.body.RetailerType; 
      var panNo = req.body.PanNo;
      var pinCode = req.body.PinCode; 
      var landline = req.body.LandLine; 
      var contactPerson = req.body.ContactPerson; 
      var scheme = req.body.Scheme;
      var parentMasterDealerId = parseInt(req.body.ParentMasterDealerId);
  

  var sql = "UPDATE Dealer SET Name = '" + name + "', Mobile = '" + mobile + "', State = '" + state + "', City = '" + city + "', EmailId = '" + email + "',  Balance = " + balance + ", LoginStatus = '" + loginStatus + "', Address = '" + address + "', RetailerType = '" + retailerType + "', PanNo = '" + panNo + "', PinCode = '" + pinCode + "', Landline = '" + landline + "', ContactPerson = '" + contactPerson + "', Scheme = '" + scheme + "', parentMasterDealerId = " + parentMasterDealerId + " WHERE Id = " + id + "";
 
 pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

  connection.query(sql, function (err, result) {
    connection.release();
    if (err) {
       console.log('unable to edit Dealer');
       console.log(err);
       res.send({data:"failure", "message":"unable to edit dealer", done:false});
    } else {
       console.log(result.affectedRows + " record(s) updated");
       res.send({data:"success", "message":"dealer edited successfully", done:true});
    };
  });
 }) 
}

exports.GetDealersbyMasterId = function (req, res) {
 // if(!connection) {
 //  reconnect(connection);
 // }

  var masterid = parseInt(req.body.Masterid);
  var count = Number(req.body.count);
  console.log(masterid);

pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

  connection.query("SELECT * FROM Dealer WHERE ParentMasterDealerId = ? LIMIT ?,20 ", [masterid, count], function (err, result) {
    connection.release();
    if (err) {
       console.log('unable to get Dealers');
       console.log(err);
       return res.send({data:"failure", "message":"unable to get dealers", done:false});
    } else {
       console.log(result);
       return res.send({data:result, "message":"success", done:true});
    };
  });
 })  
}

/*
exports.GetAllDealers = function (req, res) {
//  if(!connection) {
//   reconnect(connection);
//  }


pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

  connection.query("SELECT * FROM Dealer", [], function (err, result) {
    connection.release();
    if (err) {
       console.log('unable to get all Dealers');
       console.log(err);
       res.send({data:"failure", "message":"unable to get all Dealers", done:false});
    } else {
       console.log(result);
       res.send({data:result, "message":"success", done:true});
    };
  });
 })  
}
*/
//------------

exports.AddRetailer = function (req, res) {
 // if(!connection) {
 //  reconnect(connection);
 // }
  /*
      var name = req.body.Name; 
      var mobile = req.body.Mobile; 
      var state = req.body.State;
      var city = req.body.City;
      var email = req.body.EmailId; 
      var balance = parseFloat(req.body.Balance); 
      var loginStatus = req.body.LoginStatus; 
      var address = req.body.Address;
      var retailerType = req.body.RetailerType; 
      var panNo = req.body.PanNo;
      var pinCode = req.body.PinCode; 
      var landline = req.body.LandLine; 
      var contactPerson = req.body.ContactPerson; 
      var scheme = req.body.Scheme;
      var password = req.body.Password;
      var parentDealerId =  parseInt(req.body.ParentDealerId);
      var parentMasterDealerId = parseInt(req.body.ParentMasterDealerId);
  */
     // retailerType = parseInt(retailerType);
      var retailerObj = req.body;

      var transferDetails = {};
   //   transferDetails["CurSenderBalance"] = retailerObj.CurSenderBalance;
	    transferDetails["SenderId"] = retailerObj.SenderId;
      transferDetails["RecieverId"] = 0;
  //    transferDetails["RecieverBalance"] = 0;
      transferDetails["Amount"] = retailerObj.Balance;

  //    transferDetails["RecieverMobileNo"] = retailerObj.Mobile;
	//    transferDetails["SenderMobileNo"] = retailerObj.SenderMobileNo; 

      delete retailerObj["Cpassword"];
 //     delete retailerObj["CurSenderBalance"];
      delete retailerObj["SenderId"]; 
 //     delete retailerObj["SenderMobileNo"]; 

      console.log(req.body);
      
//  var sql = "INSERT INTO Retailer (Name, Mobile, State, City, EmailID, Balance, LoginStatus, Address, RetailerType, PanNo, PinCode, Landline, ContactPerson, Scheme, Password, ParentDealerId, ParentMasterDealerId) VALUES ( '" + name + "','" + mobile + "','" + state + "','" + city + "','" + email + "'," + balance + ",'" + loginStatus + "','" + address + "','" + retailerType + "','" + panNo + "','" + pinCode + "','" + landline + "','" + contactPerson + "','" + scheme + "','" + password + "',"+ parentDealerId +"," + parentMasterDealerId + ")";
  
  pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

  var sql1 = "select Balance from "+ getTableName(transferDetails.SenderId) +" WHERE Id = "+transferDetails.SenderId;  
  connection.query(sql1, function (err1, result1) {
 //   connection.release();
    if (err1) { 
       console.log('unable to add master dealer');
       console.log(err);
       return res.send({message:"unable to add master dealer", done:false});   
    }
    console.log(result1);
   
    if(!result1) {
       console.log('unable to add master dealer');
       return res.send({message:"unable to add master dealer", done:false});   
    } else if((getTableName(transferDetails.SenderId) == "Dealer") && (result1[0].Balance - transferDetails.Amount) < 5000) {
      // min balance 0 for master dealer and admin
       console.log('Insufficient balance');
       return res.send({message:"You don't have enough balance", done:false});   
    } else if((getTableName(transferDetails.SenderId) != "Dealer") && (result1[0].Balance - transferDetails.Amount) < 0) {
      // min balance 0 for master dealer and admin
       console.log('Insufficient balance');
       return res.send({message:"You don't have enough balance", done:false});   
    } else {
        retailerObj.Balance = 0;
        connection.query("INSERT INTO Retailer SET ?", retailerObj, function (err, result) {
         connection.release();
         if (err) {
           console.log('unable to add retailer');
           console.log(err);
           res.send({data:"failure", "message":"unable to add retailer", done:false});
         } else {
           console.log("1 record inserted");
           
           //  res.send({data:"success"}); 

            if(transferDetails.Amount > 0) {
              transferDetails["RecieverId"] = result.insertId;
              var newReq = {"body": transferDetails};
              exports.MoneyTransferDetails(newReq, res);
            } else {
              return res.send({data:"Retailer added successfully", "message":"Retailer added successfully", done:true});
            }
         };
        });
    }
  })    
 }) 
}

exports.DeleteRetailerbyId = function (req, res) {
 // if(!connection) {
 //  reconnect(connection);
 // }
  
  var id = parseInt(req.body.Id);

 // var sql = "DELETE FROM Retailer WHERE Id = " + id + "";
  
 pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

  connection.query("DELETE FROM Retailer WHERE Id = ?", [id], function (err, result) {
    connection.release();
    if (err) {
       console.log('unable to delete retailer');
       console.log(err);
       res.send({data:"failure", "message":"unable to delete retailer", done:false});
    } else {
       console.log("Number of records deleted: " + result.affectedRows);
       res.send({data:"success", "message":"success", done:true});
    };
  });
 }) 
}

exports.EditRetailerById = function (req, res) {
 //  if(!connection) {
 //    reconnect(connection);
 //  }
      var id = parseInt(req.body.Id);
      var name = req.body.Name; 
      var mobile = req.body.Mobile; 
      var state = req.body.State;
      var city = req.body.City;
      var email = req.body.EmailId; 
      var balance = parseFloat(req.body.Balance); 
      var loginStatus = req.body.LoginStatus; 
      var address = req.body.Address;
      var retailerType = req.body.RetailerType; 
      var panNo = req.body.PanNo; 
      var pinCode = req.body.PinCode; 
      var landline = req.body.LandLine; 
      var contactPerson = req.body.ContactPerson; 
      var scheme = req.body.Scheme;
      var parentDealerId = parseInt(req.body.ParentDealerId);
      var password = req.body.Password;
      var parentMasterDealerId = parseInt(req.body.ParentMasterDealerId);
  
  var sql = "UPDATE Retailer SET Name = '" + name + "', Mobile = '" + mobile + "', State = '" + state + "', City = '" + city + "', EmailId = '" + email + "',  Balance = " + balance + ", LoginStatus = '" + loginStatus + "', Address = '" + address + "', RetailerType = '" + retailerType + "', PanNo = '" + panNo + "', PinCode = '" + pinCode + "', Landline = '" + landline + "', ContactPerson = '" + contactPerson + "', Scheme = '" + scheme + "', parentDealerId = " + parentDealerId + ",  parentMasterDealerId = " + parentMasterDealerId + " WHERE Id = " + id + "";
  
pool.getConnection(function (error, connection) { 
   connection.release();
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

  connection.query(sql, function (err, result) {
    if (err) {
       console.log('unable to edit retailer');
       console.log(err);
       res.send({data:"failure", message:"unable to edit", done:false});
    } else {
       console.log(result.affectedRows + " record(s) updated");
       res.send({data:"success", message:"success", done:true});
    };
  });
 }) 
}

exports.GetRetailerByDealerId = function (req, res) {
//  if(!connection) {
//   reconnect(connection);
//  }

  var dealerid = parseInt(req.body.Dealerid);
  var count = Number(req.body.count);
  console.log(req.body);

pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

  connection.query("SELECT * FROM Retailer WHERE ParentDealerId = ? LIMIT ?,20", [dealerid, count], function (err, result) {
    connection.release();
    if (err) {
       console.log('unable to get retailer by dealer id');
       console.log(err);
       res.send({data:"failure", message:"unable to get", done:false});
    } else {
       console.log(result);
       res.send({data:result, message:"success", done:true});
    };
  });
 })  
}

exports.GetRetailerByMasterId = function (req, res) {
 //if(!connection) {
 //  reconnect(connection);
 //}

  var masterid = parseInt(req.body.Masterid);
  var count = Number(req.body.count);

pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

  connection.query("SELECT * FROM Retailer WHERE ParentMasterDealerId = ? LIMIT ?,20", [masterid, count], function (err, result) {
    connection.release();
    if (err) {
       console.log('unable to get retailer by master id');
       console.log(err);
       res.send({data:"failure", message:"unable to get", done:false});
    } else {
       console.log(result);
       res.send({data:result, message:"success", done:true});
    };
  });
 })  
}

/*
exports.GetAllRetailers = function (req, res) {
 // if(!connection) {
 //  reconnect(connection);
 // }

 pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

  connection.query("SELECT * FROM Retailer", [], function (err, result) {
    connection.release();
    if (err) {
       console.log('unable to get all retailer');
       console.log(err);
       res.send({data:"failure", message:"unable to get", done:false});
    } else {
       console.log(result);
       res.send({data:result, message:"success", done:true});
    };
  });
 })  
}
*/

//------------

exports.GetAllRetailerType = function (req, res) {
//  if(!connection) {
//   reconnect(connection);
//  }

 pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

   connection.query("SELECT * FROM RetailerType", [], function (err, result) {
    connection.release();
    if (err) {
       console.log('unable to get retailerType');
       console.log(err);
       res.send({data:"failure", message:"unable to get", done:false});
    } else {
       console.log(result);
       res.send({data:result, message:"success", done:true});
    };
  });
 })  
}

exports.AddNewRetailerType = function (req, res) {
 // if(!connection) {
 //  reconnect(connection);
 // }
 // var name = req.body.Name;
  var retailerTypeObj = req.body;
  console.log(req.body);

//  var sql = "INSERT INTO RetailerType (Name) VALUES ( '" + name + "')";
//  console.log(sql);
pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

  connection.query("INSERT INTO RetailerType SET ?", retailerTypeObj, function (err, result) {
    connection.release();
    if (err) {
       console.log('unable to add retailerType');
       console.log(err);
       res.send({data:"failure", message:"unablle to add", done:false});
    } else {
       console.log("1 record inserted");
       res.send({data:"success", message:"success", done:true});
    };
  });
 }) 
}

exports.DeleteRetailerTypebyId = function (req, res) {
 // if(!connection) {
 //  reconnect(connection);
 // }
  var id = parseInt(req.body.Id);

  //var sql = "DELETE FROM RetailerType WHERE Id = " + id + "";

pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

  connection.query("DELETE FROM RetailerType WHERE Id = ?", [id], function (err, result) {
    connection.release();
    if (err) {
       console.log('unable to delete retailerType');
       console.log(err);
       res.send({data:"failure", message:"unable to delete", done:false});
    } else {
       console.log("Number of records deleted: " + result.affectedRows);
       res.send({data:"success", message:"success", done:true});
    };
  });
 }) 
}

exports.EditRetailerTypebyId = function (req, res) {
//  if(!connection) {
//   reconnect(connection);
//  }
  var id = parseInt(req.body.Id);
  var name = req.body.Name;

  var sql = "UPDATE RetailerType SET Name = '" + name + "' WHERE Id = " + id + "";

pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

  connection.query(sql, function (err, result) {
    connection.release();
    if (err) {
       console.log('unable to edit retailerType');
       console.log(err);
       res.send({message:"Unable to edit retailer type", done:false});
    } else {
       console.log(result.affectedRows + " record(s) updated");
       res.send({message:"Retailer type edited successfully", done:true});
    };
  });
 }) 
}

//---------------

exports.AddNewScheme = function (req, res) {
// if(!connection) {
//   reconnect(connection);
// }
 // var name = req.body.Name;
 // var type = req.body.Type;
  var schemeObj = req.body;

  //var sql = "INSERT INTO Scheme (Name, Type) VALUES ( '" + name + "','" + type + "')";
  
pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", done:false});
   }

  connection.query("INSERT INTO Scheme SET ?", schemeObj, function (err, result) {
    connection.release();
    if (err) {
       console.log('unable to add scheme');
       console.log(err);
       res.send({data:"failure", message:"unable to add", done:false});
    } else {
       console.log("1 record inserted");
       res.send({data:"success", message:"success", done:true});
    };
  });
 }) 
}

exports.DeleteSchemebyId = function (req, res) {
 // if(!connection) {
 //  reconnect(connection);
 // }
  var id = parseInt(req.body.Id);

 // var sql = "DELETE FROM Scheme WHERE Id = " + id + "";
pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

  connection.query("DELETE FROM Scheme WHERE Id = ?", [id], function (err, result) {
    connection.release();
    if (err) {
       console.log('unable to delete scheme');
       console.log(err);
       res.send({data:"failure", message:"unable to delete", done:false});
    } else {
       console.log("Number of records deleted: " + result.affectedRows);
       res.send({data:"success", message:"success", done:true});
    };
  });
 }) 
}

exports.EditSchemebyId = function (req, res) {
//  if(!connection) {
//   reconnect(connection);
//  }
  var id = parseInt(req.body.Id);
  var name = req.body.Name;
  var type = req.body.Type;

  var sql = "UPDATE Scheme SET Name = '" + name + "', Type = '" + type + "' WHERE Id = " + id + "";
 
pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

  connection.query(sql, function (err, result) {
    connection.release();
    if (err) {
       console.log('unable to edit scheme');
       console.log(err);
       res.send({data:"failure", message:"unable to update", done:false});
    } else {
       console.log(result.affectedRows + " record(s) updated");
       res.send({data:"success", message:"success", done:true});
    };
  });
 }) 
}

exports.GetSchemebyType = function (req, res) {
 // if(!connection) {
 //  reconnect(connection);
 // }
  var type = req.body.Type;

pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

   connection.query("SELECT * FROM Scheme WHERE Type = ?", [type], function (err, result) {
    connection.release(); 
    if (err) {
       console.log('unable to get scheme');
       console.log(err);
       res.send({data:"failure", message:"unable to get", done:false});
    } else {
       console.log(result);
       res.send({data:result, message:"success", done:true});
    };
  });
 })  
}

exports.GetAllScheme = function (req, res) {
//  if(!connection) {
//   reconnect(connection);
//  }

pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

   connection.query("SELECT * FROM Scheme", [], function (err, result) {
     connection.release();
    if (err) {
       console.log('unable to get scheme');
       console.log(err);
       res.send({message:"unable to get all scheme", done:false});
    } else {
       console.log(result);
       res.send({message:"get all scheme success", "data":result, "done":true});
    };
  });
 })  
}

//---------------------------

exports.AddNewTransaction = function (req, res) {
 // if(!connection) {
 //  reconnect(connection);
 // }
  var userId = parseInt(req.body.UserId);  
  var paymentDate = req.body.PaymentDate;
  var paymentTo = parseInt(req.body.PaymentTo); 
  var userType = req.body.UserType;
  var transactionType = req.body.TransactionType; 
  var paymentType = req.body.PaymentType;
  var description = req.body.Description;
  var remark = req.body.Remark; 
  var creditAmount = parseFloat(req.body.CreditAmount);
  var debitAmount = parseFloat(req.body.DebitAmount);
  var balance = parseFloat(req.body.Balance);

  var sql = "INSERT INTO Transaction (UserId, PaymentDate, PaymentTo, UserType, TransactionType, PaymentType, Description, Remark, CreditAmount, DebitAmount, Balance) VALUES ( " + userId + "," + paymentDate + "," + paymentTo + ",'" + userType + "','" + transactionType + "','" + paymentType + "','" + description + "','" + remark + "'," + creditAmount + "," + debitAmount + "," + balance + ")";

pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }  
  connection.query(sql, function (err, result) {
    connection.release();
    if (err) {
       console.log('unable to add Transaction');
       console.log(err);
       res.send({data:"failure", message:"unable to add", done:false});
    } else {
       console.log("1 record inserted");
       res.send({data:"success", message:"success", done:true});
    };
  });
 }) 
}

exports.DeleteTransactionbyId = function (req, res) {
//  if(!connection) {
//   reconnect(connection);
//  }
  var paymentId = parseInt(req.body.PaymentId);

 // var sql = "DELETE FROM Transaction WHERE PaymentId = " + paymentId +"";

pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", message:"unable to delete", done:false});
   }

  connection.query("DELETE FROM Transaction WHERE PaymentId = ?", [paymentId], function (err, result) {
    connection.release();
    if (err) {
       console.log('unable to delete Transaction');
       console.log(err);
       res.send({data:"failure", message:"unable to delete", done:false});
    } else {
       console.log("Number of records deleted: " + result.affectedRows);
       res.send({data:"success", message:"success", done:true});
    };
  });
 }) 
}

exports.EditTransactionbyId = function (req, res) {
 // if(!connection) {
 //  reconnect(connection);
 // }
  var paymentId = parseInt(req.body.PaymentId);
  var userId = parseInt(req.body.UserId);  
  var paymentDate = req.body.PaymentDate;
  var paymentTo = parseInt(req.body.PaymentTo); 
  var userType = req.body.UserType;
  var transactionType = req.body.TransactionType; 
  var paymentType = req.body.PaymentType;
  var description = req.body.Description;
  var remark = req.body.Remark; 
  var creditAmount = parseInt(req.body.CreditAmount);
  var debitAmount = parseInt(req.body.DebitAmount);
  var balance = parseFloat(req.body.Balance);
  
  var sql = "UPDATE Transaction SET UserId = " + userId +", PaymentDate = "+ paymentDate + ", PaymentTo = " + paymentTo + ", UserType = '" + userType + "', TransactionType = '" + transactionType + "', PaymentType = '" + paymentType + "', Description = '" + description + "', Remark = '" + remark + "' , CreditAmount = " + creditAmount + ", DebitAmount = " + debitAmount + ", Balance = " + balance + " WHERE PaymentId = " + paymentId +"";

pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

  connection.query(sql, function (err, result) {
    connection.release();
    if (err) {
       console.log('unable to edit Transaction');
       console.log(err);
       res.send({data:"failure", message:"unable to update", done:false});
    } else {
       console.log(result.affectedRows + " record(s) updated");
       res.send({data:"success", message:"success", done:true});
    };
  });
 }) 
}

 exports.GetTransactionByDateAndUserId = function (req, res) {
 // if(!connection) {
 //  reconnect(connection);
 // }
   var paymentDate = req.body.PaymentDate; 
   var userId = parseInt(req.body.UserId);

pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

   connection.query("SELECT * FROM Transaction WHERE PaymentDate = " + paymentDate + ", AND UserId = " + userId + "", function (err, result) {
    if (err) {
       console.log('unable to get Transaction');
       console.log(err);
       res.send({data:"failure", message:"unable to get", done:false});
    } else {
       console.log(result);
       res.send({data:result, message:"success", done:true});
    };
  });
 })  
}

 exports.changePassword = function (req, res) {
 //  if(!connection) {
 //    reconnect(connection);
 //  }
   var oldpassword = req.body.oldpassword;
   var newpassword = req.body.newpassword;
   var tName = getTableName(req.body.Id);
   var id = Number(req.body.Id);

   var sql = "UPDATE "+tName+" SET Password = '" + newpassword +"' WHERE id = "+id+" AND Password = '"+oldpassword+"'";

 pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"unable to update", done:false});
   }

   connection.query(sql, function (err, result) {
    connection.release();
    if (err) {
       console.log('unable to change password');
       console.log(err);
       return res.send({message:"unable to change password.. try again", done:false});

    } else {
       console.log(result.affectedRows + " record(s) updated");
       if(result.affectedRows) {
         return res.send({message:"Password changed successfully", done:true});   
       } else {
         return res.send({message:"Enter correct old password..", done:false}); 
       }
    };
   }) 
  }); 

 } 

  exports.loginValidate = function(req, res) {
 
   console.log(req.body);

		var username = parseInt(req.body.Uname);
    var password = req.body.Pwd;
    //var tableName = req.body.TableName;
    var tableName = "";
    var locationUrl = "";

    if(username == 123) { 
        tableName = "Admin";
        locationUrl = "/admin"
    } else if(username > 1000 && username <5000000) { 
        tableName = "MasterDealer";
        locationUrl = "/mdealer"
    } else if(username > 5000000 && username < 10000000) { 
        tableName = "Dealer";
        locationUrl = "/dealer"
    } else if(username > 10000000) { 
        tableName = "Retailer";
        locationUrl = "/retailer"
    } else {
        console.log("The username is not existing");
        return res.send({message:"The username is not existing", done:false});
    }

    var sql = "SELECT * FROM " + tableName + " WHERE Id = " + username;
    console.log(sql);

pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

  connection.query(sql, function (err, result) {
    connection.release();
    if (err) {
       console.log('unable to login');
       console.log(err);
       return res.status(401).send({message:"Unable to login.. Please try again", done:false});      
    }

    console.log(result);
    if (!result[0]) {
       console.log("The username is not existing");
       return res.send({message:"The username is not existing", done:false});
    } else if (result[0].Password != password) {
       console.log("The username or password don't match");
       return res.send({message:"The username or password don't match", done:false});
    } else {
      result[0].locationUrl = locationUrl;
      if(!username == 123) {
         updateLoginStatus(tableName, username);  
      }
      
       res.send({
        token: generateToken(result[0]),
        done:true,
        tName: tableName,
        userInfo: result[0],
        locUrl:locationUrl
       }); 
    }
   })
 });
}

function updateLoginStatus(tName, id) {
  var sql = "UPDATE "+tName+" SET LoginStatus = 'Online' WHERE Id = "+id;
  console.log(sql);
  pool.getConnection(function (error, connection) { 
    if(error)  {
       console.log('server busy');
       console.log(error);
     
    }

    connection.query(sql, function(err, result) {
       connection.release();
       if(err) {
         console.log(err);
       } else {
         console.log(result);  
       }

    })
  })
}

exports.GetMIdByDId = function (req, res) {
// if(!connection) {
//   reconnect(connection);
// }
   var did = parseInt(req.body.Dealerid); 
   console.log(did);

pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

   connection.query("SELECT * FROM Dealer WHERE Id = " + did + "", function (err, result) {
    connection.release();
    if (err) {
       console.log('unable to get Master id by did');
       console.log(err);
       res.send({data:"failure", message:"unable to get", done:false});
    } else {
       console.log(result);
       res.send({data:result, message:"success", done:true});
    };
  }); 
 }) 
}

exports.GetBalanceAmount = function (req, res) {
 // if(!connection) {
 //  reconnect(connection);
 // } 
   var id = parseInt(req.body.Id);
   var tName = getTableName(id);


pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

   connection.query("SELECT * FROM "+tName+" WHERE Id = " + id + "", function (err, result) {
    connection.release();
    if (err) {
       console.log('unable to get Master id by did');
       console.log(err);
       res.send({data:"unable to get Balance", done:false});
    } else {
       console.log(result);
       res.send({data:result, "message":"success", done:true});
    };
  });
 })  
}

/*
 exports.UpdateBalanceAmount = function (req, res) {
 // if(!connection) {
 //  reconnect(connection);
 // }
   var tName = req.body.TName;
   var balance = req.body.Balance;
   var id = parseInt(req.body.Id);

   var sql = "UPDATE "+tName+" SET Balance = '" + balance +"' WHERE id = "+id;
   
 pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

   connection.query(sql, function (err, result) {
    connection.release();
    if (err) {
       console.log('unable to update balance');
       console.log(err);
       return res.send({message:"unable to update balance.. try again", done:false});
    } else {
       console.log(result.affectedRows + " record(s) updated");
       if(result.affectedRows) {
         return res.send({message:"Balance Updated successfully", done:true});   
       } else {
         return res.send({message:"balance not updated..", done:false}); 
       }
    };
  });
 })  
}
*/

  function getTableName(id) {
    
    id = Number(id);

    if(id == 123) { 
        return "Admin";
    } else if(id > 1000 && id <5000000) { 
        return "MasterDealer";
    } else if(id > 5000000 && id < 10000000) { 
        return "Dealer";
    } else if(id > 10000000) { 
        return "Retailer";
    } 
	}


exports.MoneyTransferDetails = function (req, res) {
//  if(!connection) {
//   reconnect(connection);
// }
  console.log(req.body);
  var senderId = Number(req.body.SenderId);  
  var recieverId = Number(req.body.RecieverId);
  var amount = Number(req.body.Amount);
//  var recieverBalance = parseFloat(req.body.RecieverBalance);
//  var curSenderBal = parseFloat(req.body.CurSenderBalance);
//  var recieverMobileNo = req.body.RecieverMobileNo;
 // var senderMobileNo = req.body.SenderMobileNo;

  var curSenderBal;
  var senderMobileNo;
  var curRecieverBal
  var curRecieverBal;

  if(!amount) {
    console.log('Invalid amount')
    return res.send({data:"Invalid entered amount", "message":"Invalid entered amount", done:false});
  }
  
pool.getConnection(function (error, connection) { 
 if(error)  {
     console.log('server busy');
     console.log(error);
     return res.send({data:"server busy", "message":"server busy", done:false});
 }
 
 var sql1 = "select Balance, Mobile from "+ getTableName(senderId) +" WHERE Id = "+senderId;  
 connection.query(sql1, function (err1, result1) {
 //   connection.release();
    if (err1) { 
       console.log('unable to transfer');
       console.log(err);
       return res.send({message:"unable to transfer", done:false});   
    }
    console.log(result1);
   
    if(!result1) {
       console.log('Unable to transfer balance');
       return res.send({message:"Unable to transfer balance", done:false});   
    } else if(getTableName(senderId)=="Dealer" && (result1[0].Balance - amount) < 5000) {
       // min balance 5000 for dealer
       console.log('Insufficient balance');
       return res.send({message:"You don't have enough balance", done:false});   
    } else if(getTableName(senderId)!="Dealer" && (result1[0].Balance - amount) < 0) {
      // min balance 0 for master dealer and admin
       console.log('Insufficient balance');
       return res.send({message:"You don't have enough balance", done:false});   
    } else {
       curSenderBal = result1[0].Balance;
       senderMobileNo = result1[0].Mobile;
    
       var sql2 = "select Balance, Mobile from "+ getTableName(recieverId) +" WHERE Id = "+recieverId;  
       connection.query(sql2, function (err2, result2) {
 //    connection.release();
         if (err2) { 
           console.log('unable to transfer');
           console.log(err);
           return res.send({message:"unable to transfer", done:false});   
         } else if(!result1) {
           console.log('Unable to transfer balance');
           return res.send({message:"Unable to transfer balance", done:false});   
         } else {
           curRecieverBal = result2[0].Balance;
           recieverMobileNo = result2[0].Mobile;   

           updateBalance((curSenderBal - amount), senderId, getTableName(senderId));
           updateBalance((curRecieverBal + amount), recieverId, getTableName(recieverId));
           addToMoneyTransfer(senderId, recieverId, senderMobileNo, recieverMobileNo, amount, curSenderBal - amount, curRecieverBal + amount, connection, res);
         }
       })   
     }
   })
 })
}   

function addToMoneyTransfer(senderId, recieverId, senderMobileNo, recieverMobileNo, amount, curSenderBal, curRecieverBal, connection, res) {
  var transferDate = (new Date()).getTime();

  var sql = "INSERT INTO MoneyTransfer (SenderId, RecieverId, SenderMobileNo, RecieverMobileNo, TransferAmount, SenderBalance, RecieverBalance, TransferDate) VALUES ( " + senderId + "," + recieverId + ",'" + senderMobileNo + "','" + recieverMobileNo + "'," + amount + "," + curSenderBal+"," + curRecieverBal + "," + transferDate + ")";
  console.log(sql);

  connection.query(sql, function (err, result) {
    connection.release();
    if (err) {
       console.log('unable to add to money transfer');
       console.log(err);
       return res.send({message:"unable to add to money transfer", done:false}); 
    } else {
       console.log("Balance Updated successfully");
       return res.send({message:"Balance Updated successfully", done:true});   
    } 
  });
 }
 
exports.Recharge = function(req, res) {

    var rechargeDetails = req.body;
    rechargeDetails["OrderId"] = (new Date()).getTime();

    var details ={}; 
		details["circlecode"] = "";
		details["operatorcode"] = rechargeDetails.OperatorCode; 
		details["number"] = rechargeDetails.MobileNo;
		details["amount"] = rechargeDetails.RechargeAmount;
		details["orderid"] = rechargeDetails.OrderId;
    details["username"] = 9019;
	  details["pwd"] = 69865987;
    
    console.log('entered recharge api');
    console.log(details);

 pool.getConnection(function (error, connection) { 
     if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
     }

   var sql = "select Balance from Retailer WHERE Id = "+rechargeDetails.RetailerId;
   console.log(sql);
   connection.query(sql, function (err, result) {
  //  connection.release();
    if (err) { 
       console.log('unable to recharge');
       console.log(err);
       return res.send({message:"unable to recharge", done:false});   
    }
     console.log(result[0]);
    if(!result[0]) {
      console.log('Unable to recharge');
      return res.send({"message":"Unable to recharge", done:false});  
    } else if(result[0] && (result[0].Balance - Number(rechargeDetails.RechargeAmount)) < 250) {
      console.log('insufficient balance');
      return res.send({"message":"Insufficient balance", done:false});
    } else {
       console.log('recharge processing');
       // console.log(typeOf(Balance)); 
       var formData = querystring.stringify(details);
       var contentLength = formData.length;

       request({
         headers: {
          'Content-Length': contentLength,
          'Content-Type': 'application/x-www-form-urlencoded'
         },
           url: 'http://www.ugamtelecom.com/api_users/recharge',
           body: formData,
           method: 'POST'
         }, function (err, response, body) {
          if(err) {
            console.log(err);
            return res.send({"message":"unable to recharge", "done":false}); 
          }
           console.log(response);
           console.log("body data");
           console.log(body);
         
           var patt = /Pending/i;
           if(patt.test(body)) {
              
             // update remaining balance in retailer table
              var tempRemAmount = Number(result[0].Balance) - Number(rechargeDetails.RechargeAmount);
              updateBalance(tempRemAmount, Number(rechargeDetails.RetailerId), getTableName(rechargeDetails.RetailerId));
              AddRechargeDetails(rechargeDetails, connection);
              return res.send({"message":"recharge pending", "done":true }); 
           } else {
              connection.release();
              return res.send({"message":"recharge failed", "done":false, "data":body }); 
           }
        });
 
     }
   })   
 })    
}

function AddRechargeDetails(rechargeDetails, connection) {    
  console.log('Entered add recharge details')
  var retailerId = Number(rechargeDetails.RetailerId);
  var status = "Pending"; 
  var orderId = rechargeDetails.OrderId; 
  var mobileNo = rechargeDetails.MobileNo;
  var rechargeType = rechargeDetails.RechargeType;
  var rechargeAmount = Number(rechargeDetails.RechargeAmount); 
  var customerName = rechargeDetails.CustomerName;
  var company = rechargeDetails.Company;
  var operatorCode = rechargeDetails.OperatorCode;
  var rechargeDate = (new Date()).getTime();

  console.log(rechargeDetails);

  var sql = "INSERT INTO RechargeDetails (RetailerId, Status, OrderId, MobileNo, RechargeType, RechargeAmount, CustomerName, Company, OperatorCode, RechargeDate) VALUES ( " + retailerId + ",'" + status + "','" + orderId + "','" + mobileNo + "','" + rechargeType + "'," + rechargeAmount + ",'" + customerName + "','" + company + "','"+ operatorCode + "',"+rechargeDate+")";
  console.log(sql);
  connection.query(sql, function (err, result) {
    connection.release();
    if (err) {
       console.log('unable to add recharge details');
       console.log(err);
    } else {
       console.log("Recharge Details Added");
    };
  });
}

 function UpdateRechargeDetails(rechargeResObj) {
 
   console.log(rechargeResObj);

   var transactionId =  rechargeResObj.transactionid;
   var status = rechargeResObj.status;
   var orderId = rechargeResObj.orderid;
   var operatorId = rechargeResObj.operatorid;

   var sql = "UPDATE RechargeDetails SET TransactionId = '" + transactionId +"', OperatorId = '" + operatorId +"', Status = '" + status +"' WHERE OrderId = "+orderId;
   console.log(sql);
pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

   connection.query(sql, function (err, result) {
    connection.release();
    if (err) {
       console.log('unable to update recharge details');
       console.log(err);
       return;
     }
       console.log(result.affectedRows + " record(s) updated");

      var patt = /Failure/i;
      if(patt.test(status)) { 
          updateFailedRechargeAmount(rechargeResObj) 
      }   
  }); 
 })
}

 function updateFailedRechargeAmount(rechargeResObj) {
   var orderId = rechargeResObj.orderid;
   
 pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

    connection.query("SELECT * FROM RechargeDetails WHERE OrderId = " + orderId + "", function (err, result) {
    if (err) {
       connection.release();
       console.log('unable to get recharge details by orderid');
       console.log(err);
       return;
    } 
  
     if(result[0]) {
       console.log(result);
       var retailerId = result[0].RetailerId;
       var rechargedAmount = result[0].RechargeAmount;
       var tName = getTableName(retailerId);
    
      connection.query("SELECT * FROM "+tName+" WHERE Id = " + retailerId + "", function (err, result2) {
       connection.release();
       if (err) {
         console.log('unable to get retailer table balance');
         console.log(err);
         return;
       } 

         console.log(result2);
         if(result2[0]) {
           var balance = result2[0].Balance;
           var tempAddedTotalAmount = Number(balance) + Number(rechargedAmount);
           console.log(tempAddedTotalAmount);
          // updateBalance(tempAddedTotalAmount, Number(retailerId), tName);
           updateRefundDetails(result[0], tempAddedTotalAmount);

         }
     });
    };
   }) 
  })
 }

function updateRefundDetails(rechargeDetails, balance) {
   rechargeDetails.Balance = balance;
   rechargeDetails.RefundAmount = Number(rechargeDetails.RechargeAmount);
   rechargeDetails.RechargeDate = Number(rechargeDetails.RechargeDate);
 //  var RechargeDate = (new Date()).getTime();
   
  pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

   var sql = "INSERT INTO RefundDetails (TransactionId, RetailerId, OrderId, MobileNo, RechargeType, RechargeAmount, RefundAmount, Balance, CustomerName, Company, RechargeDate) VALUES ( '" + rechargeDetails.TransactionId + "'," + rechargeDetails.RetailerId + ",'" + rechargeDetails.OrderId + "','" + rechargeDetails.MobileNo + "','" + rechargeDetails.RechargeType + "'," + rechargeDetails.RechargeAmount + "," + rechargeDetails.RefundAmount + "," + rechargeDetails.Balance + ",'" + rechargeDetails.CustomerName + "','" + rechargeDetails.Company + "'," + rechargeDetails.RechargeDate + ")";
  console.log(sql);
   connection.query(sql, function (err, result) {
       connection.release();
       if (err) {
         console.log('unable to update refund details');
         console.log(err);
         return;
       } else {
         updateBalance(balance, Number(rechargeDetails.RetailerId), getTableName(rechargeDetails.RetailerId));
         console.log('updated refund details')
         console.log(result); 
       }
   });
  }) 
}

exports.GetRefundDetailsByRetailerId = function (req, res) {
 //  if(!connection) {
 //    reconnect(connection);
 //  }
   var id = parseInt(req.body.Id);
   var fromDate = Number(req.body.FromDate);
   var toDate = Number(req.body.ToDate);
   var count = Number(req.body.Count);

   var sql = "SELECT * FROM RefundDetails WHERE RetailerId = " + id + " AND RechargeDate >= "+fromDate+ " AND RechargeDate <= "+toDate+" LIMIT "+count+",20";
  console.log(sql);
  pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

   connection.query(sql, function (err, result) {
    connection.release();
    if (err) {
       console.log('unable to get refund details by id');
       console.log(err);
       res.send({message:"unable to get refund details", done:false});
    } else {
       console.log(result);
       res.send({"message":"recharge details fetch success", "data":result, "done":true});
    };
  });
 })  
}
 
exports.GetRechargeDetailsByRetailerId = function (req, res) {
 // if(!connection) {
 //  reconnect(connection);
 // }
   var id = parseInt(req.body.Id);


pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

   connection.query("SELECT * FROM RechargeDetails WHERE RetailerId = " + id + " ORDER BY OrderId DESC LIMIT 10", function (err, result) {
   
    connection.release();
    if (err) {
       console.log('unable to get recharge details by id');
       console.log(err);
       res.send({message:"unable to get recharge details", done:false});
    } else {
       console.log(result);
       res.send({"message":"recharge details fetch success", "data":result, "done":true});
    };
  }); 
 }) 
}

exports.RechargeCallback = function(req, res) {   

  console.log("......................................recharge callback triggered...........................................");
  console.log("......................................recharge callback triggered...........................................");

 //  console.log(req);
   console.log(req.query); 
 
   var rechargeResponse = req.query;
   var transactionid =  rechargeResponse.transactionid;
   var status = rechargeResponse.status;
   var orderid = rechargeResponse.orderid;
   var operatorid = rechargeResponse.operatorid;

// transactionid=3474572&status=Success&orderid=10&operatorid=RM16150223366147

   if(transactionid == "" || transactionid == undefined) {
     return res.status(409).send("Error::parameter is missing");
   }
   if(status == "" || status == undefined) {
     return res.status(409).send("Error::parameter is missing");
   }
   if(orderid == "" || orderid == undefined) {
     return res.status(409).send("Error::parameter is missing");
   }
  /* 
   if(operatorid == "" || operatorid == undefined) {
     return res.status(409).send("Error::parameter is missing");
   }
  */
  UpdateRechargeDetails(rechargeResponse)
 // setTimeout(UpdateRechargeDetails(rechargeResponse) ,3000);
 /* 
   pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
   }

    connection.query("select * from RefundDetails WHERE TransactionId = "+transactionid , function(err, result) {
       connection.release();
       if(err) {
         console.log(err);
       }  
       if(!result[0]) {
         //if no results are updated already
          
       } 
    })  
  })   
 */   
  
   console.log("......................................recharge callback end...........................................");
   console.log("......................................recharge callback end...........................................");
   res.status(200).send("success");
} 

exports.CheckStatusByTxnId = function(req, res) {
    var txnId = req.body.TxnId;

pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", message:"server busy", done:false});
   }

    connection.query("select * from RechargeDetails WHERE TransactionId = "+txnId , function(err, result) {
       connection.release();
       if(err) {
         console.log(err);
         return  res.send({"message":"unable to check status", done:false})
       }  
      if(result) {
        return  res.send({"message":"success", data:result, done:true})
      } else {
        return  res.send({"message":"no records found", done:false})
      }
      
    })  
  })  
}

exports.CheckMainBalance = function(req, res) {

    var details ={}; 
    details["username"] = 9019;
	  details["pwd"] = 69865987;
    
    console.log('entered get balance api');
    console.log(details);  

   var formData = querystring.stringify(details);
   var contentLength = formData.length;

  request({
    headers: {
      'Content-Length': contentLength,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: 'http://www.ugamtelecom.com/api_users/balance',
    body: formData,
    method: 'POST'
  }, function (err, response, body) {
    if(err) {
      console.log(err);
      return res.send({"message":"unable to check Balance", "done":false}); 
    }
     console.log(response);
     console.log("body data");
     console.log(body);

     return res.send({"message":"balance check successful", "done":true, "data":body });   
   })
  }

  exports.GetAllReports = function(req, res) {
  // select * from *table_name* where *datetime_column* BETWEEN DATE_SUB(NOW(), INTERVAL 30 DAY)  AND NOW()
     console.log(req.body);
     var id = Number(req.body.Id);
     var fromDate = Number(req.body.FromDate);
     var toDate = Number(req.body.ToDate);
     var companyCode = req.body.CompanyCode;
     var status = req.body.Status;
     var number = req.body.Number;
     var data = req.body.Data;
     var count = req.body.Count;
   
     var sql = "";
     if(companyCode == "all" && status == "all" && number == "0") {
       sql = "select * from RechargeDetails WHERE RechargeDate >= "+fromDate+ " AND RechargeDate <="+toDate+" AND RetailerId = "+id+" LIMIT "+count+",20";
     } else if(companyCode == "all" && status == "all" && number != "0") {
       sql = "select * from RechargeDetails WHERE MobileNo = '"+number+"' AND RechargeDate >= "+fromDate+ " AND RechargeDate <= "+toDate+" AND RetailerId = "+id+" LIMIT "+count+",20";
     } else if(companyCode == "all" && status != "all" && number == "0") {
       sql = "select * from RechargeDetails WHERE Status = '"+status+"' AND RechargeDate >= "+fromDate+ " AND RechargeDate <= "+toDate+" AND RetailerId = "+id+" LIMIT "+count+",20";
     } else if(companyCode != "all" && status == "all" && number == "0") {
       sql = "select * from RechargeDetails WHERE OperatorCode = '"+companyCode+"' AND RechargeDate >= "+fromDate+ " AND RechargeDate <= "+toDate+" AND RetailerId = "+id+" LIMIT "+count+",20";
     } else if(companyCode == "all" && status != "all" && number != "0") {
       sql = "select * from RechargeDetails WHERE Status = '"+status+"' AND MobileNo = '"+number+"' AND RechargeDate >= "+fromDate+ " AND RechargeDate <= "+toDate+" AND RetailerId = "+id+" LIMIT "+count+",20";
     } else if(companyCode != "all" && status == "all" && number != "0") {
       sql = "select * from RechargeDetails WHERE OperatorCode = '"+companyCode+"' AND MobileNo = '"+number+"' AND RechargeDate >= "+fromDate+ " AND RechargeDate <= "+toDate+" AND RetailerId = "+id+" LIMIT "+count+",20";
     } else if(companyCode != "all" && status != "all" && number == "0") {
       sql = "select * from RechargeDetails WHERE OperatorCode = '"+companyCode+"' AND Status = '"+status+"' AND RechargeDate >= "+fromDate+ " AND RechargeDate <= "+toDate+" AND RetailerId = "+id+" LIMIT "+count+",20";
     }
     console.log(sql);
  
  pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", done:false});
   }

     connection.query(sql, function(err, result) {
       connection.release();
       if(err) {
         console.log(err);
         return  res.send({"message":"unable to get all reports", done:false})
       } else {
         console.log(result);
         return  res.send({"message":"success", data:result, done:true})
       }  
       
     })
   }); 
  }

  exports.GetAccountReportsById = function(req, res) {
     var senderId = Number(req.body.Id);
     var fromDate = Number(req.body.FromDate);
     var toDate = Number(req.body.ToDate);
     var count = Number(req.body.Count);
     console.log(req.body);

     var sql = "select * from MoneyTransfer WHERE (SenderId = "+senderId+" OR RecieverId = "+senderId+") AND TransferDate >= "+fromDate+" AND TransferDate <= "+toDate+" LIMIT "+count+",20";
     console.log(sql);
    
  pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", done:false});
   }

    connection.query(sql, function(err, result) {
       connection.release();
       if(err) {
         console.log(err);
         return  res.send({"message":"unable to get account reports", done:false})
       }  
       
       console.log(result);
       return res.send({"message":"success", data:result, done:true})
     })
   }) 
  }


 exports.SendComplain = function(req, res) {
//  var subject = req.body.Subject;
  var orderId = req.body.OrderId;
  var message = req.body.Message;
  var retailerId = req.body.Id
 
  console.log(req.body);

  pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", done:false});
   }
 
  if(!orderId) {
   console.log('entered if.. order id is not defined');
   
   var sql = "INSERT INTO Complain (Message, RetailerId) VALUES ('" + message +"',"+ retailerId +")";
   connection.query(sql, function (err, result) {
       connection.release();  
       if (err) {
         console.log('unable to send complain');
         console.log(err);
         return res.send({"message":"unable to send complain", done:false});
       } 
     
       console.log(result);
       return res.send({"message":"report sent", done:true})
   });
  } else {
    connection.release();
    getRechargeDetails(orderId, message, retailerId, res, connection)
  } 
 })
}

function getRechargeDetails(orderId, message, retailerId, res, connection) {
   console.log('entered get recharge details function');
// pool.getConnection(function (error, connection) { 
/*   if(error)  {
     connection.release();
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", done:false});
   }
*/
    connection.query("SELECT * FROM RechargeDetails WHERE OrderId = " + orderId + "", function (err, result) {
    if (err) {
       connection.release();
       console.log('unable to get recharge details by orderid');
       console.log(err);
       return res.send({"message":"unable send complain", done:false});
    } 
      if(result) {
        result = result[0];
      } 
      console.log(result);
      result.RechargeDate = new Date(result.RechargeDate).getTime();
      console.log(result.RechargeDate);
      var sql = "INSERT INTO Complain (Message, RetailerId, OrderId, Number, RechargeType, RechargeAmount, RechargeStatus, Company, RechargeDate) VALUES ( '" + message +"'," + retailerId + ",'"+result.OrderId+"','"+ result.MobileNo+"','"+ result.RechargeType+"',"+ result.RechargeAmount+",'"+ result.Status+"','"+ result.Company+"',"+ result.RechargeDate+")";
      console.log(sql);
      connection.query(sql, function (err, result) {
       if(!connection){
         connection.release();
       } 
       
       if (err) {
         console.log('unable to send complain');
         console.log(err);
         return res.send({"message":"unable to send complain", done:false});
       } 
     
       console.log(result);
       return res.send({"message":"report sent", done:true})
   });   
  //  })
 })
}    

 exports.GetComplains = function(req, res) {
     var retailerId = req.body.Id;
     var count = Number(req.body.Count);
     console.log(req.body);

     var sql = "";
     if(!retailerId) {
       sql = "select * from Complain LIMIT "+count+",20";
     } else {
       sql = "select * from Complain WHERE RetailerId = "+retailerId+" LIMIT "+count+",20";
     }
      
     console.log(sql);
    
  pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

    connection.query(sql, function(err, result) {
       connection.release();
       if(err) {
         console.log(err);
         return  res.send({"message":"unable to get complains", done:false})
       }  
       
       console.log(result);
       return  res.send({"message":"success", data:result, done:true})
     })
   }) 
  }

  exports.ComplainsResponse = function(req, res) {
   var responseMessage =  req.body.ResponseMessage;
   var status = req.body.Status;
   var complainId = req.body.ComplainId;
   var responseDate = (new Date()).getTime();

   var sql = "UPDATE Complain SET ResponseMessage = '" + responseMessage +"', Status = '" + status + "', SolveDate = " + responseDate + " WHERE ComplainId = "+complainId;
   console.log(sql);

pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

   connection.query(sql, function (err, result) {
    connection.release();
    if (err) {
       console.log('unable to update complain');
       console.log(err);
       return res.send({message:"unable to send complain response", done:false});
     }  
     console.log("complain response sent");
      return res.send({message:"complain response sent", done:true});
   })
 })
}

exports.GetRetailersRechargeByDId = function(req, res) {
  var dealerId = req.body.Id;
  var fromDate = Number(req.body.FromDate);
  var toDate = Number(req.body.ToDate);
  var count = Number(req.body.Count);

  var sql = "select Name,Id from Retailer where ParentDealerId = "+dealerId;
  console.log(sql);

pool.getConnection(function (error, connection) { 
   if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
   }

   connection.query(sql, function (err, result) {
 
    if (err) {
      if(connection) {
        connection.release();
      }
      console.log('unable to get retailer recharge details');
      console.log(err);
      return res.send({message:"unable to get retailer recharge details", done:false});
    } 
     
     if(result) {
       console.log(result);
      var idArr = [];
      for(var i = 0; i < result.length; i++) {
         idArr.push(result[i].Id); 
      }
      var sql2 = "SELECT * FROM RechargeDetails WHERE RetailerId IN (" + idArr.join() + ") AND RechargeDate >= "+fromDate+" AND RechargeDate <= "+toDate+" LIMIT "+count+",20";
      console.log(sql2); 
      connection.query(sql2, function (err, result) {
       if(connection) {
         connection.release();
       }
       if (err) {
         console.log('unable to update complain');
         console.log(err);
         return res.send({message:"unable to get retailer recharge details", done:false});
        }   
          
        console.log(result); 
        return res.send({message:"success", data:result, done:true});        
      })
     } else {
       console.log('no results for given id');
        return res.send({message:"No results for given id", done:false});
     } 

   })
 })
}

exports.SendFundRequest = function(req, res) {
   var id = Number(req.body.Id);
   var parentId = Number(req.body.ParentId);
   var amount = Number(req.body.Amount);
   var paymentDate = Number(req.body.PaymentDate);
   var paymentMode = req.body.PaymentMode;
   var depositBankName = req.body.DepositBankName;
   var depositTime = req.body.DepositTime;
   var bankName = req.body.BankName;
   var bankCharge = Number(req.body.BankCharge);
   var dDChequeNumber = req.body.DDChequeNumber;
   var dDChequeDate = Number(req.body.DDChequeDate);
   var remarks = req.body.Remarks;
   var requestDate = (new Date()).getTime();

   pool.getConnection(function (error, connection) { 
      if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({data:"server busy", "message":"server busy", done:false});
      }

    var sql = "INSERT INTO FundRequest (PaymentDate, RequestSenderId, RequestRecieverId, Amount, PaymentMode, DepositTime, BankName, BankCharge, Remarks, DDChequeDate, DDChequeNumber, RequestDate) VALUES ( '" + paymentDate + "'," + id + "," + parentId + "," + amount + ",'"+paymentMode+"','"+ depositTime+"','"+ bankName+"',"+ bankCharge+",'"+ remarks+"',"+ dDChequeDate + ",'" + dDChequeNumber + "'," + requestDate+")";
    console.log(sql);
    connection.query(sql, function (err, result) {
    if (err) {
         console.log(err);
         console.log('Unable to send fund request');
         return res.send({data:"Unable to send fund request", "message":"Unable to send fund request", done:false}) 
    }
     
     console.log("Affected rows: "+res.affectedRows);
     return res.send({data:"Fund request sent", "message":"Fund request sent", done:true}) 
   }) 
  }) 
}

exports.GetSentFundRequest = function(req, res) {
   var id = Number(req.body.Id);
   var count = Number(req.body.Count);

   var sql = "select * from FundRequest WHERE RequestSenderId = "+id+" LIMIT "+count+",20";
   console.log(sql);
    
  pool.getConnection(function (error, connection) { 
    if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({"data":"server busy", "message":"server busy", "done":false});
    }

    connection.query(sql, function(err, result) {
       connection.release();
       if(err) {
         console.log(err);
         return res.send({"message":"unable to get complains", "done":false})
       }

       console.log(result);
       return res.send({"message":"success", "data":result, "done":true}) 
    })
  })     
}

exports.GetRecievedFundRequest = function(req, res) {
   var id = Number(req.body.Id);
   var count = Number(req.body.Count);
   console.log(req.body);
   var sql = "select * from FundRequest WHERE RequestRecieverId = "+id+" LIMIT "+count+",20";
   console.log(sql);
    
  pool.getConnection(function (error, connection) { 
    if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({"data":"server busy", "message":"server busy", "done":false});
    }

    connection.query(sql, function(err, result) {
       connection.release();
       if(err) {
         console.log(err);
         return res.send({"message":"unable to get complains", "done":false})
       }

       console.log(result);
       return res.send({"message":"success", "data":result, "done":true}) 
    })
  })     
}

exports.RespondFundRequest = function(req, res) {
   var fundRequestId = req.body.RequestId;
   var responseMessage = req.body.ResponseMessage;
   var status = req.body.Status;
   var responseDate = (new Date()).getTime();

  var sql = "UPDATE FundRequest SET ResponseMessage = '" + responseMessage +"', Status = '" + status + "', ResponseDate = " + responseDate + " WHERE RequestId = "+fundRequestId;
  console.log(sql);
  pool.getConnection(function (error, connection) { 
    if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({"data":"server busy", "message":"server busy", "done":false});
    }

    connection.query(sql, function(err, result) {
       connection.release();
       if(err) {
         console.log(err);
         return res.send({"message":"unable to send fund request response", "done":false})
       }

       console.log(result);
       return res.send({"message":"success", "data":result, "done":true}) 
    })
  })     
}

exports.Logout = function(req, res) {
   var id = Number(req.body.Id);
   var tName = getTableName(id);

  var sql = "UPDATE "+tName+" SET LoginStatus = 'Offline' WHERE Id = "+id;
  console.log(sql);
  pool.getConnection(function (error, connection) { 
    if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({"data":"server busy", "message":"server busy", "done":false});
    }

    connection.query(sql, function(err, result) {
       connection.release();
       if(err) {
         console.log(err);
         return res.send({"message":"unable to update login status", "done":false})
       } else {
         console.log(result);
         return res.send({"message":"login status update success", "done":true})   
       }

    })
  })
}

exports.RevertTransaction = function(req, res) {
  var reverterId = Number(req.body.ReverterId);
  var revertFrom = Number(req.body.RevertFrom);
  console.log(req.body);

  var sql = "select * from MoneyTransfer where SenderId = "+reverterId+" AND RecieverId = "+revertFrom+" ORDER BY TransferId DESC LIMIT 0,1";
  console.log(sql);
  pool.getConnection(function (error, connection) { 
    if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({"data":"server busy", "message":"server busy", "done":false});
    }

    connection.query(sql, function(err, result) {
    //   connection.release();
    console.log(result);
       if(err) {       
         connection.release();
         console.log(err);
         return res.send({"message":"unable to revert balance", "done":false});
       } else if(!result[0]) {
           connection.release();
           console.log('No Transactions happened to this user');
           return res.send({"message":"No Transactions happened to this user", "done":false});
       } else if(result[0].Balance == 0) {
           connection.release();
           console.log('No balance to retrieve');
           return res.send({"message":"No balance to retrieve", "done":false});
       } else if(result[0].Status == 'Cancelled') {
           connection.release();
           console.log('Last transaction is already reverted');
           return res.send({"message":"Last transaction is reverted already", "done":false});
       } else {
         console.log(result);
         var sql2 = "select Balance from "+getTableName(revertFrom)+" where Id = "+revertFrom;
         connection.query(sql2, function(err, result2) { 
           
           if(err) {
             connection.release();
             console.log(err);
             return res.send({"message":"unable to revert balance", "done":false})
           } else {
             if(result2[0].Balance >= result[0].TransferAmount) {
                UpdateRevertTransactionDetails(result[0], result[0].TransferAmount, result2[0].Balance, connection, res);
             } else if(result2[0].Balance < result[0].TransferAmount) {
                UpdateRevertTransactionDetails(result[0], result2[0].Balance, result2[0].Balance, connection, res);
             }
           }    
         })      
       }
    })
  }) 
}


function UpdateRevertTransactionDetails(transactionDetails, revertAmount, revertFromCurBalance, connection, res) {

    var sql = "select Balance from "+getTableName(transactionDetails.SenderId)+" where Id = "+transactionDetails.SenderId;
    console.log(sql);
    connection.query(sql, function(err, result) {
       if(err) {
         connection.release();
         console.log(err);
         return res.send({"message":"unable to update login status", "done":false})
       } else {
         console.log(result);
         var revertDate = (new Date()).getTime();
         var sql2 = "INSERT INTO RevertTransactionDetails (TransactionId, RevertFrom, RevertTo, RevertDate, TransferedAmount, RevertedAmount, RevertedFromBalance, RevertedToBalance) VALUES ( " + transactionDetails.TransferId + "," + transactionDetails.RecieverId + "," + transactionDetails.SenderId + "," + revertDate + "," + transactionDetails.TransferAmount + "," + revertAmount + "," + (Number(revertFromCurBalance) - Number(revertAmount)) + "," +(Number(result[0].Balance) + Number(revertAmount)) + ")";
         console.log(sql2);
         connection.query(sql2, function(err, result1) {
           if(err) {
             connection.release();
             console.log(err);
             return res.send({"message":"unable to update login status", "done":false})
           } else {
             console.log(result1);
              var sql3 = "UPDATE MoneyTransfer SET Status = 'Cancelled' WHERE TransferId = "+transactionDetails.TransferId;
              console.log(sql3);
              connection.query(sql3, function(err, result2) {
                connection.release();
                if(err) {
                
                  console.log(err);
                  return res.send({"message":"unable to update login status", "done":false})
                } else {
                  updateBalance((revertFromCurBalance - revertAmount), transactionDetails.RecieverId, getTableName(transactionDetails.RecieverId));
                  updateBalance((result[0].Balance + revertAmount), transactionDetails.SenderId, getTableName(transactionDetails.SenderId)); 
                  return res.send({"message":"Last transaction reverted successully", "done":true})
                }
              })
           }  
         })   
       }
    })  
}

exports.GetRevertTransactions = function(req, res) {
  var id = Number(req.body.Id);
  var count = Number(req.body.Count);
  var fromDate = Number(req.body.FromDate);
  var toDate = Number(req.body.ToDate);

  var sql = "select * from RevertTransactionDetails where RevertTo = "+id+" AND RevertDate >= "+fromDate+ " AND RevertDate <= "+toDate+" LIMIT "+count+",20";
  console.log(sql);
  pool.getConnection(function (error, connection) { 
    if(error)  {
       console.log('server busy');
       console.log(error);
       return res.send({"data":"server busy", "message":"server busy", "done":false});
    }

    connection.query(sql, function(err, result) {
     connection.release();
     console.log(result);
       if(err) {
         console.log(err);
         return res.send({"message":"unable to get revert transactions", "done":false});
       } else {
         console.log(result);
         return res.send({"message":"success", "data":result, "done":true});
       }
    })
  })     
}

exports.DownloadApk = function(req, res) { 
  var filePath = "./public/apk/android-debug.apk"; 
  console.log(filePath); 
  res.download(filePath); 
}