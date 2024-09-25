const router = require('express').Router();
const models = require('../../db/models');
const { Review, Spot, User } = models;
const { literal } = require('sequelize');
router.get('/current', async (req, res, next) => {
    const user = req.user;
    if (user) {
        const userId = user.id;
        console.log(userId);
        const reviews = await Review.findAll({
            where: {
                userId: userId
            },
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
                                        SpotImage.preview = true
                                        AND
                                        SpotImage.spotId = Spot.id
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
    }
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

router.post('/:reviewId/images', async (req, res, next) => {
    const reviewImage = await models.ReviewImage.create({
        reviewId: Number(req.params.reviewId),
        ...req.body
    });
    if (!reviewImage) {
        return res.status(400).json("bad image");
    }
    res.status(201).json({
        id: reviewImage.id,
        url: reviewImage.url
    });
});

router.put('/:reviewId', async (req, res, next) => {
    // const errorResults = {}
    const { review, stars } = req.body;
    const reviewInstance = await Review.findByPk(req.params.reviewId);
    if (!reviewInstance) {
        res.status(404).json({ message: "Review couldn't be found" });
    }
    for (const [k, v] of Object.entries({ review, stars })) {
        if (v) {
            reviewInstance[k] = v;
        }
    }
    try {
        await reviewInstance.save();
    } catch (e) {
        // errorResults.errors = { review, stars };
        res.status(400).json({
            message: e.message,
            errors: { review, stars }
        })
    }
    res.status(200).json(reviewInstance);
});

router.delete('/:reviewId', async (req, res, next) => {
    const review = await Review.findByPk(req.params.reviewId);
    if (!review) {
        res.status(404).json({ message: "Review couldn't be found" });
    }
    await review.destroy();
    res.status(200).json({ message: "Successfully deleted" });
})
module.exports = router;