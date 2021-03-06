async function gs(app) {
    app.search.input.placeholder = 'Search library'
    app.search.back.style.display = 'none';
    app.main.library = app.createElement('div', await compileGs(app), {
        style: {
            'margin-bottom': '40px'
        }
    });
    app.main.emptySearch = app.createElement('div', [app.createElement('p', 'No results found.')], {
        class: 'gs-empty',
        style: {
            display: 'none'
        }
    });
    app.main.player = app.createElement('div', [app.createElement('iframe', [], {
        class: 'gs-frame',
        events: {
            focus(event) {
                event.target.contentWindow.focus();
            }
        },
        attrs: {
            tabindex: 1,
            src: 'about:blank'
        }
    }), app.createElement('p', [], {
        class: 'author'
    }), app.createElement('div', [], {
        class: 'description'
    })], {
        class: 'gs-player',
        style: {
            display: 'none',
        }
    });
    app.search.input.setAttribute('oninput', '(' + (function() {
        let count = 0;
        app.main.library.querySelectorAll('.gs-entry').forEach(node => {
            if (node.getAttribute('data-title').toLowerCase().includes(app.search.input.value.toLowerCase())) {
                node.setAttribute('data-active', '1');
                count++;
            } else {
                node.removeAttribute('data-active');
            };
        });
        app.main.library.querySelectorAll('.category').forEach(node => {
            if (!node.querySelectorAll('.gs-library .gs-entry[data-active]').length) {
                node.style.display = 'none';
            } else {
                node.style.removeProperty('display');
            };
        });
        if (!count) {
            app.main.library.style.display = 'none';
            app.main.emptySearch.style.display = 'block';
        } else {
            app.main.library.style.removeProperty('display');
            app.main.emptySearch.style.display = 'none';
        };
    }).toString() + ')()')
};
async function compileGs(app) {
    const res = await fetch('./gs.json');
    const json = await res.json();
    const list = {
        featured: [],
        web: [],
        indie: [],
        n64: [],
        flash: [],
    };
    for (const entry of json) {
        const elem = app.createElement('div', [], {
            class: 'gs-entry',
            style: {
                background: `url(${entry.img})`,
                'background-size': 'cover'
            },
            attrs: {
                'data-title': entry.title,
                'data-active': '1'
            },
            events: {
                click(event) {
                    function foc() {
                        app.main.player.querySelector('iframe').contentWindow.focus()
                    };
                    app.main.library.style.display = 'none';
                    app.main.player.style.display = 'block';
                    app.search.input.style.display = 'none';
                    app.search.title.style.display = 'block';
                    app.search.back.style.display = 'block';
                    app.search.title.textContent = entry.title;
                    window.addEventListener('click', foc);
                    app.nav.fullscreen = app.createElement('button', 'fullscreen', {
                        class: 'submit',
                        style: {
                            'font-family': 'Material Icons',
                            'font-size': '30px',
                            color: 'var(--accent)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                        },
                        events: {
                            click() {
                                app.main.player.querySelector('iframe').requestFullscreen();
                                app.main.player.querySelector('iframe').contentWindow.focus();
                            }
                        }
                    });
                    app.main.player.querySelector('iframe').src = entry.location;
                    app.main.player.querySelector('.author').textContent = entry.author || '';
                    app.main.player.querySelector('.description').textContent = entry.description || '';
                    window.scrollTo({
                        top: 0
                    });
                    app.search.back.setAttribute('onclick', '(' + (() => {
                        if (window.location.hash !== '') return this.removeAttribute('onclick');
                        event.preventDefault();
                        this.style.display = 'none';

                        app.main.library.style.removeProperty('display');
                        app.search.input.style.removeProperty('display');
                        app.search.title.style.display = 'none';
                        app.search.title.textContent = '';
                        app.main.player.style.display = 'none';
                        app.main.player.querySelector('iframe').src = 'about:blank';
                        delete app.nav.fullscreen;
                        this.removeAttribute('onclick');
                    }).toString() + ')()');
                }
            }
        });
        (list[entry.category] || list.web).push(elem);
    };
    return [
app.createElement('section', [app.createElement('span', 'Mobile & Web', {
        style: {
            display: 'block',
            'margin-bottom': '30px',
            'font-size': '18px',
            'font-weight': '500'
        }
    }), app.createElement('div', list.web, {
        class: 'gs-library'
    })], {
        class: 'data-section web category',
        attrs: {
            'data-category': 'web'
        }
    }), 
    app.createElement('section', [app.createElement('span', 'Indie', {
        style: {
            display: 'block',
            'margin-bottom': '30px',
            'font-size': '18px',
            'font-weight': '500'
        }
    }),
    app.createElement('div', list.indie, {
        class: 'gs-library'
    })
], {
    class: 'data-section indie category',
    attrs: {
        'data-category': 'indie'
    }
}),
app.createElement('section', [app.createElement('span', 'Flash', {
    style: {
        display: 'block',
        'margin-bottom': '30px',
        'font-size': '18px',
        'font-weight': '500'
    }
}),
app.createElement('div', list.flash, {
    class: 'gs-library'
})
], {
class: 'data-section flash category',
attrs: {
    'data-category': 'flash'
}
}),
app.createElement('section', [app.createElement('span', 'Nintendo', {
        style: {
            display: 'block',
            'margin-bottom': '30px',
            'font-size': '18px',
            'font-weight': '500'
        }
    }), app.createElement('div', [...list.n64], {
        class: 'gs-library'
    })], {
        class: 'data-section nintendo category',
        attrs: {
            'data-category': 'nintendo'
        }
    })]
};
export { gs }