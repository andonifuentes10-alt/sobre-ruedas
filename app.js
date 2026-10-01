/* ============================================================
   SOBRE RUEDAS — Landing page
   Identificación → catálogo → selección → presupuesto → llamada
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Constantes del proyecto ---------- */
  var PHONE_DISPLAY = "908 368 294";
  var PHONE_TEL = "tel:908368294";
  var PENDING = "[INFORMACIÓN PENDIENTE]";
  var SESSION_KEY = "sr_identificacion";
  var SELECTED_KEY = "sr_vehiculo_seleccionado";

  /* ------------------------------------------------------------
     CATÁLOGO DE VEHÍCULOS
     Añade vehículos reales copiando una de las fichas de ejemplo
     y reemplazando null por el dato real. Todo lo que siga en null
     se mostrará como [INFORMACIÓN PENDIENTE] (nunca se inventan datos).

     Ejemplo de vehículo real:
     {
       id: "v-audi-a3",
       marca: "Audi",
       modelo: "A3",
       anio: 2021,
       combustible: "Gasolina",
       cambio: "Automático",
       km: 68000,
       potencia: "150 CV",
       tipo: "Turismo",
       precio: null,
       estado: null,
       imagen: "img/vehiculos/audi-a3.webp",
       alt: "Audi A3 en el concesionario Sobre Ruedas"
     }
  ------------------------------------------------------------ */
  var vehicles = [
    {
      id: "v-01",
      marca: "Audi",
      modelo: "A3 Sportback",
      anio: 2021,
      combustible: "Gasolina",
      cambio: "Automático",
      km: 45000,
      potencia: "150 CV",
      tipo: "Compacto",
      precio: 28500,
      estado: "Disponible",
      imagen: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80",
      alt: "Audi A3 Sportback 2021 en el concesionario Sobre Ruedas"
    },
    {
      id: "v-02",
      marca: "BMW",
      modelo: "Serie 3",
      anio: 2020,
      combustible: "Diésel",
      cambio: "Automático",
      km: 62000,
      potencia: "190 CV",
      tipo: "Berlina",
      precio: 32900,
      estado: "Disponible",
      imagen: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
      alt: "BMW Serie 3 2020 en el concesionario Sobre Ruedas"
    },
    {
      id: "v-03",
      marca: "Mercedes-Benz",
      modelo: "Clase C",
      anio: 2022,
      combustible: "Híbrido",
      cambio: "Automático",
      km: 28000,
      potencia: "204 CV",
      tipo: "Berlina",
      precio: 41500,
      estado: "Disponible",
      imagen: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80",
      alt: "Mercedes-Benz Clase C 2022 en el concesionario Sobre Ruedas"
    },
    {
      id: "v-04",
      marca: "Volkswagen",
      modelo: "Golf",
      anio: 2019,
      combustible: "Gasolina",
      cambio: "Manual",
      km: 78000,
      potencia: "130 CV",
      tipo: "Compacto",
      precio: 19800,
      estado: "Disponible",
      imagen: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
      alt: "Volkswagen Golf 2019 en el concesionario Sobre Ruedas"
    },
    {
      id: "v-05",
      marca: "Toyota",
      modelo: "RAV4",
      anio: 2021,
      combustible: "Híbrido",
      cambio: "Automático",
      km: 35000,
      potencia: "218 CV",
      tipo: "SUV",
      precio: 36900,
      estado: "Disponible",
      imagen: "https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&w=800&q=80",
      alt: "Toyota RAV4 2021 en el concesionario Sobre Ruedas"
    },
    {
      id: "v-06",
      marca: "Ford",
      modelo: "Focus",
      anio: 2020,
      combustible: "Diésel",
      cambio: "Manual",
      km: 55000,
      potencia: "120 CV",
      tipo: "Compacto",
      precio: 21500,
      estado: "Reservado",
      imagen: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
      alt: "Ford Focus 2020 en el concesionario Sobre Ruedas"
    }
  ];

  /* ---------- Utilidades ---------- */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  function displayName(v) {
    if (v.marca && v.modelo) return v.marca + " " + v.modelo;
    if (v.marca) return v.marca;
    if (v.modelo) return v.modelo;
    var n = v.id.split("-").pop();
    return "Vehículo " + (n.length < 2 ? "0" + n : n);
  }

  function val(v) {
    return (v === null || v === undefined || v === "") ? null : String(v);
  }

  function specValue(v, format) {
    var s = val(v);
    if (!s) return { text: PENDING, pending: true };
    return { text: format ? format(s) : s, pending: false };
  }

  function isMobile() {
    try {
      return window.matchMedia("(max-width: 760px)").matches;
    } catch (e) {
      return window.innerWidth <= 760;
    }
  }

  /* ---------- Analítica (preparada, sin servicios externos) ---------- */
  window.dataLayer = window.dataLayer || [];
  function track(event, params) {
    var payload = Object.assign({ event: event, ts: Date.now() }, params || {});
    window.dataLayer.push(payload);
    if (window.console && console.debug) console.debug("[track]", event, params || {});
  }

  /* ---------- Estado ---------- */
  var state = {
    selectedVehicle: null,
    filters: { marca: "", combustible: "", cambio: "", anio: "", tipo: "" },
    gateStarted: false
  };

  try {
    var stored = sessionStorage.getItem(SELECTED_KEY);
    if (stored) state.selectedVehicle = vehicles.filter(function (v) { return v.id === stored; })[0] || null;
  } catch (e) { /* almacenamiento no disponible */ }

  /* ============================================================
     1. PANTALLA DE IDENTIFICACIÓN
     ============================================================ */
  var gate = $("#gate");
  var gateForm = $("#gate-form");
  var gateSubmit = $("#gate-submit");
  var gateFeedback = $("#gate-feedback");
  var site = $("#site");

  var validators = {
    nombre: function (v) { return v.trim().length >= 2; },
    apellido: function (v) { return v.trim().length >= 2; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim()); },
    telefono: function (v) { return (v.replace(/[\s\-().+]/g, "").match(/\d/g) || []).length >= 9; }
  };

  function validateField(input) {
    var name = input.name;
    var wrap = input.closest(".field");
    var error = $("#" + input.id + "-error");
    var ok;

    if (input.type === "checkbox") ok = input.checked;
    else ok = validators[name] ? validators[name](input.value) : input.value.trim() !== "";

    if (wrap) {
      wrap.classList.toggle("is-valid", ok);
      wrap.classList.toggle("is-invalid", !ok && input.value !== "");
    }
    if (error) error.hidden = ok || (input.type !== "checkbox" && input.value === "");
    input.setAttribute("aria-invalid", ok ? "false" : "true");
    return ok;
  }

  function formIsValid() {
    return $$("input", gateForm).every(function (input) {
      return input.type === "checkbox" ? input.checked : validators[input.name](input.value);
    });
  }

  function refreshSubmit() {
    gateSubmit.disabled = !formIsValid();
  }

  if (gateForm) {
    $$("input", gateForm).forEach(function (input) {
      input.addEventListener("input", function () {
        if (!state.gateStarted) {
          state.gateStarted = true;
          track("identification_form_start");
        }
        validateField(input);
        refreshSubmit();
      });
      input.addEventListener("blur", function () { validateField(input); });
    });

    gateForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var allOk = $$("input", gateForm).map(validateField).every(Boolean);
      if (!allOk) {
        gateFeedback.textContent = "Revisa los campos marcados antes de continuar.";
        gateFeedback.className = "gate-form__feedback is-error";
        var firstInvalid = $(".field.is-invalid input", gateForm) || $(".field.is-invalid input[type=checkbox]", gateForm) || $("input", gateForm);
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      track("identification_form_submit");

      gateSubmit.classList.add("is-loading");
      gateSubmit.disabled = true;
      $(".btn__label", gateSubmit).textContent = "Accediendo…";
      gateFeedback.textContent = "";
      gateFeedback.className = "gate-form__feedback";

      // Punto de integración futuro con CRM / base de datos de leads.
      // Los datos NUNCA se exponen públicamente ni se envían a servicios no informados.
      setTimeout(function () {
        try {
          sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ts: Date.now() }));
        } catch (err) { /* sin sessionStorage */ }

        track("identification_form_success");
        gateFeedback.textContent = "¡Identificación completada! Preparando los vehículos…";
        gateFeedback.className = "gate-form__feedback is-success";

        setTimeout(unlockSite, 550);
      }, 700);
    });
  }

  function unlockSite() {
    document.body.classList.remove("is-locked");
    document.body.classList.add("is-unlocked");
    gate.classList.add("is-hidden");
    site.removeAttribute("aria-hidden");
    site.removeAttribute("inert");
    gate.setAttribute("aria-hidden", "true");

    renderVehicles();
    buildFilters();
    updateQuoteSection();
    setupReveal();
    track("page_view", { screen: "landing" });

    setTimeout(function () {
      gate.hidden = true;
      var h1 = $(".hero__title");
      if (h1) {
        h1.setAttribute("tabindex", "-1");
        h1.focus({ preventScroll: true });
      }
    }, 600);
  }

  // Si ya se identificó en esta sesión, no volver a pedir los datos
  try {
    if (sessionStorage.getItem(SESSION_KEY)) {
      gate.hidden = true;
      gate.setAttribute("aria-hidden", "true");
      document.body.classList.remove("is-locked");
      document.body.classList.add("is-unlocked");
      site.removeAttribute("aria-hidden");
      site.removeAttribute("inert");
      renderVehicles();
      buildFilters();
      updateQuoteSection();
      setupReveal();
      track("page_view", { screen: "landing" });
    } else {
      site.setAttribute("inert", "");
      setTimeout(function () { var f = $("#nombre"); if (f) f.focus(); }, 150);
    }
  } catch (e) { site.setAttribute("inert", ""); }

  /* ============================================================
     2. CATÁLOGO DE VEHÍCULOS
     ============================================================ */
  var grid = $("#vehicle-grid");
  var filtersCount = $("#filters-count");

  var SPECS = [
    { key: "anio", label: "Año" },
    { key: "combustible", label: "Combustible" },
    { key: "cambio", label: "Cambio" },
    { key: "km", label: "Kilometraje", format: function (s) { return s + " km"; } },
    { key: "potencia", label: "Potencia" },
    { key: "precio", label: "Precio", format: function (s) { return s ? Number(s).toLocaleString("es-ES") + " €" : PENDING; } }
  ];

  var CAR_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17h14M6.5 17l-1.2-4.6A2.5 2.5 0 0 1 7.7 9.5h8.6a2.5 2.5 0 0 1 2.4 2.9L17.5 17"/><circle cx="8" cy="17.6" r="1.6"/><circle cx="16" cy="17.6" r="1.6"/><path d="M9.5 12.5h5"/></svg>';

  function matchesFilters(v) {
    return Object.keys(state.filters).every(function (k) {
      var want = state.filters[k];
      if (!want) return true;
      return val(v[k]) === want;
    });
  }

  function vehicleCard(v) {
    var name = displayName(v);
    var specs = SPECS.map(function (s) {
      var value = specValue(v[s.key], s.format);
      return (
        '<div class="spec">' +
          '<span class="spec__label">' + s.label + "</span>" +
          '<span class="spec__value' + (value.pending ? " is-pending" : "") + '">' + value.text + "</span>" +
        "</div>"
      );
    }).join("");

    var media = v.imagen
      ? '<img src="' + v.imagen + '" alt="' + (v.alt || name) + '" width="640" height="400" loading="lazy" decoding="async" />'
      : '<div class="vehicle__placeholder">' + CAR_SVG + "<span>Imagen " + PENDING + "</span></div>";

    var isSelected = state.selectedVehicle && state.selectedVehicle.id === v.id;

    var art = document.createElement("article");
    art.className = "vehicle" + (isSelected ? " is-selected" : "");
    art.id = "ficha-" + v.id;
    art.innerHTML =
      '<div class="vehicle__media">' + media +
        '<span class="vehicle__badge">' + (val(v.estado) || "Disponibilidad " + PENDING) + "</span>" +
      "</div>" +
      '<div class="vehicle__body">' +
        "<div>" +
          '<p class="vehicle__brand">' + (val(v.marca) || "Marca " + PENDING) + "</p>" +
          '<h3 class="vehicle__name">' + name + "</h3>" +
        "</div>" +
        '<div class="vehicle__specs">' + specs + "</div>" +
        '<div class="vehicle__foot">' +
          (isSelected ? '<p class="vehicle__selected-flag">✓ Vehículo seleccionado</p>' : "") +
          '<button class="btn btn--primary btn--block" type="button" data-vehicle="' + v.id + '" data-cta="vehicle">Solicitar presupuesto</button>' +
        "</div>" +
      "</div>";
    return art;
  }

  function renderVehicles() {
    if (!grid) return;
    var visible = vehicles.filter(matchesFilters);

    grid.innerHTML = "";
    visible.forEach(function (v) { grid.appendChild(vehicleCard(v)); });

    if (filtersCount) {
      filtersCount.textContent = visible.length === 0
        ? "Ningún vehículo coincide con los filtros."
        : visible.length + (visible.length === 1 ? " vehículo" : " vehículos") + " en el catálogo.";
    }

    // Evento vehicle_view cuando la ficha entra en pantalla
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !entry.target.hasAttribute("data-viewed")) {
            entry.target.setAttribute("data-viewed", "1");
            track("vehicle_view", { vehicle_id: entry.target.getAttribute("data-vehicle-id") });
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      $$(".vehicle", grid).forEach(function (card, i) {
        card.setAttribute("data-vehicle-id", visible[i] ? visible[i].id : "");
        io.observe(card);
      });
    }
  }

  /* ---------- Filtros ---------- */
  var FILTER_FIELDS = [
    { key: "marca", id: "f-marca", all: "Todas" },
    { key: "combustible", id: "f-combustible", all: "Todos" },
    { key: "cambio", id: "f-cambio", all: "Todos" },
    { key: "anio", id: "f-anio", all: "Todos" },
    { key: "tipo", id: "f-tipo", all: "Todos" }
  ];

  function buildFilters() {
    FILTER_FIELDS.forEach(function (f) {
      var select = document.getElementById(f.id);
      if (!select) return;

      var values = vehicles
        .map(function (v) { return val(v[f.key]); })
        .filter(function (v, i, arr) { return v && arr.indexOf(v) === i; })
        .sort();

      // Solo se muestran opciones con datos reales
      var wrapper = select.closest(".field");
      if (values.length === 0) {
        select.innerHTML = '<option value="">Sin datos ' + PENDING + "</option>";
        select.disabled = true;
        if (wrapper) wrapper.hidden = true;
        return;
      }

      select.disabled = false;
      if (wrapper) wrapper.hidden = false;
      select.innerHTML =
        '<option value="">' + f.all + "</option>" +
        values.map(function (v) { return '<option value="' + v + '">' + v + "</option>"; }).join("");
    });

    // Los filtros solo se muestran cuando el catálogo tiene datos reales
    var form = document.getElementById("filters");
    if (form) {
      var anyData = $$("select", form).some(function (s) { return !s.disabled; });
      form.hidden = !anyData;
    }
  }

  var filtersForm = $("#filters");
  if (filtersForm) {
    filtersForm.addEventListener("change", function (e) {
      var key = e.target.getAttribute && e.target.getAttribute("data-filter");
      if (!key) return;
      state.filters[key] = e.target.value;
      renderVehicles();
    });
    $("#filters-clear").addEventListener("click", function () {
      Object.keys(state.filters).forEach(function (k) { state.filters[k] = ""; });
      $$("select", filtersForm).forEach(function (s) { s.value = ""; });
      renderVehicles();
      showToast("Filtros limpiados");
    });
  }

  /* ============================================================
     3. SELECCIÓN DE VEHÍCULO Y PRESUPUESTO
     ============================================================ */
  var quoteSelection = $("#quote-selection");

  function selectVehicle(id, origin) {
    var v = vehicles.filter(function (x) { return x.id === id; })[0];
    if (!v) return;

    state.selectedVehicle = v;
    try { sessionStorage.setItem(SELECTED_KEY, v.id); } catch (e) {}

    track("vehicle_select", { vehicle_id: v.id, vehicle_name: displayName(v), origin: origin || "grid" });
    renderVehicles();
    updateQuoteSection();
    openQuoteModal(origin);
  }

  function updateQuoteSection() {
    if (!quoteSelection) return;
    if (state.selectedVehicle) {
      quoteSelection.hidden = false;
      quoteSelection.textContent = "Vehículo seleccionado: " + displayName(state.selectedVehicle);
    } else {
      quoteSelection.hidden = true;
    }
  }

  /* ---------- Modales ---------- */
  var lastFocused = null;

  function openModal(modal) {
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    var dialog = $(".modal__dialog", modal);
    if (dialog) dialog.focus();
  }

  function closeModal(modal) {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  $$("[data-close-modal]").forEach(function (el) {
    el.addEventListener("click", function () {
      var modal = el.closest(".modal");
      if (modal) closeModal(modal);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      $$(".modal").forEach(function (m) { if (!m.hidden) closeModal(m); });
    }
  });

  var quoteModal = $("#quote-modal");

  function openQuoteModal(origin) {
    var nameEl = $("#modal-vehicle-name");
    var specEl = $("#modal-vehicle-spec");
    var mediaEl = $("#modal-vehicle-media");
    var box = $("#modal-vehicle");
    var title = $("#quote-modal-title");

    if (state.selectedVehicle) {
      var v = state.selectedVehicle;
      var name = displayName(v);
      box.hidden = false;
      title.textContent = "Presupuesto para " + name;
      nameEl.textContent = name;

      var bits = [];
      if (val(v.anio)) bits.push(v.anio);
      if (val(v.combustible)) bits.push(v.combustible);
      if (val(v.precio)) bits.push("Precio: " + v.precio);
      specEl.textContent = bits.length ? bits.join(" · ") : "Datos del vehículo: " + PENDING;

      mediaEl.innerHTML = v.imagen
        ? '<img src="' + v.imagen + '" alt="' + (v.alt || name) + '" />'
        : CAR_SVG;
    } else {
      box.hidden = true;
      title.textContent = "Solicita tu presupuesto";
    }

    openModal(quoteModal);

    var hint = $("#modal-hint");
    if (hint) {
      hint.textContent = isMobile()
        ? "Al pulsar “Llamar ahora” se abrirá la aplicación de llamadas de tu dispositivo."
        : "En escritorio, contacta con nosotros en el " + PHONE_DISPLAY + ".";
    }

    track("quote_modal_open", { origin: origin || "unknown", vehicle: state.selectedVehicle ? displayName(state.selectedVehicle) : null });
  }

  // CTA "Solicitar presupuesto" / "Elegir vehículo"
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-action='quote']");
    if (btn) {
      e.preventDefault();
      openQuoteModal(btn.getAttribute("data-cta") || "button");
      return;
    }

    var vBtn = e.target.closest("[data-vehicle]");
    if (vBtn) {
      selectVehicle(vBtn.getAttribute("data-vehicle"), vBtn.getAttribute("data-cta") || "grid");
      return;
    }

    var legalBtn = e.target.closest("[data-legal]");
    if (legalBtn) {
      openLegal(legalBtn.getAttribute("data-legal"));
    }
  });

  // CTA genéricos de navegación (Header, hero, intermedios, final)
  document.addEventListener("click", function (e) {
    var cta = e.target.closest("[data-cta]");
    if (!cta) return;
    var name = cta.getAttribute("data-cta");
    var map = {
      "header": "cta_header_click",
      "hero": "cta_hero_click",
      "hero-secondary": "cta_hero_secondary_click",
      "vehicle": "cta_vehicle_click",
      "vehicles-head": "cta_vehicles_click",
      "middle": "cta_middle_click",
      "quote-section": "cta_quote_click",
      "final": "cta_final_click",
      "final-call": "cta_final_click",
      "mobile-menu": "cta_header_click",
      "mobilebar": "cta_mobilebar_click",
      "modal-call": "phone_click"
    };
    track(map[name] || "cta_click", { cta: name, vehicle: state.selectedVehicle ? displayName(state.selectedVehicle) : null });
  });

  // Todos los enlaces telefónicos
  document.addEventListener("click", function (e) {
    var link = e.target.closest("a[href='" + PHONE_TEL + "']");
    if (!link) return;
    track("phone_click", {
      source: link.getAttribute("data-phone") || "unknown",
      vehicle: state.selectedVehicle ? displayName(state.selectedVehicle) : null
    });
    showToast("Llamando al " + PHONE_DISPLAY);
  });

  // Copiar número
  var copyBtn = $("#copy-phone");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var done = function () { showToast("Número copiado: " + PHONE_DISPLAY); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(PHONE_DISPLAY).then(done).catch(fallbackCopy);
      } else {
        fallbackCopy();
      }
      function fallbackCopy() {
        var ta = document.createElement("textarea");
        ta.value = PHONE_DISPLAY;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); done(); } catch (err) { showToast("Copia el número: " + PHONE_DISPLAY); }
        document.body.removeChild(ta);
      }
    });
  }

  /* ---------- Modal legal ---------- */
  var LEGAL = {
    privacidad: {
      title: "Política de Privacidad",
      body:
        "<p>El formulario de identificación de Sobre Ruedas recopila tu nombre, apellido, email y número de teléfono con la única finalidad de atender tu solicitud de presupuesto y contactar contigo.</p>" +
        "<p>Tus datos no se exponen públicamente, no se usan para finalidades no informadas y no se comparten con terceros salvo obligación legal o para gestionar la solicitud que tú has solicitado.</p>" +
        "<h3>Responsable y datos registrales</h3><p>[DATOS EMPRESARIALES PENDIENTES]</p>" +
        "<h3>Derechos</h3><p>Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a [DATOS EMPRESARIALES PENDIENTES] o llamando al " + PHONE_DISPLAY + ".</p>" +
        "<p><em>Documento pendiente de revisión jurídica: [INFORMACIÓN PENDIENTE]</em></p>"
    },
    cookies: {
      title: "Política de cookies",
      body:
        "<p>Esta landing utiliza únicamente almacenamiento técnico local (sessionStorage) para recordar que ya te has identificado durante la misma sesión y el vehículo que estabas consultando.</p>" +
        "<p>No se instalan cookies publicitarias ni de terceros sin tu consentimiento.</p>" +
        "<p><em>Detalle de cookies pendiente: [INFORMACIÓN PENDIENTE]</em></p>"
    },
    condiciones: {
      title: "Condiciones legales",
      body:
        "<p>Los vehículos mostrados en Sobre Ruedas se ofrecen sujetos a disponibilidad y a la información facilitada en cada ficha.</p>" +
        "<p>El presupuesto es personalizado según el vehículo seleccionado. Consulta las condiciones exactas con Sobre Ruedas en el " + PHONE_DISPLAY + ".</p>" +
        "<p><em>Condiciones completas pendientes: [INFORMACIÓN PENDIENTE]</em></p>"
    }
  };

  function openLegal(key) {
    var data = LEGAL[key] || LEGAL.privacidad;
    $("#legal-modal-title").textContent = data.title;
    $("#legal-body").innerHTML = data.body;
    openModal($("#legal-modal"));
  }

  /* ---------- Toast ---------- */
  var toast = $("#toast");
  var toastTimer = null;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 2600);
  }

  /* ============================================================
     4. HEADER, MENÚ MÓVIL, SCROLL
     ============================================================ */
  var burger = $("#burger");
  var mobileMenu = $("#mobile-menu");

  if (burger && mobileMenu) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open));
      burger.setAttribute("aria-label", open ? "Abrir menú de navegación" : "Cerrar menú de navegación");
      mobileMenu.hidden = open;
    });

    mobileMenu.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        burger.setAttribute("aria-expanded", "false");
        mobileMenu.hidden = true;
      }
    });
  }

  // Scroll 50% / 90%
  var fired = { s50: false, s90: false };
  window.addEventListener("scroll", function () {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    var pct = (window.scrollY / max) * 100;
    if (!fired.s50 && pct >= 50) { fired.s50 = true; track("scroll_50"); }
    if (!fired.s90 && pct >= 90) { fired.s90 = true; track("scroll_90"); }
  }, { passive: true });

  // Scroll reveal discreto (respeta prefers-reduced-motion)
  var reduceMotion = false;
  try { reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

  function setupReveal() {
    if (!("IntersectionObserver" in window) || reduceMotion) return;
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.style.opacity = "1";
          en.target.style.transform = "none";
          revealIO.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    $$(".benefit, .step, .trust").forEach(function (el) {
      if (el.style.opacity === "1") return;
      el.style.opacity = "0";
      el.style.transform = "translateY(16px)";
      el.style.transition = "opacity .5s var(--ease), transform .5s var(--ease)";
      revealIO.observe(el);
    });
  }

  /* ---------- Año del copyright ---------- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Anclas suaves del header ---------- */
  $$('a[href^="#"]').forEach(function (a) {
    if (a.classList.contains("skip-link")) return;
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var reduce = false;
      try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (err) {}
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", id);
    });
  });
})();
