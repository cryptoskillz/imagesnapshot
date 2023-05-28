it("has the correct headline", () => {
    cy.visit("http://127.0.0.1:8080/")
    cy.contains("h2", "Backpage generator");
    cy.get("#cypress-gs").click();
});

