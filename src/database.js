import mongoose from "mongoose";

mongoose.connect("mongodb://localhost/Velosuite", {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(db => console.log('\t' +  '\x1b[32m', 'MongoDB Connected' + '\x1b[0m' + '\n\n'))
.catch(error => console.log(error))