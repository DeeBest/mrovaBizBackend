const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyJWT');

const {
  getAllBusinesses,
  addBusiness,
  deleteBusiness,
  getSingleBusiness,
  updateBusiness,
} = require('../controllers/businessController');

router.get('/', getAllBusinesses);
router.get('/:id', verifyToken, getSingleBusiness);
router.post('/add-business', verifyToken, addBusiness);
router.delete('/delete-business/:id', verifyToken, deleteBusiness);
router.put('/update-business/:id', verifyToken, updateBusiness);

module.exports = router;
