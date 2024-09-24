const router = require('express').Router();
const { Spot, User } = require('../../db/models');

router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll();
    // Need to add aggregate avgRating after reviews is added in
    res.status(200).json({
        Spots: spots
    });
});

// '/api/spots/current'
router.get('/current', async (req, res, next) => {
    // const user = getCurrentUserWithAuth();
    const spots = await Spot.findAll({
        where: {
            // ownerId: user.id;
        }
    });
});

// '/api/spots/1'
router.get('/:id', async (req, res, next) => {
    // Make sure id param is a valid number
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
        return res.json({
            message: 'Spot couldn\'t be found'
        });
    }
    const spot = await Spot.findOne({
        where: {
            id
        },
        include: {
            model: User,
            as: 'Owner',
            attributes: ['id', 'firstName', 'lastName']
        }
    });
    if (spot) {
        res.status(200).json(spot);
    } else {
        return res.status(404).json({
            message: 'Spot couldn\'t be found'
        });
    }
});


// create a spot
// /api/spots
router.post('/', async (req, res, next) => {
    const spot = await Spot.create(req.params);
    // handle validation errors
    /*
    if (//some code//) {
        res.status(400).json({
            message: 'Bad Request',
            errors: {
                address: 'Street address is required',
                city: 'City is required',
                state: 'State is required',
                country: 'Country is required',
                lat: 'Latitude must be within -90 and 90'
                lng: 'Longitude must be within -180 and 180',
                name: 'Name must be less than 50 characters',
                description: 'Description is required',
                price: 'Price per day must be a positive number'
            }
        });
    }
    */
    res.status(201).json(spot);
});

// add an image to a spot based on the spot's id
// /api/spots/:spotId/images

// edit a spot
// /api/spots/:spotId
router.put('/:spotId', async (req, res, next) => {
    const {
        address, city, state,
        country, lat, lng,
        name, description, price
    } = req.body;
    const spotInstance = await Spot.findByPk(req.params.spotId);
    if (!spotInstance) res.status(404).json({ message: `Spot couldn't be found` });
    /*
    second guessed myself too much
    
    this section should add params to instance
    */
    try {
        await spotInstance.save();
    } catch (e) {
        res.status(400).json({
            message: 'Bad Request',
            errors: {
                address: 'Street address is required',
                city: 'City is required',
                state: 'State is required',
                country: 'Country is required',
                lat: 'Latitude must be within -90 and 90',
                lng: 'Longitude must be within -180 and 180',
                name: 'Name must be less than 50 characters',
                description: 'Description is required',
                price: 'Price per day must be a positive number'
            }
        });
    }
    res.status(200).json(spotInstance);
});

// delete a spot
// /api/spots/:spotId
router.delete('/spotId', async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) res.status(404).json({ message: `Spot couldn't be found` });
    await spot.destroy();
    res.status(200).json({ message: `Successfully deleted` });
});

module.exports = router;