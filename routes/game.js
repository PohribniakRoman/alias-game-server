const { Router } = require("express");
const Room = require("../schema/room");
const router = Router();

router.post("/getRoomInfo",async  (req,res)=>{
    const {roomId} = req.body;
    const resp = await Room.findOne({roomId:roomId});
    res.send(resp);
})

module.exports = router;
