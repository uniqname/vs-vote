var express = require('express'),

    votes = require('./votes'),

    router = express.Router();

router.get('/vote', function(req, res) {
    var id = req.query.id,
        contenderA = req.query.contenderA,
        contenderB = req.query.contenderB,
        record;

    if (id) {
        record = votes.get(id);

        if (!record) {
            console.warn(`Attempt to get votes for undefined entry with id "${req.query.id}"
            ${JSON.stringify(votes, null, 4)}
            `);
            res.status(404);
            record = {
                error: `No entry with id "${req.query.id}"`
            };
        }
    } else if (contenderA && contenderB) {
        record = votes.recordOf(contenderA, contenderB);
    } else {
        res.status(400);
        record = {
            error: `Insufficient information to create or get record. Endpoint reqires either an <id> or <contenderA> and <contenderB> fields.
            Supplied arguments:
            [0] ${contenderA}
            [0] ${contenderB}
            `
        }
    }
    res.json(record);
});

router.patch('/vote', function(req, res) {
    var recordDelta = req.body,
        record = votes.recordOf(recordDelta.id),
        contenderADelta = recordDelta.contenderA.votes,
        contenderBDelta = recordDelta.contenderB.votes;

    if (contenderADelta !== undefined) {
        if (contenderADelta === '+')      {record.contenderA.votes += 1; }
        else if (contenderADelta === '-') {record.contenderA.votes -= 1; }
        else if (contenderADelta === 0)   {record.contenderA.votes = 0; }
    }

    if (contenderBDelta !== undefined) {
        if (contenderBDelta === '+')      {
            console.log('pre: ', record.contenderB.votes);
            record.contenderB.votes += 1;
            console.log('post: ', record.contenderB.votes);
        }
        else if (contenderBDelta === '-') {record.contenderB.votes -= 1; }
        else if (contenderBDelta === 0)   {record.contenderB.votes = 0; }
    }

    res.json(record);
});


module.exports = router;
