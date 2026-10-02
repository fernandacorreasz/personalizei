# ATRYÊ — Configurador 3D de Camiseta

Configurador responsivo da ATRYÊ (Sweet Studio × Weird Cute) para personalização de camisetas com até três artes, posicionamento por toque/mouse, visualização frente/costas, cores da marca, exportação PNG e pedido via WhatsApp.

## Stack

- React 19 + Vite + TypeScript
- Three.js, `@react-three/fiber` e `@react-three/drei`
- Tailwind CSS 4
- `html2canvas` para exportação PNG
- `lucide-react` e `sonner`

## Desenvolvimento

```bash
pnpm install
pnpm dev
```

Validação:

```bash
pnpm check
pnpm build
```

## Funcionalidades

- Modelo 3D de camiseta com vistas frente e costas
- Zoom entre 90% e 155%
- Upload de até três logos simultâneas
- Seleção de arte ativa e histórico local para reutilização
- Arraste com mouse, toque ou caneta usando Pointer Events
- Paleta ATRYÊ com preto `#000000`, azul-bebê `#B9DDF5` e seletor HEX personalizado
- Área segura de impressão
- Exportação da composição como PNG
- Pedido direcionado ao WhatsApp `+55 47 8874-0894`
- Botão reservado para futura tabela de medidas

## Assets WebDev

O modelo GLB e os elementos gráficos persistentes são servidos pelo armazenamento do WebDev via `/manus-storage/`. Em ambiente WebDev, mantenha os assets persistentes configurados para os caminhos referenciados em `client/src/components/ShirtCanvas.tsx`, `client/src/pages/Home.tsx` e `client/src/index.css`.

## Estrutura principal

- `client/src/pages/Home.tsx` — fluxo da personalização, upload, exportação e WhatsApp
- `client/src/components/ShirtCanvas.tsx` — renderização Three.js do modelo
- `client/src/index.css` — identidade visual e responsividade
- `docs/projeto-atrye.md` — visão, funcionalidades e roadmap
