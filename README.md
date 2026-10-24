# Site pessoal — Kleinner Farias

Site estático em HTML, CSS e JavaScript. Visual inspirado na organização e na atmosfera do [Neural Interfaces 2026](https://neural-interfaces26.github.io/), com código e ilustração próprios. Não exige Node, npm ou compilação.

## Pré-requisitos

- Git e Python 3 instalados.
- Conta no GitHub.

## Abrir localmente

No Terminal, entre na pasta do projeto e execute:

```bash
python3 -m http.server 8000
```

Abra `http://localhost:8000`. Para interromper: `Ctrl+C`. Edite `index.html` para alterar textos e seções, `styles.css` para cores e layout, `script.js` para interações. Atualize a página para ver o resultado.

## Publicar pela primeira vez

1. Revise a fotografia, o e-mail institucional, os textos, a afiliação e os registros de publicações.
2. Crie **um repositório público vazio** no GitHub chamado `kleinner-farias-site`. Não marque a opção de adicionar README, licença ou `.gitignore` (já há arquivos locais).
3. No Terminal, dentro da pasta do projeto, execute os comandos abaixo. Substitua `SEU_USUARIO` pelo seu login do GitHub:

```bash
git init -b main
git add .
git commit -m "Criar site pessoal"
git remote add origin https://github.com/SEU_USUARIO/kleinner-farias-site.git
git push -u origin main
```

4. No repositório no GitHub, abra **Settings → Pages → Build and deployment**. Em **Source**, selecione **Deploy from a branch**. Em **Branch**, selecione `main` e `/ (root)`; clique **Save**.
5. A página ficará em `https://SEU_USUARIO.github.io/kleinner-farias-site/`. Aguarde a conclusão da publicação indicada em **Actions** ou **Settings → Pages**.

Para ter o endereço curto `https://SEU_USUARIO.github.io/`, crie o repositório com o nome exato `SEU_USUARIO.github.io` no passo 2 e use esse mesmo nome no comando `git remote add origin`.

## Edições posteriores

```bash
git status
git add .
git commit -m "Atualizar conteúdo do site"
git push
```

Cada `push` para `main` atualiza o GitHub Pages após a publicação. Para trabalhar em outra máquina, use `git clone https://github.com/SEU_USUARIO/kleinner-farias-site.git` e entre na pasta criada.

## Observações

- O site usa fontes do Google Fonts; sem internet, o navegador usa fontes locais alternativas.
- O e-mail de contato configurado é `kleinnerfarias@unisinos.br`.
- A referência visual é de terceiros. Não foram copiadas imagens, textos ou código do site original.

## Novidades da versão 2

- Retrato profissional local em `assets/kleinner-farias.png`, recuperado do retrato anteriormente salvo pelo usuário.
- Publicações no menu e biblioteca com busca por título, autor e tema, filtros por ano e tipo.
- BibTeX, APA 7 e Chicago (bibliografia) em texto simples, cópia para área de transferência e download `.bib` individual ou de toda a seleção.
- Cinco registros iniciais reais; preprint identificado como tal. Os nomes usados nas referências seguem os registros consultados das publicações.
- E-mail institucional e links ORCID e DBLP.

## Manter a lista de publicações

Edite `publications.js`. Cada registro contém `id`, `title`, `authors` (pares de nome e sobrenome), `year`, `venue`, `type`, `topic`, `doi`, `url`, `summary` e os campos opcionais `volume`, `number`, `pages`, `article` e `pdf`. Use `pdf: ""` quando não houver link direto confirmado: o site mostrará acesso pela editora. Links PDF externos abrem em uma nova aba; o leitor poderá salvar o arquivo no visualizador. Para hospedar arquivos próprios, crie uma pasta `pdf/` e use caminhos relativos como `pdf/artigo.pdf`.

As citações APA e Chicago são exportadas como texto simples; a aplicação das convenções tipográficas (itálico do título do periódico e do volume, quando aplicável) fica a cargo do editor de texto ou do gerenciador de referências. BibTeX preserva a capitalização dos títulos e aceita UTF-8.

## Fontes dos registros iniciais

- SmellHunter: https://arxiv.org/abs/2605.20675 (preprint).
- SmellDSL: https://doi.org/10.1016/j.infsof.2025.107760 (Information and Software Technology 184, 107760).
- CognIDE: https://doi.org/10.3897/jucs.124812 (Journal of Universal Computer Science 31(7), 683–712).
- UML2Merge: https://doi.org/10.1049/iet-sen.2018.5104 e PDF no site acadêmico do autor.
- Composição de modelos: https://doi.org/10.1007/s10270-014-0408-2 e PDF no site acadêmico do autor.

A lista é uma seleção inicial, não uma bibliografia completa. Atualize os dados quando houver novas versões e publicações. Para substituir a fotografia, altere o arquivo em `assets/` e o caminho da imagem no HTML, mantendo um texto alternativo descritivo.

## Catálogo completo — atualização de 5 de outubro de 2026

Foram importados os **126 registros** presentes em https://kleinnerfarias.github.io/publication/, preservando seus **134 links** (PDF, preprint e slides, quando existentes). Três registros recentes da versão 2, ausentes nessa página, foram mantidos: catálogo total de **129 publicações**, de 2005 a 2026.

O catálogo contém 31 artigos de periódico, 49 trabalhos de conferência, 3 livros, 33 TCCs, 5 dissertações, 6 relatórios técnicos, 1 material suplementar e 1 preprint. Há paginação de 20 registros e filtros por ano e tipo. A exportação geral `.bib` contém todas as 129 publicações, independentemente do filtro em uso.

`import-report.json` registra o inventário importado e os links originais para auditoria. `sourceReference` e `venueRaw`, dentro de `publications.js`, preservam as informações bibliográficas da fonte. As citações usam apenas os campos disponíveis. Os DOIs previamente confirmados foram mantidos; não foram inventados DOIs para os demais registros. Os status “submetido” e “a publicar” são reproduzidos como informações da fonte, sem afirmar que continuam atuais. Não foram transferidos os PDFs para o repositório; os botões apontam para os endereços originais. Um botão rotulado PDF na origem que aponta para a página de uma editora foi adaptado para “Acessar artigo”.

As referências BibTeX usam tipos próprios para periódicos, conferências, livros, dissertações, relatórios e outros materiais. As referências APA e Chicago são referências bibliográficas em texto simples, geradas a partir dos dados fornecidos pela página. A identificação de sobrenomes foi estruturada a partir da lista de autores; para nomes compostos ou abreviados, revise a forma bibliográfica ao inserir metadados novos.

Verificação: correspondência de 126/126 registros e todos os links, IDs únicos, paginação, busca, filtros e geração dos três formatos de referência (387 combinações). A disponibilidade atual dos arquivos remotos não foi verificada individualmente.
