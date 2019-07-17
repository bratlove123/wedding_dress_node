const User = require('../models/user.model');

module.exports = {
    create: function(req, res, next){
        User.findOne({$or: [{'userName': req.body.userName}, {'email': req.body.email}]}, function(err, user){
            if(err){
              return next(err);
            }
            if(user){
              logger.error("User already exists - " + userName);
              return next({status:403,message:'User already exists!', data: null});
            }

            var user = new User(req.body);
            user.save(function(err, user){
                if(err){
                    return next(err);
                }
                logger.info("Save user success - " + user.userName);
                res.json({status:'success',message:'Create user success!', data: user});
            });
        }); 
    },
    getSort: function(req, res, next){
        var sortBy = {};
        sortBy[req.query.orderBy?req.query.orderBy:"modifiedOn"] = req.query.sort==="true"?1:-1;
        var skip = parseInt(req.query.pageSize)*(parseInt(req.query.pageNumber)-1);
        var pageSize =  parseInt(req.query.pageSize);
        var search = req.query.search;
        User.find({$or:[ {'userName':{ "$regex": search, "$options": "i" }}, 
        {'email':{ "$regex": search, "$options": "i" }},
        {'password':{ "$regex": search, "$options": "i" }},
        {'firstName':{ "$regex": search, "$options": "i" }},
        {'lastName':{ "$regex": search, "$options": "i" }},
        {'phone':{ "$regex": search, "$options": "i" }},
        {'address':{ "$regex": search, "$options": "i" }} ]}, {},
        {
            skip:skip,
            limit:pageSize,
            sort: sortBy
        }).populate('modifiedBy').exec(
        function(err, allDatas){
            if(err){
                return next(err);
            }
            User.count({}, function( err, count){
                if(err){
                    return next(err);
                }
                res.json({status:'success',message:'Get list user success!', data: {
                    data: allDatas,
                    countAll: count
                }});
            });
        });
    },
    getUserById:function(req, res,next){
        User.findById(req.params.id).populate('modifiedBy').exec(function(err, ln){
            if(err){
                return next(err);
            }
            res.json({status:'success',message:'Get user success!', data: ln});
        });
    },
    updateUser:function(req, res, next){
        if(req.body.password){
            User.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, user) {
                if (err) return next(err);
                user.password = req.body.password;
                user.save(function(err, user){
                    if(err){
                        return next(err);
                    }
                    logger.info("Update user success - " + user.userName);
                    res.json({status:'success',message:'Update user success!', data: user});
                });
            });
        }
        else{
            delete req.body.password;
            User.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, ln) {
                if (err) return next(err);
                logger.info("Update user success - " + user.userName);
                res.json({status:'success',message:'Update user success!', data: ln});
            });
        }
    },
    delete: function(req, res, next){
        User.findById(req.params.id, function(err, user){
            if(err){
                return next(err);
            }
            user.remove(function(err){
                if(!err){
                    logger.info("Delete user success - " + user.userName);
                    res.json({status:'success',message:'Delete user success!', data: user});
                }
                else{
                    return next(err);
                }
            });
        });
    },
    toggleActive:  function(req, res, next){
        User.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, ln) {
            if (err) return next(err);
            logger.info("Active user success - " + user.userName);
            res.json({status:'success',message:'Update user success!', data: ln});
        });
    },
    getRoles: function(req, res, next){
        User.findById(req.params.id).populate('roles').exec(function(err, ln){
            if(err){
                return next(err);
            }
            res.json({status:'success',message:'Get roles of user success!', data: ln.roles});
        });
    }
}