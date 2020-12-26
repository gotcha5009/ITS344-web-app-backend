const express = require('express');
const router = express.Router();
const company_controller = require('../../controllers/companyController');
const jwtSecret = process.env.JWT_SECRET;
// const companyMiddlewares = require('../../middlewares/companyMiddleware');
// const { check } = require('express-validator/check');
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  company_controller.getUser
);
router.post('/signup', company_controller.signup_post);
router.post('/login', (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (user) {
      const payload = {
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      };
      const token = jwt.sign(payload, `${jwtSecret}`, { expiresIn: '24h' });
      return res.json({ user, token });
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});
// app.post(
//   "/local-reg",
//   passport.authenticate("local-signup", {
//     successRedirect: "/",
//     failureRedirect: "/signin",
//   })
// );
router.post(
  '/changepassword',
  passport.authenticate('jwt', { session: false }),
  company_controller.changePassword_post
);
module.exports = router;
