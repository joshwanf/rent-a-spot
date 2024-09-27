const router = require('express').Router();
const models = require('../../db/models');
const { Op, fn, col, literal, query } = require('sequelize');
const { formatBookingDates, hasNoBookingOverlap } = require('../../utils/booking-dates');
const { checkSchema } = require('express-validator');
const { restoreUser, requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const {
    isLoggedIn,
    prepareSubqStatement,
    allSpotsValidation,
    createSpotValidation,
    createReviewValidation
} = require('../../utils/endpoint-validation');


// Get all spots
router.get('/', allSpotsValidation, async (req, res, next) => {
    const page = req.query.page || 1;
    const size = req.query.size || 20;
    // Query parameters
    const { minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    const pagination = {};
    pagination.limit = size;
    pagination.offset = size * (page - 1);

    const where = {};
    if ( minLat || maxLat ) {
        where['lat'] = {};
        if (minLat) where['lat'][Op.gte] = minLat;
        if (maxLat) where['lat'][Op.lte] = maxLat;
    }
    if ( minLng || maxLng ) {
        where['lng'] = {};
        if (minLng) where['lng'][Op.gte] = minLng;
        if (maxLng) where['lng'][Op.lte] = maxLng;
    }
    if ( minPrice || maxPrice ) {
        where['price'] = {};
        if (minPrice) where['price'][Op.gte] = minPrice;
        if (maxPrice) where['price'][Op.lte] = maxPrice;
    }
    // Use prepared statements to handle SQLite vs PostgreSQL differences
    // const preparedSchema = process.env.NODE_ENV === 'production' ? process.env.SCHEMA + '"."' : '';
    // const subq = {
    //     avgRating: `( 
    //         SELECT AVG("stars") FROM "${preparedSchema}Reviews" AS "Review" 
    //         WHERE "Review"."spotId" = "Spot"."id" 
    //     )`,
    //     previewImage: `( 
    //         SELECT "url" FROM "${preparedSchema}SpotImages" AS "SpotImage" 
    //         WHERE 
    //             "SpotImage"."spotId" = "Spot"."id" 
    //             AND 
    //             "SpotImage"."preview" = true 
    //     )`,
    //     statement: function(subquery) { return this[subquery] }
    // };
    const subq = prepareSubqStatement();
    subq.avgRating = `( 
        SELECT AVG("stars") FROM "${subq.schema}Reviews" AS "Review" 
        WHERE "Review"."spotId" = "Spot"."id" 
    )`;
    subq.previewImage = `( 
        SELECT "url" FROM "${subq.schema}SpotImages" AS "SpotImage" 
        WHERE 
            "SpotImage"."spotId" = "Spot"."id" 
            AND 
            "SpotImage"."preview" = true 
    )`;
    // Get all spots
    const spots = await models.Spot.findAll({
        // attributes: {
        //     include: [
        //         [fn('AVG', col('Reviews.stars')), 'avgRating'],
        //         [fn('COUNT', col('Reviews.id')), 'numReviews'], // Check numReviews/spot is correct
        //     ]
        // },
        // include: [
        //     { model: models.Review, attributes: [], required: false },
        //     { model: models.SpotImage, attributes: ['id', 'url', 'preview'], required: false },
        // ],
        // group: ['Spot.id', 'SpotImages.id'],
        attributes: {
            include: [
                [literal(subq.statement('avgRating')), 'avgRating'],
                [literal(subq.statement('previewImage')), 'previewImage']
                // [
                //     literal(`(
                //         SELECT AVG("stars") FROM "Reviews" AS "Review"
                //         WHERE
                //             "Review"."spotId" = "Spot"."id"
                //     )`),
                //     'avgRating',
                // ],
                // [
                //     literal(`(
                //         SELECT ("url") FROM "SpotImages" AS "SpotImage"
                //         WHERE
                //             "SpotImage"."spotId" = "Spot"."id"
                //             AND
                //             "SpotImage"."preview" = true
                //     )`),
                //     'previewImage',
                // ]
            ]
        },
        ...pagination, where,
    });
    if (spots.length === 0) {

    }
    const allSpots = spots.map(spot => {
        const spotJson = spot.toJSON();
        spotJson.avgRating = spotJson.avgRating || 0;
        spotJson.previewImage = spotJson.previewImage || 'no preview image';
        return spotJson;
    });
    res.status(200).json({ Spots: allSpots, page, size });
});

// Get all Spots owned by the current user
router.get('/current', requireAuth, isLoggedIn, async (req, res, next) => {
   // Use prepared statements to handle SQLite vs PostgreSQL differences
   const preparedSchema = process.env.NODE_ENV === 'production' ? process.env.SCHEMA + '"."' : '';
   const subq = {
       avgRating: `( 
            SELECT AVG("stars") FROM "${preparedSchema}Reviews" AS "Review"
            WHERE
                "Review"."spotId" = "Spot"."id"
       )`,
       previewImage: `( 
            SELECT ("url") FROM "${preparedSchema}SpotImages" AS "SpotImage"
            WHERE
                "SpotImage"."spotId" = "Spot"."id"
                AND
                "SpotImage"."preview" = true
       )`,
       statement: function(subquery) { return this[subquery] }
   };
    const spots = await models.Spot.findAll({
        where: { ownerId: req.user.id },
        // attributes: {
        //     include: [
        //         [fn('COUNT', col('Reviews.id')), 'numReviews'], // Check numReviews/spot is correct
        //         [fn('AVG', col('Reviews.stars')), 'avgRating'],
        //     ]
        // },
        // include: [
        //     { model: models.Review, attributes: [] },
        //     { model: models.SpotImage, attributes: ['id', 'url', 'preview'] }
        // ],
        // group: ['SpotImages.id'],
        attributes: {
            include: [
                [literal(subq.statement('avgRating')), 'avgRating'],
                [literal(subq.statement('previewImage')), 'previewImage']
                // [
                //     literal(`(
                //         SELECT AVG(stars) FROM Reviews AS Review
                //         WHERE
                //             "Review".spotId = "Spot".id
                //     )`),
                //     'avgRating',
                // ],
                // [
                //     literal(`(
                //         SELECT (url) FROM SpotImages AS SpotImage
                //         WHERE
                //             "SpotImage".spotId = "Spot".id
                //             AND
                //             "SpotImage".preview = true
                //     )`),
                //     'previewImage',
                // ]
            ]
        }
    });
    const allSpots = spots.map(spot => {
        const spotJson = spot.toJSON();
        spotJson.avgRating = spotJson.avgRating || 0;
        spotJson.previewImage = spotJson.previewImage || 'no preview image';
        return spotJson;
    });
    res.status(200).json({
        Spots: allSpots
    });
});

// Get details of a Spot from an id
router.get('/:spotId', async (req, res, next) => {
    // Make sure id param is a valid number
    const id = Number(req.params.spotId);
    // refactor using next()
    if (!Number.isInteger(id)) {
        return res.json({
            message: 'Spot couldn\'t be found'
        });
    }
    // Use prepared statements to handle SQLite vs PostgreSQL differences
//    const preparedSchema = process.env.NODE_ENV === 'production' ? process.env.SCHEMA + '"."' : '';
//    const subq = {
//        numReviews: `( 
//             SELECT COUNT("id")
//             FROM "${preparedSchema}Reviews" AS "Review"
//             WHERE "Review"."spotId" = "Spot"."id"
//        )`,
//        avgStarRating: `( 
//             SELECT AVG("stars")
//             FROM "${preparedSchema}Reviews" AS "Review"
//             WHERE "Review"."spotId" = "Spot"."id"
//        )`,
//        statement: function(subquery) { return this[subquery] }
//    };
   const subq = prepareSubqStatement();
   subq.numReviews = `( 
        SELECT COUNT("id")
        FROM "${subq.schema}Reviews" AS "Review"
        WHERE "Review"."spotId" = "Spot"."id"
    )`;
   subq.avgStarRating = `( 
        SELECT AVG("stars")
        FROM "${subq.schema}Reviews" AS "Review"
        WHERE "Review"."spotId" = "Spot"."id"
    )`;
    const spot = await models.Spot.findOne({
        where: { id },
        // attributes: {
        //     include: [
        //         [fn('COUNT', col('Reviews.stars')), 'numReviews'],
        //         [fn('AVG', col('Reviews.stars')), 'avgStarRating']
        //     ]
        // },
        // group: ['SpotImages.id'],
        // Need to use sub-query calls in raw SQL to get an accurate count
        attributes: {
            include: [
                [literal(subq.statement('numReviews')), 'numReviews'],
                [literal(subq.statement('avgStarRating')), 'avgStarRating']
            //     [
            //         literal(`(
            //             SELECT COUNT(id)
            //             FROM Reviews AS Review
            //             WHERE "Review".spotId = "Spot".id
            //         )`),
            //         'numReviews',
            //     ],
            //     [
            //         literal(`(
            //             SELECT AVG(stars)
            //             FROM Reviews AS Review
            //             WHERE "Review".spotId = "Spot".id
            //         )`),
            //         'avgStarRating',
            //     ],
            ]
        },
        include: [
            { model: models.Review, attributes: [] },
            {
                model: models.SpotImage,
                attributes: ['id', 'url', 'preview'],
                // required: false,
            },
            {
                model: models.User,
                as: 'Owner',
                attributes: ['id', 'firstName', 'lastName'],
                // required: false
            },
        ],
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

// Get all bookings for a spot based on the spot's id
router.get('/:spotId/bookings', async (req, res, next) => {
    const { ownerId } = await models.Spot.findByPk(
        req.params.spotId,
        {
            attributes: ['ownerId']
        }
    );
    const bookingProps = ['spotId', 'startDate', 'endDate'];
    const userProps = [];
    if (req.user.id === ownerId) {
        bookingProps.push('id', 'userId', 'createdAt', 'updatedAt');
        userProps.push('id', 'firstName', 'lastName')
    }
    const bookings = await models.Booking.findAll({
        where: { spotId: req.params.spotId },
        include: [
            { model: models.User, attributes: userProps },
        ],
        attributes: bookingProps,
    });
    if (!bookings) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }

    res.status(200).json(bookings);
});

// Create a booking from a spot based on the spot's id
router.post('/:spotId/bookings', async (req, res, next) => {
    if (req.user) {
        const { startDate:start, endDate:end } = req.body;
        const { startDate, endDate } = formatBookingDates({ start, end });
        // req.body.startDate = new Date(req.body.startDate + 'T15:00:00');
        // req.body.endDate = new Date(req.body.endDate + 'T11:00:00');
        const pastBookings = await models.Booking.findAll({
            where: { spotId: req.params.spotId }
        });
        const isValidBookingDate = startDate < endDate;
        const isAllowedToBook = hasNoBookingOverlap(pastBookings, startDate, endDate);
        if (!isValidBookingDate || !isAllowedToBook) {
            return res.status(404).json({
                message: "Incompatile booking days"
            });
        }
        const newBooking = await models.Booking.create({
            spotId: Number(req.params.spotId),
            userId: req.user.id,
            startDate, endDate
        })
        return res.status(200).json(newBooking);
    }
});

// Get all reviews by a spot's id
router.get('/:spotId/reviews', requireAuth, async (req, res, next) => {
    const err = new Error();
    err.title = "Couldn't get reviews for a spot!";

    const spot = await models.Spot.findByPk(req.params.spotId);
    if (!spot) {
        err.message = "Spot couldn't be found";
        err.status = 404;
        next(err);
    }
    const reviews = await models.Review.findAll({
        where: { spotId: req.params.spotId },
        include: [
            {
                model: models.User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: models.ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });
    if (!reviews) {
        // refactor using next
        return res.status(404).json({
            message: "Couldn't find spot"
        });
    }
    res.status(200).json({
        Reviews: reviews
    });
})

// Create a spot
router.post('/', requireAuth, createSpotValidation, async (req, res, next) => {
    // if (req.user) {
    const spot = await models.Spot.create({
        ownerId: req.user.id,
        ...req.body
    });
        // handle validation errors
        // if (!spot) {
        //     return res.status(400).json({
        //         message: 'Bad Request',
        //         errors: {
        //             address: 'Street address is required',
        //             city: 'City is required',
        //             state: 'State is required',
        //             country: 'Country is required',
        //             lat: 'Latitude must be within -90 and 90',
        //             lng: 'Longitude must be within -180 and 180',
        //             name: 'Name must be less than 50 characters',
        //             description: 'Description is required',
        //             price: 'Price per day must be a positive number'
        //         }
        //     });
        // }
    res.status(201).json(spot);
    // }
});

// Create a review for a spot based on the spot's id
router.post('/:spotId/reviews', requireAuth, isLoggedIn, createReviewValidation, async (req, res, next) => {
    const err = new Error();
    err.title = "Couldn't get reviews for a spot!";
    // if (!req.user) {
    //     err.message = "Forbidden";
    //     err.status = 201;
    //     next(err);
    // }
    const spot = await models.Spot.findByPk(req.params.spotId);
    if (!spot) {
        err.message = "Spot couldn't be found";
        err.status = 404;
        next(err);
    }

    const pastUserReview = await models.Review.findOne({
        where: { spotId: req.params.spotId, userId: req.user.id }
    });
    if (pastUserReview) {
        err.message = "User already has a review for this spot";
        err.status = 500;
        next(err);
    }
    // refactor to use spot.addReview() ?
    const review = await models.Review.create({
        userId: req.user.id,
        spotId: Number(req.params.spotId),
        ...req.body
    });

    res.status(201).json(review);
});

// Add an image to a spot based on the spot's id
// /api/spots/:spotId/images
router.post('/:spotId/images', requireAuth, isLoggedIn, async (req, res, next) => {
    const err = new Error();
    err.title = "Couldn't add an image to a spot";
    // if (!req.user) {
    //     err.message = "Forbidden";
    //     err.status = 403;
    //     next(err);
    // }
    const spot = await models.Spot.findByPk(req.params.spotId);
    if (!spot) {
        err.message = "Spot couldn't be found";
        err.status = 404;
        next(err);
    } else if (req.user.id !== spot.ownerId) {
        err.message = "The user is not the spot's owner";
        err.status = 403;
        next(err);
    }
    if (req.body.preview) {
        const where = { spotId: req.params.spotId }
        await models.SpotImage.update( { preview: false }, { where } );
    }
    const spotImage = await models.SpotImage.create( { spotId: req.params.spotId, ...req.body } );
    if (!spotImage) {
        return res.status(404).json({
            message: "Image couldn't be created"
        });
    }
    res.status(201).json({ id: spotImage.id, url: spotImage.url, preview: spotImage.preview });
});

// Edit a spot
router.put('/:spotId', requireAuth, isLoggedIn, createSpotValidation, async (req, res, next) => {
    const err = new Error();
    err.title = "Couldn't edit a spot!";
    // if (!req.user) {
    //     err.status = 403;
    //     err.message = "Forbidden";
    //     next(err);
    // }
    const {
        address, city, state,
        country, lat, lng,
        name, description, price
    } = req.body;
    const spotInstance = await models.Spot.findByPk(req.params.spotId);
    if (!spotInstance) {
        err.status = 404;
        err.message = "Spot couldn't be found";
        next(err);
    } else if (req.user.id !== spotInstance.ownerId) {
        err.status = 403;
        err.message = "Forbidden";
        next(err);
    }
    for (const [k, v] of Object.entries({ 
        address, city, state,
        country, lat, lng,
        name, description, price
    })) {
        if (v) {
            spotInstance[k] = v;
        }
    }
    try {
        await spotInstance.save();
    } catch (e) {
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
    res.status(200).json(spotInstance);
});

// Delete a spot
router.delete('/:spotId', requireAuth, isLoggedIn, async (req, res, next) => {
    const err = new Error();
    err.title = "Couldn't delete a spot!";
    // if (!req.user) {
    //     err.status = 403;
    //     err.message = "Forbidden";
    //     next(err);
    // }
    const spot = await models.Spot.findByPk(req.params.spotId);
    // const spot = await models.Spot.destroy({ where: { id: req.params.spotId } });
    if (!spot) {
        err.status = 404;
        err.message = "Spot couldn't be found";
        next(err);
    } else if (req.user.id !== spot.ownerId) {
        err.status = 403;
        err.message = "Forbidden";
        next(err);
    }
    await spot.destroy();
    res.status(200).json({ message: `Successfully deleted` });
});

module.exports = router;