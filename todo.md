# Revisão ATRYÊ — lista de trabalho

## Exclusão da experiência de caneca

- [x] Remover navegação e referências visuais de caneca.
- [x] Remover estados, controles e lógica específicos de caneca.
- [x] Manter somente o palco e as funcionalidades de camiseta.
- [x] Remover componente e dependências não utilizadas da caneca.
- [x] Testar upload de três artes, frente/costas, zoom, cores, tabela e exportação.
- [x] Salvar checkpoint da versão exclusiva de camiseta.


## Correção de orientação e textura da caneca

- [x] Analisar Mug3D e Kianoni/chilicornmugs para mapear eixos, UV e impressão.
- [x] Validar o modelo/textura de caneca mais adequado no repositório enviado.
- [x] Corrigir a caneca para ficar em pé, sem inversão ou deformação.
- [x] Limitar a paleta comercial da caneca a branca e preta.
- [x] Alinhar a área de arte aberta e a estampa à superfície da caneca.
- [x] Testar rotação manual/automática, impressão e mobile.
- [x] Salvar checkpoint da correção.


## Correção do modelo STL da caneca

- [x] Extrair e validar `canecamugUnwrappedSTL.stl` do source.zip.
- [x] Hospedar o STL correto como ativo persistente.
- [x] Trocar o carregador OBJ pelo STLLoader.
- [x] Corrigir normais, orientação, escala, material e enquadramento.
- [x] Testar o render e preservar rotação/arte aberta.
- [x] Salvar checkpoint da correção.


## Integração da caneca do projeto enviado

- [x] Analisar novamente a referência Mug3D e registrar os comportamentos relevantes.
- [x] Inventariar o `source.zip` sem executar arquivos desconhecidos.
- [x] Localizar FBX/OBJ e texturas correspondentes da caneca.
- [x] Converter/preparar o modelo para carregamento web, se necessário.
- [x] Substituir a caneca procedural pelo modelo enviado.
- [x] Sincronizar materiais, arte, cores e área de impressão.
- [x] Validar rotação manual, automática opcional, ângulos e responsividade.
- [x] Salvar checkpoint da integração.


## Revisão da caneca e arquivos

- [x] Deixar rotação automática desligada por padrão e manter rotação manual.
- [x] Adicionar modo 3D e modo arte aberta para a caneca.
- [x] Suportar até três artes dentro do ambiente de impressão.
- [x] Criar histórico reutilizável dos arquivos enviados anteriormente.
- [x] Adicionar adição de texto e controles essenciais da caneca.
- [x] Adicionar botão de tabela de medidas somente na camiseta.
- [x] Testar desktop/mobile e salvar checkpoint.


## Expansão camiseta + caneca

- [x] Auditar as referências mug3d e floating-mug.
- [x] Permitir até três arquivos de arte, com seleção da arte ativa.
- [x] Permitir mover cada arte e manter posições independentes em frente/costas.
- [x] Restaurar a posição padrão correspondente ao alternar frente/costas.
- [x] Criar navegação ATRYÊ entre camiseta e caneca.
- [x] Adicionar formato/área de arte específico por produto.
- [x] Adicionar rotação contínua e controle de pausa/reprodução no modelo 3D.
- [x] Testar desktop/mobile e salvar checkpoint.


## Correção de visualização e WhatsApp

- [x] Aumentar a camiseta dentro do palco mantendo bordas pequenas.
- [x] Fazer os botões de zoom realmente aumentar e diminuir a prévia.
- [x] Melhorar o envio/compartilhamento da imagem no fluxo do WhatsApp.
- [x] Testar com logo, desktop e mobile e salvar checkpoint.


## WhatsApp e visual da prévia

- [x] Configurar o WhatsApp oficial +55 47 8874-0894.
- [x] Criar mensagem sutil com os dados da personalização.
- [x] Compartilhar a imagem da arte aplicada quando o navegador permitir e manter fallback de download.
- [x] Aumentar o modelo 3D para ocupar o palco com bordas pequenas.
- [x] Concluir e validar o seletor de cor personalizado.
- [x] Salvar checkpoint da revisão.


## Seletor de cor personalizado

- [ ] Adicionar seletor nativo para qualquer cor.
- [ ] Exibir e validar o código hexadecimal escolhido.
- [ ] Sincronizar a cor personalizada com o modelo GLB e testar responsividade.
- [x] Salvar checkpoint da melhoria.


## Correção da paleta

- [x] Trocar a opção escura atual por preto puro `#000000`.
- [x] Adicionar azul-bebê identificado e aplicável ao modelo 3D.
- [x] Validar visualmente a paleta e salvar checkpoint.


## Exportação da prévia

- [x] Substituir a geração de PDF por captura PNG da prévia.
- [x] Atualizar botões, textos e nome do arquivo para download de imagem.
- [x] Testar o download em desktop e mobile e tratar falhas de captura.
- [x] Salvar checkpoint da revisão de exportação.


## Melhoria de interação

- [x] Implementar arraste da logo com mouse e toque usando Pointer Events.
- [x] Adicionar preto e azul-bebê à paleta e sincronizar a cor no modelo GLB.
- [x] Testar gesto em desktop e mobile, incluindo limites da área de impressão.
- [x] Salvar checkpoint da melhoria e entregar a nova versão.


- [x] Auditar a estrutura, funcionalidades e identidade do repositório GitHub de referência.
- [x] Mapear os requisitos prioritários do prompt anexado para a primeira entrega.
- [x] Registrar a nova direção visual ATRYÊ e substituir a identidade Atelier 3D.
- [x] Adaptar o cabeçalho, catálogo inicial, temas, seleção e editor de camisa.
- [x] Implementar o fluxo de solicitação com mensagem pronta para WhatsApp.
- [x] Manter upload de logo, posicionamento, cores, vistas e exportação em PDF.
- [x] Testar a versão em desktop e mobile, incluindo estados vazios, erro e sucesso.
- [x] Salvar checkpoint da versão revisada e entregar o link do projeto.
