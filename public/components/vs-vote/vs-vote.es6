import getVotes from './modules/get-votes.js';
import getTemplate from './modules/get-template.js';
import registerVote from './modules/register-vote.js';
import resetVotes from './modules/reset-votes.js';

const doc = document.currentScript.ownerDocument,
    qsa = (selector, root) => {
        return [...(root || document).querySelectorAll(selector)];
    },
    whichContender = el => {
        return el.getAttribute('class').match('contender-a') ? 'contenderA' : 'contenderB';

    },
    vsProto = Object.create(HTMLElement.prototype, {
        contenderA: {
            get() { return this.getAttribute('contender-a'); },
            set(val) { this.setAttribute('contender-a', val); }
        },

        contenderB: {
            get() { return this.getAttribute('contender-b'); },
            set(val) { this.setAttribute('contender-b', val); }
        },

        title: {
            get() { return `${this.getAttribute('contender-a')} vs ${this.getAttribute('contender-b')}`}
        },

        template: {
            get() {
                var t = qsa('template#vs-vote', doc)[0];

                if (!t) {
                  t = document.createElement('template');
                  t.innerHTML = getTemplate(this);
                }

                return document.importNode(t.content, true)
            }
        },

        shadowProxy: {
            get() {
                return ('shadowRoot' in this) ? (this.shadowRoot || this.createShadowRoot()) : this;
            }
        }
    });

vsProto.render = function (data) {
    let vsVote = this;
    if ('shadowRoot' in this) {
        if (!this.shadowProxy.childElementCount) {
            this.shadowProxy.appendChild(this.template);
        }
        this._renderWithShadowRoot(data);
    } else {
        this._renderWithInnerHTML();
    }
    qsa('[class*=vs-vote__vote]', this.shadowProxy)
        .map( btn => btn.addEventListener('click', function (evt) {
            registerVote(vsVote.id, whichContender(evt.target)).then(val => {
              Object.keys(val).filter(key => key !== 'id')
                  .map(key => {
                      vsVote.shadowProxy.querySelector(`[class*="vs-vote__vote--${key === 'contenderA' ? 'contender-a' : 'contender-b' }"]`).textContent = `+ ${val[key].votes}`;
                  })
            });
        }));
};

vsProto._renderWithShadowRoot = function (data) {
    let imgDataMap = img => {
        var contender = whichContender(img);
        img.src = `/vs/${encodeURIComponent(this[contender])}`;
        img.alt = `${this[contender]}`;
    }

    qsa('[class|="vs-vote__image"]', this.shadowRoot).map(imgDataMap);

    qsa('[class|="vs-vote__vote"]', this.shadowRoot).map(btn => {
        var contender = whichContender(btn);
            btn.textContent = `+ ${data[contender].votes}`
    });

    qsa('.vs-vote__title', this.shadowRoot).map(title => title.textContent = this.title);
};

vsProto._renderWithInnerHTML = function () {
    var templFrag = this.template;

    //emulate slotting
    qsa('slot', templFrag)
        .sort((a,b) => a.getAttribute('name') > b.getAttribute('name') )
        .map( slot  => {
            var name = slot.getAttribute('name') || '*';
            return qsa(`[slot="${name}"]`, this)
        .map( node => slot.appendChild(node))
    });
    this.innerHTML = '';
    this.appendChild(templFrag);
};

vsProto.createdCallback = function () {
    var vsVote = this;
    getVotes(vsVote.contenderA, vsVote.contenderB)
        .then( function (votes) {
            vsVote.dataset.id = votes.id;
            vsVote.render.bind(vsVote)(votes)
        });
};

vsProto.attributeChangedCallback = function (attr, prev, curr) {
    if (attr.toLowerCase() === 'contender-a' || attr.toLowerCase() === 'contender-b') {
        var vsVote = this;
        getVotes(vsVote.contenderA, vsVote.contenderB)
            .then( function (votes) {
                vsVote.dataset.id = votes.id;
                vsVote.render.bind(vsVote)(votes)
            });
    }
}

var Vs = document.registerElement('vs-vote', { prototype: vsProto });
