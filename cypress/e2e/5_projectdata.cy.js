it("project ", () => {
    //go to page
    cy.visit("http://localhost:8788/login/")
    cy.get("#inp-email").clear().type('a@b.com');
    cy.get("#inp-password1").type('1');
    cy.get("#btn-login").click();
    cy.get("#projects-cy").click();
    cy.get("#datap-project-1-0").click();
    cy.get('#pageActionSelect').select('1');
    cy.get(".fa-backward").click();
    cy.get('#pageActionSelect').select('2');
    cy.get('#pageActionSelect').select('3');
    cy.get(".fa-backward").click();
    cy.get('#pageActionSelect').select('4');
    cy.get('#pageActionSelect').select('1');
    cy.get('#pageActionSelect').select('2');
    //add template name click create / change tempalte name / update
    cy.get('#pageActionSelect').select('5');
    cy.get('#pageActionSelect').select('6');
    cy.get('#pageActionSelect').select('7');
    //import data

});