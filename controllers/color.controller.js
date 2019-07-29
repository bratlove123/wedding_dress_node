const Color = require('../models/color.model');
const logger = require('../logger');

module.exports = {
    create: function (req, res, next) {
        var color = new Color(req.body);
        color.save(function(err, cl){
            if(err){
                return next(err);
            }
            logger.info("Create color success - id:" + cl._id);
            res.json({status:'success',message:'Create color success!', data: null});
        });
    },
    getAll:function(req, res,next){
        Color.find({}).exec(function(err, color){
            if(err){
                return next(err);
            }
            res.json({status:'success',message:'Get color success!', data: color});
        });
    },
    getSort: function(req, res,next){
        var sortBy = {};
        sortBy[req.query.orderBy?req.query.orderBy:"modifiedOn"] = req.query.sort==="true"?1:-1;
        var skip = parseInt(req.query.pageSize)*(parseInt(req.query.pageNumber)-1);
        var pageSize =  parseInt(req.query.pageSize);
        var search = req.query.search;
        Color.find({'name':{ "$regex": search, "$options": "i" }}, {},
        {
            skip:skip,
            limit:pageSize,
            sort: sortBy
        }).populate('modifiedBy').exec(
        function(err, color){
            if(err){
                return next(err);
            }
            Color.count({}, function( err, count){
                if(err){
                    return next(err);
                }
                res.json({status:'success',message:'Get color success!', data: {
                    data: color,
                    countAll: count
                }});
            });
        });
    },
    getColorById:function(req, res,next){
        Color.findById(req.params.id).exec(function(err, color){
            if(err){
                return next(err);
            }
            res.json({status:'success',message:'Get color success!', data: color});
        });
    },
    edit: function (req, res, next) {
        Color.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, color) {
            if (err) return next(err);
            logger.info("Updated color success - id:" + color._id);
            res.json({status:'success',message:'Updated color success!', data: color});
        });
    },
    delete: function(req, res, next){
        Color.findByIdAndRemove(req.params.id, function(err, color){
            if(!err){
                logger.info("Delete color success - id:" + color._id);
                res.json({status:'success',message:'Delete color success!', data: color._id});
            }
            else{
                return next(err);
            }
        });
    }
}