it("login ", () => {
    //go to page
    cy.visit("http://localhost:8788/login/")
    //click the button fail all
    cy.get("#btn-login").click();
    //add an incorrect email
    cy.get("#inp-email").type('ab.com');
    cy.get("#btn-login").click();
    //add correct email with no password
    cy.get("#inp-email").clear().type('a@b.com');
    cy.get("#btn-login").click();
    //add incorrect password
    cy.get("#inp-password1").type('2eweqwe');
    cy.get("#btn-login").click();
    //add all correct data
    cy.get("#inp-password1").clear();
    cy.get("#inp-password1").type('1');
    cy.get("#btn-login").click();
});