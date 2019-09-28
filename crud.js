const db = require('./dbCon');
const express = require("express");
const router = express.Router();
var multer = require('multer');
var fs = require('fs');

var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./uploads");
    },
    filename: function (req, file, callback) {
        //callback(null, file.name + "_" + Date.now());
        callback(null, file.originalname);
    }
});

var upload = multer({
    storage: Storage
}).array("File", 3);

var defaultErrorMsg = "Something went wrong...";

//INSERT INTO `emp_details` (name, empId, department, image, gender) VALUES('Jamal Mohammed', 11, 'UI', '', 'male')

// INSERT INTO `emp_details` (name, empId, department, image, gender) VALUES('Shabudeen Shaikh', 11, 'UI', '', 'male'), ('Shabudeen Shaikh', 11, 'UI', '', 'male'), ('Shabudeen Shaikh', 11, 'UI', '', 'male'), ('Shabudeen Shaikh', 11, 'UI', '', 'male'), ('Shabudeen Shaikh', 11, 'UI', '', 'male');

//Getting all emp list
router.get("/getEmpList", function (req, res) {
    var sql = "select * from emp_details";
    db.query(sql, function (error, result) {
        if (error) {
            res.jsonp({
                "success": false,
                "error": error
            });
        } else {
            res.jsonp({
                "message": "List get successfully",
                "success": true,
                "data": result
            });
        }
    });
});

//Get selected emp list
router.post("/changeEmpStatus", function (req, res) {
    var inputParams = req.body;
    console.log('inputParams', inputParams);
    var sql = "";
    if (inputParams.status == "all") {
        sql = "UPDATE `emp_details` SET status = 1";
    } else {
        sql = "UPDATE `emp_details` SET status = '" + inputParams.status + "' WHERE id = " + inputParams.emp_id + "";
    }
    db.query(sql, function (error, result) {
        if (error) {
            res.jsonp({
                "success": false,
                "error": error
            });
        } else {
            res.jsonp({
                "message": "Status updated successfully",
                "success": true
            });
        }
    });
});

//Creating new employee
router.post("/createNewEmployee", function (req, res) {
    var inputParams = req.body;
    var sql = "INSERT INTO `emp_details` (name, empId, department, image, gender, status) VALUES('" + inputParams.name + "', " + inputParams.empId + ", '" + inputParams.department + "', '" + inputParams.image + "', '" + inputParams.gender + "', '" + 0 + "')";
    db.query(sql, function (error, result) {
        if (error) {
            res.jsonp({
                "success": false,
                "error": error
            });
        } else {
            if (result.affectedRows > 0) {
                console.log("createNewEmployee", result);
                res.jsonp({
                    "message": "Employee added successfully",
                    "success": true,
                    "data": result.insertId
                });
            } else {
                res.jsonp({
                    "message": defaultErrorMsg,
                    "success": false
                });
            }
        }
    });
});

//delete employee
router.get("/deleteEmployee", function (req, res) {
    var inputParams = req.query;
    var sql = "SELECT * FROM `emp_details` WHERE id = '" + inputParams.emp_id + "'";
    db.query(sql, function (error, result) {
        console.log('result', result[0].image);
        if (error) {
            res.jsonp({
                "success": false,
                "error": error
            });
        } else {
            if (result[0].image != "" && result[0].image != null && result[0].image != undefined) {
                var data = "uploads/" + result[0].image;
                fs.unlinkSync(data);
                deleteRow(res, inputParams);
            } else {
                deleteRow(res, inputParams);
            }
        }
    });
    // var sql = "DELETE FROM `emp_details` WHERE id = '" + inputParams.emp_id + "'";
    // db.query(sql, function (error, result) {
    //     if (error) {
    //         res.jsonp({
    //             "success": false,
    //             "error": error
    //         });
    //     } else {
    //         if (result.affectedRows > 0) {
    //             res.jsonp({
    //                 "message": "Employee deleted successfully",
    //                 "success": true
    //             });
    //         } else {
    //             res.jsonp({
    //                 "message": defaultErrorMsg,
    //                 "success": false
    //             });
    //         }
    //     }
    // });
});

function deleteRow(res, inputParams) {
    var deleteQuery = "DELETE FROM `emp_details` WHERE id = '" + inputParams.emp_id + "'";
    db.query(deleteQuery, function (error, delResult) {
        if (error) {
            res.jsonp({
                "success": false,
                "error": error
            });
        } else {
            if (delResult.affectedRows > 0) {
                res.jsonp({
                    "message": "Employee deleted successfully",
                    "success": true
                });
            } else {
                res.jsonp({
                    "message": defaultErrorMsg,
                    "success": false
                });
            }
        }
    });
}

//updateEmployee new employee empId
router.post("/updateEmployee", function (req, res) {
    var inputParams = req.body;
    var sql = "UPDATE `emp_details` SET name = '" + inputParams.name + "', department = '" + inputParams.department + "', gender = '" + inputParams.gender + "', empId = '" + inputParams.empId + "' WHERE id = " + inputParams.emp_id;
    db.query(sql, function (error, result) {
        console.log('result', result);
        if (error) {
            res.jsonp({
                "success": false,
                "error": error
            });
        } else {
            if (result.affectedRows > 0) {
                console.log('updateEmployee', result);
                res.jsonp({
                    "message": "Details Updated successfully",
                    "success": true,
                    "data": inputParams.emp_id
                });
            } else {
                res.jsonp({
                    "message": defaultErrorMsg,
                    "success": false
                });
            }
        }
    });
});

router.post('/uploadImage', function (req, res) {
    upload(req, res, function (err) {
        //console.log('req.body.emp_id', req.body.emp_id);
        if (err) {
            return res.end("Something went wrong!");
        } else {
            var sql = "UPDATE `emp_details` SET image = '" + req.files[0].filename + "' WHERE id = " + req.body.emp_id + "";
            db.query(sql, function (error, result) {
                if (error) {
                    res.jsonp({
                        "message": defaultErrorMsg,
                        "success": false
                    });
                } else {
                    return res.jsonp({
                        "message": "Image Uploaded successfully",
                        "success": true
                    });
                }
            });
        }
    });
});

module.exports = router;