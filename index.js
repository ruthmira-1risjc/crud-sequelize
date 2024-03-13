const fs = require('fs');
const { Sequelize } = require('sequelize');
const Pini = require('./models/pini.model.js');


const sequelize = new Sequelize('PINI', 'SA', 'abc123.,', {
    host: 'localhost',
    dialect: 'mssql'
  });

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

// Função para criar Pini
async function criarPini(nome, descricao, descricaoCombo, valor) {
    try {
        const registro = await Pini.create({ Nome: nome, Descricao: descricao, DescricaoCombo: descricaoCombo, Valor: valor });
        return registro ? registro.toJSON() : null;
    } catch (error) {
        console.error('Erro ao criar Pini:', error);
        return null;
    }
}

// Função para atualizar Pini
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

// Função para remover Pini
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

// Função para listar todos os Pini
async function listarPini() {
    try {
        const registros = await Pini.findAll();
        return registros.map(registro => registro.toJSON());
    } catch (error) {
        console.error('Erro ao listar Pini:', error);
        return [];
    }
}

// Função para executar as operações
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

// Função para escrever os resultados em um arquivo JSON
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

// Executa as operações
executarOperacoes();