// backend/routes/api/index.js
const router = require("express").Router();
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const spotsRouter = require("./spots.js");
const reviewsRouter = require("./reviews.js");
const bookingsRouter = require("./bookings.js");
const spotImagesRouter = require("./spot-images.js");
const reviewImagesRouter = require("./review-images.js");
const { restoreUser } = require("../../utils/auth.js");

// router.post('/test', function(req, res) {
//     res.json({ requestBody: req.body });
// });

// GET /api/set-token-cookie
const { setTokenCookie } = require("../../utils/auth.js");
const { User } = require("../../db/models");
router.get("/set-token-cookie", async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: "Demo-lition",
    },
  });
  setTokenCookie(res, user);
  return res.json({ user: user });
});

router.use(restoreUser);

router.get("/restore-user", (req, res) => {
  return res.json(req.user);
});

// GET /api/require-auth
const { requireAuth } = require("../../utils/auth.js");
router.get("/require-auth", requireAuth, (req, res) => {
  return res.json(req.user);
});

router.use("/session", sessionRouter);

router.use("/users", usersRouter);

router.use("/reviews", reviewsRouter);

router.use("/bookings", bookingsRouter);

router.use("/spot-images", spotImagesRouter);
router.use("/review-images", reviewImagesRouter);

router.post("/test", (req, res) => {
  res.json({ requestBody: req.body });
});

router.use("/spots", spotsRouter);

module.exports = router;
