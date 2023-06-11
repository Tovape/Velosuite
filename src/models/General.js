import { Schema, model } from "mongoose";

const generalSchema = new Schema({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	theme: {
		type: Number,
		default: 0,
		required: true
	},
	defaultpage: {
		type: Number,
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