var express = require('express');
var router = express.Router();
var config = require("../config/config");
var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : config.host,
    user     : config.userName,
    password : config.password,
    database : config.database
});

// After this line, we are connected to mysql
connection.connect();

/* GET home page. */
router.get('/', function(req, res, next) {


    var msg = req.query.msg;
    if(msg === 'updated'){
        msg = "Your post has been updated"
    }else if(msg==="added"){
        msg = "Your task has been added"
    };
    var selectQuery = "Select * FROM tasks";
    connection.query(selectQuery, (error,results,field)=>{
        res.render('index', {taskArray: results, msg: msg});
    });
});


router.post("/addNew", (req,res,next)=>{
    var newTask = req.body.newTaskString;
    var taskDate = req.body.newTaskDate;
    var insertQuery = "INSERT INTO tasks (task_name, task_date) VALUES ('"+newTask+"','"+taskDate+"')";

    connection.query(insertQuery, (error,results,field)=>{
        if (error) throw error;
        res.redirect("/");
    });

});
// ---------------EDIT GET-----------------
router.get("/edit/:id", (req,res,next)=>{



    var selectQuery = "SELECT * from tasks WHERE id="+req.params.id;

    connection.query(selectQuery, (error,results,fields)=>{
        var days = results[0].task_date.getDate();
        if(days < 10){
            days = "0"+days;
        }
        var months = results[0].task_date.getMonth() + 1;
        if(months < 10){
            months = "0"+months;
        }
        var years = results[0].task_date.getFullYear();
        if(years < 10){
            years = "0"+years;
        }
        var mysqlDate = years + "-" + months + "-" + days;
        results[0].task_date = mysqlDate;

        res.render("edit", {task:results[0]});
    })
});
// ---------------EDIT POST-----------------
router.post("/edit/:id", (req,res,next)=>{
    console.log(req.params,req.body)
    var id = req.params.id;
    var newTask = req.body.newTaskString;
    var taskDate = req.body.newTaskDate;
    var updateQuery = "UPDATE tasks SET task_name='"+newTask+"', task_date='"+taskDate+"'WHERE ID="+id;

    connection.query(updateQuery, (error,results,fields)=>{
        if (error) throw error;
        res.redirect("/?msg=updated");
    });
    // res.send(updateQuery);
});
// ---------------DELETE GET-----------------
router.get("/delete/:id", (req,res,next)=>{
    var deleteQuery = "DELETE FROM tasks WHERE id="+req.params.id;
    connection.query(deleteQuery, (error,results,fields)=>{
        if(error) throw error;
        res.redirect("/");
    });
    // res.send(req.params.id);
});

module.exports = router;
