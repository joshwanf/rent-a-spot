const router = require('express').Router();
const models = require('../../db/models');

router.delete('/:imageId', async (req, res, next) => {
    const reviewImage = await models.ReviewImage.destroy({
        where: { id: req.params.imageId }
    });
    if (!reviewImage) {
        return res.status(404).json({
            message: "Review Image couldn't be found"
        });
    }
    res.status(200).json({
        message: "Successfully deleted"
    })
});

module.exports = router;