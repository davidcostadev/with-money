import expect from 'expect';

describe('Transaction', () => {
  let transaction;

  beforeEach(() => {
    // cy.clock(1532473578215);
    cy.server();
    cy.visit('/');
    cy.location().should((loc) => {
      expect(loc.hash).toBe('#/login');
    });
    cy.get('#email').type('davidcostadev@gmail.com');
    cy.get('#password').type('P@ssw0rd');
    cy.route('POST', /api\/v1\/login/i).as('login');
    cy.route('GET', /api\/v1\/transactions/i).as('getTransactions');
    cy.get('#login').submit();
    cy.wait('@login').then((xhr) => {
      expect(xhr.response.body.success).toBe(true);
    });
    cy.wait('@getTransactions').then((xhr) => {
      const transactions = xhr.response.body;

      expect(transactions).toHaveProperty('data');
      expect(transactions.data.length > 0).toBe(true);
    });
    cy.location().should((loc) => {
      expect(loc.hash).toBe('#/');
    });
  });

  it('add', () => {
    cy.location().should((loc) => {
      expect(loc.hash).toBe('#/');
    });
    cy.get('a[href="#/transaction-new"]').click();
    cy.location().should((loc) => {
      expect(loc.hash).toBe('#/transaction-new');
    });
    cy.get('#name').type('Almoço');
    cy.get('#value').type('10');
    cy.get('#transactionDate input[type="text"]').clear();
    cy.get('#transactionDate input[type="text"]').type('2018-07-01', { force: true });
    // cy.get('#transactionDate input[type="text"]');

    cy.get('.md-dialog-actions .md-button:nth-child(2)').click();
    cy.wait(500);
    cy.get('#type').click({ force: true });

    cy.get('#type-in').click();

    cy.get('#account').click({ force: true });
    cy.get('#account-2').click();

    cy.get('label[for="isPaid"]').click({ force: true });

    cy.route('POST', /api\/v1\/transactions/i).as('addTransaction');

    cy.get('#save').click({ force: true });

    cy.wait('@addTransaction').then((xhr) => {
      transaction = xhr.response.body;

      expect(transaction).toHaveProperty('id');
    });
    cy.wait(500);

    cy.location().should((loc) => {
      expect(loc.hash).toBe('#/');
    });
    cy.get('.md-snackbar-content span').contains('Transanção salva com sucesso!');
  });

  it('edit', () => {
    cy.location().should((loc) => {
      expect(loc.hash).toBe('#/');
    });

    cy.route('GET', new RegExp(`/api/v1/transactions/${transaction.id}`, 'i')).as('addTransaction');
    cy.get(`#transaction-${transaction.id}`).click({ force: true });
    cy.wait('@addTransaction').then((xhr) => {
      expect(xhr.response.body).toHaveProperty('id');
      expect(xhr.response.body.id).toBe(transaction.id);
    });
    cy.location().should((loc) => {
      expect(loc.hash).toBe(`#/transactions/${transaction.id}`);
    });
    cy.get('#name').type('Almoço 2');

    cy.get('#value').clear();
    cy.get('#value').type('15');
    cy.get('#transactionDate input[type="text"]').clear();
    cy.get('#transactionDate input[type="text"]').type('2018-07-02', { force: true });

    cy.get('.md-dialog-actions .md-button:nth-child(2)').click();
    cy.wait(500);
    cy.get('#type').click({ force: true });

    cy.get('#type-out').click();

    cy.get('#account').click({ force: true });
    cy.get('#account-1').click();

    cy.get('label[for="isPaid"]').click({ force: true });

    cy.route('PUT', new RegExp(`/api/v1/transactions/${transaction.id}`, 'i')).as('updateTransaction');

    cy.get('#save').click({ force: true });

    cy.wait('@updateTransaction').then((xhr) => {
      transaction = xhr.response.body;

      expect(transaction).toHaveProperty('id');
    });
    cy.wait(500);

    cy.location().should((loc) => {
      expect(loc.hash).toBe('#/');
    });
    cy.get('.md-snackbar-content span').contains('Transanção salva com sucesso!');
  });
});
