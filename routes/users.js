var express = require('express');
var router = express.Router();
var insert = require('../public/javascripts/user')
var show = require('../public/javascripts/user')
var selectF = require('../public/javascripts/user')
var update  = require('../public/javascripts/user')
const users = []

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/show', async (req, res, next) => {
  try {
    // let result = await show.show();
    // console.log(result)
    let Sell = req.query.value
    console.log(Sell)
    let result = await show.show();
    console.log(result.length)
    if(result.length >0 ){
        for(let index in result){
          console.log(index,result[index])
            let height = result[index].height
            let low  = result[index].low
            let openId = result[index].openId
            if(Sell > height){
                console.log(openId,"当前已涨到" + JSON.stringify(Sell))
            }
            if(Sell < low){
              console.log(openId,"当前已跌到" + JSON.stringify(Sell))
            }
        }
    }

    res.send(result);
  } catch (e) {
    res.send(e);
  }
})

router.post('/subscribe', async (req, res, next) =>{
  try {
    let param = req.body;
    console.log(param);
      let select = await selectF.select(param.openId)
      console.log('select',select.length)
      if(select.length > 0){
        console.log('update',select)
        let reslut = await update.update([param.height,param.low,param.openId])
        res.send(reslut);
      }else{
        console.log('insert',select)
        let result =  await insert.insert([param.openId,param.height,param.low]);
        res.send(result);
      }

      
  } catch (e) {
    console.log("error",e)
    res.send(e);
  }
})





module.exports = router;
