const Product = require('../models/product.model');
const ProductDetail = require('../models/productDetail.model');
const ProductSize = require('../models/productSize.model');
const logger = require('../logger');

function generateSerial() {
    'use strict';
    var chars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        serialLength = 10,
        randomSerial = "",
        i,
        randomNumber;
    for (i = 0; i < serialLength; i = i + 1) {
        randomNumber = Math.floor(Math.random() * chars.length);
        randomSerial += chars.substring(randomNumber, randomNumber + 1);
    }
    return randomSerial;
}

module.exports = {
    create: function (req, res, next) {
        var productWtDetails = Object.assign({}, req.body);
        delete productWtDetails.details;
        var productDetails = req.body.details;
        var product = new Product(productWtDetails);
        product.code = generateSerial();
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
                                    if(index===productDetails.length-1){
                                        pt.details = proDetailIds;
                                        pt.save().then(()=>{
                                            logger.info("Create product success - id:" + pt._id);
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
    findProduct:function(req, res,next){
        Product.find({$or:[ {'name':{ "$regex": req.query.search, "$options": "i" }}, 
        {'code':{ "$regex": req.query.search, "$options": "i" }}]}).populate({ 
            path: 'details',
            populate: {
              path: 'sizes',
              model: 'ProductSize',
              populate:{
                path: 'sizeId',
                model: 'Size',
              }
            } 
         }).populate({ 
            path: 'details',
            populate: {
              path: 'colorId',
              model: 'Color'
            } 
         }).exec(function(err, product){
            if(err){
                return next(err);
            }
            res.json({status:'success',message:'Get product success!', data: product});
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
        }).populate('modifiedBy').populate('supplierId').populate('typeId').populate({ 
            path: 'details',
            populate: {
              path: 'sizes',
              model: 'ProductSize',
              populate:{
                path: 'sizeId',
                model: 'Size',
              }
            } 
         }).populate({ 
            path: 'details',
            populate: {
              path: 'colorId',
              model: 'Color'
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
        Product.findById(req.params.id).populate({ 
            path: 'details',
            populate: {
              path: 'sizes',
              model: 'ProductSize'
            } 
         }).exec(function(err, product){
            if(err){
                return next(err);
            }
            res.json({status:'success',message:'Get product success!', data: product});
        });
    },
    edit: function (req, res, next) {
        var productWithoutDetails = Object.assign({}, req.body);
        delete productWithoutDetails.details;
        delete productWithoutDetails.del_arr;
        delete productWithoutDetails.del_size_arr;
        var details = req.body.details;
        var del_arr =  req.body.del_arr;
        var del_size_arr = req.body.del_size_arr;

        //Update Product
        Product.findByIdAndUpdate(req.params.id, {$set: productWithoutDetails}, function (err, product) {
            if (err) return next(err);
            if(details && details.length>0){
                let requestAddProDetail = [];
                details.forEach((detail, proDetailIdx)=>{
                    let pdWtSizes = Object.assign({}, detail);
                    delete pdWtSizes.sizes;
                    delete pdWtSizes.del_arr;
                    if(pdWtSizes._id){
                        requestAddProDetail.push(ProductDetail.findByIdAndUpdate(pdWtSizes._id, {$set: pdWtSizes}));
                    }
                    else{
                        pdWtSizes.productId = product._id;
                        requestAddProDetail.push(ProductDetail.create(pdWtSizes));
                    }
                });

                Promise.all(requestAddProDetail).then(function(results){
                    let productIds = [];
                    results.forEach((pd, pdIndex)=>{
                        productIds.push(pd._id);
                        let sizes = details[pdIndex].sizes;
                        let requestSizes = [];
                        sizes.forEach((size, sizesIdx)=>{
                            if(size._id){
                                requestSizes.push(ProductSize.findByIdAndUpdate(size._id, {$set: size}));
                            }
                            else{
                                size.productDetailId = pd._id;
                                requestSizes.push(ProductSize.create(size));
                            }
                        });
                        let updatePDRequest = [];
                        Promise.all(requestSizes).then(function(sizeResults){
                            let sizeIds = [];
                            sizeResults.forEach((sizeResult)=>{
                               sizeIds.push(sizeResult._id);
                            });
                            //pd.sizes = sizeIds;
                            let fakeDetails = details[pdIndex];
                            fakeDetails.sizes = sizeIds;
                            updatePDRequest.push(ProductDetail.findByIdAndUpdate(pd._id, {$set: fakeDetails}));
                            if(pdIndex===details.length-1){
                                Promise.all(updatePDRequest).then(function(){
                                    product.details = productIds;

                                    let lastRequest = [];
                                    lastRequest.push(Product.findByIdAndUpdate(product._id, {$set: product}));
                                    if(del_arr.length>0){
                                        lastRequest.push(ProductDetail.deleteMany( {_id: { $in: del_arr}}));
                                    }
                                    if(del_size_arr.length>0){
                                        lastRequest.push(ProductSize.deleteMany( {_id: { $in: del_size_arr}}));
                                    }
                                    Promise.all(lastRequest).then(function(result){
                                        logger.info("Updated product success - id:" + product._id);
                                        res.json({status:'success',message:'Updated product success!', data: product});
                                    }, function(err){
                                        return next(err);
                                    });
                                }, function(err){
                                    return next(err);
                                });
                            }
                        }, function(err){
                            return next(err);
                        });
                    });
                   
                }, function (err) {
                    return next(err);
                });
                    // // var pdIds = [];
                    // // //If added new detail
                    // // if(!detail._id){
                    // //     let addPDWtSizes = Object.assign({}, detail);
                    // //     delete addPDWtSizes.sizes;
                    // //     let sizes = detail.sizes;
                    // //     let addPD = new ProductDetail(addPDWtSizes);
                    // //     addPD.productId = product._id;
                    // //     addPD.save((err, pd)=>{
                    // //         if(err){
                    // //             return next(err);
                    // //         }
                    // //         pdIds.push(pd._id);
                            
                    // //         //Add product Id
                    // //         sizes.forEach(size => {
                    // //             size.productDetailId = pd._id;
                    // //         });

                    // //         //Save sizes
                    // //         ProductSize.insertMany(sizes, function(err, productSizes){
                    // //             if(err){
                    // //                 return next(err);
                    // //             }
                    // //             let productSizesToAdd = [];
                    // //             if(productSizes && productSizes.length>0){
                    // //                 productSizes.forEach((prz)=>{
                    // //                     productSizesToAdd.push(prz._id);
                    // //                 });
                    // //             }
                    // //             pd.sizes = productSizesToAdd;
                    // //             pd.save(function(err){
                    // //                 if(err){
                    // //                     return next(err);
                    // //                 }
                    // //             });
                    // //         });
                    // //     });
                    // // }
                    // // else{
                    // //     let updatePDWtSizes = Object.assign({}, detail);
                    // //     delete updatePDWtSizes.sizes;
                    // //     delete updatePDWtSizes.del_arr;
                    // //     let sizes = detail.sizes;
                    // //     let del_arrSizes = detail.del_arr;
                    // //     ProductDetail.findByIdAndUpdate(updatePDWtSizes._id, {$set: updatePDWtSizes}, function(err, productDetailUpdate){
                    // //         pdIds.push(productDetailUpdate._id);
                    // //         let sizesAdd = sizes.filter((c)=>{
                    // //             return !c._id;
                    // //         });
                    // //         let sizesUpdate = sizes.filter((c)=>{
                    // //             return c._id;
                    // //         });

                    // //         sizesAdd.forEach(size => {
                    // //             size.productDetailId = productDetailUpdate._id;
        
                    // //             //Save size
                    // //             ProductSize.insertMany(sizesAdd, function(err, productSizes){
                    // //                 if(err){
                    // //                     return next(err);
                    // //                 }
                    // //                 let productSizesToAdd = [];
                    // //                 if(productSizes && productSizes.length>0){
                    // //                     productSizes.forEach((prz)=>{
                    // //                         productSizesToAdd.push(prz._id);
                    // //                     });
                    // //                 }
                    // //                 sizesUpdate.forEach(e=>{
                    // //                     productSizesToAdd.push(e._id);
                    // //                 });
                    // //                 productDetailUpdate.sizes = productSizesToAdd;
                    // //                 productDetailUpdate.save((err)=>{
                    // //                     return next(err);
                    // //                 });
                    // //             });
                    // //         });

                    // //         sizesUpdate.forEach((e, i)=>{
                    // //             ProductSize.findByIdAndUpdate(e._id, {$set: e}, function(err, size){
                    // //                 if(err){
                    // //                     return next(err);
                    // //                 }
        
                    // //                 // if(i===sizesUpdate.length-1){
                    // //                 //     logger.info("Updated product success - id:" + product._id);
                    // //                 //         res.json({status:'success',message:'Updated product success!', data: size});
                    // //                 // }
                                    
                    // //             });
                    // //         });

                    // //         if(del_arrSizes && del_arrSizes.length>0){
                    // //             ProductSize.deleteMany( {_id: { $in: del_arrSizes}}, function(err, delSizes){
                    // //                 if(err){
                    // //                     return next(err);
                    // //                 }
                    // //                 // logger.info("Updated product success - id:" + product._id);
                    // //                 // res.json({status:'success',message:'Updated product success!', data: delSizes});
                    // //             });
                    // //         }
                            
                    // //     });
                    // //     if(proDetailIdx===details.length-1){
                    // //         product.details = pdIds;
                    // //         product.save((err)=>{
                    // //             if(err){
                    // //                 return next(err);
                    // //             }
                    // //             logger.info("Updated product success - id:" + product._id);
                    // //             res.json({status:'success',message:'Updated product success!', data: product});
                    // //         });
                    // //     }
                    // }
                
            } 

            if(del_arr && del_arr.length>0){
                ProductDetail.deleteMany( {_id: { $in: del_arr}}, function(err, pds){
                    if(err){
                        return next(err);
                    }
                    // logger.info("Updated product success - id:" + product._id);
                    // res.json({status:'success',message:'Updated product success!', data: pds});
                });
            }
        });
    },
    delete: function(req, res, next){
        Product.findByIdAndRemove(req.params.id, function(err, product){
            if(!err){
                ProductDetail.find({productId: product._id}, function(err, pds){
                    if(err){
                        return next(err);
                    }

                    if(pds && pds.length > 0){
                        for(let i=0;i<pds.length;i++){
                            ProductSize.deleteMany({productDetailId: pds[i]._id}, function(err, ps){
                                if(err){
                                    return next(err);
                                }

                                if(i==pds.length-1){
                                    ProductDetail.deleteMany({productId: product._id}, function(err){
                                        logger.info("Delete product success - id:" + product._id);
                                        res.json({status:'success',message:'Delete product success!', data: product._id});
                                    });
                                }
                            });
                        }
                    }
                   
                });
            }
            else{
                return next(err);
            }
        });
    }
}