const Business = require('../models/businessModel');

const getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find();

    if (!businesses)
      return res.status(204).json({ message: 'No businesses found' });

    res.status(200).json({ businesses });
  } catch (err) {
    console.log(err);
  }
};

const getSingleBusiness = async (req, res) => {
  const id = req.params.id;

  if (!id) return res.status(400).json({ message: 'ID is required' });

  try {
    const business = await Business.findOne({ _id: id });

    if (!business)
      return res
        .status(400)
        .json({ message: `No business was found with ${id} ID.` });

    res.status(200).json({ business });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

const addBusiness = async (req, res) => {
  const {
    businessName,
    category,
    phoneNumber,
    email,
    location,
    openingTime,
    closingTime,
    imageUrl,
    businessDescription,
  } = req.body;

  if (
    !businessName ||
    !category ||
    !phoneNumber ||
    !email ||
    !location ||
    !openingTime ||
    !closingTime ||
    !imageUrl ||
    !businessDescription
  ) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const duplicate = await Business.findOne({
      businessName: req.businessName,
    }).exec();

    if (duplicate)
      return res
        .status(409)
        .json({ message: 'A business with that name already exists.' });

    const business = await Business.create({
      businessName,
      category,
      phoneNumber,
      email,
      location,
      openingTime,
      closingTime,
      imageUrl,
      businessDescription,
    });

    res.status(201).json({ business });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const deleteBusiness = async (req, res) => {
  const id = req.params.id;

  if (!id) return res.status(400).json({ message: 'ID required' });

  try {
    const business = await Business.findOne({ _id: id });

    if (!business)
      return res
        .status(400)
        .json({ message: `No business found with the ${id} ID.` });
    await Business.deleteOne(business);

    res.status(204).json({
      message: `Successfully deleted ${business.businessName} business.`,
    });
  } catch (err) {
    console.log(err);
  }
};

const updateBusiness = async (req, res) => {
  const id = req.params.id;

  if (!id) return res.status(400).json({ message: 'ID is required' });

  try {
    const business = await Business.findOne({ _id: id });

    if (!business)
      return res.status(400).json({ message: `No business with ${id} ID.` });

    if (req?.body?.businessName) business.businessName = req.body.businessName;
    if (req?.body?.category) business.category = req.body.category;
    if (req?.body?.phoneNumber) business.phoneNumber = req.body.phoneNumber;
    if (req?.body?.email) business.email = req.body.email;
    if (req?.body?.location) business.location = req.body.location;
    if (req?.body?.openingTime) business.openingTime = req.body.openingTime;
    if (req?.body?.closingTime) business.closingTime = req.body.closingTime;
    if (req?.body?.imageUrl) business.imageUrl = req.body.imageUrl;
    if (req?.body?.businessDescription)
      business.businessDescription = req.body.businessDescription;

    await business.save();

    res.status(200).json({ business });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  getAllBusinesses,
  addBusiness,
  deleteBusiness,
  getSingleBusiness,
  updateBusiness,
};
