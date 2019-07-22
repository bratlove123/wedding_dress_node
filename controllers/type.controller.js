const Type = require('../models/type.model');
const Size = require('../models/size.model');
const logger = require('../logger');

module.exports = {
    create: function (req, res, next) {
        var typeWithoutSizes = Object.assign({}, req.body);
        delete typeWithoutSizes.sizes;
        var sizes = req.body.sizes;
        var type = new Type(typeWithoutSizes);

        type.save(function(err, ln){
            if(err){
                return next(err);
            }
            if(sizes && sizes.length >0 ){
                sizes.forEach(element => {
                    element.typeId = ln._id;
                });
                Size.insertMany(sizes, function(err, lni){
                    if(err){
                        return next(err);
                    }
                    if(lni && lni.length>0){
                        lni.forEach(e=>{
                            ln.sizes.push(e._id);
                        });
                        ln.save().then(()=>{
                            logger.info("Create type success - id:" + ln._id);
                            res.json({status:'success',message:'Create type success!', data: null});
                        });
                    }
                });
            }
           
        });
    },
    getAll:function(req, res,next){
        Type.find({}).populate('sizes').exec(function(err, roleGroup){
            if(err){
                return next(err);
            }
            res.json({status:'success',message:'Get types success!', data: roleGroup});
        });
    },
    getSort: function(req, res,next){
        var sortBy = {};
        sortBy[req.query.orderBy?req.query.orderBy:"modifiedOn"] = req.query.sort==="true"?1:-1;
        var skip = parseInt(req.query.pageSize)*(parseInt(req.query.pageNumber)-1);
        var pageSize =  parseInt(req.query.pageSize);
        var search = req.query.search;
        Type.find({'name':{ "$regex": search, "$options": "i" }}, {},
        {
            skip:skip,
            limit:pageSize,
            sort: sortBy
        }).populate('sizes').populate('modifiedBy').exec(
        function(err, type){
            if(err){
                return next(err);
            }
            Type.count({}, function( err, count){
                if(err){
                    return next(err);
                }
                res.json({status:'success',message:'Get type success!', data: {
                    data: type,
                    countAll: count
                }});
            });
        });
    },
    getTypeById:function(req, res,next){
        Type.findById(req.params.id).populate('sizes').exec(function(err, ln){
            if(err){
                return next(err);
            }
            res.json({status:'success',message:'Get type success!', data: ln});
        });
    },
    edit: function (req, res, next) {
        var typeWithoutSizes = Object.assign({}, req.body);
        delete typeWithoutSizes.sizes;
        delete typeWithoutSizes.del_arr;
        var sizes = req.body.sizes;
        var del_arr =  req.body.del_arr;

        Type.findByIdAndUpdate(req.params.id, {$set: typeWithoutSizes}, function (err, ln) {
            if (err) return next(err);
            if(sizes && sizes.length>0){
                let sizesAdd = sizes.filter((c)=>{
                    return !c._id;
                });
                let sizesUpdate = sizes.filter((c)=>{
                    return c._id;
                });
                var isRequestAdd = false;
                if(sizesAdd.length > 0){
                    isRequestAdd = true;
                    sizesAdd.forEach(element => {
                        element.typeId = ln._id;
                    });
                    Size.insertMany(sizesAdd, function(err, lni){
                        if(err){
                            return next(err);
                        }
                        if(lni && lni.length>0){
                            let sizesToAdd = [];
                            lni.forEach(e=>{
                                sizesToAdd.push(e._id);
                            });
                            sizesUpdate.forEach(e=>{
                                sizesToAdd.push(e._id);
                            });
                            ln.sizes = sizesToAdd;
                            ln.save().then((ln)=>{
                                logger.info("Updated type success - id:" + ln._id);
                                res.json({status:'success',message:'Updated type success!', data: ln});
                            });
                        }
                    });
                }
                var isRequestUpdate = false;
                if(sizesUpdate.length > 0){
                    isRequestUpdate=true;
                    sizesUpdate.forEach((e, i)=>{
                        Size.findByIdAndUpdate(e._id, {$set: e}, function(err, lni){
                            if(err){
                                return next(err);
                            }

                            if(i===sizesUpdate.length-1){
                                if(!isRequestAdd){
                                    logger.info("Updated type success - id:" + ln._id);
                                    res.json({status:'success',message:'Updated type success!', data: lni});
                                }
                            }
                            
                        });
                    });
                }
                
                if(del_arr && del_arr.length>0){
                    Size.deleteMany( {_id: { $in: del_arr}}, function(err, lni){
                        if(err){
                            return next(err);
                        }
                        if(!isRequestUpdate){
                            logger.info("Updated type success - id:" + ln._id);
                            res.json({status:'success',message:'Updated type success!', data: lni});
                        }
                    });
                }
            }  
        });
    },
    delete: function(req, res, next){
        Type.findById(req.params.id, function(err, type){
            type.remove(function(err){
                if(!err){
                    Size.deleteMany({typeId: type._id}, function(err){
                        if(err){
                            return next(err);
                        }
                        logger.info("Delete type success - id:" + type._id);
                        res.json({status:'success',message:'Delete type success!', data: type._id});
                    });
                }
                else{
                    return next(err);
                }
            });
        });
    }
}