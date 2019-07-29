const Product = require('../models/product.model');
const ProductDetail = require('../models/productDetail.model');
const ProductSize = require('../models/productSize.model');
const logger = require('../logger');

module.exports = {
    create: function (req, res, next) {
        var productWtDetails = Object.assign({}, req.body);
        delete productWtDetails.details;
        var productDetails = req.body.details;
        var product = new Product(productWtDetails);

        product.save(function(err, pt){
            if(err){
                return next(err);
            }
            var proDetailIds = [];
            if(productDetails && productDetails.length >0 ){
                productDetails.forEach((proDetail, index) => {
                    proDetail.productId = pt._id;
                    var productDetailWtSize = Object.assign({}, proDetail);
                    delete productDetailWtSize.sizes;
                    var sizes = proDetail.sizes;
                    var productDetail = new ProductDetail(productDetailWtSize);
                    productDetail.save(function(err, pd){
                        proDetailIds.push(pd._id);
                        if(err){
                            return next(err);
                        }
                        if(sizes && sizes.length>0){
                            sizes.forEach((size)=>{
                                size.productDetailId = pd._id;
                            });

                            ProductSize.insertMany(sizes, function(err, sz){
                                if(err){
                                    return next(err);
                                }
                                if(sz && sz.length>0){
                                    sz.forEach(e=>{
                                        pd.sizes.push(e._id);
                                    });
                                    pd.save();
                                    if(index===productDetails.length){
                                        pt.details = proDetailIds;
                                        pt.save().then(()=>{
                                            logger.info("Create product success - id:" + cl._id);
                                            res.json({status:'success',message:'Create product success!', data: null});
                                        });
                                    }
                                }
                            });
                        }
                    });
                });
            }
        });
    },
    getAll:function(req, res,next){
        Product.find({}).exec(function(err, product){
            if(err){
                return next(err);
            }
            res.json({status:'success',message:'Get product success!', data: product});
        });
    },
    getSort: function(req, res,next){
        var sortBy = {};
        sortBy[req.query.orderBy?req.query.orderBy:"modifiedOn"] = req.query.sort==="true"?1:-1;
        var skip = parseInt(req.query.pageSize)*(parseInt(req.query.pageNumber)-1);
        var pageSize =  parseInt(req.query.pageSize);
        var search = req.query.search;
        Product.find({$or:[ {'name':{ "$regex": search, "$options": "i" }}, 
        {'code':{ "$regex": search, "$options": "i" }} ]}, {},
        {
            skip:skip,
            limit:pageSize,
            sort: sortBy
        }).populate('modifiedBy').populate({ 
            path: 'details',
            populate: {
              path: 'sizes',
              model: 'ProductSize'
            } 
         }).exec(
        function(err, product){
            if(err){
                return next(err);
            }
            Product.count({}, function( err, count){
                if(err){
                    return next(err);
                }
                res.json({status:'success',message:'Get product success!', data: {
                    data: product,
                    countAll: count
                }});
            });
        });
    },
    getProductById:function(req, res,next){
        Product.findById(req.params.id).exec(function(err, product){
            if(err){
                return next(err);
            }
            res.json({status:'success',message:'Get product success!', data: product});
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