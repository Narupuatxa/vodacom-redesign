/* ==========================================================================
   MAIN.JS – VODACOM MOÇAMBIQUE REDESENHADO
   Versão: Profissional, Modular, Escalável
   Funcionalidades: Busca, Tarifas, Suporte, Favoritos, UI
   ========================================================================== */

/* ==========================================================================
   1. CONFIGURAÇÕES GLOBAIS
   ========================================================================== */

const CONFIG = {
  debounceDelay: 300,
  toastDuration: 3000,
  chatAutoResponseDelay: 1000,
  networkCheckInterval: 30000,
};

/* Dados Completos de Tarifas (Atualizados Nov 2025) */
const PLANOS_DATA = [
  { id: 1, nome: "VodaBora 5GB", preco: 150, categoria: "Dados", descricao: "5GB + 300min voz, 30 dias", data: "2025-11-01" },
  { id: 2, nome: "Super Voz", preco: 250, categoria: "Voz", descricao: "Ilimitado nacional", data: "2025-10-20" },
  { id: 3, nome: "Roaming EU", preco: 800, categoria: "Roaming", descricao: "2GB + chamadas", data: "2025-11-05" },
  { id: 4, nome: "Pós-Pago Elite", preco: 500, categoria: "Pós", descricao: "20GB + dispositivo/mês", data: "2025-09-15" },
  { id: 5, nome: "VodaPay Pack", preco: 0, categoria: "Pagamentos", descricao: "Carteira digital grátis", data: "2025-10-10" },
  { id: 6, nome: "VodaBora 10GB", preco: 250, categoria: "Dados", descricao: "10GB + WhatsApp grátis, 30 dias", data: "2025-11-01" },
  { id: 7, nome: "Voz Nacional 500min", preco: 100, categoria: "Voz", descricao: "500 minutos nacionais, 7 dias", data: "2025-10-25" },
  { id: 8, nome: "Roaming África", preco: 300, categoria: "Roaming", descricao: "1GB + 100min, África do Sul/etc.", data: "2025-11-03" },
  { id: 9, nome: "Pós-Pago Básico", preco: 200, categoria: "Pós", descricao: "5GB + 200min/mês", data: "2025-09-20" },
  { id: 10, nome: "SMS Pack 1000", preco: 50, categoria: "Voz", descricao: "1000 SMS, 30 dias", data: "2025-10-15" },
  { id: 11, nome: "Internet Diária 500MB", preco: 20, categoria: "Dados", descricao: "500MB/dia", data: "2025-11-06" },
  { id: 12, nome: "Voz Internacional", preco: 5, categoria: "Voz", descricao: "Por minuto internacional", data: "2025-10-01" },
  { id: 13, nome: "Roaming Global", preco: 1000, categoria: "Roaming", descricao: "5GB mundial, 7 dias", data: "2025-11-02" },
  { id: 14, nome: "Pós-Pago Premium", preco: 800, categoria: "Pós", descricao: "50GB + ilimitado voz/mês", data: "2025-09-10" },
  { id: 15, nome: "VodaBora Semanal", preco: 80, categoria: "Dados", descricao: "2GB/semana", data: "2025-10-30" },
];

/* FAQs Reais */
const FAQS_DATA = [
  { pergunta: "Como recarregar saldo?", resposta: "Marque *150# e siga as instruções. Ou use o app VodaPay." },
  { pergunta: "Como ativar um pacote de internet?", resposta: "Disque *151# → selecione Dados → escolha o pacote." },
  { pergunta: "Qual é o código para verificar saldo?", resposta: "Marque *100#." },
  { pergunta: "Como falar com um atendente?", resposta: "Ligue 1111 (pré-pago) ou 84111 (pós-pago)." },
  { pergunta: "Como configurar internet no celular?", resposta: "Envie SMS com 'NET' para 12345." },
  { pergunta: "O que fazer se o sinal estiver fraco?", resposta: "Reinicie o celular ou mude de local. Verifique cobertura em Lojas & Cobertura." },
  { pergunta: "Como bloquear chamadas indesejadas?", resposta: "Marque *35*0000# para ativar bloqueio." },
  { pergunta: "Como transferir saldo?", resposta: "Use *150*numero*valor#." },
];

/* ==========================================================================
   2. UTILIDADES
   ========================================================================== */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
};

const showToast = (message, type = 'success') => {
  const toast = $('#toast') || document.createElement('div');
  toast.id = 'toast';
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, CONFIG.toastDuration);
};

/* ==========================================================================
   3. FAVORITOS (localStorage)
   ========================================================================== */

const Favoritos = {
  get: () => JSON.parse(localStorage.getItem('vodacom-favoritos') || '[]'),
  toggle: (id) => {
    const favs = Favoritos.get();
    const index = favs.indexOf(id);
    if (index > -1) {
      favs.splice(index, 1);
      showToast('Removido dos favoritos', 'info');
    } else {
      favs.push(id);
      showToast('Adicionado aos favoritos!', 'success');
    }
    localStorage.setItem('vodacom-favoritos', JSON.stringify(favs));
    return favs;
  },
  isFavorite: (id) => Favoritos.get().includes(id),
};

/* ==========================================================================
   4. UI COMPONENTS
   ========================================================================== */

/* --- Modal Genérico --- */
const Modal = {
  open: (title, content) => {
    const modal = $('#modal');
    const modalTitle = $('#modal-title') || modal.querySelector('h3');
    const modalText = $('#modal-text') || modal.querySelector('p');
    if (modalTitle) modalTitle.textContent = title;
    if (modalText) modalText.innerHTML = content;
    modal.style.display = 'flex';
    modal.querySelector('.close')?.focus();
  },
  close: () => {
    $('#modal').style.display = 'none';
  },
};

/* --- Menu Mobile --- */
const MenuMobile = {
  init: () => {
    const toggle = $('.menu-toggle');
    const navList = $('.nav-list');
    if (!toggle || !navList) return;

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !expanded);
      navList.classList.toggle('open');
    });

    // Fecha ao clicar fora
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav') && !e.target.closest('.menu-toggle')) {
        navList.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  },
};

/* --- Dropdowns Desktop --- */
const Dropdowns = {
  init: () => {
    $$('.dropdown').forEach(dd => {
      dd.addEventListener('mouseenter', () => dd.querySelector('.dropdown-menu').style.display = 'block');
      dd.addEventListener('mouseleave', () => dd.querySelector('.dropdown-menu').style.display = 'none');
    });
  },
};

/* --- Busca Global com Autocompletar --- */
const BuscaGlobal = {
  init: () => {
    const input = $('#global-search');
    const btn = $('#search-btn');
    if (!input || !btn) return;

    const searchHandler = debounce((query) => {
      if (query.length < 2) return;
      const sugestoes = PLANOS_DATA
        .filter(p => p.nome.toLowerCase().includes(query) || p.categoria.toLowerCase().includes(query))
        .slice(0, 3)
        .map(p => p.nome);
      if (sugestoes.length > 0) {
        showToast(`Sugestões: ${sugestoes.join(', ')}`, 'info');
      }
    }, CONFIG.debounceDelay);

    input.addEventListener('input', (e) => searchHandler(e.target.value.toLowerCase()));
    btn.addEventListener('click', () => {
      const query = input.value.trim();
      if (query) window.location.href = `tarifas.html?search=${encodeURIComponent(query)}`;
    });
  },
};

/* ==========================================================================
   5. PÁGINA: TARIFAS
   ========================================================================== */

const TarifasPage = {
  init: () => {
    if (!document.querySelector('#tarifas-table')) return;

    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery) {
      $('#search-plano').value = searchQuery;
    }

    TarifasPage.render();
    TarifasPage.setupEvents();
  },

  render: (data = PLANOS_DATA) => {
    const tbody = $('#tarifas-table tbody');
    const favoritos = Favoritos.get();

    tbody.innerHTML = data.map(plano => `
      <tr>
        <td>${plano.nome}</td>
        <td>${plano.categoria}</td>
        <td>${plano.preco} MZN</td>
        <td>${plano.descricao}</td>
        <td><img src="${plano.imagem || 'https://images.unsplash.com/photo-1518770660439-24edd4c8784d?w=50'}" alt="${plano.nome}" loading="lazy"></td>
        <td>
          <button class="btn-primary" onclick="Modal.open('Ativar ${plano.nome}', 'Disque *151#<br>Validade: ${plano.data}')">
            Ativar
          </button>
          <button class="btn-secondary" onclick="Favoritos.toggle(${plano.id}); TarifasPage.render()" style="margin-left: 0.5rem;">
            ${Favoritos.isFavorite(plano.id) ? 'Remover' : 'Favorito'}
          </button>
        </td>
      </tr>
    `).join('');
  },

  setupEvents: () => {
    const search = $('#search-plano');
    const categoria = $('#filter-categoria');
    const ordenar = $('#sort-plano');
    const limpar = $('#clear-filters');

    const filtrar = () => {
      let filtrados = [...PLANOS_DATA];
      const q = search.value.toLowerCase();
      const cat = categoria.value;

      if (q) {
        filtrados = filtrados.filter(p =>
          p.nome.toLowerCase().includes(q) ||
          p.descricao.toLowerCase().includes(q) ||
          p.categoria.toLowerCase().includes(q)
        );
      }
      if (cat) filtrados = filtrados.filter(p => p.categoria === cat);

      const sort = ordenar.value;
      if (sort === 'preco-asc') filtrados.sort((a, b) => a.preco - b.preco);
      else if (sort === 'preco-desc') filtrados.sort((a, b) => b.preco - a.preco);
      else if (sort === 'data') filtrados.sort((a, b) => new Date(b.data) - new Date(a.data));

      TarifasPage.render(filtrados);
      showToast(`${filtrados.length} plano(s) encontrado(s)`);
    };

    search.addEventListener('input', debounce(filtrar, 300));
    categoria.addEventListener('change', filtrar);
    ordenar.addEventListener('change', filtrar);
    limpar.addEventListener('click', () => {
      search.value = '';
      categoria.value = '';
      ordenar.value = 'preco-asc';
      TarifasPage.render();
    });
  },
};

/* ==========================================================================
   6. PÁGINA: SUPORTE
   ========================================================================== */

const SuportePage = {
  init: () => {
    if (!$('#faq-list') && !$('#contact-form') && !$('#chat-modal')) return;

    SuportePage.renderFAQs();
    SuportePage.setupFAQSearch();
    SuportePage.setupForm();
    SuportePage.setupChat();
    SuportePage.setupNetworkStatus();
  },

  renderFAQs: (filter = '') => {
    const list = $('#faq-list');
    const filtered = FAQS_DATA.filter(f =>
      f.pergunta.toLowerCase().includes(filter) || f.resposta.toLowerCase().includes(filter)
    );
    list.innerHTML = filtered.map((f, i) => `
      <div class="faq-item">
        <button class="faq-question" aria-expanded="false" onclick="SuportePage.toggleFAQ(this)">
          <span>${f.pergunta}</span>
          <i class="fas fa-chevron-down"></i>
        </button>
        <div class="faq-answer">${f.resposta}</div>
      </div>
    `).join('');
  },

  toggleFAQ: (btn) => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !expanded);
    const answer = btn.nextElementSibling;
    answer.style.maxHeight = expanded ? '0' : answer.scrollHeight + 'px';
  },

  setupFAQSearch: () => {
    const input = $('#faq-search');
    if (!input) return;
    input.addEventListener('input', debounce((e) => {
      SuportePage.renderFAQs(e.target.value.toLowerCase());
    }, 300));
  },

  setupForm: () => {
    const form = $('#contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      const fields = ['nome', 'telefone', 'assunto', 'mensagem'];

      fields.forEach(id => {
        const field = $(`#${id}`);
        const error = field.parentElement.querySelector('.error');
        const value = field.value.trim();

        if (!value || (id === 'telefone' && !/^\d{9}$/.test(value))) {
          error.textContent = id === 'telefone' ? 'Telefone deve ter 9 dígitos' : 'Campo obrigatório';
          valid = false;
        } else {
          error.textContent = '';
        }
      });

      if (valid) {
        showToast('Mensagem enviada! Responderemos em até 24h.', 'success');
        form.reset();
      }
    });
  },

  setupChat: () => {
    const fab = $('.chat-fab');
    const modal = $('#chat-modal');
    const input = $('#chat-input');
    const body = $('#chat-body');

    if (!fab || !modal) return;

    const open = () => {
      modal.style.display = 'block';
      input.focus();
    };
    const close = () => modal.style.display = 'none';
    const send = () => {
      const msg = input.value.trim();
      if (!msg) return;
      body.innerHTML += `<div class="message user">${msg}</div>`;
      input.value = '';
      setTimeout(() => {
        body.innerHTML += `<div class="message bot">Obrigado! Um atendente irá responder em breve.</div>`;
        body.scrollTop = body.scrollHeight;
      }, CONFIG.chatAutoResponseDelay);
      body.scrollTop = body.scrollHeight;
    };

    fab.addEventListener('click', open);
    modal.querySelector('.close').addEventListener('click', close);
    input.addEventListener('keypress', (e) => e.key === 'Enter' && send());
    modal.querySelector('button').addEventListener('click', send);
  },

  setupNetworkStatus: () => {
    const update = () => {
      const isOnline = Math.random() > 0.1;
      $('#status-text').textContent = isOnline
        ? 'Rede 100% operacional em todo Moçambique'
        : 'Algumas áreas com instabilidade. Estamos resolvendo.';
      $('#status-indicator').className = isOnline ? 'status-online' : 'status-degraded';
      $('#status-indicator').textContent = isOnline ? 'Online' : 'Degradado';
    };
    update();
    setInterval(update, CONFIG.networkCheckInterval);
  },
};

/* ==========================================================================
   7. INICIALIZAÇÃO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // UI Global
  MenuMobile.init();
  Dropdowns.init();
  BuscaGlobal.init();

  // Modal Close
  $('#modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal' || e.target.classList.contains('close')) {
      Modal.close();
    }
  });

  // Páginas Específicas
  TarifasPage.init();
  SuportePage.init();

  // Ativar SIM Button
  $('#ativar-sim')?.addEventListener('click', () => {
    Modal.open('Ativar SIM', 'Preencha o formulário ou disque *151#.');
  });
});