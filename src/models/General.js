import { Schema, model } from "mongoose";

const generalSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	}
}, {
	collection: "general",
	timestamps: true,
	versionKey: false
})

export default model('General', generalSchema);