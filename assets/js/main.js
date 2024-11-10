(function () {

    "use strict";

    const select = (el, all = false) => {
        el = el.trim()
            if (all) {
                return [...document.querySelectorAll(el)]
            } else {
                return document.querySelector(el)
            }
    }

    const on = (type, el, listener, all = false) => {
        let selectEl = select(el, all)
            if (selectEl) {
                if (all) {
                    selectEl.forEach(e => e.addEventListener(type, listener))
                } else {
                    selectEl.addEventListener(type, listener)
                }
            }
    }

    const onscroll = (el, listener) => {
        el.addEventListener('scroll', listener)
    }

    let navbarlinks = select('#navbar .scrollto', true)
        const navbarlinksActive = () => {
        let position = window.scrollY + 200
            navbarlinks.forEach(navbarlink => {
                if (!navbarlink.hash)
                    return
                    let section = select(navbarlink.hash)
                        if (!section)
                            return
                            if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
                                navbarlink.classList.add('active')
                            } else {
                                navbarlink.classList.remove('active')
                            }
            })
    }
    window.addEventListener('load', navbarlinksActive)
    onscroll(document, navbarlinksActive)

    const scrollto = (el) => {
        let header = select('#header')
            let offset = header.offsetHeight

            let elementPos = select(el).offsetTop
            window.scrollTo({
                top: elementPos - offset,
                behavior: 'smooth'
            })
    }

    let selectHeader = select('#header')
        if (selectHeader) {
            const headerScrolled = () => {
                if (window.scrollY > 100) {
                    selectHeader.classList.add('header-scrolled')
                } else {
                    selectHeader.classList.remove('header-scrolled')
                }
            }
            window.addEventListener('load', headerScrolled)
            onscroll(document, headerScrolled)
        }

        let backtotop = select('.back-to-top')
        if (backtotop) {
            const toggleBacktotop = () => {
                if (window.scrollY > 100) {
                    backtotop.classList.add('active')
                } else {
                    backtotop.classList.remove('active')
                }
            }
            window.addEventListener('load', toggleBacktotop)
            onscroll(document, toggleBacktotop)
        }

        on('click', '.mobile-nav-toggle', function (e) {
            select('#navbar').classList.toggle('navbar-mobile')
            this.classList.toggle('bi-list')
            this.classList.toggle('bi-x')
        })

        on('click', '.navbar .dropdown > a', function (e) {
            if (select('#navbar').classList.contains('navbar-mobile')) {
                e.preventDefault()
                this.nextElementSibling.classList.toggle('dropdown-active')
            }
        }, true)

        on('click', '.scrollto', function (e) {
            if (select(this.hash)) {
                e.preventDefault()

                let navbar = select('#navbar')
                    if (navbar.classList.contains('navbar-mobile')) {
                        navbar.classList.remove('navbar-mobile')
                        let navbarToggle = select('.mobile-nav-toggle')
                            navbarToggle.classList.toggle('bi-list')
                            navbarToggle.classList.toggle('bi-x')
                    }
                    scrollto(this.hash)
            }
        }, true)

        window.addEventListener('load', () => {
            if (window.location.hash) {
                if (select(window.location.hash)) {
                    scrollto(window.location.hash)
                }
            }
        });

    let preloader = select('#preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.remove()
        });
    }

    let categoriasReady = false;

    const initCategorias = () => {
        if (categoriasReady) {
            return;
        }

        const categoriasContainer = select('#list_container');
        const items = select('.categorias-item', true);
        if (!categoriasContainer || !items || !items.length) {
            return;
        }

        const categoriasFilters = select('#filters li', true);
        if (!categoriasFilters || !categoriasFilters.length) {
            return;
        }

        const applyFilter = (filterAttr) => {
            const raw = (filterAttr || '*').trim();
            if (raw === '*' || raw === '') {
                items.forEach((item) => item.classList.remove('categoria-filtro-oculto'));
                return;
            }
            const needle = raw.replace(/^\./, '').trim();
            items.forEach((item) => {
                if (needle && item.classList.contains(needle)) {
                    item.classList.remove('categoria-filtro-oculto');
                } else {
                    item.classList.add('categoria-filtro-oculto');
                }
            });
        };

        on('click', '#filters li', function (e) {
            e.preventDefault();
            categoriasFilters.forEach(function (el) {
                el.classList.remove('filter-active');
            });
            this.classList.add('filter-active');
            applyFilter(this.getAttribute('data-filter'));
            const listEl = document.getElementById('list');
            if (listEl) {
                listEl.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }, true);

        categoriasReady = true;
    };
	
	function generarFiltros(arrayFiltros) {
        const divPadre = document.getElementById('filters');

        for (let i = 0; i < arrayFiltros.length; i++) {
            const contenedor = document.createElement('li');
            contenedor.setAttribute('data-filter', "." + arrayFiltros[i][0]);
			contenedor.textContent = arrayFiltros[i][1];

            divPadre.appendChild(contenedor);
        }
    }

    /**
     * Convierte JSON en el formato interno [categoria, titulo, descripcion, url].
     * Acepta:
     * - Array legacy: [["programacion","V0.dev",...], ...]
     * - Objeto único: { "web": { "tipo","titulo","descripcion","url" } }
     * - Array de objetos con clave "web" o planos { tipo, titulo, ... }
     * - Envoltorio: { "webs": [ ... cualquiera de lo anterior ... ] }
     */
    function normalizarLinksDesdeJson(data) {
        if (data == null) {
            return [];
        }

        let lista = data;

        if (!Array.isArray(lista) && typeof lista === 'object' && Array.isArray(lista.webs)) {
            lista = lista.webs;
        } else if (!Array.isArray(lista) && typeof lista === 'object' && lista.web != null) {
            lista = [lista];
        }

        if (!Array.isArray(lista)) {
            return [];
        }

        if (lista.length > 0 && Array.isArray(lista[0]) && lista[0].length >= 4) {
            return lista;
        }

        const filaDesdeObjeto = (obj) => {
            if (!obj || typeof obj !== 'object') {
                return null;
            }
            const w = obj.web != null && typeof obj.web === 'object' ? obj.web : obj;
            const categoria = w.tipo != null ? String(w.tipo) : (w.categoria != null ? String(w.categoria) : (w.category != null ? String(w.category) : ''));
            const titulo = w.titulo != null ? String(w.titulo) : (w.nombre != null ? String(w.nombre) : (w.title != null ? String(w.title) : ''));
            const descripcion = w.descripcion != null ? String(w.descripcion) : (w.description != null ? String(w.description) : '');
            const url = w.url != null ? String(w.url) : (w.link != null ? String(w.link) : '');
            if (!url) {
                return null;
            }
            return [categoria, titulo, descripcion, url];
        };

        const out = [];
        for (let i = 0; i < lista.length; i++) {
            const fila = filaDesdeObjeto(lista[i]);
            if (fila) {
                out.push(fila);
            }
        }
        return out;
    }

    function generarLinks(arrayLinks) {
        const divPadre = document.getElementById('list_container');
        if (!divPadre) {
            return;
        }

        for (let i = 0; i < arrayLinks.length; i++) {
            const contenedor = document.createElement('div');
            contenedor.className = "card categorias-item " + arrayLinks[i][0];

            const nombre = document.createElement('span');
            nombre.className = "card_title";
            nombre.textContent = arrayLinks[i][1];

            const descripcion = document.createElement('p');
            descripcion.className = "card__subtitle";
            descripcion.textContent = arrayLinks[i][2];

            const links = document.createElement('a');
            links.className = "button";
            links.textContent = "IR";
            links.setAttribute('target', '_blank');
            links.href = arrayLinks[i][3];

            contenedor.appendChild(nombre);
            contenedor.appendChild(descripcion);
            contenedor.appendChild(links);

            divPadre.appendChild(contenedor);
        }
    }

    function mostrarErrorCarga(mensaje) {
        const lista = document.getElementById('list_container');
        if (!lista) {
            return;
        }
        const aviso = document.createElement('p');
        aviso.className = 'aviso-carga';
        aviso.style.cssText = 'padding:2rem;text-align:center;color:#b00020;font-size:1rem;';
        aviso.textContent = mensaje;
        lista.appendChild(aviso);
    }

    /**
     * Acepta:
     * - Array legacy: [["redes","Redes Sociales"], ...]
     * - Array de objetos planos: [{ id, nombre }] o { categoria: {...} }
     * - Envoltorio: { "categorias": [ ... ] } o { "filtros": [ ... ] }
     */
    function normalizarFiltrosDesdeJson(data) {
        if (data == null) {
            return [];
        }

        let lista = data;

        if (!Array.isArray(lista) && typeof lista === 'object') {
            if (Array.isArray(lista.categorias)) {
                lista = lista.categorias;
            } else if (Array.isArray(lista.filtros)) {
                lista = lista.filtros;
            } else if (lista.categoria != null) {
                lista = [lista];
            }
        }

        if (!Array.isArray(lista)) {
            return [];
        }

        if (lista.length > 0 && Array.isArray(lista[0]) && lista[0].length >= 2) {
            return lista;
        }

        const filaDesdeObjeto = (obj) => {
            if (!obj || typeof obj !== 'object') {
                return null;
            }
            const c = obj.categoria != null && typeof obj.categoria === 'object' ? obj.categoria : obj;
            const id = c.id != null ? String(c.id) : (c.tipo != null ? String(c.tipo) : (c.categoria != null ? String(c.categoria) : ''));
            const nombre = c.nombre != null ? String(c.nombre) : (c.label != null ? String(c.label) : (c.title != null ? String(c.title) : id));
            if (!id) {
                return null;
            }
            return [id, nombre];
        };

        const out = [];
        for (let i = 0; i < lista.length; i++) {
            const fila = filaDesdeObjeto(lista[i]);
            if (fila) {
                out.push(fila);
            }
        }
        return out;
    }

    async function cargarJson(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('No se pudo cargar ' + url);
        }
        return response.json();
    }

    async function init() {
        try {
            const [rawWebs, rawFiltros] = await Promise.all([
                cargarJson('assets/data/webs.json'),
                cargarJson('assets/data/categorias.json')
            ]);

            const filtros = normalizarFiltrosDesdeJson(rawFiltros);
            const webs = normalizarLinksDesdeJson(rawWebs);

            generarFiltros(filtros);
            generarLinks(webs);
            initCategorias();
        } catch (error) {
            console.error('Error cargando datos:', error);
            mostrarErrorCarga(
                'No se pudieron cargar los datos. ' +
                'Si abriste el archivo con doble clic, sírvelo por HTTP ' +
                '(por ejemplo: python -m http.server) o súbelo a un host estático.'
            );
        }
    }

    init();


})()
