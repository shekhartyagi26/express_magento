imports('config/index');
var CronJob = require('cron').CronJob;
var moment = require('moment');
var jstz = require('jstz');
var timezone = jstz.determine().name();
require('./category');
require('./home');

cron = function (AppUrls, CollectioncategoryList, homeProductsList) {
    // pattern for crone  after 5 min '*/5 * * * *'
    new CronJob('* * * * * *', function () {
        AppUrls.findOne({APP_ID: "com.tethr"}, function (err, user) {
            if (err) {
                console.log(err);
            } else if (!user) {
                console.log(user);
            } else {
                var cron_running_time = user.cron_running_time;
                var time = moment().tz(timezone).format('h:mm:ss a');
//                if (time == cron_running_time) {
                console.log('You will see this message every minute');
//                var categoryListDB = CollectioncategoryList;
//                categoryListDB.findOne({
//                    cache: 0
//                }, function (error, result) {
//                    if (error) {
//                        console.log(error);
//                    } else if (!result) {
//                        var req = {headers: {app_id: config.APP_ID},
//                            body: {store_id: '1', parent_id: '1', type: 'full'},
//                            URL: config.URL
//                        };
//                        categoryList(req, function (body) {
//                            if (body.status == 0) {
//                            } else {
//                                var allData = body.msg.children[0].children;
//                                for (var a = allData.length - 1; a >= 0; a--) {
//                                    var allRecords = new categoryListDB({cache: 0, key: allData[a].id,
//                                        categoryName: allData[a].name, type: 'category'});
//                                    allRecords.save(function (err) {
//                                        if (err) {
//                                            console.log('not saved');
//                                        } else {
//                                            console.log('saved');
//                                        }
//                                    });
//                                }
//                            }
//                        });
//                    } else {
//                        var type = result.get('type');
//                        if (type == 'category') {
//                            var inputId = result.get('key');
//                            var myReq = {headers: {app_id: config.APP_ID},
//                                body: {id: inputId, limit: '10', mobile_width: '300', pageno: '1'},
//                                URL: config.URL
//                            };
//                            categoryProducts(myReq, function (body) {
//                                if (body.status == 0) {
//                                    console.log('error');
//                                } else {
//                                    var allData = body.msg;
//                                    for (var a = 0; a < allData.length; a++) {
//                                        var row = allData[a].data;
//                                        var allRecords = new categoryListDB({cache: 0, key: row.sku,
//                                            name: row.name, type: 'product'});
//                                        allRecords.save(function (err) {
//                                            if (err) {
//                                                console.log('not saved');
//                                            } else {
//                                                categoryListDB.update({
//                                                    'key': inputId
//                                                }, {
//                                                    $set: {
//                                                        cache: 1
//                                                    }
//                                                }, function (err) {
//                                                    if (!err) {
//                                                        console.log('Update Done');
//                                                    } else {
//                                                        console.log('my error');
//                                                    }
//                                                });
//                                            }
//                                        });
//                                    }
//
////                                    var categoryProductsDB = CollectioncategoryList;
////                                    categoryProductsDB.update({
////                                        'categoryId': inputId
////                                    }, {
////                                        $set: {
////                                            children: body.msg
////                                        }
////                                    }, function (err) {
////                                        if (!err) {
////                                            console.log('Update Done');
////                                        } else {
////                                            console.log('my error');
////                                        }
////                                    });
//                                }
//                            });
//                        } else if (type == 'product') {
//                            var inputId = result.get('key');
//                            var myReq = {headers: {app_id: config.APP_ID},
//                                body: {sku: inputId, mobile_width: '300'},
//                                URL: config.URL
//                            };
//                            productGet(myReq, function (body) {
//                                if (body.status == 0) {
//                                    console.log('error');
//                                } else {
//                                    console.log('Product Get Done');
//
//                                    var productReq = {headers: {app_id: config.APP_ID},
//                                        body: {sku: inputId, mobile_width: '300', pageno: 1},
//                                        URL: config.URL
//                                    };
//                                    productReview(productReq, function (productBody) {
//                                        if (productBody.status == 0) {
//                                            console.log('error');
//                                        } else {
//                                            categoryListDB.update({
//                                                'key': inputId
//                                            }, {
//                                                $set: {
//                                                    cache: 1
//                                                }
//                                            }, function (err) {
//                                                if (!err) {
//                                                    console.log('Product Review get done.');
//                                                } else {
//                                                    console.log('my error');
//                                                }
//                                            });
//                                        }
//                                    });
//                                }
//                            });
//                        }
//                    }
//                });
//                


                homeProductsList.findOne({
                    cache: 0
                }, function (error, result) {
                    if (error) {
                        console.log(error);
                    }
                });

                console.log('cron chal rhi h');
                var req = {headers: {app_id: config.APP_ID},
                    body: {mobile_width: '300'},
                    URL: config.URL
                };

                homeSlider(req, function (body) {
                    console.log('body');
                    if (body.status == 0) {
                    } else {
                        console.log(body.msg);
                        console.log(body.msg.length);

                        var allData = body.msg;
                        for (var a = allData.length - 1; a >= 0; a--) {
                            var allRecords = new homeProductsList({cache: 0, URL: allData[a],
                                type: 'Home Slider'});
                            allRecords.save(function (err) {
                                if (err) {
                                    console.log('not saved');
                                } else {
                                    console.log('saved');
                                }
                            });
                        }


                    }
                });


//                var homeProduct = homeSlider;
//                homeProduct.findOne({
//                    cache: 0
//                }, function (error, result) {
//                    if (error) {
//                        console.log(error);
//                    } else if (!result) {
//                        console.log('record ni h');
//                        var req = {headers: {app_id: config.APP_ID},
//                            body: {mobile_width: '300'},
//                            URL: config.URL
//                        };
////                        homeProducts(req, function (body) {
////                            if (body.status == 0) {
////                            } else {
////
////                                console.log(body.msg);
////
////                                var allData = body.msg.children[0].children;
////                                for (var a = allData.length - 1; a >= 0; a--) {
////                                    var allRecords = new categoryListDB({cache: 0, key: allData[a].id,
////                                        categoryName: allData[a].name, type: 'category'});
////                                    allRecords.save(function (err) {
////                                        if (err) {
////                                            console.log('not saved');
////                                        } else {
////                                            console.log('saved');
////                                        }
////                                    });
////                                }
////                            }
////                        });
//                    }
////                    else {
////                        var type = result.get('type');
////                        if (type == 'category') {
////                            var inputId = result.get('key');
////                            var myReq = {headers: {app_id: config.APP_ID},
////                                body: {id: inputId, limit: '10', mobile_width: '300', pageno: '1'},
////                                URL: config.URL
////                            };
////                            categoryProducts(myReq, function (body) {
////                                if (body.status == 0) {
////                                    console.log('error');
////                                } else {
////                                    var allData = body.msg;
////                                    for (var a = 0; a < allData.length; a++) {
////                                        var row = allData[a].data;
////                                        var allRecords = new categoryListDB({cache: 0, key: row.sku,
////                                            name: row.name, type: 'product'});
////                                        allRecords.save(function (err) {
////                                            if (err) {
////                                                console.log('not saved');
////                                            } else {
////                                                categoryListDB.update({
////                                                    'key': inputId
////                                                }, {
////                                                    $set: {
////                                                        cache: 1
////                                                    }
////                                                }, function (err) {
////                                                    if (!err) {
////                                                        console.log('Update Done');
////                                                    } else {
////                                                        console.log('my error');
////                                                    }
////                                                });
////                                            }
////                                        });
////                                    }
////
//////                                    var categoryProductsDB = CollectioncategoryList;
//////                                    categoryProductsDB.update({
//////                                        'categoryId': inputId
//////                                    }, {
//////                                        $set: {
//////                                            children: body.msg
//////                                        }
//////                                    }, function (err) {
//////                                        if (!err) {
//////                                            console.log('Update Done');
//////                                        } else {
//////                                            console.log('my error');
//////                                        }
//////                                    });
////                                }
////                            });
////                        } else if (type == 'product') {
////                            var inputId = result.get('key');
////                            var myReq = {headers: {app_id: config.APP_ID},
////                                body: {sku: inputId, mobile_width: '300'},
////                                URL: config.URL
////                            };
////                            productGet(myReq, function (body) {
////                                if (body.status == 0) {
////                                    console.log('error');
////                                } else {
////                                    console.log('Product Get Done');
////
////                                    var productReq = {headers: {app_id: config.APP_ID},
////                                        body: {sku: inputId, mobile_width: '300', pageno: 1},
////                                        URL: config.URL
////                                    };
////                                    productReview(productReq, function (productBody) {
////                                        if (productBody.status == 0) {
////                                            console.log('error');
////                                        } else {
////                                            categoryListDB.update({
////                                                'key': inputId
////                                            }, {
////                                                $set: {
////                                                    cache: 1
////                                                }
////                                            }, function (err) {
////                                                if (!err) {
////                                                    console.log('Product Review get done.');
////                                                } else {
////                                                    console.log('my error');
////                                                }
////                                            });
////                                        }
////                                    });
////                                }
////                            });
////                        }
////                    }
//                });

//                }
            }
        });
    }, null, true);
};