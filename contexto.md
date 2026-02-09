Você é um engenheiro front-end sênior especialista em React + CSS responsivo + design systems. Quero que você refatore a estilização do meu projeto de portfólio (aplicação React) criando um conjunto de TOKENS e CLASSES GLOBAIS no `src/index.css` (ou `src/styles/index.css` importado no entrypoint), e atualize os componentes React para usar essas classes (sem quebrar nada). 

OBJETIVO PRIMORDIAL: responsividade impecável (mobile-first) em qualquer tela (320px → ultrawide), incluindo a área de “minigames online” (iframes/canvas/divs) e todas as seções do portfólio. Não pode haver scroll horizontal. Layout deve se adaptar com grids fluidos, tipografia com clamp e containers com max-width.

CONTEXTO VISUAL (baseado no layout atual):
- Landing com hero central (foto circular + título “Welcome…”) e seção “Skills” em grid do lado direito.
- Muito espaço vazio no topo e hierarquia fraca (landing crua).
- No mobile, hero + skills lado a lado tende a quebrar; precisamos empilhar e controlar espaçamentos e tamanhos.

PALETA / ESTILO (White Tech Clean, foco em branco):
Defina CSS variables e use consistentemente:
- --bg: #FFFFFF;
- --bg-soft: #F6F8FC;
- --card: #FFFFFF;
- --border: #E6EAF2;
- --text: #0B1220;
- --text-2: #52607A;
- --muted: #7E8AA3;
- --primary: #2563EB;
- --accent: #14B8A6;
- --success: #16A34A;
- --warning: #F59E0B;
- --danger: #EF4444;

REQUISITOS TÉCNICOS (React + CSS):
1) Refatoração do CSS Global (index.css)
   - Crie um mini design system: tokens de cores, espaçamento, radius, sombras, typography.
   - Reset e base: box-sizing, img max-width, fontes, antialiasing, links, buttons.
   - Tipografia responsiva com `clamp()` para h1/h2/body/lead.
   - Utilitários globais de layout e componentes: container, section, grid, card, button, chips.
   - Acessibilidade: `:focus-visible`, targets clicáveis (>=44px), `prefers-reduced-motion`.

2) Responsividade (MUITO IMPORTANTE)
   - Abordagem mobile-first.
   - Breakpoints sugeridos: 480px, 768px, 1024px, 1280px.
   - Evite medidas fixas em largura/altura; use `max-width`, `min()`, `clamp()`, `auto-fit`.
   - Garanta que não exista overflow-x: aplique regras preventivas e revise containers.

3) Minigames (prioridade altíssima)
   - Se usar iframe: criar `.gameShell` + `.gameViewport` com `aspect-ratio` e `width:100%`.
   - Se usar canvas: o canvas deve escalar responsivo sem distorcer e sem estourar o container.
   - Criar classes: `.gameShell`, `.gameHeader`, `.gameActions`, `.gameViewport`, `.gameFrame`, `.gameCanvas`.
   - Mobile: o jogo não pode ficar minúsculo; usar limites com `min-height`, `max-height` e `svh/dvh` quando útil.
   - Nenhum jogo pode causar scroll horizontal.

4) Estrutura de componentes React (refatorar para usar classes globais)
   - Atualize os componentes do layout (Navbar, Hero, Skills, Projects, GamePage) para usar as classes globais.
   - Onde fizer sentido, crie componentes reutilizáveis (ex.: `<Container />`, `<Section />`, `<Card />`, `<Button />`) ou apenas classes globais (se preferir manter simples).
   - Não altere lógica de negócio; apenas UI/estrutura.

MELHORIAS OBRIGATÓRIAS NA LANDING (ela está “crua”):
Quero mudanças concretas na UI (com markup React) seguindo o estilo clean branco:
- HERO:
  - Título forte + subtítulo curto e objetivo.
  - 2 CTAs: “Ver Projetos” (primário) e “Contato/GitHub” (ghost).
  - Badges/chips (ex.: “Full-stack”, “React”, “Node”, “Minas Gerais”) para “social proof” leve.
- SKILLS:
  - Reduzir peso visual: tiles menores, grid fluido e elegante.
  - No mobile: virar 2 colunas (ou 1 se necessário) e permitir scroll-snap horizontal se ficar melhor.
- FEATURED PROJECTS:
  - Seção logo abaixo do hero com 3 cards de projetos (título, descrição, stack, links).
- ESPAÇAMENTOS E COMPOSIÇÃO:
  - Reduzir vazio excessivo no topo; usar paddings responsivos.
  - Background sutil (gradiente MUITO leve ou “soft section”) sem perder o clean.
- MICROINTERAÇÕES:
  - Hover/focus discretos em cards e botões; respeitar `prefers-reduced-motion`.

ENTREGÁVEIS:
A) `src/index.css` completo refatorado contendo:
   - tokens (CSS variables),
   - reset/base,
   - classes globais de layout (container/section/grid/stack),
   - componentes globais (card/btn/chip/badge/nav),
   - estilos para skills tiles,
   - estilos para game shell (iframe/canvas) com aspect-ratio e comportamento responsivo.
B) Trechos de código React (JSX) mostrando a aplicação das classes globais em:
   - `Navbar.jsx`
   - `Home.jsx` (Hero + Skills + Featured Projects)
   - `Projects.jsx`
   - `GamePage.jsx` (shell + viewport + iframe/canvas)
C) Checklist final de testes de responsividade:
   - widths: 320/375/414/768/1024/1280/1440/1920
   - verificação de overflow-x, tamanho de clique, legibilidade e layout do game viewport.

REGRAS:
- Não use Tailwind nem frameworks CSS (a menos que eu já esteja usando; ainda assim quero a solução em CSS puro com classes globais).
- Não introduza dependências novas.
- Priorize manutenção, consistência e performance.
- Se houver CSS existente redundante, consolide e remova duplicações.
- Nomeie classes de forma previsível (BEM opcional), ex.: `.container`, `.section`, `.card`, `.btnPrimary`, `.gridSkills`, `.gameShell`.

Agora entregue:
1) O `index.css` completo.
2) Os trechos React (JSX) com as mudanças aplicadas.
3) Uma lista de melhorias específicas que você implementou na landing para ficar mais inovadora, estética e clean — priorizando responsividade acima de tudo.