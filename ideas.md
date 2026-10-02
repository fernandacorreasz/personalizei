# Direção visual — Configurador de Camisa 3D

## Abordagens consideradas

### 1. Oficina Editorial
Uma ferramenta com aparência de atelier contemporâneo: papel, tecido, marcações de molde e uma interface silenciosamente sofisticada. A experiência transmite precisão manual e cuidado com o acabamento.

**Probabilidade:** 0,07

### 2. Painel Esportivo Neon
Uma cabine digital de personalização com fundo escuro, contrastes luminosos e linguagem inspirada em transmissão esportiva. A experiência seria mais energética, tecnológica e orientada a impacto visual.

**Probabilidade:** 0,04

### 3. Catálogo Modular
Uma interface clara e utilitária, inspirada em catálogos de materiais e fichas de produto, com cartões modulares, controles diretos e foco em comparação de variações.

**Probabilidade:** 0,09

## Abordagem escolhida: Oficina Editorial

### Design Movement
Editorial craft / Swiss modernism aplicado a uma oficina de moda digital. A interface combina precisão de ferramenta técnica com a materialidade de um estúdio de confecção.

### Core Principles
- **Precisão visível:** controles e estados devem explicar o que está acontecendo sem parecer uma tela técnica fria.
- **Materialidade discreta:** papel, tecido, linhas de molde e sombras suaves criam profundidade sem competir com a camisa.
- **Assimetria funcional:** a composição principal reserva protagonismo ao modelo 3D, enquanto o painel de edição funciona como uma bancada lateral.
- **Decisão em camadas:** primeiro escolher o arquivo, depois ajustar, por fim revisar e exportar; cada etapa deve reduzir a incerteza.

### Color Philosophy
O fundo marfim remete a papel de molde e mantém a camisa legível. O azul- tinta cria a base de confiança e contraste para a interface. O laranja vermelhão é a cor proprietária de ação: aparece em marcações, seleções, pontos de posicionamento e no botão de exportação, como uma linha de corte que indica decisão.

### Layout Paradigm
Uma bancada de trabalho assimétrica: barra superior curta para contexto e ações, área central ampla para o palco 3D e painel lateral para propriedades. Em telas pequenas, o painel se converte em uma gaveta inferior persistente, mantendo o modelo visível e permitindo edição por toque.

### Signature Elements
- Marcações de molde e linhas finas de registro usadas como textura de fundo e divisores.
- Pequenos rótulos editoriais em caixa alta, com numeração de etapas e unidades explícitas.
- Um cursor/ponto de edição em laranja vermelhão sobre a camisa, reforçando que o objeto pode ser manipulado.

### Interaction Philosophy
A interface deve se comportar como uma ferramenta de oficina: ao selecionar um elemento, ele recebe uma marcação clara; ao mover a logo, os controles respondem imediatamente; ao exportar, o sistema mostra uma confirmação objetiva. Nada deve parecer decorativo quando está sendo usado.

### Animation
Usar transições de 160–240 ms com easing de saída forte. A entrada do palco 3D deve ser um deslocamento curto e uma revelação por opacidade; controles aparecem em cascata discreta. O giro da camisa é direto, sem animação artificial. Respeitar `prefers-reduced-motion` e manter ações de teclado instantâneas.

### Typography System
- **Display:** Fraunces, usada nos títulos curtos e no nome do produto, com contraste editorial.
- **Interface:** DM Sans, para rótulos, controles e instruções, em pesos 500–700.
- Hierarquia: títulos entre 32–56 px; títulos de painel entre 16–18 px; metadados entre 10–12 px com espaçamento de letras; valores e medidas em 14–16 px.

### Brand Essence
**Uma bancada digital para transformar uma ideia de estampa em uma camisa pronta para revisar — para criadores, equipes e pequenas marcas que precisam decidir com clareza antes de produzir.**

Personalidade: **criteriosa, tátil, confiante**.

### Brand Voice
Headlines soam como instruções de criação, não como slogans genéricos. CTAs são específicos e orientados à ação. Microcopy informa estado, unidade e consequência.

Exemplos:
- “Vista a ideia antes de produzir.”
- “Ajuste a marca. Revise o caimento. Exporte a arte.”

### Wordmark & Logo
O símbolo é uma fita geométrica dobrada que sugere simultaneamente gola, molde e cursor de edição. O wordmark usa uma serif editorial compacta com uma pequena interrupção gráfica no “3D”, evitando tipografia padrão sem criar um logotipo literal.

### Signature Brand Color
**Vermelhão de Registro — #E4572E.** É uma cor de oficina e decisão: quente o bastante para guiar a atenção, mas menos previsível que o vermelho esportivo puro.

## Style Decisions
- O palco 3D é o elemento dominante; a UI deve enquadrá-lo, não cobri-lo.
- A cor #E4572E fica reservada a ações, seleções e marcações de posicionamento.
- Nenhum cartão deve parecer um bloco genérico: usar linhas de registro, sombras de papel e bordas assimétricas quando apropriado.

## Style Decisions

- A mesa de padrão aparece como linguagem estrutural, com mais linhas de registro, rótulos dimensionais e divisões técnicas.
- O render da camisa recebe contraste de costura, sombra e zona de impressão mais evidente para parecer pronto para revisão.
- O símbolo de marca combina gola, fita dobrada e cursor; o wordmark editorial recebe uma interrupção visual em “3D”.
- O vermelhão funciona como marca de decisão: seleção, registro, posicionamento e exportação.
