const checkMillionDollarIdea = (req, res, next) => {
  let numWeeks = Number(req.body.numWeeks);
  let weeklyRevenue = Number(req.body.weeklyRevenue);

  if ((weeklyRevenue * numWeeks) >= 1000000) {
    next();
    res.status(null).send();
  } else {
    res.status(400).send();
  }
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
