it("project ", () => {
    //go to page
    cy.visit("http://localhost:8788/login/")
    cy.get("#inp-email").clear().type('a@b.com');
    cy.get("#inp-password1").type('1');
    cy.get("#btn-login").click();
    //click the button fail all
    cy.get("#projects-cy").click();
    cy.get("#btn-create-cy").click();
    cy.get(".fa-backward").click();
    cy.get("#btn-create-cy").click();
    cy.get("#inp-projectname").type('project 1');
    cy.get("#btn-create").click();
    cy.get(".fa-backward").click();
    cy.get("#dp-project-1-0").click();
    cy.get("#confirmation-modal-close-button").click();
    cy.get("#dp-project-1-0").click();
    cy.get("#confirmation-modal-delete-button").click();
    cy.get("#btn-create-cy").click();
    cy.get("#inp-projectname").type('project 2');
    cy.get("#btn-create").click();
    cy.get(".fa-backward").click();
    //edit / back udpate
    cy.get("#ep-project-2-0").click();
    cy.get(".fa-backward").click();
    cy.get("#ep-project-2-0").click();
    cy.get("#inp-projectname").clear().type('project 2e');
    cy.get("#btn-edit").click();
    cy.get(".fa-backward").click();
    cy.get("#btn-create-cy").click();
    cy.get("#inp-projectname").type('project 1');
    cy.get("#btn-create").click();
    cy.get(".fa-backward").click();
    //add data 

});