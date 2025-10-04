import * as cookieModule from '../../src/utils/cookie';
import mockIngredients from '../fixtures/ingredients.json';
import mockOrder from '../fixtures/order.json';
const apiURL = 'https://norma.nomoreparties.space/api';

describe('Check ingredients', function () {
  describe('Check adding ingredients to constructor', function () {
    beforeEach(() => {
      cy.intercept('GET', `${apiURL}/ingredients`, {
        fixture: 'ingredients.json'
      }).as('getIngredients');
      cy.visit('http://localhost:4000');
    });

    it('Check buns', function () {
      const ingredientsUi = cy.get(`[data-cy='burger-ingredients']`);
      const constructorUi = cy.get(`[data-cy='burger-constructor']`);

      const bunsIds = mockIngredients.data
        .filter((i) => i.type === 'bun')
        .map((i) => i._id);
      const bunIngredientAdd = ingredientsUi.get(
        `[data-cy=${bunsIds[0]}] button`
      );
      bunIngredientAdd.click();
      constructorUi.find(`[data-cy=${bunsIds[0]}]`).should(($div) => {
        expect($div).to.have.length(2);
      });
    });

    it('Check mains', function () {
      const ingredientsUi = cy.get(`[data-cy='burger-ingredients']`);
      const constructorUi = cy.get(`[data-cy='burger-constructor']`);

      const mainsIds = mockIngredients.data
        .filter((i) => i.type === 'main')
        .map((i) => i._id);
      const mainIngredientAdd = ingredientsUi.get(
        `[data-cy=${mainsIds[0]}] button`
      );
      mainIngredientAdd.click();
      constructorUi.find(`[data-cy=${mainsIds[0]}]`).should(($div) => {
        expect($div).to.have.length(1);
      });
    });

    it('Check sauces', function () {
      const ingredientsUi = cy.get(`[data-cy='burger-ingredients']`);
      const constructorUi = cy.get(`[data-cy='burger-constructor']`);

      const sauceIds = mockIngredients.data
        .filter((i) => i.type === 'sauce')
        .map((i) => i._id);
      const sauceIngredientAdd = ingredientsUi.get(
        `[data-cy=${sauceIds[0]}] button`
      );
      sauceIngredientAdd.click();
      constructorUi.find(`[data-cy=${sauceIds[0]}]`).should(($div) => {
        expect($div).to.have.length(1);
      });
    });
  });
});

describe('Check modals', function () {
  describe('Check ingredients modal', function () {
    beforeEach(() => {
      cy.intercept('GET', `${apiURL}/ingredients`, {
        fixture: 'ingredients.json'
      }).as('getIngredients');
      cy.visit('http://localhost:4000');
    });

    it('Check modal open', function () {
      cy.get(`[data-cy=${mockIngredients.data[0]._id}]`).click();
      cy.get('#modals div').should('be.visible');
      cy.get('#modals').contains('Детали ингредиента');
      cy.get('#modals').contains(mockIngredients.data[0].name);
    });

    describe('Check modal close', function () {
      beforeEach(() => {
        cy.get(`[data-cy=${mockIngredients.data[0]._id}]`).click();
      });

      it('Close on button', function () {
        cy.get('#modals button').click();
        cy.get('#modals div').should('not.exist');
      });

      it('Close on overlay', function () {
        cy.get('#modals div:empty').click({ force: true });
        cy.get('#modals div').should('not.exist');
      });
    });
  });
});

describe('Check user', function () {
  before(() => {
    cy.setCookie('accessToken', '123');
    localStorage.setItem('refreshToken', '123');
  });

  beforeEach(() => {
    cy.intercept('GET', `${apiURL}/auth/user`, {
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('POST', `${apiURL}/orders`, {
      fixture: 'order.json'
    }).as('makeOrder');

    cy.visit('http://localhost:4000');
  });

  it('Check order', function () {
    const ingredientsUi = cy.get(`[data-cy='burger-ingredients']`);
    const constructorUi = cy.get(`[data-cy='burger-constructor']`);

    ingredientsUi
      .get(`[data-cy=${mockIngredients.data[0]._id}] button`)
      .click();
    ingredientsUi
      .get(`[data-cy=${mockIngredients.data[3]._id}] button`)
      .click();
    ingredientsUi
      .get(`[data-cy=${mockIngredients.data[5]._id}] button`)
      .click();

    constructorUi.find('button[type=button]').click();
    cy.get('#modals div').should('be.visible');
    cy.get('#modals').contains(mockOrder.order.number);
    cy.get('#modals button').click();
    cy.get('#modals div').should('not.exist');
    cy.get(`[data-cy='burger-constructor'] div:not(:has(*))`).should(($div) => {
      expect($div).to.have.length(3);
    });
  });

  after(() => {
    cy.clearCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });
});
