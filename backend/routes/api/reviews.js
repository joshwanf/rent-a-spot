const router = require('express').Router();
const { literal } = require('sequelize');
const models = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const {
    isLoggedIn,
    createReviewValidation
} = require('../../utils/endpoint-validation');

const { Review, Spot, User } = models;

router.get('/current', requireAuth, async (req, res, next) => {
    const err = new Error();
    err.title = "Couldn't get all reviews";
    if (!req.user) {
        err.message = "Forbidden";
        err.status = 403;
        next(err);
    }
    const reviews = await Review.findAll({
        where: { userId: req.user.id },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: {
                    exclude: ['description', 'createdAt', 'updatedAt'],
                    include: [
                        [
                            literal(`(
                                SELECT url
                                FROM SpotImages AS SpotImage
                                WHERE
                                    "SpotImage"."preview" = true
                                    AND
                                    "SpotImage"."spotId" = "Spot"."id"
                            )`),
                            'previewImage',
                        ],
                    ]
                },
            },
            { model: models.ReviewImage, attributes: ['id', 'url'] }
        ]
    });
    res.status(200).json({
        Reviews: reviews
    });
});

router.get('/user/:userId', async (req, res, next) => {
    const reviews = await Review.findAll({
        where: { userId: req.params.userId },
        include: [
            { model: Spot }
        ]
    });
    res.status(200).json(reviews);
})

router.post('/:reviewId/images', requireAuth, isLoggedIn, async (req, res, next) => {
    const err = new Error();
    err.title = "Couldn't add an image to a review!";
    // if (!req.user) {
    //     err.message = "Forbidden";
    //     err.status = 403;
    //     next(err);
    // }
    const review = await models.Review.findByPk(req.params.reviewId);
    if (!review) {
        err.message = "Review couldn't be found";
        err.status = 404;
        next(err);
    } else if (req.user.id !== review.userId) {
        err.message = "Forbidden";
        err.status = 403;
        next(err);
    }
    
    const reviewImage = await models.ReviewImage.create({
        reviewId: Number(req.params.reviewId),
        ...req.body
    });
    if (!reviewImage) {
        err.message = "Forbidden";
        err.status = 403;
        next(err);
        return res.status(400).json("bad image");
    }
    res.status(201).json({
        id: reviewImage.id,
        url: reviewImage.url
    });
});

router.put('/:reviewId', requireAuth, isLoggedIn, createReviewValidation, async (req, res, next) => {
    const err = new Error();
    err.title = "Couldn't edit a review!";
    const review = await Review.findByPk(req.params.reviewId);
    if (!review) {
        err.status = 404;
        err.message = "Review couldn't be found";
        next(err);
    } else if (req.user.id !== review.userId) {
        req.throwErr = true;
        return isLoggedIn(req, res, next);
    }

    for (const [k, v] of Object.entries({ review: req.body.review, stars: req.body.stars })) {
        if (v) {
            review[k] = v;
        }
    }
    try {
        await review.save();
    } catch (e) {
        // errorResults.errors = { review, stars };
        err.status = 400;
        err.message = e.message;
        return next(err);
    }
    res.status(200).json(review);
});

router.delete('/:reviewId', requireAuth, isLoggedIn, async (req, res, next) => {
    const err = new Error();
    err.title = "Couldn't delete a review!";

    const review = await Review.findByPk(req.params.reviewId);
    if (!review) {
        err.message = "Review couldn't be found"
        err.status = 404;
        next(err);
    } else if (req.user.id !== review.userId) {
        req.throwErr = true;
        return isLoggedIn(req, res, next);
    }
    await review.destroy();
    res.status(200).json({ message: "Successfully deleted" });
})
module.exports = router;