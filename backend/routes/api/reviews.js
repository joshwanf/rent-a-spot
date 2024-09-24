const router = require('express').Router();
const { Review, Spot, User } = require('../../db/models');
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
                }
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

router.get('/:reviewId/images', async (req, res, next) => {

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