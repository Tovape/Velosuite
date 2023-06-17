import { Schema, model } from "mongoose";

const generalSchema = new Schema({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		default: "admin",
		required: true
	},
	theme: {
		type: String,
		default: "default",
		required: true
	},
	setup: {
        type: Boolean,
        default: false
    }
}, {
	collection: "general",
	timestamps: true,
	versionKey: false
})

export default model('General', generalSchema);