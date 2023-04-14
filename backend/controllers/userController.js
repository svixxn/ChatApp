const express = require("express")
const asyncHandler = require("express-async-handler")
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");



exports.registerUser = asyncHandler(async (req, res) => {
    const {name, email, password, pic} = req.body

    if(!name || !email || !password){
        res.status(400)
        throw new Error("Please Enter all Fields")
    }

    const userExists = await User.findOne({email})

    if(userExists){
        res.status(400)
        throw new Error("User already exists")
    }

    const user = await User.create({
        name, email, password, pic
    })

    if(user){
        user.token = generateToken(user._id)
        res.status(201).json({
            status: 'success',
            user,
            token: user.token
        })
    } else {
        res.status(400)
        throw new Error("Failed to create a user")
    }
})

exports.authUser = asyncHandler(async (req,res) => {
    const {email, password} = req.body

    const user = await User.findOne({email}).select('+password')

    if(user && user.correctPassword(password, user.password)) {
        user.token = generateToken(user._id)
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        });
    }else {
        res.status(400)
        throw new Error("Invalid Email or Password")
    }
})

exports.allUsers = asyncHandler(async (req,res)=> {
    const keyword = req.query.search? {
        $or:[
            {name: {$regex: req.query.search, $options:"i"}},
            {email: {$regex: req.query.search, $options:"i"}}
        ]
    }: {};

    const users = await User.find(keyword).find({_id:{$ne:req.user._id}})
    res.send(users)
})
