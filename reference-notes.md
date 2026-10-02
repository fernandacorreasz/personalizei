# Referências funcionais — expansão ATRYÊ

## Mug3D

URL: https://mug3d.com/pt/

A referência apresenta uma área 3D com controles de cor, grade, velocidade, animação contínua, direção reversa, ângulos estáticos, upload de imagem, texto e download de layout/instantâneo. Também organiza diferentes produtos em uma navegação de catálogo. Esses comportamentos serão reinterpretados no layout ATRYÊ, sem copiar sua aparência.

## floating-mug

URL: https://github.com/arielfavaro/floating-mug

O projeto usa React Three Fiber, Drei e Three.js para uma caneca 3D flutuante. O repositório tem licença MIT e inclui atenção a interação touch no canvas. A referência será usada apenas para orientar a rotação suave e o comportamento responsivo do palco.

## Decisões de produto

A primeira versão expandida terá camiseta e caneca como produtos alternáveis. Cada produto terá área segura/formato de arte próprio. O usuário poderá carregar até três imagens, selecionar qual está ativa, arrastar cada uma e manter posições independentes entre frente e costas. Ao trocar a vista, a composição voltará à posição padrão daquela vista. A rotação será contínua, com controle de pausar/retomar e velocidade.

## Análise adicional de chilicornmugs

URL: https://github.com/Kianoni/chilicornmugs/tree/master/blender

O diretório Blender contém arquivos `.blend` (`newmug.blend`, `oldmug.blend`, `chilicornmugs.blend` e uma versão com tecido), texturas PNG e renders. Não há OBJ/FBX/GLB exportável no repositório, portanto ele serve como referência visual e de processo, não como modelo diretamente carregável no navegador. O render mostra canecas em pé, com abertura para cima, alças visíveis lateralmente e estampa aplicada na face cilíndrica. O repositório declara CC0 em `license.md`, mas o modelo atual ATRYÊ continua sendo o STL do pacote enviado pelo usuário.

A referência Mug3D mostra uma área aberta de 210 × 95 mm, upload de imagem/texto, rotação manual, animação opcional, ângulos prontos, cores de componentes e download de layout/PNG. A implementação ATRYÊ usa esses comportamentos como inspiração, mantendo identidade, layout e fluxo comercial próprios.
