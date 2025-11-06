README.md - Redesenho do Website da Vodacom Moçambique
📋 Visão Geral do Projeto
Este projeto é um redesenho completo e funcional do website oficial da Vodacom Moçambique, desenvolvido para a disciplina Tecnologias Web. O foco é melhorar a usabilidade, navegação, design e experiência do usuário (UX), corrigindo limitações do site original, como falta de responsividade, busca estática e interatividade limitada.
Objetivo: Criar uma versão mobile-first, acessível e interativa, utilizando HTML5, CSS3 e JavaScript ES6, com funcionalidades como busca dinâmica, favoritos (localStorage), ordenação, FAQ, chat, modais e status de rede.
Data de Criação: Novembro 2025

 Objetivos de Aprendizagem

Aplicar tecnologias web: HTML para estrutura semântica, CSS para estilização responsiva (Grid/Flexbox, media queries, animações), JS para interatividade (DOM, localStorage, algoritmos de busca/ordenação).
Melhorar UX: Interfaces intuitivas, feedback visual (toasts, loading), acessibilidade (ARIA, WCAG AA), adaptação a dispositivos móveis.
Resolução de problemas: Análise do site original (usabilidade baixa, carregamento lento), otimização de performance (lazy loading, <2s load).


🔍 Análise do Site Original
O site da Vodacom tem:

Limitações: Navegação confusa (dropdowns sobrecarregados), busca estática, não totalmente responsivo, sem favoritos/ordenar, performance ~4s em 3G, acessibilidade parcial.
Conteúdos: Hero com promoções (VodaBora), serviços (Voz, Dados, Roaming), tarifas em tabelas, FAQ básica, mapa de lojas, notícias.
Melhorias Implementadas: Busca real-time (O(n) filter), favoritos (localStorage), ordenação (sort()), chat simulado, status rede, animações CSS, tema claro/escuro, contraste WCAG.

Pontuação Lighthouse Original: ~60/100 Performance, ~70/100 Accessibility. Novo: ~90/100.

📂 Estrutura do Projeto
textvodacom-redesenhado/
│
├── index.html                 # Página inicial (Hero, Para Si, Para Empresas, Promoções, Notícias)
├── tarifas.html               # Tarifas com favoritos, busca, ordenação, tabela dinâmica
├── suporte.html               # Suporte com FAQ, chat, formulário, status rede
├── lojas.html                 # Lojas & Cobertura com mapa, busca, lista, FAQ
├── sobre.html                 # Sobre Nós com história, missão, equipe, carreiras
│
├── styles/
│   └── main.css               # CSS responsivo, vibrante, acessível (Grid, Flexbox, animações)
│
├── scripts/
│   └── main.js                # JS modular (busca, favoritos, FAQ, chat, menu mobile, modal)
│
├── assets/
│   ├── images/
│   │   └── logo-vodacom.svg   # Logo local (fallback)
│   └── icons/
│       ├── voz.png            # Ícone Voz
│       ├── internet.png       # Ícone Internet
│       ├── roaming.svg        # Ícone Roaming
│       ├── dispositivos.png   # Ícone Dispositivos
│       ├── vodapay.png        # Ícone VodaPay
│       ├── conectividade.png  # Ícone Conectividade (Font Awesome)
│       ├── cloud.svg          # Ícone Cloud (Font Awesome)
│       └── seguranca.svg      # Ícone Segurança (Font Awesome)
│
├── README.md                  # Este arquivo
└── deployment/
    ├── vercel.json            # Configuração Vercel
    └── report.pdf             # Relatório (exemplo)