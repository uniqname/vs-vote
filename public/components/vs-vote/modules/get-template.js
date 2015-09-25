export default function(data) {
    return `
<style>
@keyframes grow-out {
  from {
    opacity: 1;
    transform: translate(50%, 50%) scale(.5);
  }

  to {
    opacity: 0;
    transform: translate(50%, 50%) scale(10);
    z-index: -1;
  }
}

:host {
    position: relative;
    width: 100%;
}

[class*="vs-vote"] {
    box-sizing: border-box;
}

.vs-vote__stage {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
}

[class|="vs-vote__contender"] {
    flex: 0 0 48%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
}

[class|="vs-vote__vs"] {
    font-style: italic;
    animation: grow-out 1s forwards;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

[class|="vs-vote__image"] {
    width: 100%;
    object-fit: cover;
}

[class|="vs-vote__figure"] {
    margin: 0;
    padding: 0;
}

[class|="vs-vote__vote"] {
    color: rebeccapurple;
    cursor: pointer;
    border: .25rem solid currentcolor;
    border-radius: .25rem;
    background-color: hsla(270, 50%, 40%, .2);
    font-size: 2em;
    font-family: sans-serif;
    font-style: italic;
}
</style>
<p class="vs-vote__vs">fight!</p>
<h1 class="vs-vote__title">${data.title}</h1>
<div class="vs-vote__stage">
    <div class="vs-vote__contender--contender-a">
        <img class="vs-vote__image--contender-a" src="/vs/${encodeURIComponent(data.contenderA)}" alt="${data.contenderA}" />
        <slot name="contender-a"></slot>
        <button class="vs-vote__vote--contender-a">+ 0</button>
    </div>
    <div class="vs-vote__contender--contender-b">
        <img class="vs-vote__image--contender-b" src="/vs/${encodeURIComponent(data.contenderB)}" alt="${data.contenderB}" />
        <slot name="contender-b"></slot>
        <button class="vs-vote__vote--contender-b">+ 0</button>
    </div>
</div>
`
};
