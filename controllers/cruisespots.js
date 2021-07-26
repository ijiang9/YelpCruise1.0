const Cruisespot = require('../models/cruisespot');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const cruisespots = await Cruisespot.find({});
    res.render('cruisespots/index', { cruisespots });
};

module.exports.renderNewForm = (req, res) => {
    res.render('cruisespots/new');
};

module.exports.createCruisespot = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.cruisespot.location,
        limit:1
    }).send()
    const cruisespot = new Cruisespot(req.body.cruisespot);
    cruisespot.geometry = geoData.body.features[0].geometry;
    cruisespot.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    cruisespot.author = req.user._id;
    await cruisespot.save();
    req.flash('success', 'Successfully made a new cruise spot!');
    res.redirect(`/cruisespots/${cruisespot._id}`);
};

module.exports.showCruisespot = async (req, res) => {
    const cruisespot = await Cruisespot.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!cruisespot) {
        req.flash('error', 'Cannot find that cruise spot!');
        return res.redirect('/cruisespots');
    }
    res.render('cruisespots/show', { cruisespot });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const cruisespot = await Cruisespot.findById(id);
    if (!cruisespot) {
        req.flash('error', 'Cannot find that cruise spot!');
        return res.redirect('/cruisespots');
    }

    res.render('cruisespots/edit', { cruisespot });
};

module.exports.updateCruisespot = async (req, res) => {
    const { id } = req.params;
    const cruisespot = await Cruisespot.findByIdAndUpdate(id, { ...req.body.cruisespot });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    cruisespot.images.push(...imgs);

    await cruisespot.save();
    if (req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await cruisespot.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    
    req.flash('success', 'Successfully updated!');
    res.redirect(`/cruisespots/${cruisespot._id}`);
};

module.exports.deleteCruisespot = async (req, res) => {
    const { id } = req.params;
    await Cruisespot.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted!');
    res.redirect('/cruisespots');
};