const router = require('express').Router();
const models = require('../../db/models');

router.delete('/:imageId', async (req, res, next) => {
    // const spotImage = await models.SpotImage.findByPk(Number(req.params.imageId));
    const spotImage = await models.SpotImage.destroy({
        where: {
            id: Number(req.params.imageId)
        }
    });
    if (!spotImage) {
        return res.status(404).json({
            message: "Spot Image couldn't be found"
        });
    }
    res.status(200).json({
        message: "Successfully deleted"
    })
});

module.exports = router;