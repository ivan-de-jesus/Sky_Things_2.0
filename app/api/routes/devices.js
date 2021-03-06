const express = require('express');
const router = express.Router();
const { checkAuth } = require ('../middlewares/authentication.js')
const async = require('async');
//localhost:3001/api1/device 


//Models
import Device from '../models/device.js';


//API

router.get("/device", checkAuth, async function (req, res){
    try {
        const userId = req.userData._id;
        const devices =  await Device.find({ userId: userId });
        const toSend = {
            status: "success",
            data: devices
        };
        res.json(toSend);
    } catch (error) {
        const toSend = {
          status: "error",
          error: error
        }    
        return res.status(500).json(toSend);
    }
   
});

router.post("/device", checkAuth, async function(req, res){
    try {
        const userId = req.userData._id;
        var newDevice = req.body.newDevice;
    
        newDevice.userId = userId;
        newDevice.createdTime = Date.now();
    
        const device = await Device.create(newDevice);
        
        selectDevice(userId, newDevice.dId);
        
        const toSend = {
          status: "success"
        }
    
        return res.json(toSend);
    
      } catch (error) {
        console.log("ERROR CREATING NEW DEVICE");
        console.log(error);
    
        const toSend = {
          status: "error",
          error: error
        };
    
        return res.status(500).json(toSend);
    }
});

router.delete("/device", checkAuth, async function(req, res){
  try {
   const userId = req.userData._id;
   const dId = req.query.dId;
   const result = await Device.deleteOne({userId: userId, dId: dId});

   const toSend = {
    status: "success",
    data: result
  };

  return res.json(toSend);

  } catch (error) {
      console.log("ERROR DELETING DEVICE");
        console.log(error);
    
        const toSend = {
          status: "error",
          error: error
        };
      return res.status(500).json(toSend);
  }

   
});

router.put("/device", checkAuth, (req, res) => {
   const dId = req.body.dId;
   const userId = req.userData._id;

   if(selectDevice(userId,dId)){
      const toSend = {
        status: "success",
      };
      return res.json(toSend);
   }else{
      const toSend = {
        status: "error",
     };
    return res.json(toSend);
   }
});

//Functions
 async function selectDevice(userId, dId){
  try {
    const result = await Device.updateMany({userId: userId},{selected: false});
    const result2 = await Device.updateOne({dId:dId, userId: userId},{selected: true});

  return true
  } catch (error) {
    console.log("ERROR IN 'selectDevice' FUNTION ");
    console.log(error);
    return false;
  }
}

module.exports = router;