const mongoCollections = require("../config/mongoCollections");
const users= mongoCollections.users;

module.exports = {

    async createUser(firstname,lastname, email, password, dataofbirth, gender) {
        if (!email) throw "You must provide a email address for your account";

        if (password.length === 0) throw "password cannot be empty";
        const userCollection = await users();

        let newUser = {
            firstname:firstname,
            lastname: lastname,
            email: email,
            password: password,
            dataofbirth: dataofbirth,
            gender: gender
        };

        const createdUserInfo = await userCollection.insertOne(newUser);
        if (createdUserInfo.insertedCount === 0) throw "Could not add user";

        return createdUserInfo;
    },

    async getAllUser() {
        const userCollection = await users();
        const allUsers= await userCollection.find({}).toArray();
        return allUsers;
    },

    async getUser(email) {
                
        if (!email) throw "You must provide an email to search for";

        const userCollection = await users();
        const user = await userCollection.findOne({ email: email });
        //if (user === null) throw "No user with that email";

        return user;
    },

    //modify or update task in database
    async UpdateUser(email) {
        if (!email) throw "You must provide an id to search for";
        
        //used for keeping the unchanged information
        const specificUser = await this.getUser(email);
                    
        const userCollection = await users();
        const updatedUser= {
            email: specificUser.email,
            password: specificUser.password,
        };
        
        //update the database
        const updatedInfo = await userCollection.replaceOne({ email: email }, updatedUser);

        if (updatedInfo.modifiedCount === 0) {
          
          throw "could not update user successfully";
        }

        return await this.getUser(email);
    },

    async removeUser(email) {

        if (!email) throw "You must provide an email to search for";

        const userCollection = await users();
        const deletedTaskInfo = await userCollection.removeOne({ email: email });

        if (deletedTaskInfo.deletedCount === 0) {
            throw `Could not remove user with email of ${email}`;
        }
        0;
    },

    // async verifyPassword(password, hashedPassword) {
    //     return bcrypt.compareSync(password, hashedPassword)
    // }

}