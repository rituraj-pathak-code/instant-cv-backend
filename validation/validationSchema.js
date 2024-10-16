import Joi from "joi";

export const authSchema = Joi.object({
    username: Joi.string().min(5).required(),
    password: Joi.string().min(5).required()
})