import User from "../models/User.js";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const errorFormatter = (e) => {
    let errors = {};
  
    // "User validation failed: email: Enter a valid email address!, phoneNumber: phoneNumber is not a valid!"
  
    const allErrors = e.substring(e.indexOf(":") + 1).trim();
    const allErrorsFormatted = allErrors.split(",").map((err) => err.trim());
    allErrorsFormatted.forEach((error) => {
      const [key, value] = error.split(":").map((err) => err.trim());
      errors[key] = value;
    });
    return errors;
  };
  


export const register = async (req, res, next) => {
    const users = await User.find({ email: req.body.email });
    if (users.length >= 1) {
        return res.status(409).json({
          message: "Account already exist for this Email",
        });
    }
    const { email, username, password,confirmPassword,phoneNumber} = req.body;
    if (password.length < 6) {
        res
          .status(400)
          .json({ errors: "Password should be atleast 6 characters long" });
      } 
      if (password !== confirmPassword){
        res
        .status(400)
        .json({ errors: "Passwords do not match" });
      }
    const hashedPassword = await bycrypt.hash(password, 10);
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email,
        username,
        password: hashedPassword,
        confirmPassword:hashedPassword,
        phoneNumber,
     
    });
    try {
        const newUser = await user.save();
        const admin = 'iamstillcath'
        const role = user.username === admin ? 'admin' : 'user';
        const token = jwt.sign({
            username: user.username,
            role: role
        } , process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        res.status(201).json({ message: "user created", token, role:decoded.username +" is now a "+ decoded.role });
    } catch (e) {
        res.status(500).json({
                 errors: errorFormatter(e.message),
             });
    }
};



export const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const validPassword = await bycrypt.compare(req.body.password, user.password);
            if (validPassword) {
                const bearer = jwt.sign({ email: user.email, role: user.role }, process.env.ACCESS_TOKEN_SECRET);
                res.status(200).json({message: "you are logged in" , bearer: bearer});
            } else {
                res.status(401).json({ message: "password doesn't match" });
            }
        } else {
            res.status(401).json({ message: "user doesn't exist" });
        }
    } catch (error) {
        res.status(500).json({
            errors: errorFormatter(e.message),
        });
    }
};

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        next(err);
    }
};