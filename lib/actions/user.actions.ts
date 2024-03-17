"use server"

import { revalidatePath } from "next/cache";
import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose"
import { handleError } from "../utils";

// create user
export async function createUser(user: CreateUserParams) {
    try {
        await connectToDatabase();

        const newUser = await User.create(user);
        console.log("Success")

        return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
        handleError(error);
    }
}

// get user
export async function getUserById(userId: string) {
    try {
        await connectToDatabase();

        const user = await User.findOne({clerkId: userId});

        if(!user) throw new Error("User does not exist");

        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        handleError(error);
    }
}

// update user
export async function updateUser(clerkId: string, user: UpdateUserParams) {
    try {
        await connectToDatabase();

        const updatedUser = await User.findOneAndUpdate({clerkId}, user, {
            new: true,
        });

        if(!updatedUser) throw new Error("User updation failed");
        console.log("updated");

        return JSON.parse(JSON.stringify(updatedUser));
    } catch (error) {
        console.log("hello");
        handleError(error);
    }
}

// delete user
export async function deleteUser(clerkId: string) {
    try {
        await connectToDatabase();

        // find user
        const userToDelete = await User.findOne({clerkId});

        if(!userToDelete) throw new Error("User does ot exist");

        // delete user
        const deletedUser = await User.findByIdAndDelete(userToDelete._id);
        revalidatePath('/');

        return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
    } catch (error) {
        handleError(error);
    }
}

// use Credits
export async function updateCredits(userId: string, creditFee: number) {
    try {    
        await connectToDatabase();

        const updateUserCredits = await User.findOneAndUpdate(
            {_id: userId},
            {$inc: {creditBalance: creditFee}},
            {new: true}
        )

        if(!updateUserCredits) throw new Error("User credit updation failed");

        return JSON.parse(JSON.stringify(updateUserCredits)); 
    } catch (error) {
        handleError(error);
    }
}