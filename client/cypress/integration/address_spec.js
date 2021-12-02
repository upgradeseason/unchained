describe("Addresses", () => {

  const mainnetAddress1 = "3DRVz9YUhoXSMgBngvv2JkNReBHvkeJwLs";
  const mainnetAddress2 = "12cbQLTFMXRnSzktFkuoG3eHoMeFtpTu3S";
  const testnetAddress1 = "2NE1LH35XT4YrdnEebk5oKMmRpGiYcUvpNR";
  const testnetAddress2 = "2NBcqxMAzZYygHFmYBCfvXba6FND1SvVi7Y";

  // Reset and re-seed list data
  beforeEach(() => {
    cy.exec("npm run db:reset");

    cy.createList(
      "List A", [
        {
          value: mainnetAddress1,
          testnet: false,
        },
        {
          value: testnetAddress1,
          testnet: true,
        },
        {
          value: testnetAddress2,
          testnet: true,
        },
        {
          value: mainnetAddress2,
          testnet: false,
        },
      ]);
    cy.createList(
      "List B", [
        {
          value: testnetAddress1,
          testnet: true,
        },
      ]);

    cy.visit("/");
  });

  it("can delete an address from a specific list", () => {
    // Delete a testnet address from List A
    cy.findByText("List A").click();
    cy.findByText(testnetAddress1).parent().contains("Delete").click();

    // Validate the address is only deleted from List A
    cy.findByText(testnetAddress1).should("not.exist");

    cy.get("a").contains("Addresses").click();
    cy.findByText(testnetAddress1).parent().contains("1 list");
  });

  it("can delete an address from all lists", () => {
    cy.get("a").contains("Addresses").click();

    cy.get("button").contains(testnetAddress1).click();
    cy.findByText("Delete Address").click();

    cy.findByText(testnetAddress1).should("not.exist");

    // Validate the address is not in either list
    cy.visit("/");

    cy.findByText("List A").click();
    cy.get("tr").not(':first').not(":last").should("have.length", 3);
    cy.findByText(testnetAddress1).should("not.exist");

    cy.go('back');

    cy.findByText("List B").click();
    cy.get("tr").not(':first').not(":last").should("have.length", 0);
  });

  it("can view which lists contain an address", () => {
    cy.get("a").contains("Addresses").click();

    cy.findByText(testnetAddress1).click();

    cy.get("tr").not(':first').then($lists => {
      expect($lists).to.have.length(2);
      expect($lists[0]).to.contain("List A");
      expect($lists[1]).to.contain("List B");
    });
  });
});
