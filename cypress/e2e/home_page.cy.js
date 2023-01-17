describe('Auth0', function () {
  beforeEach(function () {
    //cy.task('db:seed')
    //cy.intercept('POST', '/graphql').as('createBankAccount')
    cy.loginAuth(
      Cypress.env('auth_username'),
      Cypress.env('auth_password')
    )
    //cy.visit('/')
  })

  it('shows onboarding', function () {
    console.log('test : ', Cypress.env('auth_username'))
    //cy.contains('Get Started').should('be.visible')
  })
})

/*describe('The Home Page', () => {
    it('successfully loads', () => {
      cy.visit('/') // change URL to match your dev URL
      expect(Cypress.env('my-var')).to.equal('ok')
    })
})*/