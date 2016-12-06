imports('config/index');
var CronJob = require('cron').CronJob;
var moment = require('moment');
var jstz = require('jstz');
var timezone = jstz.determine().name();
require('./category');
require('./home');
var _ = require('lodash');

fetchCategoryList = function (categoryListDB) {
    categoryListDB.findOne({
        cache: 0
    }, function (error, result) {
        if (error) {
            console.log(error);
        } else if (!result) {
            var req = {headers: {app_id: config.APP_ID},
                body: {store_id: '1', parent_id: '1', type: 'full'},
                URL: config.URL
            };
            categoryList(req, function (body) {
                if (body.status == 0) {
                } else {
                    var allData = body.msg.children[0].children;
                    var reverseAllData = _.reverse(allData);
                    _.forEach(reverseAllData, function (value) {
                        var allRecords = new categoryListDB({cache: 0, key: value.id,
                            categoryName: value.name, type: 'category'});
                        allRecords.save(function (err) {
                            if (err) {
                                console.log('not saved');
                            } else {
                                console.log('saved');
                            }
                        });
                    });
                }
            });
        } else {
            var type = result.get('type');
            if (type == 'category') {
                var inputId = result.get('key');
                var myReq = {headers: {app_id: config.APP_ID},
                    body: {id: inputId, limit: '10', mobile_width: '300', pageno: '1'},
                    URL: config.URL
                };
                categoryProducts(myReq, function (body) {
                    if (body.status == 0) {
                        console.log('error');
                    } else {
                        var allData = body.msg;
                        _.forEach(allData, function (value) {
                            var row = value.data;
                            var allRecords = new categoryListDB({cache: 0, key: row.sku,
                                name: row.name, type: 'product'});
                            allRecords.save(function (err) {
                                if (err) {
                                    console.log('not saved');
                                } else {
                                    categoryListDB.update({
                                        'key': inputId
                                    }, {
                                        $set: {
                                            cache: 1
                                        }
                                    }, function (err) {
                                        if (!err) {
                                            console.log('Update Done');
                                        } else {
                                            console.log('my error');
                                        }
                                    });
                                }
                            });
                        });
                    }
                });
            } else if (type == 'product') {
                var inputId = result.get('key');
                var myReq = {headers: {app_id: config.APP_ID},
                    body: {sku: inputId, mobile_width: '300'},
                    URL: config.URL
                };
                productGet(myReq, function (body) {
                    if (body.status == 0) {
                        console.log('error');
                    } else {
                        console.log('Product Get Done');
                        var productReq = {headers: {app_id: config.APP_ID},
                            body: {sku: inputId, mobile_width: '300', pageno: 1},
                            URL: config.URL
                        };
                        productReview(productReq, function (productBody) {
                            if (productBody.status == 0) {
                                console.log('error');
                            } else {
                                categoryListDB.update({
                                    'key': inputId
                                }, {
                                    $set: {
                                        cache: 1
                                    }
                                }, function (err) {
                                    if (!err) {
                                        console.log('Product Review get done.');
                                    } else {
                                        console.log('my error');
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    });
};

fetchHomeSliderList = function (homeSliderList) {
    homeSliderList.findOne({
        cache: 0
    }, function (error, result) {
        if (error) {
            console.log(error);
        } else if (!result) {
            var req = {headers: {app_id: config.APP_ID},
                body: {mobile_width: '300'},
                URL: config.URL
            };
            homeSlider(req, function (body) {
                if (body.status == 0) {
                } else {
                    var allData = body.msg;
                    _.forEach(allData, function (value) {
                        var allRecords = new homeSliderList({cache: 0, URL: value,
                            type: 'Home Slider'});
                        allRecords.save(function (err) {
                            if (err) {
                                console.log('not saved');
                            } else {
                                console.log('saved');
                            }
                        });
                    });
                }
            });
        } else {
            var urlId = result.get('_id');
            homeSliderList.update({_id: urlId}, {
                $set: {
                    cache: 1
                }
            }, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Home Slider cache 1 Done!!');
                }
            });
        }
    });
};

fetchhomeProductList = function (homeProductList) {
    homeProductList.findOne({
        cache: 0
    }, function (error, result) {
        if (error) {
            console.log(error);
        } else if (!result) {
            var req = {headers: {app_id: config.APP_ID},
                body: {mobile_width: '300'},
                URL: config.URL
            };
            homeProducts(req, function (body) {
                if (body.status == 0) {
                } else {
                    var allData = body.msg;
                    var reverseAllData = _.reverse(allData);
                    _.forEach(reverseAllData, function (value) {
                        var allRecords = new homeProductList({cache: 0, key: value.data.sku,
                            categoryName: value.data.name, type: 'product'});
                        allRecords.save(function (err) {
                            if (err) {
                                console.log('not saved');
                            } else {
                                console.log('saved');
                            }
                        });
                    });
                }
            });
        } else {
            var type = result.get('type');
            if (type == 'product') {
                var inputId = result.get('key');
                var myReq = {headers: {app_id: config.APP_ID},
                    body: {sku: inputId, mobile_width: '300'},
                    URL: config.URL
                };
                productGet(myReq, function (body) {
                    if (body.status == 0) {
                        console.log('error');
                    } else {
                        console.log('Product Get Done');
                        var productReq = {headers: {app_id: config.APP_ID},
                            body: {sku: inputId, mobile_width: '300', pageno: 1},
                            URL: config.URL
                        };
                        productReview(productReq, function (productBody) {
                            if (productBody.status == 0) {
                                console.log('error');
                            } else {
                                homeProductList.update({
                                    'key': inputId
                                }, {
                                    $set: {
                                        cache: 1
                                    }
                                }, function (err) {
                                    if (!err) {
                                        console.log('Product Review get done.');
                                    } else {
                                        console.log('my error');
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    });
};