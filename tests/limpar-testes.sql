-- Execute no MySQL Workbench depois dos testes automatizados.
SET SQL_SAFE_UPDATES = 0;

DELETE FROM pagamento
WHERE pedido_id IN (
  SELECT id FROM pedido
  WHERE cliente_id IN (SELECT id FROM cliente WHERE email LIKE '%@smoke.test')
);

DELETE FROM item_pedido
WHERE pedido_id IN (
  SELECT id FROM pedido
  WHERE cliente_id IN (SELECT id FROM cliente WHERE email LIKE '%@smoke.test')
);

DELETE FROM pedido
WHERE cliente_id IN (SELECT id FROM cliente WHERE email LIKE '%@smoke.test');

DELETE FROM endereco
WHERE cliente_id IN (SELECT id FROM cliente WHERE email LIKE '%@smoke.test');

DELETE FROM cliente
WHERE email LIKE '%@smoke.test';

SET SQL_SAFE_UPDATES = 1;
