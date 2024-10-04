import express from 'express';
import { UserController } from '../controller/User.controller'; // Adjust path as needed
import { AuthController } from '../controller/Auth.controller'; // Adjust path as needed
import { PostController } from '../controller/Post.controller';
import { ProfileController } from '../controller/Profile.controller'; // Adjust path as needed
import { FriendController } from '../controller/Friend.controller'; // Adjust path as needed

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

// Friend request routes
router.post('/friend/request/:id', FriendController.requestFriend);
router.post('/friend/accept/:id', FriendController.acceptFriend);
router.post('/friend/deny/:id', FriendController.denyFriend);
router.get('/friends', FriendController.getFriends);
router.get('/friend/requests',  FriendController.getFriendRequests);


// Route to validate token
router.get('/validateToken', AuthController.validateToken);

// Route to make a post
router.post('/makePost/:id', PostController.makePost);

// Route to get all posts
router.get('/posts', PostController.getPosts);

// Get own profile
router.get("/profile", ProfileController.getOwnProfile);

// Get other ppl profile
router.get("/profile/:id", ProfileController.getOtherProfile);

router.get('/posts/user/:userId', PostController.getPostsByUser);

export default router;