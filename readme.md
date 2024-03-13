## Dias 13, 14, 15 e 18.
- Implementar CRUD em javascript/nodejs utilizando sequelize. (funções: editar, atualizar, remover e listar) Obs.: Escrever um script único que imprima os resultados de cada operação.
- Ao iniciar, o script deverá carregar um arquivo .json e armazenar os objetos em uma lista.
- Vide exemplo na pasta do desenvolvimento. Obs.: Não é necessário utilizar nestjs, apenas observem a conexão com o banco, o resto está bem explicado na documentação.
- Salvar os resultados em uma pasta e escrever um pequeno relatório explicando o que foi aprendido e como executar o código.

![Static Badge](https://img.shields.io/badge/build-EM_DESENVOLVIMENTO-brightred?style=for-the-badge&logoColor=purple&label=STATUS&labelColor=BLACK&color=red)

### Instruções para Uso

Consulte o código-fonte  no repositório:\
**colocar link**

### Requisitos

1. **Node.js e npm:** Certifique-se de ter o Node.js instalado em seu sistema. O Node.js inclui o npm (Node Package Manager) que usaremos para instalar as dependências do projeto.
   
2. **Sequelize:** O Sequelize é uma biblioteca Node.js ORM para interagir com bancos de dados SQL.
   
3. **Banco de Dados MS SQL Server:** Você precisa ter um banco de dados MS SQL Server configurado e acessível. Neste exemplo, estamos usando uma imagem Docker do MS SQL Server para simplificar a configuração.


### Preparando ambiente

``` bash
# Cria a pasta
mkdir crud-sequelize

# Movimenta o terminal para a pasta
cd crud-sequelize

# Criar o package.json -> dar enter, enter, ...
npm init

# Instalação de módulos, incluindo o módulo fs
npm install sequelize
npm install tedious
npm install fs
npm install --save mysql

# Criar um arquivo index.js
echo "" > index.js
echo "" > pini.json

# Abrir o VSCode
code .
```

### Criando imagem Docker

Vamos criar uma imagem do mssql em um arquivo `docker-compose.yaml`.

```Javascript
version: '3.8'

services:
  mssql:
    image: mcr.microsoft.com/mssql/server
    environment:
      - MSSQL_SA_PASSWORD=abc123.,
      - ACCEPT_EULA=Y
    ports:
      - "1433:1433" # Porta 1433 do contêiner mapeada para a porta 1433 do host (localhost)

```

### Como executar o código

Use o comando no terminal 
 ``` bash
 node index.js 
 ```

### Conexão com o Banco de Dados:
Aqui, estou importando o Sequelize e criando uma instância do Sequelize para estabelecer a conexão com o banco de dados MS SQL Server.\
Especifiquei as configurações de conexão, incluindo o dialeto (mssql), host, porta, nome de usuário, senha e nome do banco de dados.

```javascript
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'mssql',
    host: 'localhost',
    port: 1433,
    username: 'SA', 
    password: 'abc123.,', 
    database: 'PINI' 
});
```

### Modelos do Sequelize:

O Sequelize permite definir modelos para mapear as tabelas do banco de dados em objetos JavaScript. Para esta aplicação defini um modelo para a entidade "Pini":

```javascript
const { DataTypes } = require('sequelize');

const Pini = sequelize.define('Pini', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    Nome: DataTypes.STRING,
    Descricao: DataTypes.STRING,
    DescricaoCombo: DataTypes.STRING,
    Valor: DataTypes.FLOAT
});
```

Defini um modelo chamado "Pini" com os campos correspondentes às colunas da tabela do banco de dados.

### Criando carga inicial de um arquivo .json para o banco

Esta função lê dados de um arquivo JSON e os carrega na tabela "Pini" do banco de dados.

```JavaScript
// Função para carregar dados do JSON para o banco de dados
async function loadJSONData(filename) {
    try {
        const jsonData = fs.readFileSync(filename, 'utf-8');
        const data = JSON.parse(jsonData);
        await Pini.sync({ force: true });
        await Pini.bulkCreate(data);
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    } finally {
        await sequelize.close();
    }
}

// Chame a função para carregar os dados do JSON
loadJSONData('./pini.json');
```

## CRUD

### CREATE 
A função `criarPini` cria um novo registro na tabela "Pini".

```Javascript
async function criarPini(nome, descricao, descricaoCombo, valor) {
    try {
        const registro = await Pini.create({ Nome: nome, Descricao: descricao, DescricaoCombo: descricaoCombo, Valor: valor });
        return registro ? registro.toJSON() : null;
    } catch (error) {
        console.error('Erro ao criar Pini:', error);
        return null;
    }
}
```

### READ

A função `listarPini` recupera todos os registros da tabela "Pini" e os retorna como uma lista.

```JavaScript
async function listarPini() {
    try {
        const registros = await Pini.findAll();
        return registros.map(registro => registro.toJSON());
    } catch (error) {
        console.error('Erro ao listar Pini:', error);
        return [];
    }
}
```

### UPDATE
A função `atualizarPini` atualiza um registro existente na tabela "Pini" com base no ID fornecido.

```JavaScript
 async function atualizarPini(id, nome, descricao, descricaoCombo, valor) {
    try {
        const registro = await Pini.findByPk(id);
        if (registro) {
            await registro.update({ Nome: nome, Descricao: descricao, DescricaoCombo: descricaoCombo, Valor: valor });
            return registro.toJSON();
        } else {
            console.error('Pini não encontrado.');
            return null;
        }
    } catch (error) {
        console.error('Erro ao atualizar Pini:', error);
        return null;
    }
}

```
### DELETE - Destroy

A função `removerPini` exclui um registro da tabela "Pini" com base no ID fornecido.

```JavaScript
async function removerPini(id) {
    try {
        const registro = await Pini.findByPk(id);
        if (registro) {
            await registro.destroy();
            return { id };
        } else {
            console.error('Pini não encontrado.');
            return null;
        }
    } catch (error) {
        console.error('Erro ao remover registro:', error);
        return null;
    }
}
```

### Escrever Resultados em Arquivos JSON:
Esta função escreve os resultados das operações (criar, atualizar, listar, remover) em arquivos JSON.

```javascript
async function escreverResultado(operacao, resultado) {
    try {
        if (resultado) {
            const arquivo = `resultado_${operacao}.json`;
            await fs.writeFile(arquivo, JSON.stringify(resultado));
        } else {
            console.error(`Erro ao salvar resultado da operação ${operacao}: resultado nulo.`);
        }
    } catch (error) {
        console.error('Erro ao escrever resultado:', error);
    }
}
```

### Executar Operações:
Esta função executa todas as operações (criar, atualizar, listar, remover) e escreve os resultados em arquivos JSON.

```javascript
async function executarOperacoes() {
    await sequelize.sync(); // Sincroniza o modelo com o banco de dados
    const resultadoCriar = await criarPini('Nome1', 'Descricao1', 'DescricaoCombo1', 123.45);
    const resultadoAtualizar = await atualizarPini(1, 'NovoNome', 'NovaDescricao', 'NovaDescricaoCombo', 543.21);
    const resultadoListar = await listarPini();
    const resultadoRemover = await removerPini(1);

    // Escrever os resultados em arquivos JSON
    await escreverResultado('criar', resultadoCriar);
    await escreverResultado('atualizar', resultadoAtualizar);
    await escreverResultado('listar', resultadoListar);
    await escreverResultado('remover', resultadoRemover);
}
```

### Conhecimentos Adquiridos

Este programa foi desenvolvido para interagir com um banco de dados MS SQL Server utilizando Node.js e Sequelize. O objetivo principal do programa é realizar operações CRUD (Create, Read, Update, Delete) em uma tabela chamada "Pini" no banco de dados, bem como carregar dados de um arquivo JSON para essa tabela e escrever os resultados em arquivos JSON.

1. **Sequelize**: Aprendemos a utilizar o Sequelize para definir modelos, sincronizar o modelo com o banco de dados, realizar operações CRUD e manipular transações.

2. **Operações CRUD**: Aprendemos como criar, ler, atualizar e excluir registros em um banco de dados usando Sequelize.



CRIANDO SCRIPT PARA VERSIONAR UMA PASTA QUALQUER EM UM REPOSITÓRIO NO GITHUB

#!/bin/bash

# Nome da pasta que você deseja adicionar ao repositório
pasta="crud-sequelize"

# Mensagem do commit
mensagem="Adicionando pasta $pasta ao repositório"

# Caminho para a pasta
caminho="/wsl.localhost/Ubuntu/home/ruth_mira/github/crud-sequelize"

# URL do repositório remoto no GitHub
url_repo="https://github.com/ruthmira-1risjc/crud-sequelize.git"

# Navega para o diretório da pasta
cd $caminho || exit

# Inicializa a pasta como um repositório Git
git init

# Adiciona todos os arquivos na pasta ao Git
git add .

# Faz o commit dos arquivos
git commit -m "$mensagem"

# Conecta ao repositório remoto no GitHub
git remote add origin $url_repo

# Envia os arquivos para o repositório remoto
git push -u origin master

echo "Pasta $pasta adicionada ao repositório com sucesso!"
