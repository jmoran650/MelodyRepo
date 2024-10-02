import express from 'express';
import { UserController } from '../controller/User.controller'; // Adjust path as needed
import { AuthController } from '../controller/Auth.controller'; // Adjust path as needed
import { PostController } from '../controller/Post.controller';

const router = express.Router();


// Route to sign up a new user
router.post('/signup', UserController.signup);

// Route to get all users
router.get('/users', UserController.getUsers);

// Route to update a user by ID
router.put('/users/:id', UserController.updateUser);

// Route to delete a user by ID
router.delete('/users/:id', UserController.deleteUser);

// Route to login
router.post('/login', AuthController.login);

// Route to get user profile
router.get('/profile', AuthController.getOwnProfile);

// Route to validate token
router.get('/validateToken', AuthController.validateToken);

// Route to make a post
router.post('/makePost/:id', PostController.makePost);

// Route to get all posts
router.get('/posts', PostController.getPosts);


export default router;