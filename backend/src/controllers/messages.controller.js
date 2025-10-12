import User from "../models/user.model.js";
import Message from "../models/messages.model.js";
import cloudinary from "../lib/cloudinary.js";

/* GET USERS */
export const getUserInSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUser = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );
    res.status(200).json(filteredUser);
  } catch (error) {
    console.error("Error in getUserInSidebar: ", error.message);
    res.status(400).json({ error: "Internal server error" });
  }
};

/* GET MESSAGES */
export const getMessages = async (req, res) => {
  try {
    const { id: userToUserChatId } = req.params;
    const accountUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: accountUserId, receiverId: userToUserChatId },
        { senderId: userToUserChatId, receiverId: accountUserId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages: ", error.message);
    res.status(400).json({ error: "Internal server error" });
  }
};

/* SEND MESSAGE */
export const sendMessage = async (req, res) => {
  try {
    const { text, image, file } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl, fileUrl, fileSize;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "chat_images",
      });
      imageUrl = uploadResponse.secure_url;
    }

    if (file) {
      const uploadResponse = await cloudinary.uploader.upload(file, {
        folder: "chat_files",
        resource_type: "raw",
      });
      fileUrl = uploadResponse.secure_url;
      fileSize = uploadResponse.bytes;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      file: fileUrl,
      size: fileSize,
      status: "sent",
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* UPDATE MESSAGE STATUS */
export const messageStatus = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { status } = req.body;

    if (!["sent", "delivered", "read", "failed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updateData = { status };

    if (status === "delivered") updateData.deliveredAt = new Date();
    if (status === "read") updateData.readAt = new Date();
    if (status === "failed") updateData.failedAt = new Date();

    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      updateData,
      { new: true }
    );

    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error("Error in messageStatus:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* DELETE / UNSEND MESSAGE */
export const deletedMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const { type } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ error: "Message not found" });

    if (type === "everyone") {
      // Only sender can unsend
      if (message.senderId.toString() !== userId.toString()) {
        return res.status(403).json({ error: "Not allowed" });
      }

      message.isDeletedForEveryone = true;
      message.text = null;
      message.image = null;
      message.file = null;
      message.unsentAt = new Date();

    } else if (type === "self") {
      // Hide only for this user
      if (!message.deletedBy.includes(userId)) {
        message.deletedBy.push(userId);
      }

    }

    await message.save();

    res.status(200).json({ success: true, message });
    
  } catch (error) {
    console.error("Error in deletedMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
