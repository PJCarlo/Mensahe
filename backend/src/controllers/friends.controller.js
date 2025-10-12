import Friends from '../models/friends.model.js';
import User from '../models/user.model.js';

// Send a friend request
export const sendFriendRequest = async (req, res) => {
  try {
    const { mobile } = req.body;
    const userId = req.user._id;

    // find target user mobile number
    const receiver = await User.findOne({ mobile });

    let senderFriends = await Friends.findOne({ mobile: req.user.mobile });
    let receiverFriends = await Friends.findOne({ mobile: mobile });
    
    /* this logic shows that you can's send a friend request to your self */
    if (req.user.mobile === mobile) {
        return res.status(400).json({ message: 'Cannot send friend request to yourself' });
    }

    /* this logic check if the user register to the app or if that mobile number exist and register in app */
    if (!receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    /* this logic shows that as long as the user is not adding a friends there will be no created row yet for friend request
       but if you already add friend it return a row, a list of user request for the other user or the receiver to accept */
    if (!senderFriends) {
      senderFriends = new Friends({ name: req.user.name, mobile: req.user.mobile });
      await senderFriends.save();
    }

    if (!receiverFriends) {
      receiverFriends = new Friends({ name: receiver.name, mobile: receiver.mobile });
      await receiverFriends.save();
    }

    if (senderFriends.friends.includes(receiver._id)) {
      return res.status(400).json({ message: 'friends' });
    }

    if (receiverFriends.friendRequests.includes(userId)) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    receiverFriends.friendRequests.push(userId);
    await receiverFriends.save();
    res.status(200).json({ message: 'Friend request sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Accept a friend request
export const acceptFriendRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;
    const userId = req.user._id;

    let userFriends = await Friends.findOne({ mobile: req.user.mobile });
    let requesterFriends = await Friends.findOne({ mobile: requester.mobile });

    if (!userFriends) {
      userFriends = new Friends({ name: req.user.name, mobile: req.user.mobile });
      await userFriends.save();
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// cancel friend request
export const declineFriendRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;
    const userId = req.user._id;
    const requester = await User.findById(requesterId);
    if (!requester) {
      return res.status(404).json({ message: 'Requester not found' });
    }
    if (requester._id.equals(userId)) {
        return res.status(400).json({ message: 'Cannot decline friend request from yourself' });
    }
    const userFriends = await Friends.findOne({ mobile: req.user.mobile });
    if (!userFriends || !userFriends.friendRequests.includes(requesterId)) {
      return res.status(400).json({ message: 'No friend request from this user' });
    }
    userFriends.friendRequests = userFriends.friendRequests.filter(
      (id) => !id.equals(requesterId)
    );
    await userFriends.save();
    res.status(200).json({ message: 'Friend request declined' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get friends and friend requests
export const getFriendsAndRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const userFriends = await Friends.findOne({ mobile: req.user.mobile })
      .populate('friends', 'name mobile')
      .populate('friendRequests', 'name mobile');
    if (!userFriends) {
      return res.status(200).json({ friends: [], friendRequests: [] });
    }
    res.status(200).json({ friends: userFriends.friends, friendRequests: userFriends.friendRequests });
    } catch (err) { 
    res.status(500).json({ error: err.message });
  }
};

// Remove a friend
export const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user._id;
    const friend = await User.findById(friendId);

    if (!friend) {
      return res.status(404).json({ message: 'Friend not found' });
    }
    if (friend._id.equals(userId)) {
        return res.status(400).json({ message: 'Cannot remove yourself from friends' });
    }
    const userFriends = await Friends.findOne({ mobile: req.user.mobile });
    const friendFriends = await Friends.findOne({ mobile: friend.mobile });
    if (!userFriends || !userFriends.friends.includes(friendId)) {
        return res.status(400).json({ message: 'Not friends' });
    }
    userFriends.friends = userFriends.friends.filter(
      (id) => !id.equals(friendId)
    );
    friendFriends.friends = friendFriends.friends.filter(
      (id) => !id.equals(userId)
    );
    await userFriends.save();
    await friendFriends.save();
    res.status(200).json({ message: 'Friend removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
