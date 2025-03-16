'use strict';

let editingIndex = null;

// Funções para abrir/fechar o modal e limpar campos
const openModal = () => document.getElementById('modal').classList.add('active');
const closeModal = () => {
    document.getElementById('modal').classList.remove('active');
    editingIndex = null;
    clearModalFields();
};
const clearModalFields = () => {
    ['nome', 'tipo', 'valor', 'data'].forEach(id => document.getElementById(id).value = '');
};

// Função para salvar investimento no localStorage
const saveInvestment = (investment) => {
    const dbInvestment = readInvestment();
    if (editingIndex !== null) {
        dbInvestment[editingIndex] = investment;
    } else {
        dbInvestment.push(investment);
    }
    localStorage.setItem('dbInvestment', JSON.stringify(dbInvestment));
};

// Função para ler investimentos do localStorage
const readInvestment = () => JSON.parse(localStorage.getItem('dbInvestment')) || [];

// Função para atualizar a tabela
const updateTable = () => {
    const dbInvestment = readInvestment();
    const tbody = document.getElementById('tableInvestment').querySelector('tbody');
    tbody.innerHTML = '';

    dbInvestment.forEach((investment, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${investment.nome}</td>
            <td>${investment.tipo}</td>
            <td>R$ ${parseFloat(investment.valor).toFixed(2)}</td>
            <td>${investment.data}</td>
            <td>
                <button class="button green" onclick="editInvestment(${index})">Editar</button>
                <button  class="button red" 
                onclick="deleteInvestment(${index})"">Excluir</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Atualizar o gráfico após atualizar a tabela
    updateChart();
};

// Função para editar investimento
const editInvestment = (index) => {
    const investment = readInvestment()[index];
    ['nome', 'tipo', 'valor', 'data'].forEach(id => document.getElementById(id).value = investment[id]);
    editingIndex = index;
    openModal();
};

// Função para excluir investimento
// Função para excluir investimento com confirmação
const deleteInvestment = (index) => {
    Swal.fire({
        title: 'Tem certeza?',
        text: "Você não poderá reverter isso!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const dbInvestment = readInvestment();
            dbInvestment.splice(index, 1);
            localStorage.setItem('dbInvestment', JSON.stringify(dbInvestment));
            updateTable();
            Swal.fire({
                title: "Excluído!",
                text: "Seu investimento foi excluído.",
                icon: "success",
            });
        }
    });
};

// Função para validar os campos do formulário
const validateForm = () => {
    const fields = ['nome', 'tipo', 'valor', 'data'];
    const values = fields.map(id => document.getElementById(id).value.trim());

    if (values.some(value => !value)) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return false;
    }

    const [,, valor, data] = values;

    if (isNaN(valor) || parseFloat(valor) <= 0) {
        alert('Por favor, insira um valor numérico válido maior que zero.');
        return false;
    }

    const regexData = /^\d{4}-\d{2}-\d{2}$/;
    if (!regexData.test(data)) {
        alert('Por favor, insira uma data válida no formato YYYY-MM-DD.');
        return false;
    }

    return true;
};

// Função para salvar ou editar investimento
document.getElementById('salvar').addEventListener('click', (event) => {
    event.preventDefault(); // Impede o comportamento padrão do formulário

    if (!validateForm()) return;

    const investment = {
        nome: document.getElementById('nome').value,
        tipo: document.getElementById('tipo').value,
        valor: document.getElementById('valor').value,
        data: document.getElementById('data').value
    };

    saveInvestment(investment);
    updateTable();
});

// Função para cancelar e fechar o modal
document.getElementById('cancelar').addEventListener('click', closeModal);

// Função para abrir o modal ao cadastrar um novo investimento
document.getElementById('cadastrarInvestimento').addEventListener('click', () => {
    clearModalFields();
    openModal();
});

// Função para fechar o modal ao clicar no botão de fechar (×)
document.getElementById('modalClose').addEventListener('click', closeModal);

// Função para fechar o modal ao clicar em salvar
document.getElementById('salvar').addEventListener('click', closeModal);

function alertaSalvar() {
    if (validateForm()) {
        Swal.fire({
            title: "Sucesso!",
            text: "O investimento foi cadastrado!",
            icon: "success",
            draggable: true
        });
    } else {
        Swal.fire({
            title: "Erro!",
            text: "Por favor, preencha todos os campos obrigatórios corretamente.",
            icon: "error",
        });
    }
}

function alertaCancelar() {
    Swal.fire({
        title: "Cancelado!",
        text: "O cadastro foi cancelado!",
        icon: "error",
    });
}

