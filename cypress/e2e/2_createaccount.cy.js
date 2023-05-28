it("create account", () => {
    //go to page
    cy.visit("http://localhost:8788/create-account/")
    //click the button fail all
    cy.get("#btn-create-account").click();
    //add an incorrect email
    cy.get("#inp-email").type('ab.com');
    cy.get("#btn-create-account").click();
    //add correct email with no password
    cy.get("#inp-email").clear().type('a@b.com');
    cy.get("#btn-create-account").click();
    //add only one password fields
    cy.get("#inp-password1").type('1');
    cy.get("#btn-create-account").click();
    //add all correct data
    cy.get("#inp-password2").type('1');
    cy.get("#btn-create-account").click();
});

//.clear()