exports.allAccess = (req, res) => {
  res.status(200).json({ access: true });
};

exports.userBoard = (req, res) => {
  res.status(200).json({ access: true });
};

exports.adminBoard = (req, res) => {
  res.status(200).json({ access: true });
};

exports.moderatorBoard = (req, res) => {
  res.status(200).json({ access: true });
};
