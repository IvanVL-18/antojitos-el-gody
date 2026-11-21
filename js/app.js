/* Antojitos "El Gody": arma el menú, el pedido y los detalles interactivos de la página. */
(() => {
  'use strict';

  const D = window.GODY;
  if (!D) return;
  document.documentElement.classList.add('js');

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pesos = (n) => '$' + Number(n).toLocaleString('es-MX');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
  const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  const ICONO_MAS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  const ICONO_MENOS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>';
  const ICONO_CHILE = '<svg viewBox="0 0 48 48" aria-hidden="true"><use href="#i-chile"/></svg>';

  /* ---------- Datos ---------- */

  const items = new Map();
  D.menu.forEach((cat) => cat.items.forEach((it) => items.set(it.id, { ...it, cat })));

  const precioCategoria = (cat) => {
    const precios = cat.items.map((i) => i.precio);
    const min = Math.min(...precios);
    return { min, iguales: precios.every((p) => p === min) };
  };

  /* ---------- Pedido guardado en el teléfono (se borra solo después de 12 horas) ---------- */

  const CLAVE = 'gody-pedido-v1';
  const VIGENCIA = 12 * 60 * 60 * 1000;

  const leerPedido = () => {
    try {
      const guardado = JSON.parse(localStorage.getItem(CLAVE) || 'null');
      if (!guardado || Date.now() - guardado.t > VIGENCIA) return {};
      const limpio = {};
      Object.entries(guardado.items || {}).forEach(([id, n]) => {
        if (items.has(id) && Number.isInteger(n) && n > 0) limpio[id] = Math.min(n, 99);
      });
      return limpio;
    } catch (e) {
      return {};
    }
  };
  let pedido = leerPedido();
  const guardarPedido = () => {
    try { localStorage.setItem(CLAVE, JSON.stringify({ t: Date.now(), items: pedido })); } catch (e) { /* sin almacenamiento */ }
  };

  const totales = () => {
    let piezas = 0;
    let total = 0;
    Object.entries(pedido).forEach(([id, n]) => {
      piezas += n;
      total += n * items.get(id).precio;
    });
    return { piezas, total };
  };

  /* ---------- Pintar el menú ---------- */

  const control = (it) => {
    const n = pedido[it.id] || 0;
    return `<div class="cantidad" data-cantidad="${it.id}">
      <button type="button" class="menos" data-op="menos" data-id="${it.id}" aria-label="Quitar uno: ${esc(it.pedido)}"${n ? '' : ' hidden'}>${ICONO_MENOS}</button>
      <output aria-label="Cantidad de ${esc(it.pedido)}"${n ? '' : ' hidden'}>${n}</output>
      <button type="button" class="mas" data-op="mas" data-id="${it.id}" aria-label="Agregar: ${esc(it.pedido)}">${ICONO_MAS}</button>
    </div>`;
  };

  const estampa = (cat) => {
    const { min, iguales } = precioCategoria(cat);
    if (!iguales) return `<span><small>desde</small>${pesos(min)}</span>`;
    const unidad = cat.items.length > 1 && cat.unidad ? `<small>${esc(cat.unidad)}</small>` : '';
    return `<span>${pesos(min)}${unidad}</span>`;
  };

  $('#menu-contenido').innerHTML = D.menu.map((cat) => `
    <section class="categoria" id="cat-${cat.id}" aria-labelledby="titulo-${cat.id}">
      <div class="categoria__cabeza">
        <h3 class="categoria__titulo" id="titulo-${cat.id}">${esc(cat.nombre)}</h3>
        <p class="categoria__chiste">${esc(cat.chiste)}</p>
        <div class="arte" aria-hidden="true">
          <svg class="arte__sello" viewBox="0 0 120 120"><use href="#i-sello"/></svg>
          <svg class="arte__comida" viewBox="0 0 120 120"><use href="#i-${cat.icono}"/></svg>
          <div class="estampa"><svg viewBox="0 0 120 120"><use href="#i-sello"/></svg>${estampa(cat)}</div>
        </div>
      </div>
      <ul class="platillos">
        ${cat.items.map((it) => `
        <li class="platillo${pedido[it.id] ? ' tiene' : ''}" data-platillo="${it.id}">
          <span class="platillo__nombre">${esc(it.nombre)}</span>
          <span class="platillo__puntos" aria-hidden="true"></span>
          <span class="platillo__precio">${pesos(it.precio)}</span>
          ${control(it)}
          ${it.detalle ? `<span class="platillo__detalle">${esc(it.detalle)}</span>` : ''}
        </li>`).join('')}
      </ul>
      ${cat.letraChiquita ? `<p class="letra-chiquita">${esc(cat.letraChiquita)}</p>` : ''}
    </section>`).join('');

  $('#categorias').innerHTML = D.menu.map((cat) => `
    <li><a class="cat" href="#cat-${cat.id}" data-cat="${cat.id}" aria-current="false">
      <svg viewBox="0 0 120 120" aria-hidden="true"><use href="#i-${cat.icono}"/></svg>${esc(cat.nombre)}
    </a></li>`).join('');

  const vuelta = D.menu.map((cat) => {
    const { min, iguales } = precioCategoria(cat);
    return `<span class="liston__item">${esc(cat.nombre)} ${iguales ? '' : 'desde '}${pesos(min)}${ICONO_CHILE}</span>`;
  }).join('');
  $('#liston').innerHTML = vuelta + vuelta;

  /* ---------- Categoría activa en la barra ---------- */

  const listaCats = $('#categorias');
  const enlaces = new Map($$('.cat').map((a) => [a.dataset.cat, a]));
  let activa = null;

  const marcar = (id) => {
    if (activa === id) return;
    activa = id;
    enlaces.forEach((a, k) => a.setAttribute('aria-current', k === id ? 'true' : 'false'));
    const a = enlaces.get(id);
    if (a && listaCats.scrollWidth > listaCats.clientWidth + 4) {
      const izquierda = a.parentElement.offsetLeft - (listaCats.clientWidth - a.offsetWidth) / 2;
      listaCats.scrollTo({ left: Math.max(0, izquierda), behavior: sinMovimiento ? 'auto' : 'smooth' });
    }
  };

  if ('IntersectionObserver' in window) {
    const espia = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => { if (e.isIntersecting) marcar(e.target.id.slice(4)); });
    }, { rootMargin: '-30% 0px -65% 0px' });
    $$('.categoria').forEach((s) => espia.observe(s));

    const vistos = new IntersectionObserver((entradas, obs) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add(e.target.classList.contains('croquis') ? 'dibujado' : 'visto');
        obs.unobserve(e.target);
      });
    }, { threshold: 0.35 });
    if (!sinMovimiento) $$('.categoria').forEach((s) => vistos.observe(s));
    vistos.observe($('.croquis'));
  } else {
    $('.croquis').classList.add('dibujado');
  }

  /* ---------- Avisos ---------- */

  const anuncio = document.createElement('p');
  anuncio.className = 'sr-only';
  anuncio.setAttribute('aria-live', 'polite');
  document.body.append(anuncio);
  const anunciar = (texto) => { anuncio.textContent = ''; requestAnimationFrame(() => { anuncio.textContent = texto; }); };

  let temporizadorAviso;
  const aviso = (texto) => {
    const el = $('#aviso');
    el.textContent = texto;
    el.classList.add('ver');
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => el.classList.remove('ver'), 2800);
  };

  /* ---------- Charola y ventana del pedido ---------- */

  const charola = $('#charola');
  const ventana = $('#pedido');

  const enlaceWhatsApp = () => {
    const lineas = [];
    items.forEach((it, id) => {
      const n = pedido[id];
      if (n) lineas.push(`• ${n} × ${it.pedido}: ${pesos(n * it.precio)}`);
    });
    const texto = `¡Hola! Quiero pedir en Antojitos "El Gody":\n\n${lineas.join('\n')}\n\nTotal: ${pesos(totales().total)}`;
    const numero = String(D.negocio.whatsapp || '').replace(/\D/g, '');
    return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
  };

  const pintarTotales = (animar) => {
    const { piezas, total } = totales();
    const estabaOculta = charola.hidden;
    charola.hidden = piezas === 0;
    $('#charola-n').textContent = piezas;
    const totalEl = $('#charola-total');
    totalEl.textContent = pesos(total);
    if (animar && !estabaOculta && !sinMovimiento) {
      totalEl.classList.remove('salto');
      void totalEl.offsetWidth;
      totalEl.classList.add('salto');
    }
    $('#pedido-total').textContent = pesos(total);
    $('#pedido-whatsapp').href = enlaceWhatsApp();
    ventana.classList.toggle('vacio', piezas === 0);
    $('#pedido-vacio').hidden = piezas !== 0;
  };

  const filaPedido = (it, n) => `
    <li class="pedido__item" data-pedido-item="${it.id}">
      <span class="pedido__nombre">${esc(it.pedido)}</span>
      <span class="pedido__subtotal">${pesos(n * it.precio)}</span>
      <span class="pedido__precio">${pesos(it.precio)} c/u</span>
      ${control(it)}
    </li>`;

  const pintarPedido = () => {
    const filas = [];
    items.forEach((it, id) => { if (pedido[id]) filas.push(filaPedido(it, pedido[id])); });
    $('#pedido-lista').innerHTML = filas.join('');
    pintarTotales(false);
  };

  const actualizar = (id) => {
    const n = pedido[id] || 0;
    $$(`[data-cantidad="${id}"]`).forEach((c) => {
      $('output', c).textContent = n;
      $('output', c).hidden = !n;
      $('.menos', c).hidden = !n;
    });
    const fila = $(`[data-platillo="${id}"]`);
    if (fila) fila.classList.toggle('tiene', n > 0);

    const filaVentana = $(`[data-pedido-item="${id}"]`);
    if (filaVentana) {
      if (n) {
        $('.pedido__subtotal', filaVentana).textContent = pesos(n * items.get(id).precio);
      } else {
        const siguiente = filaVentana.nextElementSibling || filaVentana.previousElementSibling;
        const teniaFoco = filaVentana.contains(document.activeElement);
        filaVentana.remove();
        if (teniaFoco) (siguiente ? $('.mas', siguiente) : $('.pedido__cerrar')).focus();
      }
    }
  };

  document.addEventListener('click', (e) => {
    const boton = e.target.closest('[data-op]');
    if (!boton) return;
    const { id, op } = boton.dataset;
    const antes = pedido[id] || 0;
    const despues = op === 'mas' ? Math.min(antes + 1, 99) : Math.max(antes - 1, 0);
    if (despues === antes) return;
    if (despues) pedido[id] = despues; else delete pedido[id];
    guardarPedido();
    actualizar(id);
    pintarTotales(true);

    if (op === 'mas' && !sinMovimiento) {
      boton.classList.remove('pop');
      void boton.offsetWidth;
      boton.classList.add('pop');
    }
    // Si el botón "−" se escondió al llegar a cero, el foco pasa al "+" de la misma fila.
    if (op === 'menos' && !despues && boton.isConnected && boton.hidden) {
      const mas = boton.parentElement.querySelector('.mas');
      if (mas) mas.focus();
    }
    const { total } = totales();
    anunciar(`${items.get(id).pedido}: ${despues} en tu pedido. Total ${pesos(total)}.`);
  });

  $('#abrir-pedido').addEventListener('click', () => {
    pintarPedido();
    if (typeof ventana.showModal === 'function') ventana.showModal();
    else ventana.setAttribute('open', '');
  });

  ventana.addEventListener('click', (e) => {
    if (e.target !== ventana) return;
    const r = ventana.getBoundingClientRect();
    const fuera = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    if (fuera) ventana.close();
  });

  const vaciar = $('#pedido-vaciar');
  let confirmando = null;
  vaciar.addEventListener('click', () => {
    if (!confirmando) {
      vaciar.textContent = 'Toca otra vez para vaciar';
      confirmando = setTimeout(() => { vaciar.textContent = 'Vaciar pedido'; confirmando = null; }, 3000);
      return;
    }
    clearTimeout(confirmando);
    confirmando = null;
    vaciar.textContent = 'Vaciar pedido';
    const ids = Object.keys(pedido);
    pedido = {};
    guardarPedido();
    ids.forEach(actualizar);
    pintarPedido();
    ventana.close();
    aviso('Listo, tu pedido quedó vacío.');
  });

  pintarTotales(false);

  /* ---------- Horario: "Abierto ahorita" ---------- */

  const aMinutos = (hhmm) => {
    const [h, m] = String(hhmm).split(':').map(Number);
    return h * 60 + (m || 0);
  };
  const hora = (minutos) => {
    const d = new Date();
    d.setHours(Math.floor(minutos / 60) % 24, minutos % 60, 0, 0);
    const texto = d.toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit' });
    return (d.getHours() % 12 === 1 ? 'a la ' : 'a las ') + texto;
  };
  const listaDias = (dias) => {
    const orden = [1, 2, 3, 4, 5, 6, 0].filter((d) => dias.includes(d)).map((d) => DIAS[d]);
    const texto = orden.length > 1 ? `${orden.slice(0, -1).join(', ')} y ${orden[orden.length - 1]}` : orden[0] || '';
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  };

  const pintarHorario = () => {
    const horario = D.negocio.horario || [];
    const estado = $('#estado');
    const texto = $('#estado-texto');
    $('#dato-pagos').textContent = D.negocio.pagos;
    if (!horario.length) {
      texto.textContent = D.negocio.dias;
      return;
    }

    $('#dato-horario').innerHTML = horario
      .map((r) => `${esc(listaDias(r.dias))}<br><small>${esc(hora(aMinutos(r.abre)).replace(/^a las? /, ''))} a ${esc(hora(aMinutos(r.cierra)).replace(/^a las? /, ''))}</small>`)
      .join('<br>');

    const ahora = new Date();
    const hoy = ahora.getDay();
    const ayer = (hoy + 6) % 7;
    const minuto = ahora.getHours() * 60 + ahora.getMinutes();

    for (const r of horario) {
      const abre = aMinutos(r.abre);
      const cierra = aMinutos(r.cierra);
      const cruzaMedianoche = cierra <= abre;
      const abiertoHoy = r.dias.includes(hoy) && minuto >= abre && (cruzaMedianoche || minuto < cierra);
      const abiertoDesdeAyer = cruzaMedianoche && r.dias.includes(ayer) && minuto < cierra;
      if (abiertoHoy || abiertoDesdeAyer) {
        estado.dataset.abierto = 'si';
        texto.textContent = `Abierto ahorita, cerramos ${hora(cierra)}`;
        return;
      }
    }

    for (let i = 0; i < 8; i += 1) {
      const dia = (hoy + i) % 7;
      const aperturas = horario
        .filter((r) => r.dias.includes(dia))
        .map((r) => aMinutos(r.abre))
        .filter((a) => i > 0 || a > minuto)
        .sort((x, y) => x - y);
      if (aperturas.length) {
        estado.dataset.abierto = 'no';
        const cuando = i === 0 ? 'Hoy abrimos' : i === 1 ? 'Mañana abrimos' : `Abrimos el ${DIAS[dia]}`;
        texto.textContent = `${cuando} ${hora(aperturas[0])}`;
        return;
      }
    }
    texto.textContent = D.negocio.dias;
  };
  pintarHorario();

  /* ---------- Compartir ---------- */

  $('#compartir').addEventListener('click', async () => {
    const canonica = $('link[rel="canonical"]');
    const url = canonica ? canonica.href : location.href.split('#')[0];
    const datos = { title: 'Antojitos “El Gody”', text: 'Mira el menú y los precios de Antojitos “El Gody” en Téllez:', url };
    if (navigator.share) {
      try { await navigator.share(datos); } catch (e) { /* el usuario canceló */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      aviso('Link copiado. Pégalo en WhatsApp o Facebook.');
    } catch (e) {
      aviso(url);
    }
  });
})();
