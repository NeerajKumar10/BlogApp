const { Schema, model } = require('mongoose');
const { createHmac, randomBytes } = require("crypto");


const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        salt: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
        profileImageURL: {
            type: String,
            default: "/images/users.jpg",
        },
        role: {
            type: String,
            enum: ['USER', 'ADMIN'],
            default: 'USER',
        },
    },
    { timestamps: true }
);


userSchema.pre('save', function (next) {
    const user = this;

    
    if (!user.isModified("password")) return next();

  
    const salt = randomBytes(16).toString("hex");

    
    const hashPassword = createHmac('sha256', salt)
        .update(user.password) 
        .digest("hex");

    
    user.salt = salt;
    user.password = hashPassword;

    next();
});

userSchema.static("matchPassword", async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) return false; 

    
    const userProvidedHash = createHmac('sha256', user.salt)
        .update(password)
        .digest("hex");

    
    if (userProvidedHash !== user.password) return false; // Password mismatch

    
    return { ...user.toObject(), password: undefined, salt: undefined };
});



const User = model('user', userSchema);
module.exports = User;
