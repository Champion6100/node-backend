var express = require('express')
var router = express.Router()
const Task   = require('../models/table')

router.get('/home',function(req, res,next){
    Task.findAll()
    .then(tasks=>{
        res.json(tasks)
    })
    .catch(err=>{
        res.send('error:' +err)
    })
})
router.get('/login/:full_name',function(req, res,next){
    Task.findOne({
        where:{
            full_name:req.params.full_name
        }
    })
    .then(tasks=>{
        if(task){
        res.json(tasks)
        } else {
            res.send('task does not exist')
        }
    })
    .catch(err=>{
        res.send('error:' +err)
    })
})
router.post('/signup', function(req,res,next){
    if (!req.body.full_name){
        res.status(400)
        res.json({
            error :'bad data'
        })
    } else {
        Task.create(req.body)
        .then(data=> {
            res.send(data)
        })
        .catch(err=> {
            res.json('error:' +err)
        })
    }
})

module.exports=router