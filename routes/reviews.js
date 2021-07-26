const express = require('express');
const router = express.Router({ mergeParams: true });
const {validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const Cruisespot = require('../models/cruisespot');
const Review = require('../models/review');
const reviews = require('../controllers/reviews')

const ExpressError = require('../utils/ExpressError');

const { reviewSchema } = require('../schemas.js');



router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;