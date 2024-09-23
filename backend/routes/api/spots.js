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
    })
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
        })
    }
})


module.exports = router;