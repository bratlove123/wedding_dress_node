const Supplier = require('../models/supplier.model');
const logger = require('../logger');

module.exports = {
    create: function (req, res, next) {
        var supplier = new Supplier(req.body);
        supplier.save(function(err, sup){
            if(err){
                return next(err);
            }
            logger.info("Create supplier success - id:" + sup._id);
            res.json({status:'success',message:'Create supplier success!', data: null});
        });
    },
    getAll:function(req, res,next){
        Supplier.find({}).exec(function(err, sup){
            if(err){
                return next(err);
            }
            res.json({status:'success',message:'Get supplier success!', data: sup});
        });
    },
    getSort: function(req, res,next){
        var sortBy = {};
        sortBy[req.query.orderBy?req.query.orderBy:"modifiedOn"] = req.query.sort==="true"?1:-1;
        var skip = parseInt(req.query.pageSize)*(parseInt(req.query.pageNumber)-1);
        var pageSize =  parseInt(req.query.pageSize);
        var search = req.query.search;
        Supplier.find({'name':{ "$regex": search, "$options": "i" }}, {},
        {
            skip:skip,
            limit:pageSize,
            sort: sortBy
        }).populate('modifiedBy').exec(
        function(err, sup){
            if(err){
                return next(err);
            }
            Supplier.count({}, function( err, count){
                if(err){
                    return next(err);
                }
                res.json({status:'success',message:'Get supplier success!', data: {
                    data: sup,
                    countAll: count
                }});
            });
        });
    },
    getSupllierById:function(req, res,next){
        Supplier.findById(req.params.id).exec(function(err, sup){
            if(err){
                return next(err);
            }
            res.json({status:'success',message:'Get supplier success!', data: sup});
        });
    },
    edit: function (req, res, next) {
        Supplier.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, sup) {
            if (err) return next(err);
            logger.info("Updated supplier success - id:" + sup._id);
            res.json({status:'success',message:'Updated supplier success!', data: sup});
        });
    },
    delete: function(req, res, next){
        Supplier.findByIdAndRemove(req.params.id, function(err, sup){
            if(!err){
                logger.info("Delete supplier success - id:" + sup._id);
                res.json({status:'success',message:'Delete supplier success!', data: sup._id});
            }
            else{
                return next(err);
            }
        });
    }
}