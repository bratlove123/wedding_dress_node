const Role = require('../models/role.model');
const RoleGroup = require('../models/roleGroup.model');

module.exports = {
    create: function (req, res, next) {
        var roleGroupWithoutChilds = Object.assign({}, req.body);
        delete roleGroupWithoutChilds.childs;
        var childs = req.body.childs;
        var roleGroup = new RoleGroup(roleGroupWithoutChilds);

        roleGroup.save(function(err, ln){
            if(err){
                return next(err);
            }
            if(childs && childs.length >0 ){
                childs.forEach(element => {
                    element.roleGroupId = ln._id;
                });
                Role.insertMany(childs, function(err, lni){
                    if(err){
                        return next(err);
                    }
                    if(lni && lni.length>0){
                        lni.forEach(e=>{
                            ln.childs.push(e._id);
                        });
                        ln.save().then(()=>{
                            res.json({status:'success',message:'Create role success!', data: null});
                        });
                    }
                });
            }
           
        });
    },
    getAll:function(req, res,next){
        RoleGroup.find({}).populate('childs').exec(function(err, roleGroup){
            if(err){
                return next(err);
            }
            res.json({status:'success',message:'Get roles success!', data: roleGroup});
        });
    },
    getSort: function(req, res,next){
        var sortBy = {};
        sortBy[req.query.orderBy?req.query.orderBy:"modifiedOn"] = req.query.sort==="true"?1:-1;
        var skip = parseInt(req.query.pageSize)*(parseInt(req.query.pageNumber)-1);
        var pageSize =  parseInt(req.query.pageSize);
        var search = req.query.search;
        RoleGroup.find({$or:[ {'name':{ "$regex": search, "$options": "i" }}, {'code':{ "$regex": search, "$options": "i" }} ]}, {},
        {
            skip:skip,
            limit:pageSize,
            sort: sortBy
        }).populate('childs').populate('modifiedBy').exec(
        function(err, roleGroup){
            if(err){
                return next(err);
            }
            RoleGroup.count({}, function( err, count){
                if(err){
                    return next(err);
                }
                res.json({status:'success',message:'Get role success!', data: {
                    data: roleGroup,
                    countAll: count
                }});
            });
        });
    },
    getRoleById:function(req, res,next){
        RoleGroup.findById(req.params.id).populate('childs').exec(function(err, ln){
            if(err){
                return next(err);
            }
            res.json({status:'success',message:'Get role success!', data: ln});
        });
    },
    edit: function (req, res, next) {
        var roleGroupWithoutChilds = Object.assign({}, req.body);
        delete roleGroupWithoutChilds.childs;
        delete roleGroupWithoutChilds.del_arr;
        var childs = req.body.childs;
        var del_arr =  req.body.del_arr;

        RoleGroup.findByIdAndUpdate(req.params.id, {$set: roleGroupWithoutChilds}, function (err, ln) {
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
                    Role.insertMany(childsAdd, function(err, lni){
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
                                res.json({status:'success',message:'Updated role success!', data: ln});
                            });
                        }
                    });
                }
                var isRequestUpdate = false;
                if(childsUpdate.length > 0){
                    isRequestUpdate=true;
                    childsUpdate.forEach((e, i)=>{
                        Role.findByIdAndUpdate(e._id, {$set: e}, function(err, lni){
                            if(err){
                                return next(err);
                            }

                            if(i===childsUpdate.length-1){
                                if(!isRequestAdd){
                                    res.json({status:'success',message:'Updated role success!', data: lni});
                                }
                            }
                            
                        });
                    });
                }
                
                if(del_arr && del_arr.length>0){
                    Role.deleteMany( {_id: { $in: del_arr}}, function(err, lni){
                        if(err){
                            return next(err);
                        }
                        if(!isRequestUpdate){
                            res.json({status:'success',message:'Updated role success!', data: lni});
                        }
                    });
                }
            }  
        });
    },
    delete: function(req, res, next){
        RoleGroup.findById(req.params.id, function(err, roleGroup){
            roleGroup.remove(function(err){
                if(!err){
                    Role.deleteMany({roleGroupId: roleGroup._id}, function(err){
                        if(err){
                            return next(err);
                        }
                        res.json({status:'success',message:'Delete role success!', data: roleGroup._id});
                    });
                }
                else{
                    return next(err);
                }
            });
        });
    }
}