const router = require('express').Router();
const models = require('../../db/models');
const { Op, fn, col, literal } = require('sequelize');
// const { Review, Spot, User } = require('../../db/models');
const { Review, Spot, User } = models;

// Get all spots
router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll({
        attributes: {
            include: [
                [
                    literal(`(
                        SELECT AVG(stars)
                        FROM Reviews AS Review
                        WHERE
                            Review.spotId = Spot.id
                    )`),
                    'avgRating',
                ],
                [
                    literal(`(
                        SELECT (url)
                        FROM SpotImages AS SpotImage
                        WHERE
                            SpotImage.spotId = Spot.id
                            AND
                            SpotImage.preview = true
                    )`),
                    'previewImage',
                ]
            ]
        }
    });
    const allSpots = [];
    for (const spot of spots) {
        const spotJson = spot.toJSON();
        spotJson.avgRating = spotJson.avgRating || 0;
        allSpots.push(spotJson);
    }
    res.status(200).json({
        Spots: allSpots
    });
});

// Get all Spots owned by the current user
// '/api/spots/current'
router.get('/current', async (req, res, next) => {
    // const user = getCurrentUserWithAuth();
    const spots = await Spot.findAll({
        where: {
            ownerId: req.user.id
        }
    });
    res.status(200).json(spots);
});

// Get details of a Spot from an id
// '/api/spots/1'
router.get('/:spotId', async (req, res, next) => {
    // Make sure id param is a valid number
    const id = Number(req.params.spotId);
    if (!Number.isInteger(id)) {
        return res.json({
            message: 'Spot couldn\'t be found'
        });
    }
    const spot = await Spot.findOne({
        where: { id },
        // attributes: {
        //     include: [
        //         [fn('COUNT', col('Reviews.stars')), 'numReviews'],
        //         [fn('AVG', col('Reviews.stars')), 'avgStarRating']
        //     ]
        // },
        // Need to use sub-query calls in raw SQL to get an accurate count
        attributes: {
            include: [
                [
                    literal(`(
                        SELECT COUNT(id)
                        FROM Reviews AS Review
                        WHERE Review.spotId = Spot.id
                    )`),
                    'numReviews',
                ],
                [
                    literal(`(
                        SELECT AVG(stars)
                        FROM Reviews AS Review
                        WHERE Review.spotId = Spot.id
                    )`),
                    'avgStarRating',
                ],
            ]
        },
        include: [
            {
                model: models.Review,
                attributes: [],
                required: false,
            },
            {
                model: models.SpotImage,
                attributes: ['id', 'url', 'preview'],
                required: false,
            },
            {
                model: models.User,
                as: 'Owner',
                attributes: ['id', 'firstName', 'lastName'],
                required: false
            },
        ]
    });
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        });
    }
    const spotJson = spot.toJSON();
    spotJson.avgStarRating = spotJson.avgStarRating || 0;
    res.status(200).json(spotJson);
});


// Create a spot
// /api/spots
router.post('/', async (req, res, next) => {
    if (req.user) {
        const spot = await Spot.create({
            ownerId: req.user.id,
            ...req.body
        });
        // handle validation errors
        if (!spot) {
            return res.status(400).json({
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
        res.status(201).json(spot);
    }
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
    for (const [k, v] of Object.entries({ 
        address, city, state,
        country, lat, lng,
        name, description, price
    })) {
        if (v) {
            reviewInstance[k] = v;
        }
    }
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