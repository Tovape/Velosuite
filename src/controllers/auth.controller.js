import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
	const { username, email, password, roles } = req.body;

	const newUser = new User({
		username,
		email,
		password: await User.encryptPassword(password)
	})
	
	newUser.saved = [{}]
	newUser.upvoted = [{}]
	newUser.downvoted = [{}]
	
	if (roles) {
		const foundRoles = await Role.find({name: {$in: roles}})
		newUser.roles = foundRoles.map(role => role._id)
	} else {
		const role = await Role.find({name: "user"})
		newUser.roles = [role._id]
	}
	
	const savedUser = await newUser.save()
	console.log(newUser)
	
	const token = jwt.sign({id: savedUser._id}, "user-api-signed", {
		expiresIn: 84600
	})
	
	res.status(200).json({token: token, message: "User Created", "userId": savedUser._id})
}