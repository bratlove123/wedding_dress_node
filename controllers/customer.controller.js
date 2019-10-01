const Customer = require('../models/customer.model');
const logger = require('../logger');

module.exports = {
    create: function (req, res, next) {
        var customer = new Customer(req.body);
        customer.save(function(err, customer){
            if(err){
                return next(err);
            }
            logger.info("Create customer success - id:" + customer._id);
            res.json({status:'success',message:'Create customer success!', data: null});
        });
    },
    getAll:function(req, res,next){
        Customer.find({}).exec(function(err, customer){
            if(err){
                return next(err);
            }
            res.json({status:'success',message:'Get customer success!', data: customer});
        });
    },
    findCustomer:function(req, res,next){
        Customer.find({$or:[ {'name':{ "$regex": req.query.search, "$options": "i" }}, 
        {'phone':{ "$regex": req.query.search, "$options": "i" }},
        {'email':{ "$regex": req.query.search, "$options": "i" }},
        {'facebook':{ "$regex": req.query.search, "$options": "i" }} ]}).populate('customerGroupId').exec(function(err, customer){
            if(err){
                return next(err);
            }
            res.json({status:'success',message:'Get customer success!', data: customer});
        });
    },
    getSort: function(req, res,next){
        var sortBy = {};
        sortBy[req.query.orderBy?req.query.orderBy:"modifiedOn"] = req.query.sort==="true"?1:-1;
        var skip = parseInt(req.query.pageSize)*(parseInt(req.query.pageNumber)-1);
        var pageSize =  parseInt(req.query.pageSize);
        var search = req.query.search;
        Customer.find({$or:[ {'name':{ "$regex": search, "$options": "i" }}, 
        {'phone':{ "$regex": search, "$options": "i" }},
        {'email':{ "$regex": search, "$options": "i" }},
        {'facebook':{ "$regex": search, "$options": "i" }} ]}, {},
        {
            skip:skip,
            limit:pageSize,
            sort: sortBy
        }).populate('modifiedBy').populate('customerGroupId').exec(
        function(err, customer){
            if(err){
                return next(err);
            }
            Customer.count({}, function( err, count){
                if(err){
                    return next(err);
                }
                res.json({status:'success',message:'Get customer success!', data: {
                    data: customer,
                    countAll: count
                }});
            });
        });
    },
    getCustomerById:function(req, res,next){
        Customer.findById(req.params.id).exec(function(err, customer){
            if(err){
                return next(err);
            }
            res.json({status:'success',message:'Get customer success!', data: customer});
        });
    },
    edit: function (req, res, next) {
        Customer.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, customer) {
            if (err) return next(err);
            logger.info("Updated customer success - id:" + customer._id);
            res.json({status:'success',message:'Updated customer success!', data: customer});
        });
    },
    delete: function(req, res, next){
        Customer.findByIdAndRemove(req.params.id, function(err, customer){
            if(!err){
                logger.info("Delete customer success - id:" + customer._id);
                res.json({status:'success',message:'Delete customer success!', data: customer._id});
            }
            else{
                return next(err);
            }
        });
    }
}