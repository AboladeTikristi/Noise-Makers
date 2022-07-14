const express = require("express");
const app = express();
const ejs = require("ejs");
let path = require("path");
app.use('/public/', express.static('./public'));
app.use(express.static("public"))
const bodyParser = require("body-parser");
const { all } = require("express/lib/application");
const cors=require('cors')
const mongoose=require("mongoose")
app.use(cors())
require('dotenv').config()
const URI=process.env.MONGO_URI;
app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine","ejs");
mongoose.connect(URI,(err)=>{
    if(err){
        console.log(err)
        console.log(`Mongoose has not connected`)
    }
    else{
        console.log(`mongoose has connected successfully`)
    }
})
let noiseSchema=mongoose.Schema({
    name:String,
    times:String,
})
let noiseModel=mongoose.model("noise_maker_tb",noiseSchema)
app.get("/",(req,res)=>{
    noiseModel.find((err,result)=>{
        if(err){
            console.log("could not get data")
        }
        else{
 
            res.render("index",{allStudents:result})
            console.log(result)
        }
    })

})

app.post("/enter",(req,res)=>{
    const studentDetails=req.body;
    console.log(req.body)
    noiseModel.find({name:req.body.name},(err,result)=>{
        if(err){
            console.log("error!!")
        }else{
            if(result.length>0){
                console.log("noiseMaker exists")
               
            }
            else{
                let form=new noiseModel(studentDetails)
                    form.save((err)=>{
                        if (err) {
                            console.log("devil is a liar")
                        }
                        else{
                            res.redirect('/');
                        }
                    })
            }
        }
})
})
app.post("/delete",(req,res)=>{
    let myIndex=req.body.inds
    noiseModel.deleteOne({_id:myIndex},(err,result)=>{
        if (err){
            console.log("hmm i am still here")
        }
        else{
            console.log("student gone")
            res.redirect("/")
        }
    })
    // let myIndex=req.body.ind;
    // let added=allStudents.filter((student,index)=>(index!=myIndex))
    // allStudents=added;
    // res.redirect("/");
})
app.post("/add",(req,res)=>{
    let gets=parseInt(req.body.ind);
    let get=req.body.inds;
    noiseModel.find((err,result)=>{
    noiseModel.findOneAndUpdate(get,{times:parseInt(result[gets].times)+1},(err,result)=>{
         if(err){
            console.log("error!!")
        }
        else{
        res.redirect("/")
        }
    })})
    // let current=parseInt(req.body.ind);
    // let timed=parseInt(allStudents[current].times)+1;
    // allStudents[current].times=timed;
    // res.redirect("/")

})
app.post("/minus",(req,res)=>{
    let gets=parseInt(req.body.ind);
    let get=req.body.inds;
    noiseModel.find((err,result)=>{
    noiseModel.findOneAndUpdate(get,{times:parseInt(result[gets].times)-1},(err,result)=>{
         if(err){
            console.log("error!!")
        }
        else{
        res.redirect("/")
        }
    })})
    // let current=parseInt(req.body.ind);
    // let timed=parseInt(allStudents[current].times)-1;
    // allStudents[current].times=timed;
    // res.redirect("/")

})
app.post("/edit",(req,res)=>{
    let gets=parseInt(req.body.ind);
    let get=req.body.inds;
    noiseModel.find((err,result)=>{
         if(err){
            console.log("error!!")
        }
        else{
        let currentStudent=result[gets] 
        res.render("edit",{currentStudent,get})
        }
    })

})
app.post("/change",(req,res)=>{
   let index=req.body.inds
   let updateDetails=req.body

   noiseModel.findByIdAndUpdate(index,updateDetails,(err,result)=>{ 
       console.log(result)
        if(err){
           
            console.log("error!!")
        
        }
        else{
        res.redirect("/")}
    })
    // let index=parseInt(req.body.ind)
    // let current=req.body.name;
    // console.log(current)
    // allStudents[index].name=current;
    // console.log(allStudents)
    // res.redirect("/")

})
app.listen(4005,()=>{
    console.log(`My app is listening on PORT 4005`)
 })