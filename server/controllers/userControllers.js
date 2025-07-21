import User from '../models/User.js';

export const getExample = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const newUser = new User({
      name,
      email,
      password
    });

    const user = await newUser.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};