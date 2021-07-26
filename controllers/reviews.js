const Cruisespot = require('../models/cruisespot');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const cruisespot = await Cruisespot.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    cruisespot.reviews.push(review);
    await review.save();
    await cruisespot.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/cruisespots/${cruisespot._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const {id, reviewId } = req.params;
    await Cruisespot.findByIdAndUpdate(id, {$pull:{reviews: reviewId}})
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/cruisespots/${id}`);
}