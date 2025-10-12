import Location from "../models/location.model.js";

// Start or update sharing
export const shareLocation = async (req, res) => {
  try {
    const { latitude, longitude, address } = req.body;
    const userId = req.user._id; 

    const location = await Location.findOneAndUpdate(
      { userId },
      { coordinates: { latitude, longitude }, address, isSharing: true },
      { new: true, upsert: true } 
    );

    res.status(200).json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Stop sharing
export const stopSharing = async (req, res) => {
  try {
    const userId = req.user._id;

    const location = await Location.findOneAndUpdate(
      { userId },
      { isSharing: false },
      { new: true }
    );

    res.status(200).json({ message: "Location sharing stopped", location });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user location
export const getUserLocation = async (req, res) => {
  try {
    const { userId } = req.params;

    const location = await Location.findOne({ userId, isSharing: true });

    if (!location) {
      return res.status(404).json({ message: "User is not sharing location" });
    }

    res.status(200).json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
