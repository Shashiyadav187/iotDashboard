var express   =    require("express");
var mysql     =    require('mysql');
var app       =    express();
const port = 3000;
var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'pi',
    password : 'mypi',
    database : 'pidb',
    debug    :  false
});

function handle_database(req,res) {
    
    pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }   

        console.log('connected as id ' + connection.threadId);
        
        connection.query("select nodename,unix_timestamp(lastseen) as 'lastseen' from nodes",function(err,rows){
            connection.release();
            if(!err) {
                res.json(rows);
            }           
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
  });
}

app.get("/",function(req,res){-
          res.send('Hello World!');
          handle_database(req,res);
});

app.listen(port);