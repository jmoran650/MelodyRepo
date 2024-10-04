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
    const { id: receiverId } = req.params; // ID of the user to send friend request to
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
      return res
        .status(400)
        .json({
          message: "Friend request already exists or you are already friends",
        });
    }

    const friendRequest = new Friend();
    friendRequest.requesterId = requesterId;
    friendRequest.receiverId = receiverId;
    friendRequest.status = statusType.PENDING;

    await friendRepository.save(friendRequest);

    return res.status(200).json({ message: "Friend request sent" });
  }

  static async acceptFriend(req: AuthenticatedRequest, res: Response) {
    const { id: requesterId } = req.params; // ID of the user who sent the friend request
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
  }

  static async denyFriend(req: AuthenticatedRequest, res: Response) {
    const { id: requesterId } = req.params; // ID of the user who sent the friend request
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
  }

  static async getFriends(req: AuthenticatedRequest, res: Response) {
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
    const friendIds = friends.map((friend) => {
      return friend.requesterId === userId
        ? friend.receiverId
        : friend.requesterId;
    });

    // Fetch user details of friends
    const userRepository = MelodyDataSource.getRepository(User);
    const friendUsers = await userRepository.findByIds(friendIds);

    return res.status(200).json({ data: friendUsers });
  }

  static async getFriendRequests(req: AuthenticatedRequest, res: Response) {
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
    const friendRequests = requesterUsers.map((user) => {
      const request = requests.find((r) => r.requesterId === user.id);
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        friendRequestId: request?.requesterId, // You might need this ID for accept/deny actions
      };
    });

    return res.status(200).json({ data: friendRequests });
  }
}
