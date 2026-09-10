/* =========================================================
   STARTMILGRAU — SCRIPT.JS
   Arquitetura:
   1) CONFIG centraliza dados editáveis.
   2) Catálogos separam Carros e Motos.
   3) STATE armazena o atendimento atual.
   4) O configurador renderiza e valida as etapas.
   5) localStorage preserva o progresso.
   6) A mensagem final é montada dinamicamente e enviada ao WhatsApp.
   ========================================================= */

"use strict";

/* =========================================================
   CONFIGURAÇÕES CENTRAIS
   Troque somente os valores abaixo quando tiver os dados oficiais.
   O WhatsApp deve usar DDI + DDD + número, apenas dígitos.
   Exemplo: 5541999999999
   ========================================================= */
const CONFIG = {
  companyName: "STARTMILGRAU",
  whatsapp: "5541999999999",
  instagram: "",
  address: "",
  openingHours: ""
};

const STORAGE_KEY = "startmilgrau_booking_v2";
const TOTAL_STEPS = 7;

/* =========================================================
   CATÁLOGO DE SERVIÇOS
   Nenhum serviço possui valor exibido.
   Os campos price / startingPrice / duration permanecem null
   para facilitar uma futura evolução sem mudar a estrutura.
   ========================================================= */
const SERVICE_CATALOG = {
  car: [
    {
      id: "car-lavagem",
      title: "Lavagem",
      icon: "🧼",
      description: "Cuidados de manutenção, limpeza e detalhamento.",
      services: [
        service("lavagem-simples", "Lavagem simples"),
        service("lavagem-detalhada", "Lavagem detalhada"),
        service("lavagem-tecnica", "Lavagem técnica"),
        service("lavagem-externa", "Lavagem externa"),
        service("lavagem-interna", "Lavagem interna"),
        service("lavagem-completa", "Lavagem completa"),
        service("lavagem-manutencao", "Lavagem de manutenção")
      ]
    },
    {
      id: "car-interna",
      title: "Limpeza interna",
      icon: "🪑",
      description: "Limpeza profunda e acabamento interno.",
      services: [
        service("aspiracao", "Aspiração"),
        service("limpeza-painel", "Limpeza de painel"),
        service("limpeza-detalhada-interna", "Limpeza detalhada interna"),
        service("limpeza-plasticos-internos", "Limpeza de plásticos"),
        service("limpeza-carpetes", "Limpeza de carpetes"),
        service("limpeza-bancos", "Limpeza de bancos"),
        service("higienizacao-interna", "Higienização interna"),
        service("higienizacao-teto", "Higienização de teto"),
        service("higienizacao-porta-malas", "Higienização de porta-malas"),
        service("remocao-odores", "Remoção de odores")
      ]
    },
    {
      id: "car-couro",
      title: "Bancos e couro",
      icon: "🧴",
      description: "Limpeza, hidratação e proteção.",
      services: [
        service("limpeza-bancos-couro", "Limpeza de bancos"),
        service("higienizacao-bancos", "Higienização de bancos"),
        service("limpeza-couro", "Limpeza de couro"),
        service("hidratacao-couro", "Hidratação de couro"),
        service("protecao-couro", "Proteção de couro")
      ]
    },
    {
      id: "car-pintura",
      title: "Pintura e proteção",
      icon: "💎",
      description: "Preparação, proteção e acabamento da pintura.",
      services: [
        service("descontaminacao-pintura", "Descontaminação de pintura"),
        service("clay-bar", "Clay bar"),
        service("preparacao-pintura", "Preparação da pintura"),
        service("cera-premium", "Cera premium"),
        service("selante-sintetico", "Selante sintético"),
        service("protecao-pintura", "Proteção de pintura"),
        service("cristalizacao", "Cristalização"),
        service("vitrificacao", "Vitrificação")
      ]
    },
    {
      id: "car-polimento",
      title: "Polimento",
      icon: "✨",
      description: "Correção e recuperação de brilho, sempre conforme avaliação.",
      services: [
        service("polimento-comercial", "Polimento comercial", "", ["polishing"]),
        service("polimento-tecnico", "Polimento técnico", "", ["polishing"]),
        service("polimento-uma-etapa", "Polimento de uma etapa", "", ["polishing"]),
        service("polimento-duas-etapas", "Polimento de duas etapas", "", ["polishing"]),
        service("polimento-multiplas-etapas", "Polimento de múltiplas etapas", "", ["polishing"]),
        service("correcao-pintura", "Correção de pintura", "", ["polishing"]),
        service("remocao-marcas-superficiais", "Remoção de marcas superficiais", "", ["polishing"]),
        service("reducao-riscos", "Redução de riscos", "", ["polishing"]),
        service("remocao-hologramas", "Remoção de hologramas", "", ["polishing"]),
        service("recuperacao-brilho", "Recuperação de brilho", "", ["polishing"]),
        service("refino", "Refino", "", ["polishing"]),
        service("lustro", "Lustro", "", ["polishing"]),
        service("polimento-personalizado", "Polimento personalizado", "Definido conforme a condição real da pintura.", ["polishing"])
      ]
    },
    {
      id: "car-vidros",
      title: "Vidros",
      icon: "🪟",
      description: "Limpeza, descontaminação e proteção.",
      services: [
        service("limpeza-tecnica-vidros", "Limpeza técnica de vidros"),
        service("descontaminacao-vidros", "Descontaminação de vidros"),
        service("cristalizacao-parabrisa", "Cristalização de para-brisa"),
        service("protecao-vidros", "Proteção de vidros"),
        service("tratamento-hidrofobico", "Tratamento hidrofóbico")
      ]
    },
    {
      id: "car-farois",
      title: "Faróis",
      icon: "💡",
      description: "Recuperação visual e proteção.",
      services: [
        service("polimento-farois", "Polimento de faróis"),
        service("recuperacao-farois", "Recuperação de faróis"),
        service("polimento-protecao-farois", "Polimento + proteção"),
        service("revitalizacao-farois", "Revitalização de faróis")
      ]
    },
    {
      id: "car-rodas",
      title: "Rodas e pneus",
      icon: "🛞",
      description: "Limpeza e acabamento detalhado.",
      services: [
        service("limpeza-detalhada-rodas", "Limpeza detalhada de rodas"),
        service("descontaminacao-rodas", "Descontaminação de rodas"),
        service("limpeza-caixas-roda", "Limpeza de caixas de roda"),
        service("limpeza-pneus", "Limpeza de pneus"),
        service("acabamento-pneus", "Pretinho / acabamento de pneus"),
        service("protecao-rodas", "Proteção de rodas")
      ]
    },
    {
      id: "car-plasticos",
      title: "Plásticos",
      icon: "◼️",
      description: "Limpeza, revitalização e proteção.",
      services: [
        service("limpeza-plasticos", "Limpeza de plásticos"),
        service("revitalizacao-plasticos-internos", "Revitalização de plásticos internos"),
        service("revitalizacao-plasticos-externos", "Revitalização de plásticos externos"),
        service("protecao-plasticos", "Proteção de plásticos")
      ]
    },
    {
      id: "car-motor",
      title: "Motor",
      icon: "⚙️",
      description: "Cuidados estéticos com o cofre do motor.",
      services: [
        service("limpeza-cofre-motor", "Limpeza técnica do cofre do motor"),
        service("detalhamento-motor", "Detalhamento do motor"),
        service("protecao-plasticos-cofre", "Proteção de plásticos do cofre")
      ]
    },
    {
      id: "car-extras",
      title: "Extras",
      icon: "➕",
      description: "Cuidados complementares.",
      services: [
        service("remocao-chuva-acida", "Remoção de chuva ácida"),
        service("limpeza-emblemas", "Limpeza de emblemas"),
        service("limpeza-cantos-frestas", "Limpeza de cantos e frestas"),
        service("limpeza-detalhada-portas", "Limpeza detalhada de portas"),
        service("limpeza-porta-malas", "Limpeza de porta-malas"),
        service("aromatizacao", "Aromatização"),
        service("outros-servicos-carro", "Outros serviços")
      ]
    }
  ],

  motorcycle: [
    {
      id: "moto-lavagem",
      title: "Lavagem de motos",
      icon: "🏍️",
      description: "Limpeza da moto com atenção às áreas de difícil acesso.",
      services: [
        service("moto-lavagem-simples", "Lavagem simples"),
        service("moto-lavagem-detalhada", "Lavagem detalhada"),
        service("moto-lavagem-tecnica", "Lavagem técnica"),
        service("moto-lavagem-manutencao", "Lavagem de manutenção"),
        service("moto-limpeza-frestas", "Limpeza de cantos e frestas")
      ]
    },
    {
      id: "moto-pintura",
      title: "Pintura e carenagens",
      icon: "✨",
      description: "Cuidados estéticos para tanque, carenagens e peças pintadas.",
      services: [
        service("moto-descontaminacao-pintura", "Descontaminação da pintura"),
        service("moto-cera-premium", "Cera premium"),
        service("moto-selante", "Selante sintético"),
        service("moto-protecao-pintura", "Proteção da pintura"),
        service("moto-vitrificacao", "Vitrificação / coating"),
        service("moto-revitalizacao-carenagens", "Revitalização de carenagens")
      ]
    },
    {
      id: "moto-polimento",
      title: "Polimento de motos",
      icon: "💎",
      description: "Correção e recuperação de brilho em superfícies compatíveis.",
      services: [
        service("moto-polimento-tanque", "Polimento do tanque", "", ["polishing"]),
        service("moto-polimento-carenagens", "Polimento de carenagens", "", ["polishing"]),
        service("moto-polimento-tecnico", "Polimento técnico", "", ["polishing"]),
        service("moto-correcao-marcas", "Correção de marcas superficiais", "", ["polishing"]),
        service("moto-recuperacao-brilho", "Recuperação de brilho", "", ["polishing"]),
        service("moto-polimento-personalizado", "Polimento personalizado", "Definido conforme a condição real da superfície.", ["polishing"])
      ]
    },
    {
      id: "moto-rodas",
      title: "Rodas, pneus e partes baixas",
      icon: "🛞",
      description: "Limpeza detalhada das áreas que mais acumulam sujeira.",
      services: [
        service("moto-limpeza-rodas", "Limpeza detalhada de rodas"),
        service("moto-descontaminacao-rodas", "Descontaminação de rodas"),
        service("moto-limpeza-pneus", "Limpeza de pneus"),
        service("moto-limpeza-paralama", "Limpeza de paralamas"),
        service("moto-limpeza-balanca", "Limpeza detalhada da balança"),
        service("moto-limpeza-partes-baixas", "Limpeza de partes baixas")
      ]
    },
    {
      id: "moto-motor",
      title: "Motor e áreas técnicas",
      icon: "⚙️",
      description: "Detalhamento estético externo, sem desmontagem mecânica.",
      services: [
        service("moto-limpeza-motor-externa", "Limpeza externa do motor"),
        service("moto-detalhamento-motor", "Detalhamento externo do motor"),
        service("moto-limpeza-aletas", "Limpeza detalhada de aletas"),
        service("moto-limpeza-areas-dificeis", "Limpeza de áreas de difícil acesso")
      ]
    },
    {
      id: "moto-metais",
      title: "Metais e acabamentos",
      icon: "🔩",
      description: "Revitalização visual de componentes compatíveis.",
      services: [
        service("moto-polimento-metais", "Polimento de metais"),
        service("moto-revitalizacao-cromados", "Revitalização de cromados"),
        service("moto-limpeza-escapamento", "Limpeza externa do escapamento"),
        service("moto-polimento-escape", "Polimento externo do escapamento"),
        service("moto-protecao-metais", "Proteção de metais")
      ]
    },
    {
      id: "moto-banco",
      title: "Banco e plásticos",
      icon: "🧴",
      description: "Limpeza e acabamento de materiais da moto.",
      services: [
        service("moto-limpeza-banco", "Limpeza do banco"),
        service("moto-higienizacao-banco", "Higienização do banco"),
        service("moto-limpeza-plasticos", "Limpeza de plásticos"),
        service("moto-revitalizacao-plasticos", "Revitalização de plásticos"),
        service("moto-protecao-plasticos", "Proteção de plásticos")
      ]
    },
    {
      id: "moto-painel",
      title: "Painel, farol e lentes",
      icon: "💡",
      description: "Limpeza e recuperação estética de superfícies transparentes.",
      services: [
        service("moto-limpeza-painel", "Limpeza detalhada do painel"),
        service("moto-protecao-painel", "Proteção do painel"),
        service("moto-polimento-farol", "Polimento de farol"),
        service("moto-polimento-lentes", "Polimento de lentes"),
        service("moto-protecao-lentes", "Proteção de lentes")
      ]
    },
    {
      id: "moto-extras",
      title: "Extras para motos",
      icon: "➕",
      description: "Serviços complementares para personalizar o atendimento.",
      services: [
        service("moto-limpeza-capacete", "Limpeza externa de capacete"),
        service("moto-protecao-tanque", "Proteção do tanque"),
        service("moto-remocao-residuos", "Remoção de resíduos e sujeiras aderidas"),
        service("moto-limpeza-emblemas", "Limpeza de emblemas e detalhes"),
        service("moto-outros", "Outros serviços para moto")
      ]
    }
  ]
};

function service(id, name, description = "", tags = []) {
  return {
    id,
    name,
    description,
    tags,
    price: null,
    startingPrice: null,
    duration: null
  };
}

const CONDITION_OPTIONS = {
  car: [
    "Apenas manutenção",
    "Muito sujo",
    "Interior muito sujo",
    "Manchas nos bancos",
    "Mau cheiro",
    "Pintura sem brilho",
    "Pintura riscada",
    "Marcas de lavagem",
    "Hologramas",
    "Faróis amarelados",
    "Vidros manchados",
    "Rodas muito sujas",
    "Plásticos ressecados",
    "Precisa de avaliação"
  ],
  motorcycle: [
    "Apenas manutenção",
    "Muito suja",
    "Muita sujeira em frestas",
    "Tanque sem brilho",
    "Carenagens com marcas",
    "Pintura riscada",
    "Marcas de lavagem",
    "Cromados sem brilho",
    "Rodas muito sujas",
    "Motor / áreas externas muito sujas",
    "Plásticos ressecados",
    "Farol ou lentes opacas",
    "Resíduos aderidos",
    "Precisa de avaliação"
  ]
};

const BODY_TYPES = {
  car: ["Hatch", "Sedan", "SUV", "Picape", "Utilitário", "Cupê", "Perua", "Conversível", "Outro"],
  motorcycle: ["Scooter", "Street", "Naked", "Trail", "Big Trail", "Custom", "Esportiva", "Touring", "Ciclomotor", "Outra"]
};

const POLISH_GOALS = {
  car: [
    "Quero apenas aumentar o brilho",
    "Quero remover marcas de lavagem",
    "Quero reduzir riscos",
    "Quero remover hologramas",
    "Minha pintura está opaca",
    "Quero preparar o carro para vitrificação",
    "Quero a melhor correção possível",
    "Não sei, quero uma avaliação"
  ],
  motorcycle: [
    "Quero aumentar o brilho",
    "Quero remover marcas do tanque",
    "Quero reduzir riscos",
    "Quero melhorar as carenagens",
    "A superfície está opaca",
    "Quero preparar para coating / vitrificação",
    "Quero a melhor correção possível",
    "Não sei, quero uma avaliação"
  ]
};

const SURFACE_CONDITIONS = [
  "Muito boa",
  "Boa",
  "Regular",
  "Ruim",
  "Muito danificada",
  "Não sei"
];

/* =========================================================
   ESTADO DO APLICATIVO
   ========================================================= */
const defaultState = () => ({
  step: 1,
  vehicleMode: "car",
  vehicle: {
    bodyType: "",
    brand: "",
    model: "",
    year: "",
    color: "",
    plate: ""
  },
  conditions: [],
  services: [],
  polish: {
    goal: "",
    surfaceCondition: "",
    postProtection: "",
    inPersonEvaluation: false
  },
  appointment: {
    date: "",
    period: ""
  },
  client: {
    name: "",
    phone: "",
    neighborhood: "",
    notes: ""
  }
});

let state = defaultState();

/* =========================================================
   CACHE DE ELEMENTOS
   ========================================================= */
const el = {};

document.addEventListener("DOMContentLoaded", initializeApp);

function initializeApp() {
  cacheElements();
  loadFormState();
  initializeMenu();
  initializeScrollEffects();
  initializePublicServiceTabs();
  initializeVehicleModeSelector();
  initializeInputs();
  initializeNavigation();
  initializeFAQ();
  initializeAnimations();
  initializeStaticContent();

  applyStateToForm();
  renderVehicleDependentUI();
  showStep(state.step, false);
  updateSummary();
  updateServiceCounter();
  updateNotesCounter();
  setMinimumDate();

  trackEvent("app_initialized");
}

function cacheElements() {
  el.siteHeader = document.querySelector("#siteHeader");
  el.menuToggle = document.querySelector("#menuToggle");
  el.mobileMenu = document.querySelector("#mobileMenu");
  el.publicServicesGrid = document.querySelector("#publicServicesGrid");
  el.bookingForm = document.querySelector("#bookingForm");
  el.formSteps = [...document.querySelectorAll(".form-step")];
  el.stepLabel = document.querySelector("#stepLabel");
  el.progressBar = document.querySelector("#progressBar");
  el.formMessage = document.querySelector("#formMessage");
  el.conditionGrid = document.querySelector("#conditionGrid");
  el.conditionTitle = document.querySelector("#conditionTitle");
  el.configServicesContainer = document.querySelector("#configServicesContainer");
  el.serviceSearch = document.querySelector("#serviceSearch");
  el.serviceCounter = document.querySelector("#serviceCounter");
  el.extrasGrid = document.querySelector("#extrasGrid");
  el.polishingCustomization = document.querySelector("#polishingCustomization");
  el.polishGoal = document.querySelector("#polishGoal");
  el.paintCondition = document.querySelector("#paintCondition");
  el.postProtection = document.querySelector("#postProtection");
  el.inPersonEvaluation = document.querySelector("#inPersonEvaluation");
  el.recommendationsContainer = document.querySelector("#recommendationsContainer");

  el.vehicleBodyType = document.querySelector("#vehicleBodyType");
  el.vehicleBodyTypeLabel = document.querySelector("#vehicleBodyTypeLabel");
  el.brand = document.querySelector("#brand");
  el.model = document.querySelector("#model");
  el.year = document.querySelector("#year");
  el.color = document.querySelector("#color");
  el.plate = document.querySelector("#plate");

  el.preferredDate = document.querySelector("#preferredDate");
  el.period = document.querySelector("#period");
  el.clientName = document.querySelector("#clientName");
  el.phone = document.querySelector("#phone");
  el.neighborhood = document.querySelector("#neighborhood");
  el.notes = document.querySelector("#notes");
  el.notesCounter = document.querySelector("#notesCounter");

  el.prevBtn = document.querySelector("#prevBtn");
  el.nextBtn = document.querySelector("#nextBtn");
  el.whatsappBtn = document.querySelector("#whatsappBtn");
  el.clearSelectionBtn = document.querySelector("#clearSelectionBtn");
  el.sideFinalizeBtn = document.querySelector("#sideFinalizeBtn");

  el.finalSummary = document.querySelector("#finalSummary");
  el.sideVehicleName = document.querySelector("#sideVehicleName");
  el.sideVehicleType = document.querySelector("#sideVehicleType");
  el.sideServiceCount = document.querySelector("#sideServiceCount");
  el.sideServicesList = document.querySelector("#sideServicesList");

  el.currentYear = document.querySelector("#currentYear");
  el.contactGrid = document.querySelector("#contactGrid");
  el.footerContact = document.querySelector("#footerContact");
}

/* =========================================================
   MENU E SCROLL
   ========================================================= */
function initializeMenu() {
  el.menuToggle.addEventListener("click", () => {
    const isOpen = el.menuToggle.getAttribute("aria-expanded") === "true";
    el.menuToggle.setAttribute("aria-expanded", String(!isOpen));
    el.menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
    el.menuToggle.classList.toggle("active", !isOpen);
    el.mobileMenu.hidden = isOpen;
    document.body.classList.toggle("menu-open", !isOpen);
  });

  document.querySelectorAll(".mobile-menu a").forEach(link => {
    link.addEventListener("click", closeMobileMenu);
  });
}

function closeMobileMenu() {
  el.menuToggle.setAttribute("aria-expanded", "false");
  el.menuToggle.setAttribute("aria-label", "Abrir menu");
  el.menuToggle.classList.remove("active");
  el.mobileMenu.hidden = true;
  document.body.classList.remove("menu-open");
}

function initializeScrollEffects() {
  const updateHeader = () => {
    el.siteHeader.classList.toggle("scrolled", window.scrollY > 14);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

/* =========================================================
   SEÇÃO PÚBLICA DE SERVIÇOS
   ========================================================= */
function initializePublicServiceTabs() {
  document.querySelectorAll("[data-public-vehicle]").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-public-vehicle]").forEach(btn => {
        const active = btn === button;
        btn.classList.toggle("active", active);
        btn.setAttribute("aria-selected", String(active));
      });

      renderPublicServices(button.dataset.publicVehicle);
    });
  });

  renderPublicServices("car");
}

function renderPublicServices(mode) {
  const categories = SERVICE_CATALOG[mode];

  el.publicServicesGrid.innerHTML = categories.map(category => `
    <article class="public-category-card reveal visible">
      <div>
        <span class="eyebrow">${category.icon} ${escapeHTML(category.title)}</span>
        <h3>${escapeHTML(category.title)}</h3>
        <p>${escapeHTML(category.description)}</p>
      </div>
      <ul class="public-service-list">
        ${category.services.map(item => `<li>${escapeHTML(item.name)}</li>`).join("")}
      </ul>
      <span class="no-price-badge">Orçamento via WhatsApp</span>
    </article>
  `).join("");
}

/* =========================================================
   ALTERAÇÃO CARRO / MOTO
   ========================================================= */
function initializeVehicleModeSelector() {
  document.querySelectorAll("[data-vehicle-mode]").forEach(button => {
    button.addEventListener("click", () => {
      const newMode = button.dataset.vehicleMode;
      if (newMode === state.vehicleMode) return;

      state.vehicleMode = newMode;

      // Ao trocar carro ↔ moto, serviços e condições incompatíveis
      // são zerados para evitar uma ficha inconsistente.
      state.vehicle.bodyType = "";
      state.conditions = [];
      state.services = [];
      state.polish = defaultState().polish;

      document.querySelectorAll("[data-vehicle-mode]").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.vehicleMode === newMode);
      });

      renderVehicleDependentUI();
      updateServiceCounter();
      updateSummary();
      saveFormState();
      showFormMessage(`Modo alterado para ${newMode === "car" ? "Carro" : "Moto"}. Os serviços foram atualizados.`, "success");
      trackEvent("vehicle_mode_changed", { mode: newMode });
    });
  });
}

function renderVehicleDependentUI() {
  renderBodyTypes();
  renderConditions();
  renderConfigServices();
  renderExtras();
  renderPolishFields();
  handlePolishingOptions();

  const isCar = state.vehicleMode === "car";
  el.conditionTitle.textContent = isCar ? "Como está seu carro atualmente?" : "Como está sua moto atualmente?";
  el.vehicleBodyTypeLabel.textContent = isCar ? "Tipo do carro *" : "Tipo da moto *";

  document.querySelectorAll("[data-vehicle-mode]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.vehicleMode === state.vehicleMode);
  });
}

function renderBodyTypes() {
  el.vehicleBodyType.innerHTML = `
    <option value="">Selecione</option>
    ${BODY_TYPES[state.vehicleMode].map(type => `<option value="${escapeHTML(type)}">${escapeHTML(type)}</option>`).join("")}
  `;
  el.vehicleBodyType.value = state.vehicle.bodyType || "";
}

function renderConditions() {
  el.conditionGrid.innerHTML = CONDITION_OPTIONS[state.vehicleMode].map(condition => `
    <button type="button"
      class="selectable-card ${state.conditions.includes(condition) ? "selected" : ""}"
      data-condition="${escapeHTML(condition)}"
      aria-pressed="${state.conditions.includes(condition)}">
      <strong>${escapeHTML(condition)}</strong>
    </button>
  `).join("");

  el.conditionGrid.querySelectorAll("[data-condition]").forEach(button => {
    button.addEventListener("click", () => toggleCondition(button.dataset.condition, button));
  });
}

function toggleCondition(condition, button) {
  const exists = state.conditions.includes(condition);

  if (exists) {
    state.conditions = state.conditions.filter(item => item !== condition);
  } else {
    state.conditions.push(condition);
  }

  button.classList.toggle("selected", !exists);
  button.setAttribute("aria-pressed", String(!exists));
  saveFormState();
  generateRecommendations();
  updateSummary();
}

/* =========================================================
   SERVIÇOS
   ========================================================= */
function renderConfigServices(searchTerm = "") {
  const normalizedTerm = normalize(searchTerm);
  const categories = SERVICE_CATALOG[state.vehicleMode];

  const html = categories.map(category => {
    const visibleServices = category.services.filter(item => {
      if (!normalizedTerm) return true;
      return normalize(`${category.title} ${item.name} ${item.description}`).includes(normalizedTerm);
    });

    if (!visibleServices.length) return "";

    return `
      <section class="config-category">
        <div class="config-category-header">
          <h4>${category.icon} ${escapeHTML(category.title)}</h4>
          <span class="no-price-badge">Sem preço no site</span>
        </div>

        <div class="service-card-grid">
          ${visibleServices.map(item => `
            <button type="button"
              class="service-option ${state.services.includes(item.id) ? "selected" : ""}"
              data-service-id="${item.id}"
              aria-pressed="${state.services.includes(item.id)}">
              <strong>${escapeHTML(item.name)}</strong>
              ${item.description ? `<small>${escapeHTML(item.description)}</small>` : ""}
            </button>
          `).join("")}
        </div>
      </section>
    `;
  }).join("");

  el.configServicesContainer.innerHTML = html || `<div class="empty-state">Nenhum serviço encontrado com esse termo.</div>`;

  el.configServicesContainer.querySelectorAll("[data-service-id]").forEach(button => {
    button.addEventListener("click", () => toggleService(button.dataset.serviceId));
  });
}

function toggleService(serviceId) {
  const exists = state.services.includes(serviceId);

  if (exists) {
    state.services = state.services.filter(id => id !== serviceId);
    trackEvent("service_removed", { serviceId });
  } else {
    state.services.push(serviceId);
    trackEvent("service_selected", { serviceId });
  }

  renderConfigServices(el.serviceSearch.value);
  renderExtras();
  updateServiceCounter();
  handlePolishingOptions();
  updateSummary();
  saveFormState();
}

function updateServiceCounter() {
  const count = state.services.length;
  const label = count === 1 ? "1 serviço selecionado" : `${count} serviços selecionados`;

  el.serviceCounter.textContent = label;
  el.sideServiceCount.textContent = label;
}

function getServiceById(id) {
  for (const category of SERVICE_CATALOG[state.vehicleMode]) {
    const found = category.services.find(item => item.id === id);
    if (found) return { ...found, category: category.title, categoryId: category.id };
  }
  return null;
}

function getSelectedServiceObjects() {
  return state.services.map(getServiceById).filter(Boolean);
}

/* =========================================================
   RECOMENDAÇÕES
   ========================================================= */
const RECOMMENDATION_RULES = {
  car: [
    { match: ["Pintura sem brilho"], serviceId: "polimento-tecnico", title: "Polimento técnico", text: "A falta de brilho pode indicar que a pintura se beneficiará de correção e refino." },
    { match: ["Pintura riscada"], serviceId: "correcao-pintura", title: "Avaliação para correção de pintura", text: "Riscos variam em profundidade. Uma avaliação ajuda a definir o que pode ser corrigido." },
    { match: ["Marcas de lavagem", "Hologramas"], serviceId: "polimento-personalizado", title: "Polimento personalizado", text: "Marcas circulares e hologramas podem exigir um processo de correção sob medida." },
    { match: ["Faróis amarelados"], serviceId: "recuperacao-farois", title: "Recuperação de faróis", text: "A recuperação pode melhorar aparência e transparência, conforme a condição da lente." },
    { match: ["Manchas nos bancos"], serviceId: "higienizacao-bancos", title: "Higienização de bancos", text: "Manchas podem exigir uma limpeza mais profunda do tecido ou material." },
    { match: ["Vidros manchados"], serviceId: "descontaminacao-vidros", title: "Descontaminação de vidros", text: "Manchas aderidas podem exigir tratamento técnico de vidro." },
    { match: ["Plásticos ressecados"], serviceId: "revitalizacao-plasticos-externos", title: "Revitalização de plásticos", text: "Pode ajudar a recuperar o aspecto visual de peças plásticas externas." }
  ],
  motorcycle: [
    { match: ["Tanque sem brilho", "Carenagens com marcas"], serviceId: "moto-polimento-personalizado", title: "Polimento personalizado", text: "O tanque e as carenagens podem precisar de correção adaptada ao material e à condição real." },
    { match: ["Pintura riscada", "Marcas de lavagem"], serviceId: "moto-polimento-tecnico", title: "Polimento técnico", text: "Marcas e riscos superficiais podem se beneficiar de avaliação e polimento." },
    { match: ["Cromados sem brilho"], serviceId: "moto-revitalizacao-cromados", title: "Revitalização de cromados", text: "Pode melhorar o aspecto de componentes cromados compatíveis." },
    { match: ["Rodas muito sujas"], serviceId: "moto-limpeza-rodas", title: "Limpeza detalhada de rodas", text: "Rodas acumulam resíduos e sujeiras que podem exigir atenção específica." },
    { match: ["Motor / áreas externas muito sujas"], serviceId: "moto-detalhamento-motor", title: "Detalhamento externo do motor", text: "Uma limpeza estética cuidadosa pode melhorar bastante a apresentação da moto." },
    { match: ["Farol ou lentes opacas"], serviceId: "moto-polimento-lentes", title: "Polimento de lentes", text: "Lentes opacas podem se beneficiar de recuperação estética, conforme o material." },
    { match: ["Plásticos ressecados"], serviceId: "moto-revitalizacao-plasticos", title: "Revitalização de plásticos", text: "Pode recuperar visual e acabamento de plásticos compatíveis." }
  ]
};

function generateRecommendations() {
  const rules = RECOMMENDATION_RULES[state.vehicleMode];

  const recommendations = rules.filter(rule =>
    rule.match.some(condition => state.conditions.includes(condition))
  );

  if (!recommendations.length) {
    el.recommendationsContainer.innerHTML = `
      <div class="empty-state">
        Nenhuma recomendação automática no momento. Você continua podendo escolher qualquer serviço livremente.
      </div>
    `;
    return;
  }

  el.recommendationsContainer.innerHTML = recommendations.map(rule => {
    const added = state.services.includes(rule.serviceId);

    return `
      <article class="recommendation-card">
        <h4>${escapeHTML(rule.title)}</h4>
        <p>${escapeHTML(rule.text)}</p>
        <button type="button"
          class="btn ${added ? "btn-secondary" : "btn-primary"}"
          data-recommendation-service="${rule.serviceId}"
          ${added ? "disabled" : ""}>
          ${added ? "Já adicionado" : "Adicionar à seleção"}
        </button>
      </article>
    `;
  }).join("");

  el.recommendationsContainer.querySelectorAll("[data-recommendation-service]").forEach(button => {
    button.addEventListener("click", () => {
      const id = button.dataset.recommendationService;
      if (!state.services.includes(id)) {
        state.services.push(id);
        updateServiceCounter();
        renderConfigServices(el.serviceSearch.value);
        renderExtras();
        handlePolishingOptions();
        generateRecommendations();
        updateSummary();
        saveFormState();
        trackEvent("recommended_service_added", { serviceId: id });
      }
    });
  });
}

/* =========================================================
   POLIMENTO PERSONALIZADO
   ========================================================= */
function hasPolishingService() {
  return getSelectedServiceObjects().some(item => item.tags.includes("polishing"));
}

function renderPolishFields() {
  el.polishGoal.innerHTML = `
    <option value="">Selecione</option>
    ${POLISH_GOALS[state.vehicleMode].map(item => `<option>${escapeHTML(item)}</option>`).join("")}
  `;

  el.paintCondition.innerHTML = `
    <option value="">Selecione</option>
    ${SURFACE_CONDITIONS.map(item => `<option>${escapeHTML(item)}</option>`).join("")}
  `;

  el.polishGoal.value = state.polish.goal || "";
  el.paintCondition.value = state.polish.surfaceCondition || "";
  el.postProtection.value = state.polish.postProtection || "";
  el.inPersonEvaluation.checked = Boolean(state.polish.inPersonEvaluation);
}

function handlePolishingOptions() {
  const shouldShow = hasPolishingService();
  el.polishingCustomization.hidden = !shouldShow;

  if (!shouldShow) {
    state.polish = defaultState().polish;
  }
}

/* =========================================================
   EXTRAS
   ========================================================= */
const EXTRA_IDS = {
  car: [
    "hidratacao-couro",
    "revitalizacao-plasticos-externos",
    "tratamento-hidrofobico",
    "cristalizacao-parabrisa",
    "polimento-farois",
    "limpeza-detalhada-rodas",
    "limpeza-cofre-motor",
    "protecao-pintura"
  ],
  motorcycle: [
    "moto-protecao-tanque",
    "moto-revitalizacao-plasticos",
    "moto-limpeza-rodas",
    "moto-detalhamento-motor",
    "moto-polimento-lentes",
    "moto-polimento-metais",
    "moto-vitrificacao",
    "moto-limpeza-capacete"
  ]
};

function renderExtras() {
  const items = EXTRA_IDS[state.vehicleMode]
    .map(getServiceById)
    .filter(Boolean);

  el.extrasGrid.innerHTML = items.map(item => `
    <button type="button"
      class="selectable-card ${state.services.includes(item.id) ? "selected" : ""}"
      data-extra-service="${item.id}"
      aria-pressed="${state.services.includes(item.id)}">
      <strong>${escapeHTML(item.name)}</strong>
      <small>Será incluído na mesma ficha de atendimento.</small>
    </button>
  `).join("");

  el.extrasGrid.querySelectorAll("[data-extra-service]").forEach(button => {
    button.addEventListener("click", () => toggleService(button.dataset.extraService));
  });
}

/* =========================================================
   INPUTS E FORMATAÇÃO
   ========================================================= */
function initializeInputs() {
  const fields = [
    [el.vehicleBodyType, "vehicle", "bodyType"],
    [el.brand, "vehicle", "brand"],
    [el.model, "vehicle", "model"],
    [el.year, "vehicle", "year"],
    [el.color, "vehicle", "color"],
    [el.plate, "vehicle", "plate"],
    [el.preferredDate, "appointment", "date"],
    [el.period, "appointment", "period"],
    [el.clientName, "client", "name"],
    [el.phone, "client", "phone"],
    [el.neighborhood, "client", "neighborhood"],
    [el.notes, "client", "notes"]
  ];

  fields.forEach(([input, group, key]) => {
    input.addEventListener("input", () => {
      let value = input.value;

      if (input === el.phone) {
        value = formatPhone(value);
        input.value = value;
      }

      if (input === el.year) {
        value = value.replace(/\D/g, "").slice(0, 4);
        input.value = value;
      }

      if (input === el.plate) {
        value = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
        input.value = value;
      }

      state[group][key] = value;
      input.classList.remove("input-error");

      if (input === el.notes) updateNotesCounter();

      updateSummary();
      saveFormState();
    });

    input.addEventListener("change", () => {
      state[group][key] = input.value;
      updateSummary();
      saveFormState();
    });
  });

  el.serviceSearch.addEventListener("input", () => {
    renderConfigServices(el.serviceSearch.value);
  });

  el.polishGoal.addEventListener("change", () => {
    state.polish.goal = el.polishGoal.value;
    saveFormState();
    updateSummary();
  });

  el.paintCondition.addEventListener("change", () => {
    state.polish.surfaceCondition = el.paintCondition.value;
    saveFormState();
    updateSummary();
  });

  el.postProtection.addEventListener("change", () => {
    state.polish.postProtection = el.postProtection.value;
    saveFormState();
    updateSummary();
  });

  el.inPersonEvaluation.addEventListener("change", () => {
    state.polish.inPersonEvaluation = el.inPersonEvaluation.checked;
    saveFormState();
    updateSummary();
  });
}

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function setMinimumDate() {
  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];

  el.preferredDate.min = localDate;
}

function updateNotesCounter() {
  const length = el.notes.value.length;
  el.notesCounter.textContent = `${length}/400`;
}

/* =========================================================
   NAVEGAÇÃO ENTRE ETAPAS
   ========================================================= */
function initializeNavigation() {
  el.nextBtn.addEventListener("click", nextStep);
  el.prevBtn.addEventListener("click", previousStep);
  el.whatsappBtn.addEventListener("click", openWhatsApp);
  el.clearSelectionBtn.addEventListener("click", clearFormState);
  el.sideFinalizeBtn.addEventListener("click", () => {
    syncStateFromForm();

    if (!validateStep(1, true) || state.services.length === 0) {
      document.querySelector("#configurador").scrollIntoView({ behavior: "smooth" });
      showFormMessage("Complete os dados do veículo e selecione pelo menos um serviço antes de finalizar.", "error");
      return;
    }

    showStep(6);
    document.querySelector("#configurador").scrollIntoView({ behavior: "smooth" });
  });

  document.querySelectorAll('a[href="#configurador"]').forEach(link => {
    link.addEventListener("click", () => trackEvent("configurator_started"));
  });
}

function nextStep() {
  syncStateFromForm();

  if (!validateStep(state.step)) return;

  if (state.step === 2) generateRecommendations();

  if (state.step < TOTAL_STEPS) {
    showStep(state.step + 1);
  }
}

function previousStep() {
  if (state.step > 1) showStep(state.step - 1);
}

function showStep(step, scroll = true) {
  state.step = Math.min(Math.max(Number(step) || 1, 1), TOTAL_STEPS);

  el.formSteps.forEach(section => {
    section.classList.toggle("active", Number(section.dataset.step) === state.step);
  });

  el.stepLabel.textContent = `Passo ${state.step} de ${TOTAL_STEPS}`;
  el.progressBar.style.width = `${(state.step / TOTAL_STEPS) * 100}%`;

  el.prevBtn.hidden = state.step === 1;
  el.nextBtn.hidden = state.step === TOTAL_STEPS;
  el.whatsappBtn.hidden = state.step !== TOTAL_STEPS;

  if (state.step === 4) {
    generateRecommendations();
    handlePolishingOptions();
  }

  if (state.step === 7) {
    updateSummary();
    renderFinalSummary();
    trackEvent("booking_reviewed");
  }

  hideFormMessage();
  saveFormState();

  if (scroll) {
    document.querySelector("#configurador").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/* =========================================================
   VALIDAÇÕES
   ========================================================= */
function validateStep(step, silent = false) {
  clearFieldErrors();

  if (step === 1) {
    const missing = [];

    if (!state.vehicle.bodyType) missing.push(el.vehicleBodyType);
    if (!state.vehicle.brand.trim()) missing.push(el.brand);
    if (!state.vehicle.model.trim()) missing.push(el.model);

    if (state.vehicle.year && !/^\d{4}$/.test(state.vehicle.year)) {
      el.year.classList.add("input-error");
      if (!silent) showFormMessage("Informe o ano com 4 dígitos ou deixe o campo vazio.", "error");
      return false;
    }

    if (missing.length) {
      missing.forEach(input => input.classList.add("input-error"));
      if (!silent) showFormMessage("Preencha o tipo, a marca e o modelo do veículo para continuar.", "error");
      missing[0].focus();
      return false;
    }
  }

  if (step === 3 && state.services.length === 0) {
    if (!silent) showFormMessage("Selecione pelo menos um serviço para montar seu atendimento.", "error");
    return false;
  }

  if (step === 4 && hasPolishingService()) {
    // Não obrigamos o preenchimento; polimento pode ser avaliado presencialmente.
    // Porém, se o cliente marcou algo, tudo segue para a ficha final.
  }

  if (step === 6) {
    const required = [];

    if (!state.appointment.date) required.push(el.preferredDate);
    if (!state.appointment.period) required.push(el.period);
    if (!state.client.name.trim()) required.push(el.clientName);
    if (!state.client.phone.trim()) required.push(el.phone);

    if (required.length) {
      required.forEach(input => input.classList.add("input-error"));
      if (!silent) showFormMessage("Preencha data, período, nome e telefone para continuar.", "error");
      required[0].focus();
      return false;
    }

    const selectedDate = new Date(`${state.appointment.date}T12:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(selectedDate.getTime()) || selectedDate < today) {
      el.preferredDate.classList.add("input-error");
      if (!silent) showFormMessage("Escolha uma data de preferência válida, sem usar dias anteriores.", "error");
      return false;
    }

    const phoneDigits = state.client.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      el.phone.classList.add("input-error");
      if (!silent) showFormMessage("Informe um telefone válido com DDD.", "error");
      return false;
    }
  }

  return true;
}

function clearFieldErrors() {
  document.querySelectorAll(".input-error").forEach(input => input.classList.remove("input-error"));
}

function showFormMessage(message, type = "error") {
  el.formMessage.textContent = message;
  el.formMessage.className = `form-message show ${type}`;
}

function hideFormMessage() {
  el.formMessage.className = "form-message";
  el.formMessage.textContent = "";
}

/* =========================================================
   ESTADO / LOCALSTORAGE
   ========================================================= */
function syncStateFromForm() {
  state.vehicle.bodyType = el.vehicleBodyType.value;
  state.vehicle.brand = el.brand.value.trim();
  state.vehicle.model = el.model.value.trim();
  state.vehicle.year = el.year.value.trim();
  state.vehicle.color = el.color.value.trim();
  state.vehicle.plate = el.plate.value.trim();

  state.appointment.date = el.preferredDate.value;
  state.appointment.period = el.period.value;

  state.client.name = el.clientName.value.trim();
  state.client.phone = el.phone.value.trim();
  state.client.neighborhood = el.neighborhood.value.trim();
  state.client.notes = el.notes.value.trim();
}

function saveFormState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Não foi possível salvar o atendimento localmente.", error);
  }
}

function loadFormState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw);
    const base = defaultState();

    state = {
      ...base,
      ...parsed,
      vehicle: { ...base.vehicle, ...(parsed.vehicle || {}) },
      polish: { ...base.polish, ...(parsed.polish || {}) },
      appointment: { ...base.appointment, ...(parsed.appointment || {}) },
      client: { ...base.client, ...(parsed.client || {}) },
      conditions: Array.isArray(parsed.conditions) ? parsed.conditions : [],
      services: Array.isArray(parsed.services) ? parsed.services : []
    };

    if (!["car", "motorcycle"].includes(state.vehicleMode)) {
      state.vehicleMode = "car";
    }

    state.services = state.services.filter(id => getAllServiceIds(state.vehicleMode).includes(id));
    state.conditions = state.conditions.filter(condition => CONDITION_OPTIONS[state.vehicleMode].includes(condition));
  } catch (error) {
    console.warn("Estado local corrompido. Reiniciando configurador.", error);
    localStorage.removeItem(STORAGE_KEY);
    state = defaultState();
  }
}

function clearFormState() {
  localStorage.removeItem(STORAGE_KEY);
  state = defaultState();

  el.bookingForm.reset();
  el.serviceSearch.value = "";
  hideFormMessage();
  applyStateToForm();
  renderVehicleDependentUI();
  updateServiceCounter();
  updateNotesCounter();
  updateSummary();
  showStep(1);

  showFormMessage("Seleção limpa. Você pode montar um novo atendimento.", "success");
  trackEvent("booking_cleared");
}

function applyStateToForm() {
  el.brand.value = state.vehicle.brand;
  el.model.value = state.vehicle.model;
  el.year.value = state.vehicle.year;
  el.color.value = state.vehicle.color;
  el.plate.value = state.vehicle.plate;

  el.preferredDate.value = state.appointment.date;
  el.period.value = state.appointment.period;

  el.clientName.value = state.client.name;
  el.phone.value = state.client.phone;
  el.neighborhood.value = state.client.neighborhood;
  el.notes.value = state.client.notes;

  el.polishGoal.value = state.polish.goal;
  el.paintCondition.value = state.polish.surfaceCondition;
  el.postProtection.value = state.polish.postProtection;
  el.inPersonEvaluation.checked = state.polish.inPersonEvaluation;
}

/* =========================================================
   RESUMO
   ========================================================= */
function updateSummary() {
  const vehicleName = [state.vehicle.brand, state.vehicle.model].filter(Boolean).join(" ").trim();

  el.sideVehicleName.textContent = vehicleName || "Veículo ainda não informado";
  el.sideVehicleType.textContent = state.vehicleMode === "car" ? "🚗 Carro" : "🏍️ Moto";

  const selected = getSelectedServiceObjects();
  const visible = selected.slice(0, 4);

  if (!visible.length) {
    el.sideServicesList.innerHTML = "<li>Selecione serviços para montar sua ficha.</li>";
  } else {
    const more = selected.length - visible.length;
    el.sideServicesList.innerHTML = `
      ${visible.map(item => `<li>${escapeHTML(item.name)}</li>`).join("")}
      ${more > 0 ? `<li>+ ${more} ${more === 1 ? "serviço" : "serviços"}</li>` : ""}
    `;
  }

  updateServiceCounter();
}

function renderFinalSummary() {
  syncStateFromForm();

  const servicesByCategory = groupServicesByCategory();
  const serviceHTML = Object.entries(servicesByCategory).map(([category, items]) => `
    <div>
      <strong>${escapeHTML(category)}</strong>
      <ul>${items.map(item => `<li>${escapeHTML(item.name)}</li>`).join("")}</ul>
    </div>
  `).join("");

  const vehicleParts = [
    state.vehicle.brand,
    state.vehicle.model,
    state.vehicle.year
  ].filter(Boolean);

  el.finalSummary.innerHTML = `
    <section class="summary-section">
      <h4>${state.vehicleMode === "car" ? "🚘 Veículo" : "🏍️ Moto"}</h4>
      <p><strong>${escapeHTML(vehicleParts.join(" "))}</strong></p>
      <p>Tipo: ${escapeHTML(state.vehicle.bodyType)}</p>
      ${state.vehicle.color ? `<p>Cor: ${escapeHTML(state.vehicle.color)}</p>` : ""}
      ${state.vehicle.plate ? `<p>Placa: ${escapeHTML(state.vehicle.plate)}</p>` : ""}
    </section>

    ${state.conditions.length ? `
      <section class="summary-section">
        <h4>🔎 Situação atual</h4>
        <ul>${state.conditions.map(item => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
      </section>
    ` : ""}

    <section class="summary-section">
      <h4>✨ Serviços</h4>
      ${serviceHTML}
    </section>

    ${hasPolishingService() ? `
      <section class="summary-section">
        <h4>🎯 Polimento personalizado</h4>
        ${state.polish.goal ? `<p>Objetivo: ${escapeHTML(state.polish.goal)}</p>` : ""}
        ${state.polish.surfaceCondition ? `<p>Estado aparente: ${escapeHTML(state.polish.surfaceCondition)}</p>` : ""}
        ${state.polish.postProtection ? `<p>Proteção posterior: ${escapeHTML(state.polish.postProtection)}</p>` : ""}
        <p>Avaliação presencial: ${state.polish.inPersonEvaluation ? "Sim" : "Não informada"}</p>
      </section>
    ` : ""}

    <section class="summary-section">
      <h4>📅 Preferência de atendimento</h4>
      <p>${escapeHTML(formatDate(state.appointment.date))} — ${escapeHTML(state.appointment.period)}</p>
      <p><small>A disponibilidade será confirmada pelo WhatsApp.</small></p>
    </section>

    <section class="summary-section">
      <h4>👤 Cliente</h4>
      <p>${escapeHTML(state.client.name)}</p>
      <p>${escapeHTML(state.client.phone)}</p>
      ${state.client.neighborhood ? `<p>${escapeHTML(state.client.neighborhood)}</p>` : ""}
    </section>

    ${state.client.notes ? `
      <section class="summary-section">
        <h4>📝 Observações</h4>
        <p>${escapeHTML(state.client.notes)}</p>
      </section>
    ` : ""}
  `;
}

function groupServicesByCategory() {
  return getSelectedServiceObjects().reduce((groups, item) => {
    groups[item.category] ??= [];
    groups[item.category].push(item);
    return groups;
  }, {});
}

/* =========================================================
   WHATSAPP
   ========================================================= */
function generateWhatsAppMessage() {
  syncStateFromForm();

  const isCar = state.vehicleMode === "car";
  const vehicleEmoji = isCar ? "🚘" : "🏍️";
  const vehicleTitle = isCar ? "VEÍCULO" : "MOTO";
  const modeLabel = isCar ? "Carro" : "Moto";

  const lines = [
    `Olá! Vim pelo site da ${CONFIG.companyName} e gostaria de solicitar um atendimento.`,
    "",
    `${vehicleEmoji} ${vehicleTitle}`,
    `Categoria: ${modeLabel}`,
    lineIf("Marca", state.vehicle.brand),
    lineIf("Modelo", state.vehicle.model),
    lineIf("Ano", state.vehicle.year),
    lineIf("Tipo", state.vehicle.bodyType),
    lineIf("Cor", state.vehicle.color),
    lineIf("Placa", state.vehicle.plate)
  ].filter(line => line !== null);

  if (state.conditions.length) {
    lines.push("", "🔎 SITUAÇÃO ATUAL");
    state.conditions.forEach(item => lines.push(`• ${item}`));
  }

  const grouped = groupServicesByCategory();

  Object.entries(grouped).forEach(([category, services]) => {
    lines.push("", `${categoryEmoji(category)} ${category.toUpperCase()}`);
    services.forEach(item => lines.push(`• ${item.name}`));
  });

  if (hasPolishingService()) {
    const polishDetails = [
      lineIf("Objetivo", state.polish.goal),
      lineIf("Estado informado", state.polish.surfaceCondition),
      lineIf("Proteção desejada", state.polish.postProtection),
      state.polish.inPersonEvaluation ? "Avaliação presencial: Sim" : null
    ].filter(Boolean);

    if (polishDetails.length) {
      lines.push("", "🎯 POLIMENTO PERSONALIZADO", ...polishDetails);
    }

    lines.push("Observação: o nível de correção e o número de etapas serão definidos após análise da superfície.");
  }

  lines.push(
    "",
    "📅 PREFERÊNCIA DE ATENDIMENTO",
    `Data: ${formatDate(state.appointment.date)}`,
    `Período: ${state.appointment.period}`,
    "Disponibilidade: aguardando confirmação pelo WhatsApp.",
    "",
    "👤 CLIENTE",
    `Nome: ${state.client.name}`,
    `Telefone: ${state.client.phone}`
  );

  if (state.client.neighborhood) {
    lines.push(`Cidade / bairro: ${state.client.neighborhood}`);
  }

  if (state.client.notes) {
    lines.push("", "📝 OBSERVAÇÕES", state.client.notes);
  }

  lines.push(
    "",
    "Gostaria de verificar disponibilidade e receber uma avaliação/orçamento."
  );

  return lines
    .filter(line => line !== null && line !== undefined && String(line).trim() !== "undefined" && String(line).trim() !== "null")
    .join("\n");
}

function openWhatsApp() {
  syncStateFromForm();

  // Validação final garante que o usuário não pule requisitos.
  const valid =
    validateStep(1) &&
    state.services.length > 0 &&
    validateStep(6);

  if (!valid) {
    showFormMessage("Revise os dados obrigatórios antes de abrir o WhatsApp.", "error");
    return;
  }

  if (!CONFIG.whatsapp || !/^\d{10,15}$/.test(CONFIG.whatsapp)) {
    showFormMessage("O número do WhatsApp ainda não foi configurado corretamente no script.js.", "error");
    return;
  }

  const message = generateWhatsAppMessage();
  const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;

  trackEvent("whatsapp_clicked", {
    vehicleMode: state.vehicleMode,
    servicesCount: state.services.length
  });

  trackEvent("booking_completed");

  window.open(url, "_blank", "noopener,noreferrer");
}

function lineIf(label, value) {
  return value ? `${label}: ${value}` : null;
}

function categoryEmoji(category) {
  const lower = normalize(category);

  if (lower.includes("lavagem")) return "🧼";
  if (lower.includes("interna") || lower.includes("banco") || lower.includes("couro")) return "🪑";
  if (lower.includes("polimento")) return "✨";
  if (lower.includes("pintura") || lower.includes("protecao")) return "💎";
  if (lower.includes("vidro")) return "🪟";
  if (lower.includes("farol") || lower.includes("lente") || lower.includes("painel")) return "💡";
  if (lower.includes("roda") || lower.includes("pneu")) return "🛞";
  if (lower.includes("motor")) return "⚙️";
  if (lower.includes("metal")) return "🔩";
  return "➕";
}

/* =========================================================
   FAQ
   ========================================================= */
function initializeFAQ() {
  document.querySelectorAll(".faq-question").forEach(button => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const isOpen = item.classList.contains("open");

      document.querySelectorAll(".faq-item.open").forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove("open");
          openItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        }
      });

      item.classList.toggle("open", !isOpen);
      button.setAttribute("aria-expanded", String(!isOpen));
    });
  });
}

/* =========================================================
   ANIMAÇÕES
   ========================================================= */
function initializeAnimations() {
  const targets = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    targets.forEach(item => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(item => observer.observe(item));
}

/* =========================================================
   CONTEÚDO DINÂMICO
   ========================================================= */
function initializeStaticContent() {
  el.currentYear.textContent = new Date().getFullYear();
  renderContactContent();
}

function renderContactContent() {
  const cards = [];
  const footerItems = [];

  if (CONFIG.whatsapp && /^\d{10,15}$/.test(CONFIG.whatsapp)) {
    cards.push(`
      <article class="contact-card">
        <span>WhatsApp</span>
        <a href="https://wa.me/${CONFIG.whatsapp}" target="_blank" rel="noopener noreferrer">Abrir conversa</a>
      </article>
    `);
    footerItems.push(`<a href="https://wa.me/${CONFIG.whatsapp}" target="_blank" rel="noopener noreferrer">WhatsApp</a>`);
  }

  if (CONFIG.instagram) {
    cards.push(`
      <article class="contact-card">
        <span>Instagram</span>
        <strong>${escapeHTML(CONFIG.instagram)}</strong>
      </article>
    `);
    footerItems.push(`<span>${escapeHTML(CONFIG.instagram)}</span>`);
  }

  if (CONFIG.address) {
    cards.push(`
      <article class="contact-card">
        <span>Endereço</span>
        <strong>${escapeHTML(CONFIG.address)}</strong>
      </article>
    `);
    footerItems.push(`<span>${escapeHTML(CONFIG.address)}</span>`);
  }

  if (CONFIG.openingHours) {
    cards.push(`
      <article class="contact-card">
        <span>Horário</span>
        <strong>${escapeHTML(CONFIG.openingHours)}</strong>
      </article>
    `);
    footerItems.push(`<span>${escapeHTML(CONFIG.openingHours)}</span>`);
  }

  if (!cards.length) {
    cards.push(`
      <article class="contact-card">
        <span>Dados de contato</span>
        <strong>Configure WhatsApp, Instagram, endereço e horário no objeto CONFIG do script.js.</strong>
      </article>
    `);
  }

  el.contactGrid.innerHTML = cards.join("");
  el.footerContact.insertAdjacentHTML("beforeend", footerItems.join(""));
}

/* =========================================================
   EVENTOS DE CONVERSÃO
   Ponto central para futura integração com GA4, GTM ou Pixel.
   ========================================================= */
function trackEvent(eventName, payload = {}) {
  console.log(`[trackEvent] ${eventName}`, payload);
}

/* =========================================================
   HELPERS
   ========================================================= */
function getAllServiceIds(mode) {
  return SERVICE_CATALOG[mode].flatMap(category => category.services.map(item => item.id));
}

function normalize(value = "") {
  return value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function formatDate(dateString) {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-");
  if (!year || !month || !day) return dateString;

  return `${day}/${month}/${year}`;
}

function escapeHTML(value = "") {
  return value
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
