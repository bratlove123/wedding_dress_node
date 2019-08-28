const CustomerGroup = require('../models/customerGroup.model');
const logger = require('../logger');

module.exports = {
    create: function (req, res, next) {
        var customerGroup = new CustomerGroup(req.body);
        customerGroup.save(function(err, customerGroup){
            if(err){
                return next(err);
            }
            logger.info("Create customer group success - id:" + customerGroup._id);
            res.json({status:'success',message:'Create customer group success!', data: null});
        });
    },
    getAll:function(req, res,next){
        CustomerGroup.find({}).exec(function(err, customerGroup){
            if(err){
                return next(err);
            }
            res.json({status:'success',message:'Get customer group success!', data: customerGroup});
        });
    },
    getSort: function(req, res,next){
        var sortBy = {};
        sortBy[req.query.orderBy?req.query.orderBy:"level"] = req.query.sort==="true"?1:-1;
        var skip = parseInt(req.query.pageSize)*(parseInt(req.query.pageNumber)-1);
        var pageSize =  parseInt(req.query.pageSize);
        var search = req.query.search;
        CustomerGroup.find({'title':{ "$regex": search, "$options": "i" }}, {},
        {
            skip:skip,
            limit:pageSize,
            sort: sortBy
        }).populate('modifiedBy').exec(
        function(err, customerGroup){
            if(err){
                return next(err);
            }
            CustomerGroup.count({}, function( err, count){
                if(err){
                    return next(err);
                }
                res.json({status:'success',message:'Get customer group success!', data: {
                    data: customerGroup,
                    countAll: count
                }});
            });
        });
    },
    getCustomerGroupById:function(req, res,next){
        CustomerGroup.findById(req.params.id).exec(function(err, customerGroup){
            if(err){
                return next(err);
            }
            res.json({status:'success',message:'Get customer group success!', data: customerGroup});
        });
    },
    edit: function (req, res, next) {
        CustomerGroup.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, customerGroup) {
            if (err) return next(err);
            logger.info("Updated customer group success - id:" + customerGroup._id);
            res.json({status:'success',message:'Updated  customer group success!', data: customerGroup});
        });
    },
    delete: function(req, res, next){
        CustomerGroup.findByIdAndRemove(req.params.id, function(err, customerGroup){
            if(!err){
                logger.info("Delete customer group success - id:" + customerGroup._id);
                res.json({status:'success',message:'Delete  customer group success!', data: customerGroup._id});
            }
            else{
                return next(err);
            }
        });
    }
}