const express = require('express');
const router = express.Router();
const cruisespots = require('../controllers/cruisespots')
const catchAsync = require('../utils/catchAsync');

const Cruisespot = require('../models/cruisespot');

const {isLoggedIn, isAuthor, validateCruisespot} = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage });


router.route('/')
    .get(catchAsync(cruisespots.index))
    .post(isLoggedIn, upload.array('image'), validateCruisespot, catchAsync(cruisespots.createCruisespot));

router.get('/new', isLoggedIn, cruisespots.renderNewForm);

router.route('/:id')
    .get(catchAsync(cruisespots.showCruisespot))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCruisespot, catchAsync(cruisespots.updateCruisespot))
    .delete(isLoggedIn, isAuthor, catchAsync(cruisespots.deleteCruisespot));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(cruisespots.renderEditForm));

module.exports = router;