import { Request, Response } from "express";
import { MelodyDataSource } from "../dataSource";
import { Friend } from "../entity/Friend";
import { User } from "../entity/User.entity";
import { statusType } from "../types/friendType";

interface AuthenticatedRequest extends Request {
  currentUser?: {
    id: string;
    role: string;
    name: string;
  };
}

export class FriendController {
  static async requestFriend(req: AuthenticatedRequest, res: Response) {
    try {
      const { id: receiverId } = req.params;
      const requesterId = req.currentUser?.id;

      if (!requesterId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (requesterId === receiverId) {
        return res
          .status(400)
          .json({ message: "Cannot send friend request to yourself" });
      }

      const friendRepository = MelodyDataSource.getRepository(Friend);

      // Check if a friend request or friendship already exists
      const existing = await friendRepository.findOne({
        where: [
          { requesterId, receiverId },
          { requesterId: receiverId, receiverId: requesterId },
        ],
      });

      if (existing) {
        return res.status(400).json({
          message: "Friend request already exists or you are already friends",
        });
      }

      // Create and save the friend request
      const friendRequest = friendRepository.create({
        requesterId,
        receiverId,
        status: statusType.PENDING,
      });

      await friendRepository.save(friendRequest);

      return res.status(201).json({ message: "Friend request sent" });
    } catch (error) {
      console.error("Error sending friend request:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async acceptFriend(req: AuthenticatedRequest, res: Response) {
    try {
      const { id: requesterId } = req.params;
      const receiverId = req.currentUser?.id;

      if (!receiverId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const friendRepository = MelodyDataSource.getRepository(Friend);

      const friendRequest = await friendRepository.findOne({
        where: { requesterId, receiverId, status: statusType.PENDING },
      });

      if (!friendRequest) {
        return res.status(404).json({ message: "Friend request not found" });
      }

      friendRequest.status = statusType.ACCEPTED;
      await friendRepository.save(friendRequest);

      return res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
      console.error("Error accepting friend request:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async denyFriend(req: AuthenticatedRequest, res: Response) {
    try {
      const { id: requesterId } = req.params;
      const receiverId = req.currentUser?.id;

      if (!receiverId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const friendRepository = MelodyDataSource.getRepository(Friend);

      const friendRequest = await friendRepository.findOne({
        where: { requesterId, receiverId, status: statusType.PENDING },
      });

      if (!friendRequest) {
        return res.status(404).json({ message: "Friend request not found" });
      }

      friendRequest.status = statusType.DENIED;
      await friendRepository.save(friendRequest);

      return res.status(200).json({ message: "Friend request denied" });
    } catch (error) {
      console.error("Error denying friend request:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getFriends(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.currentUser?.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const friendRepository = MelodyDataSource.getRepository(Friend);

      const friends = await friendRepository.find({
        where: [
          { requesterId: userId, status: statusType.ACCEPTED },
          { receiverId: userId, status: statusType.ACCEPTED },
        ],
      });

      // Collect friend IDs (excluding the current user's ID)
      const friendIds = friends.map((friend) =>
        friend.requesterId === userId ? friend.receiverId : friend.requesterId
      );

      // Fetch user details of friends
      const userRepository = MelodyDataSource.getRepository(User);
      const friendUsers = await userRepository.findByIds(friendIds);

      return res.status(200).json({ data: friendUsers });
    } catch (error) {
      console.error("Error fetching friends:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getFriendRequests(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.currentUser?.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const friendRepository = MelodyDataSource.getRepository(Friend);

      const requests = await friendRepository.find({
        where: { receiverId: userId, status: statusType.PENDING },
      });

      // Get the IDs of the users who sent the friend requests
      const requesterIds = requests.map((request) => request.requesterId);

      // Fetch user details of requesters
      const userRepository = MelodyDataSource.getRepository(User);
      const requesterUsers = await userRepository.findByIds(requesterIds);

      // Map the requester user data to include the friend request ID
      const friendRequests = requesterUsers.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        friendRequestId: user.id, // This is the requester's ID
      }));

      return res.status(200).json({ data: friendRequests });
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}