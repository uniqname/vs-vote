export default function (id='', contender='') {
    let headers = new Headers({ "Content-Type": "application/json" });

    return fetch("/api/vote", {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify({
            id: id,
            contenderA: {
                votes: contender === 'contenderA' ? '+' : ''
            },
            contenderB: {
                votes: contender === 'contenderB' ? '+' : ''
            }
        })
    }).then( resp => resp.json())
};
