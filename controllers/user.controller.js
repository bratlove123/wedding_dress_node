const userModel = require('../models/user.model');

module.exports = {
    create: function(req, res, next){
        // userModel.create({name: req.body.name, email: req.body.email, password: req.body.password}, function(err, result){
        //     if(err){
        //         next(err);
        //     }
        //     else{
        //         res.json({
        //             status: 'success', message: 'User added successfully!', data: null
        //         })
        //     }
        // });
    },
    getSort: function(req, res, next){
        var sortBy = {};
        sortBy[req.query.orderBy?req.query.orderBy:"modifiedOn"] = req.query.sort?1:-1;
        var skip = parseInt(req.query.pageSize)*(parseInt(req.query.pageNumber)-1);
        var pageSize =  parseInt(req.query.pageSize);
        var search = req.query.search;
        LeftNav.find({$or:[ {'userName':{ "$regex": search, "$options": "i" }}, 
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
                next(err);
            }
            LeftNav.count({}, function( err, count){
                if(err){
                    next(err);
                }
                res.json({status:'success',message:'Get list user success!', data: {
                    data: allDatas,
                    countAll: count
                }});
            });
        });
    }
}