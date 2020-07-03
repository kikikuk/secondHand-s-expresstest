// 创建一个mongo的客户端对象
const MongoClient = require('mongodb').MongoClient;

class DAO {
    constructor(url, dbName, collectionName) {
        this.url = url;
        this.dbName = dbName;
        this.collectionName = collectionName;
    }

    _connect() {
        return new Promise((resolve, reject) => {
            // 数据库连接方法的封装
            MongoClient.connect(this.url, { useUnifiedTopology: true }, (err, client) => {
                if (err) return reject(err);
                resolve(client)
            })
        })
    }
    insert(obj, isMany) {
        return new Promise((resolve, reject) => {
            this._connect().then(client => {
                let db = client.db(this.dbName)
                if (isMany) {
                    db.collection(this.collectionName).insertMany(obj).then(res => {
                        resolve(res)
                        client.close()
                    })

                } else {
                    db.collection(this.collectionName).insertOne(obj).then(res => {
                        resolve(res)
                        client.close()
                    })
                }
            })
        })
    }

    del(obj, isMany) {
        return new Promise((resolve, reject) => {
            this._connect().then(client => {
                let db = client.db(this.dbName)
                if (isMany) {
                    db.collection(this.collectionName).deleteMany(obj).then(res => {
                        resolve(res)
                        client.close()
                    })

                } else {
                    db.collection(this.collectionNam).deleteOne(obj).then(res => {
                        resolve(res)
                        client.close()
                    })
                }
            })
        })
    }

    update(filter, updater) {
        return new Promise((resolve, reject) => {
            this._connect().then(client => {
                let updaterCpy = { $set: updater }
                let db = client.db(this.dbName)

                db.collection(this.collectionName).updateMany(filter, updaterCpy).then(res => {
                    resolve(res)
                    client.close()
                })

            })
        })
    }

    query(obj) {
        obj = obj || {}
        let arr = []
        return new Promise((resolve, reject) => {
            this._connect().then(client => {
                let db = client.db(this.dbName);
                let queryRes = db.collection(this.collectionName).find(obj)
                // console.log(queryRes)
                // console.log('11111'+queryRes.each((err,data)=>{
                //     console.log('222222'+err)
                //     console.log('333333'+data)
                // }))

                // queryRes.each((err, data) => {
                // // queryRes.each((err, data) => {
                //     console.log('是否进入')
                //     console.log(data)

                //     if (data != null) {
                //         arr.push(data)
                //         console.log('检查arr'+arr)
                //     } else {
                //         resolve(arr)
                //     }
                // })

                client.close()
            })
        })
    }
}

module.exports = DAO

// const dao = new DAO('mongodb://localhost:27017/', 'test', 'user')
// let obj={name:'nizhebang',age:22}
// dao.insert(obj).then(res=>{console.log(res)})
// let arr=[];
// for(let i=0;i<10;i++){
//     arr.push({
//         userid:'妖怪',
//         age:i
//     })
// }
// dao.insert(arr,true).then(res=>{console.log(res)})
// let obj={userid:'妖怪'}

// dao.del(obj,true).then(res=>{console.log(res)})

// let filter ={name:'xiaoleilei'}
// let update={name:'fahai',age:2000}
// dao.update(filter,update).then(res=>{})

// dao.query().then(arr => {
//     console.log(arr)
// })
