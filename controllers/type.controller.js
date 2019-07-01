const Type = require('../models/type.model');
const Size = require('../models/size.model');

module.exports = {
    create: function (req, res, next) {
        var typeWithoutChilds = Object.assign({}, req.body);
        delete typeWithoutChilds.childs;
        var childs = req.body.childs;
        var type = new Type(typeWithoutChilds);

        type.save(function(err, ln){
            if(err){
                return next(err);
            }
            if(childs && childs.length >0 ){
                childs.forEach(element => {
                    element.typeId = ln._id;
                });
                Size.insertMany(childs, function(err, lni){
                    if(err){
                        return next(err);
                    }
                    if(lni && lni.length>0){
                        lni.forEach(e=>{
                            ln.childs.push(e._id);
                        });
                        ln.save().then(()=>{
                            res.json({status:'success',message:'Create type success!', data: null});
                        });
                    }
                });
            }
           
        });
    },
    getAll:function(req, res,next){
        Type.find({}).populate('childs').exec(function(err, roleGroup){
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
        }).populate('childs').populate('modifiedBy').exec(
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
        Type.findById(req.params.id).populate('childs').exec(function(err, ln){
            if(err){
                return next(err);
            }
            res.json({status:'success',message:'Get type success!', data: ln});
        });
    },
    edit: function (req, res, next) {
        var typeWithoutChilds = Object.assign({}, req.body);
        delete typeWithoutChilds.childs;
        delete typeWithoutChilds.del_arr;
        var childs = req.body.childs;
        var del_arr =  req.body.del_arr;

        Type.findByIdAndUpdate(req.params.id, {$set: typeWithoutChilds}, function (err, ln) {
            if (err) return next(err);
            if(childs && childs.length>0){
                let childsAdd = childs.filter((c)=>{
                    return !c._id;
                });
                let childsUpdate = childs.filter((c)=>{
                    return c._id;
                });
                var isRequestAdd = false;
                if(childsAdd.length > 0){
                    isRequestAdd = true;
                    childsAdd.forEach(element => {
                        element.typeId = ln._id;
                    });
                    Size.insertMany(childsAdd, function(err, lni){
                        if(err){
                            return next(err);
                        }
                        if(lni && lni.length>0){
                            let childsToAdd = [];
                            lni.forEach(e=>{
                                childsToAdd.push(e._id);
                            });
                            childsUpdate.forEach(e=>{
                                childsToAdd.push(e._id);
                            });
                            ln.childs = childsToAdd;
                            ln.save().then((ln)=>{
                                res.json({status:'success',message:'Updated type success!', data: ln});
                            });
                        }
                    });
                }
                var isRequestUpdate = false;
                if(childsUpdate.length > 0){
                    isRequestUpdate=true;
                    childsUpdate.forEach((e, i)=>{
                        Size.findByIdAndUpdate(e._id, {$set: e}, function(err, lni){
                            if(err){
                                return next(err);
                            }

                            if(i===childsUpdate.length-1){
                                if(!isRequestAdd){
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