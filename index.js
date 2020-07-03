var express = require('express')
var app = express()

// 处理post
const formidable = require('formidable')

// 引用
const DAO = require('./dao')
// 实例化
const dao = new DAO('mongodb://localhost:27017/', 'test', 'user')

// app.get('/',function(req,res){
//     res.send('hello word')
// })

// 查询数据
// app.get('/init', (req, res) => {
//     if (req.query.nickName) {
//         let nickName = { nickName: req.query.nickName }
//         dao.query(nickName).then(restlt => {
//             res.send({ restlt })
//         })
//     } else {
//         dao.query().then(restlt => {
//             res.send({ restlt })
//         })
//     }
// })


// 登录    查询是否有账号
app.get('/hadAccount', function (req, res) {
    var response = {
        "tele": req.query.tele
    };
    const MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        console.log("数据库已创建!");
        var dbase = db.db('test');
        dbase.collection("user").find({
            "tele": response.tele
        }).toArray(function (err, result) {
            if (err) throw err;
            // 发送响应数据 
            res.send(JSON.stringify(result));
            db.close();
        });
    });
})

//  注册
app.post('/registered', (req, res) => {
    let form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
        let obj = { tele: fields.tele, password: fields.password, time: new Date() }
        dao.insert(obj).then(result => {
            res.send('插入成功')
        })
    })
})

// 根据type展示商品列表
app.get('/changCategory', function (req, res) {
    var response = {
        "type": req.query.type
    };
    const MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        console.log("数据库已创建!");
        var dbase = db.db('test');
        dbase.collection("goods").find({
            "type": response.type
        }).toArray(function (err, result) {
            if (err) throw err;
            // 发送响应数据 
            res.send(JSON.stringify(result));
            db.close();
        });
    });
})

//  发布商品
app.post('/publish', (req, res) => {
    let form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
        let obj = {
            description: fields.description,
            picUrl: fields.picUrl,
            price: fields.price,
            type: fields.type,
            sellerId: fields.sellerId,
            nickName: fields.nickName,
            name: fields.name,
            school: fields.school,
            avartar: fields.avartar,
            time: new Date()
        }
        const MongoClient = require('mongodb').MongoClient;
        MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            console.log("数据库已创建!");
            var dbase = db.db('test');
            dbase.collection("goods").insertOne(obj).then(res => {
                console.log("插入成功!");
                // res.send('插入成功')
                db.close()
            })
        });
    })
})

// 根据sellerId展示商品列表
app.get('/relatedOrder', function (req, res) {
    var response = {
        "sellerId": req.query.sellerId
    };
    const MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        console.log("数据库已创建!");
        console.log(response.sellerId);
        var dbase = db.db('test');
        dbase.collection("goods").find(
            { sellerId: response.sellerId }
        ).toArray(function (err, result) {
            if (err) throw err;
            // 发送响应数据 
            res.send(JSON.stringify(result));
            db.close();
        });
    });
})

// 根据buyerId展示商品列表
app.get('/hadBuy', function (req, res) {
    var response = {
        "buyerId": req.query.buyerId
    };
    const MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        console.log("数据库已创建!");
        console.log(response.buyerId);
        var dbase = db.db('test');
        dbase.collection("goods").find(
            { buyerId: response.buyerId }
        ).toArray(function (err, result) {
            if (err) throw err;
            // 发送响应数据 
            res.send(JSON.stringify(result));
            db.close();
        });
    });
})

//  下单
app.post('/order', (req, res) => {
    let form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
        let obj = {
            // orderId: fields.orderId,
            goodsId: fields.goodsId,
            buyerId: fields.buyerId,
            
            sellerId: fields.sellerId,

            time: new Date()
        }
        const MongoClient = require('mongodb').MongoClient;
        MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            console.log("数据库已创建!");
            var dbase = db.db('test');
            dbase.collection("order").insertOne(obj).then(res => {
                console.log("插入成功!");
                // res.send('插入成功')
                db.close()
            })
        });
    })
})

// 添加数据
app.post('/add', (req, res) => {
    let form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
        let obj = { name: fields.name, age: fields.age, time: new Date() }
        dao.insert(obj).then(result => {
            res.send('插入成功')
        })
    })
})

// 删除数据
app.post('/del', (req, res) => {
    let form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
        let obj = { name: fields.name }
        dao.del(obj).then(result => {
            res.send('删除成功')
        })
    })
})

// 修改数据
app.post('/update', (req, res) => {
    let form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
        let filter = { tele: fields.tele }
        let update = { 
            tele: fields.tele,
            password: fields.password,
            nickName: fields.nickName,
            name: fields.name,
            school: fields.school,
            avartar: fields.avartar
         }
        dao.update(filter, update).then(result => {
            res.send('修改成功')
        })
    })
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!!');
})