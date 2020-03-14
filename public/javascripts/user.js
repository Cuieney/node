const db = require('./db')

var user = {
    insert:'INSERT INTO user(openId, height, low) VALUES(?,?,?)',
    update:'update user set height=?, low=? where openId=?',
    delete: 'delete from user where id=?',
    select: 'select * from user where openId =?',
    queryAll: 'select * from user'
  };
let show = () => {
  return new  Promise((resolve, reject) => {
    db.query(user.queryAll, (err, rows) => {
      if(err) {
        reject(err);
      }
      resolve(rows);
    })
  })
}

let select = (attribute) => {
  return new Promise((resolve, reject) => {
    db.query(user.select,attribute, (err, rows) => {
      if(err) {
        reject(err);
      }
      resolve(rows);
    })
  })
}//查询一行（传参)

let update = (attribute) => {
  return new Promise((resolve, reject) => {
    db.query(user.update,attribute,(err,rows) => {
      if(err) {
        reject(err);
      }
      resolve(rows);
    })
  }) 
}//修改



let insert = (attributes) => {
    console.log(attributes)
  return new Promise((resolve, reject) => {
    db.query(user.insert,attributes, (err,rows) => {
      if(err) {
        reject(err);
      }
      resolve(rows);
    })
  })
}//增加

exports.show = show
exports.select = select
exports.update =  update
exports.insert = insert