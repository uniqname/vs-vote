/*
 * Votes are of the form:
 *
 *  [{
 *      id: <id>,
 *      contenderA: {
 *          name: <contender a>,
 *          votes: <N>
 *      },
 *      contenderB: {
 *          name: <contender b>,
 *          votes: <N>
 *      }
 *  },...]
 */

var records = [];

var votes = {
    get(id) {
        var record = records.find( record => record.id === id );
        return !record ? undefined : Object.assign({}, record);
    },

    create(contenderA, contenderB) {
        var record = Object.create(null, {
            id: {
                enumerable: true,
                value: `${contenderA} vs ${contenderB}`
            },
            contenderA: {
                enumerable: true,
                value: createContenderRecord(contenderA),
            },
            contenderB: {
                enumerable: true,
                value: createContenderRecord(contenderB)
            }
        });

        records = records.concat(record);
        return record;
    },

    update(id, delta) {
        var record = this.get(id);
        if (record) {
            try {
                record = Object.assign(record, delta);
            } catch (err) {
                console.err(err);
            }
        }
        return record;
    },

    remove(id) {
        var idx = records.findIndex( record => record.id === id),
            record = records[idx];
        records = [].concat(records.slice(0, idx), records.slice(idx + 1));
        return record;
    },

    //Searchesfor and returns a record matching either the id,
    //or the same contenders. If a record is not found,
    //one is created and returned.
    recordOf( contenderA, contenderB ) {
        var id;

        if (!contenderB) {
            id = contenderA;
            contenderA = undefined;
        }
        console.log('recordOf args:', arguments);

        var record = records.find( record => {

            console.log(`
record.id: ${record.id}
id: ${id}

record.contenderA.name: ${record.contenderA.name}
contenderA: ${contenderA}

record.contenderB.name: ${record.contenderB.name}
contenderB: ${contenderB}
`);

            return id ? record.id === id :
                        (record.contenderA.name === contenderA &&
                         record.contenderB.name === contenderB)
        });

        if ( !record ) {

            console.log(`creating new record for ${arguments}`);
            record = this.create.apply(this, arguments);

        }

        return record;

    }
}

var createContenderRecord = contenderName => Object.create(null, {
    name: {
        enumerable: true,
        value: contenderName
    },
    votes: {
        enumerable: true,
        writable: true,
        value: 0
    }
})

module.exports = votes;
