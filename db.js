const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const ObjectId = mongoose.ObjectId;

mongoose.connect("mongodb+srv://shivanandasai38:3dYtmy9Vx3dlObQf@mongo-class.vr2ag.mongodb.net/course-selling-backend")

const userSchema = new Schema({
    userId: ObjectId,
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String
})

const courseSchema = new Schema({
    courseId: ObjectId,
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    creatorId: ObjectId
})

const adminSchema = new Schema({
    userId: ObjectId,
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String
})

const purchaseSchema = new Schema({
    purchaseId: ObjectId,
    courseId: ObjectId,
    userId: ObjectId
})

const userModel = model('users', userSchema)
const courseModel = model('courses', courseSchema)
const adminModel = model('admin', adminSchema)
const purchaseModel = model('purchases', purchaseSchema)

module.exports = {
    userModel,
    courseModel,
    adminModel,
    purchaseModel
}