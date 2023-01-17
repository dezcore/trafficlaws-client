describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
    cy.contains('type').click()
    cy.url().should('include', '/commands/actions')
  })
})

describe('My First Test', () => {
  it('Does not do much!', () => {
    //expect(true).to.equal(false)
    
    cy.visit('https://example.cypress.io')
    cy.contains('type').click()
    // Should be on a new URL which
    // includes '/commands/actions'
    cy.url().should('include', '/commands/actions')
    // Get an input, type into it
    cy.get('.action-email').type('fake@email.com')
    // Verify that the value has been updated
    cy.get('.action-email').should('have.value', 'fake@email.com')
  })
})

//NodeJs part

describe('The Home Page', () => {
  beforeEach(() => {
    // reset and seed the database prior to every test
    cy.exec('npm run db:reset && npm run db:seed')

    // seed a post in the DB that we control from our tests
    cy.request('POST', '/test/seed/post', {
      title: 'First Post',
      authorId: 1,
      body: '...',
    })

    // seed a user in the DB that we can control from our tests
    cy.request('POST', '/test/seed/user', { name: 'Jane' })
      .its('body')
      .as('currentUser')
  })

  it('successfully loads', () => {
    // this.currentUser will now point to the response
    // body of the cy.request() that we could use
    // to log in or work with in some way

    cy.visit('/')
  })
})