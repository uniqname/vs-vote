export default function (id) {
    return fetch('/api/vote', {
        method: 'patch',
        body: JSON.stringify({
            id,
            contenderA: {
                value: 0
            },
            contenderB: {
                value: 0
            }
        })
    });
};
