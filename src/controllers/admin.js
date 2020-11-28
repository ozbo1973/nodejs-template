/* Admin Controllers */

exports.getProfile = (req, res) => {
  try {
    res.status(200).send(req.profile);
  } catch (error) {
    res.status(500).send();
  }
};
