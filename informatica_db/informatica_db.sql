-- tabela de usuários
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    usuario TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    tipo TEXT CHECK (tipo IN ('admin', 'funcionario')) NOT NULL
);

-- tabela de produtos
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    categoria TEXT,
    quantidade INTEGER DEFAULT 0,
    quantidade_minima INTEGER DEFAULT 0,
    preco NUMERIC(10,2),
    data TIMESTAMP DEFAULT NOW()
);

-- tabela de movimentações 
CREATE TABLE movimentacoes (
    id SERIAL PRIMARY KEY,
    produto_id INTEGER NOT NULL,
    tipo TEXT NOT NULL, -- entrada ou saida
    quantidade INTEGER NOT NULL,
    data TIMESTAMP DEFAULT NOW(),
    observacao TEXT,

    CONSTRAINT fk_produto
        FOREIGN KEY (produto_id)
        REFERENCES produtos(id)
        ON DELETE CASCADE
);

-- alter tables para garantir valores positivos e limitar o tipo da movimentação
ALTER TABLE produtos
ADD CONSTRAINT chk_quantidade CHECK (quantidade >= 0);

ALTER TABLE movimentacoes
ADD CONSTRAINT chk_quantidade_mov CHECK (quantidade > 0);

ALTER TABLE movimentacoes
ADD CONSTRAINT chk_tipo CHECK (tipo IN ('entrada', 'saida'));

-- insert dos produtos
INSERT INTO produtos (nome, categoria, quantidade, quantidade_minima, preco)
VALUES
('Mouse Gamer', 'Periférico', 10, 5, 59.90),
('Teclado Gamer', 'Periférico', 8, 3, 120.00),
('Monitor', 'Hardware', 4, 2, 899.99);

-- insert das movimentações
INSERT INTO movimentacoes (produto_id, tipo, quantidade, observacao)
VALUES
(1, 'entrada', 10, 'Entrada de produto pelo fornecedor'),
(2, 'entrada', 8, 'Entrada de produto pelo fornecedor'),
(1, 'saida', 2, 'Venda realizada pelo cliente');

--insert dos usuários
INSERT INTO usuarios (usuario, senha, tipo)
VALUES
('admin@gmail.com', '123', 'admin'),
('funcionario@gmail.com', '123', 'funcionario');