# Projeto ATRYÊ — Configurador 3D

## Visão

O configurador ATRYÊ transforma a personalização de camisetas em uma experiência visual, simples e compartilhável. A direção criativa combina o cuidado artesanal do Sweet Studio com o universo Weird Cute da marca, usando cream, cocoa, cherry e lilac em uma interface editorial de oficina.

## Fluxo do usuário

1. O usuário escolhe a cor da camiseta.
2. Envia até três arquivos de imagem.
3. Seleciona a arte ativa e posiciona-a diretamente na área segura da camiseta.
4. Alterna entre frente e costas sem perder as posições salvas.
5. Ajusta o zoom para visualizar a aplicação.
6. Baixa um PNG da composição ou envia o pedido pelo WhatsApp.

## Recursos implementados

- Modelo `shirt_baked.glb` em Three.js.
- Vistas frente e costas.
- Zoom real do palco entre 90% e 155%.
- Até três logos com seleção individual.
- Histórico local de arquivos enviados.
- Drag-and-drop e toque com Pointer Events.
- Limites de movimentação para respeitar a área segura de impressão.
- Paleta ATRYÊ, incluindo preto `#000000`, azul-bebê `#B9DDF5` e cor HEX livre.
- Captura PNG do palco com `html2canvas`.
- Compartilhamento nativo quando disponível e fallback para download + WhatsApp.
- WhatsApp configurado para `+55 47 8874-0894`.
- Botão de tabela de medidas reservado para conteúdo futuro.

## Decisões de produto

- A experiência de caneca foi removida para manter o escopo focado em camiseta.
- PDF foi substituído por PNG por maior compatibilidade em dispositivos móveis.
- A rotação automática não faz parte do produto atual; o modelo permanece estável para facilitar o posicionamento da arte.

## Próximos passos

- Edição de texto diretamente no modelo 3D.
- Conteúdo real da tabela de medidas.
- Modelos adicionais, como oversized e manga longa.
- Backend ou WhatsApp Business API para recebimento automatizado de arquivos.
