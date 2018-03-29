const express = require('express');
const apiRouter = express.Router();
const app = require('../server')

// We import db functions from db.js
const db = require ('./db.js');

// We import checkMillionDollarIdea function from checkMillionDollarIdea.js
const checkMillionDollarIdea = require ('./checkMillionDollarIdea.js');

// We mount your existing apiRouter below at the '/api' path.
app.use('/api', apiRouter);

//USE /api/ to define req.model
apiRouter.use('/', (req, res, next) => {
  const model = req.url.split('/').filter(segment => segment)[0];
  req.model = model;
  next();
});

//USE /api/minions/:minionId to check if minionID exists
apiRouter.use('/minions/:minionId', (req, res, next) => {
  const oneMinionID = req.params.minionId;
  const oneMinion = db.getFromDatabaseById(req.model, oneMinionID);
  if (oneMinion && (oneMinion !== -1) && !(isNaN(Number(oneMinionID)))) {
    next();
  } else {
    res.status(404).send();
  }
});

//USE /api/ideas/:ideaId to check if minionID exists
apiRouter.use('/ideas/:ideaId', (req, res, next) => {
  const oneIdeaID = req.params.ideaId;
  const oneIdea = db.getFromDatabaseById(req.model, oneIdeaID);
  if (oneIdea && (oneIdea !== -1) && !(isNaN(Number(oneIdeaID)))) {
    next();
  } else {
    res.status(404).send();
  }
});

//GET /api/minions to get an array of all minions.
apiRouter.get('/minions', (req, res, next) => {
  const allMinions = db.getAllFromDatabase(req.model);
  if (allMinions) {
    res.status(200).send(allMinions);
  } else {
    res.status(404).send();
  }
});

//POST /api/minions to create a new minion and save it to the database.
apiRouter.post('/minions', (req, res, next) => {
  const newMinionWithoutID = req.body;
  if (db.isValidMinion(newMinionWithoutID)) {
    const newMinionWithID = db.addToDatabase(req.model, newMinionWithoutID);
    res.status(201).send(newMinionWithID);
  } else {
    res.status(400).send();
  }
});

//GET /api/minions/:minionId to get a single minion by id.
apiRouter.get('/minions/:minionId', (req, res, next) => {
    res.status(200).send(db.getFromDatabaseById(req.model, req.params.minionId));
});

//PUT /api/minions/:minionId to update a single minion by id.
apiRouter.put('/minions/:minionId', (req, res, next) => {
    db.updateInstanceInDatabase(req.model, req.body);
    res.send(db.updateInstanceInDatabase(req.model, req.body));
});

//DELETE /api/minions/:minionId to delete a single minion by id.
apiRouter.delete('/minions/:minionId', (req, res, next) => {
    db.deleteFromDatabasebyId(req.model, req.params.minionId);
    res.status(204).send();
});

//GET /api/ideas to get an array of all ideas.
apiRouter.get('/ideas', (req, res, next) => {
  const allIdeas = db.getAllFromDatabase(req.model);
  if (allIdeas) {
    res.status(200).send(allIdeas);
  } else {
    res.status(404).send();
  }
});

//POST /api/ideas to create a new idea and save it to the database.
apiRouter.post('/ideas', checkMillionDollarIdea, (req, res, next) => {
  const newIdeaWithoutID = req.body;
  if (db.isValidIdea(newIdeaWithoutID)) {
    const newIdeaWithID = db.addToDatabase(req.model, newIdeaWithoutID);
    res.status(201).send(newIdeaWithID);
  } else {
    res.status(400).send();
  }
});

//GET /api/ideas/:ideaId to get a single idea by id.
apiRouter.get('/ideas/:ideaId', (req, res, next) => {
    res.status(200).send(db.getFromDatabaseById(req.model, req.params.ideaId));
});

//PUT /api/ideas/:ideaId to update a single idea by id.
apiRouter.put('/ideas/:ideaId', (req, res, next) => {
    db.updateInstanceInDatabase(req.model, req.body);
    res.send(db.updateInstanceInDatabase(req.model, req.body));
});

//DELETE /api/ideas/:ideaId to delete a single minion by id.
apiRouter.delete('/ideas/:ideaId', (req, res, next) => {
    db.deleteFromDatabasebyId(req.model, req.params.ideaId);
    res.status(204).send();
});

//GET /api/meetings to get an array of all meetings.
apiRouter.get('/meetings', (req, res, next) => {
  const allMeetings = db.getAllFromDatabase(req.model);
  if (allMeetings) {
    res.status(200).send(allMeetings);
  } else {
    res.status(404).send();
  }
});

//POST /api/meetings to create a new meeting and save it to the database.
apiRouter.post('/meetings', (req, res, next) => {
  const newMeeting = db.createMeeting();
  db.getAllFromDatabase(req.model).push(newMeeting);
  res.status(201).send(newMeeting);
});

//DELETE /api/meetings to delete all meetings from the database.
apiRouter.delete('/meetings', (req, res, next) => {
  db.deleteAllFromDatabase(req.model);
  res.status(204).send();
});

//GET /api/minions/:minionId/work to get an array of all work for the specified minon.
apiRouter.get('/minions/:minionId/work', (req, res, next) => {
  const minionId = req.params.minionId;
  const workString = req.url.split('/').filter(segment => segment)[2];
  const allWorks = db.getAllFromDatabase(workString);
  const allWorksFromThatMinion = allWorks.filter(work => Number(work.minionId) === minionId);
  if (allWorksFromThatMinion) {
    res.status(200).send(allWorksFromThatMinion);
  } else {
    res.status(404).send();
  }
});

//POST /api/minions/:minionId/work to create a new work object and save it to the database.
apiRouter.post('/minions/:minionId/work', (req, res, next) => {
  const minionId = req.params.minionId;
  const newWork = createWork(minionId);
  db.addToDatabase(req.model, newWork)
  res.status(201).send(newWork);
    console.log(req.body);
});

  const work = db.getFromDatabaseById('work', id);
  if (work) {
    req.work = work;
    next();
  } else {
    res.status(404).send();
  }
});

//PUT /api/minions/:minionId/work/:workId to update a single work by id.
apiRouter.put('/minions/:minionId/work/:workId', (req, res, next) => {
  console.log(req.body.minionId);
  if (req.params.minionId !== req.body.minionId) {
    res.status(400).send();
  } else {
    updatedWork = db.updateInstanceInDatabase('work', req.body);
    res.send(updatedWork);
  }
});

//DELETE /api/minions/:minionId/work/:workId to delete a single work by id.
apiRouter.delete('/minions/:minionId/work/:workId', (req, res, next) => {
  const deleted = db.deleteFromDatabasebyId('work', req.params.workId);
  if (deleted) {
    res.status(204);
  } else {
    res.status(500);
  }
  res.send();
});

module.exports = apiRouter;
