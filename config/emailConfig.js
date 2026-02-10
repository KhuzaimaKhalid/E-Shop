require('dotenv').config()

const mongoose = require('mongoose')


const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    //host: process.env.EMAIL_HOST,
    //port: process.env.PORT,
    secure: false,
    service: "gmail",
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

// FOR DEBUGGING

// console.log('EMAIL_USER:', process.env.EMAIL_USER ? '(set)' : '(MISSING)')
// console.log('EMAIL_PASS len:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : '(MISSING)')

// transporter.verify()
//   .then(() => console.log('✅ Mail transporter ready'))
//   .catch(err => console.log('❌ Transporter verify error:', err.message))

  
module.exports = transporter