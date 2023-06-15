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
	defaultpage: {
		type: Number,
		default: 0,
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