export default function (contenderA, contenderB) {
    let headers = new Headers({"Content-Type": "application/json"}),
        id;

    if (!contenderB) {
        id = contenderA;
        contenderA = undefined;
    }

    return fetch(`/api/vote?${id ? `id=${id}` : ''}${ contenderA ? `contenderA=${contenderA}&contenderB=${contenderB}` : ''}`)
        .then( resp => resp.json());
}
