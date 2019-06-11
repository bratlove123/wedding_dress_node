const LeftNav = require('../models/leftNav.model');
const LeftNavItem = require('../models/leftNavItem.model');

module.exports = {
    create: function (req, res, next) {
        var leftNavWithoutChilds = Object.assign({}, req.body);
        delete leftNavWithoutChilds.childs;
        var childs = req.body.childs;
        var leftNav = new LeftNav(leftNavWithoutChilds);

        leftNav.save(function(err, ln){
            if(err){
                next(err);
            }
            if(childs && childs.length >0 ){
                childs.forEach(element => {
                    element.leftNavId = ln._id;
                });
                LeftNavItem.insertMany(childs, function(err, lni){
                    if(err){
                        next(err);
                    }
                    if(lni && lni.length>0){
                        lni.forEach(e=>{
                            ln.childs.push(e._id);
                        });
                        ln.save().then(()=>{
                            res.json({status:'success',message:'Create left nav success!', data: null});
                        });
                    }
                });
            }
           
        });
    },
    getAll:function(req, res,next){
        var sortBy = {};
        sortBy["position"] = 1;
        LeftNav.find({}, {}, {sort: sortBy}).populate({path: 'childs', options: {sort: {position: -1}}}).exec(function(err, leftNavs){
            if(err){
                next(err);
            }
            res.json({status:'success',message:'Get left nav success!', data: leftNavs});
        });
    },
    getSort: function(req, res,next){
        var sortBy = {};
        sortBy[req.query.orderBy?req.query.orderBy:"modifiedOn"] = req.query.sort?1:-1;
        var skip = parseInt(req.query.pageSize)*(parseInt(req.query.pageNumber)-1);
        var pageSize =  parseInt(req.query.pageSize);
        var search = req.query.search;
        LeftNav.find({$or:[ {'name':{ "$regex": search, "$options": "i" }}, {'url':{ "$regex": search, "$options": "i" }} ]}, {},
        {
            skip:skip,
            limit:pageSize,
            sort: sortBy
        }).populate('childs').exec(
        function(err, allDatas){
            if(err){
                next(err);
            }
            LeftNav.count({}, function( err, count){
                if(err){
                    next(err);
                }
                res.json({status:'success',message:'Get left nav success!', data: {
                    data: allDatas,
                    countAll: count
                }});
            });
        });
    },
    getLeftNavById:function(req, res,next){
        LeftNav.findById(req.params.id).populate('childs').exec(function(err, ln){
            if(err){
                next(err);
            }
            res.json({status:'success',message:'Get left nav success!', data: ln});
        });
    },
    edit: function (req, res, next) {
        var leftNavWithoutChilds = Object.assign({}, req.body);
        delete leftNavWithoutChilds.childs;
        delete leftNavWithoutChilds.del_arr;
        var childs = req.body.childs;
        var del_arr =  req.body.del_arr;

        LeftNav.findByIdAndUpdate(req.params.id, {$set: leftNavWithoutChilds}, function (err, ln) {
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
                        element.leftNavId = ln._id;
                    });
                    LeftNavItem.insertMany(childsAdd, function(err, lni){
                        if(err){
                            next(err);
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
                                res.json({status:'success',message:'Updated left nav success!', data: ln});
                            });
                        }
                    });
                }
                var isRequestUpdate = false;
                if(childsUpdate.length > 0){
                    isRequestUpdate=true;
                    childsUpdate.forEach(e=>{
                        //Update left nav
                        LeftNavItem.findByIdAndUpdate(e._id, {$set: e}, function(err, lni){
                            if(err){
                                next(err);
                            }
                            if(!isRequestAdd){
                                res.json({status:'success',message:'Updated left nav success!', data: lni});
                            }
                        });
                    });
                }
                
                if(del_arr && del_arr.length>0){
                    LeftNavItem.deleteMany( {_id: { $in: del_arr}}, function(err, lni){
                        if(err){
                            next(err);
                        }
                        if(!isRequestUpdate){
                            res.json({status:'success',message:'Updated left nav success!', data: lni});
                        }
                    });
                }
            }  
        });
    },
    delete: function(req, res, next){
        LeftNav.findById(req.params.id, function(err, leftNav){
            leftNav.remove(function(err){
                if(!err){
                    LeftNavItem.deleteMany({leftNavId: leftNav._id}, function(err){
                        if(err){
                            next(err);
                        }
                        res.json({status:'success',message:'Delete left nav success!', data: leftNav._id});
                    });
                }
                else{
                    next(err);
                }
            });
        });
    }
}