const express=require("express");
const product=express.Router();
const {product_model,female_model,male_model,cart_model}=require("../models/products_model");
//get product for all user 
product.get("/",async (req,res)=>{
    let data = await product_model.find({});

    res.json(data);
})
// post product for admin
product.post("/add",async (req,res)=>{
    if (req.body.user_id!=undefined){
        console.log(req.body);
        if (req.body.category=="female"){
            let payload = req.body;
            delete payload.user_id;
            try {
                await female_model.insertMany([payload]);
                await product_model.insertMany([payload]);
                res.json("product uploaded")
            } catch (error) {
               res.json("Error uploading product") 
            }
        }
        else if (req.body.category=="male"){
            let payload = req.body;
            delete payload.user_id;
            try {
                await male_model.insertMany([payload]);
                await product_model.insertMany([payload]);
                res.json("product uploaded")
            } catch (error) {
               res.json("Error uploading product") 
            }
        }
    }
    else {
        res.json("You are not authorised")
    }
   
     
})


product.patch("/",async (req,res)=>{
    let payload = req.body;
    try {
        await product_model.updateOne({title:payload.title},{$set:payload}) ;
        res.json("Product Updated");
    } catch (error) {
       res.json("Error Updating");
    }
    
    
})
//  post for user to add to cart
product.post("/cart",async (req,res)=>{
    let pay = req.body;
    try {
        await cart_model.insertMany([pay]);
        res.json("Thanks for purchasing from us ");
    } catch (error) {
        res.json("Adding Product To Cart Failed")
    }
    
})

product.post("/get_cart_items",async (req,res)=>{
    let user_id= req.body.user_id;
    let data = await cart_model.find({user_id:user_id});
    res.json(data);
})


product.delete("/delete",async (req,res)=>{
    let payload = req.body;
    try {
        await cart_model.deleteOne(payload);
        res.json("product removed");
    } catch (error) {
    res.json("Error Removing Product");    
    }
})

//delete section for admin
product.delete("/",async (req,res)=>{
    await male_model.deleteMany({});
    res.json("Data Deleted ") 
})



module.exports={product};