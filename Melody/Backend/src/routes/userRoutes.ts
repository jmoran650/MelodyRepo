import express from 'express';
import { UserController } from '../controller/User.controller'; // Adjust path as needed
import { AuthController } from '../controller/Auth.controller'; // Adjust path as needed
import { PostController } from '../controller/Post.controller';
import { ProfileController } from '../controller/Profile.controller'; // Adjust path as needed
import { FriendController } from '../controller/Friend.controller'; // Adjust path as needed
import { authenticate, authorization } from '../middlewares/auth.middleware'; // Adjust the path as needed
import { Admin } from 'typeorm';

const router = express.Router();


// Route to sign up a new user
router.post('/signup', UserController.signup);

// Route to get all users
router.get('/users', authenticate, UserController.getUsers);

// Route to update a user by ID
router.put('/users/:id', authenticate, UserController.updateUser);

// Route to delete a user by ID
router.delete('/users/:id', authenticate, UserController.deleteUser);

// Route to login
router.post('/login', AuthController.login);

// Friend request routes
router.post('/friend/request/:id', authenticate, FriendController.requestFriend);
router.post('/friend/accept/:id', authenticate,  FriendController.acceptFriend);
router.post('/friend/deny/:id', authenticate, FriendController.denyFriend);
router.get('/friends', authenticate, FriendController.getFriends);
router.get('/friend/requests',  authenticate, FriendController.getFriendRequests);


// Route to validate token
router.get('/validateToken',authenticate, AuthController.validateToken);

// Route to make a post
router.post('/makePost/',authenticate, PostController.makePost);

// Route to get all posts
router.get('/posts', authenticate, PostController.getPosts);

// Get own profile
router.get("/profile", authenticate, ProfileController.getOwnProfile);

// Get other ppl profile
router.get("/profile/:id", authenticate, ProfileController.getOtherProfile);

router.get('/posts/user/:userId', authenticate, PostController.getPostsByUser);

//user Search
router.get('/search/users', authenticate, UserController.searchUsers);

export default router;