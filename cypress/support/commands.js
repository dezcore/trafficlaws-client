// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

function googleAuth(username, password) {
  cy.visit('/')

  cy.window().then((win) => {
    cy.stub(win, 'open').as('windowOpen').callsFake(url => {
      return win.open.wrappedMethod.call(win, url, '_self')
    });
  })

  cy.get('[data-cy=login-input]').click()
  cy.get('@windowOpen').should('be.called')

  cy.origin('https://accounts.google.com', { args: {username : username, password : password}}, ({username, password}) => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    });
    cy.get('[id=identifierId]').type(username)
    cy.get('[id=identifierNext]').click().wait(2000)
    .then(() => {
      cy.get('[id=password]').should('be.visible').type( password).type('{enter}')
    })
  })
}

//Login
function loginAuth(username, password) {
  // App landing page redirects to Auth0.
  cy.request({
    method: 'POST',
    url: 'https://www.googleapis.com/oauth2/v4/token',
    body: {
      grant_type: 'refresh_token',
      client_id: Cypress.env('googleClientId'),
      client_secret: Cypress.env('googleClientSecret'),
      refresh_token: Cypress.env('googleRefreshToken'),
    },
  }).then(({ body }) => {
    const { access_token} = body
    //cy.log(body)
    window.localStorage.setItem('tokens', JSON.stringify(body))
    //cy.visit('/')
    //window.App.$store.commit("updateTokens" , response.data.tokens)
    //window.location.replace(window.location.origin + window.location.pathname)

    cy.request({
      method: 'GET',
      url: 'https://www.googleapis.com/oauth2/v3/userinfo',
      headers: { Authorization: `Bearer ${access_token}` },
    }).then(({ body }) => {
      Object.entries(body).forEach((key)=>{
        cy.log("key : ", key, ", value : ", body[key])
      })
    })
  })
}

Cypress.Commands.add('loginAuth', (username, password) => {
  /*const log = Cypress.log({
    displayName: 'LOGIN',
    message: [`🔐 Authenticating | ${username}`],
    autoEnd: false,
  })
  log.snapshot('before')*/
  loginAuth(username, password)
  //log.snapshot('after')
  //log.end()
})