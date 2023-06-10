import { Schema, model } from "mongoose";

const noteSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	}
}, {
	collection: "notes",
	timestamps: true,
	versionKey: false
})

export default model('Note', noteSchema);