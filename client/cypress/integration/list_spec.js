describe("Lists", () => {

  const mainnetAddress1 = "3DRVz9YUhoXSMgBngvv2JkNReBHvkeJwLs";
  const mainnetAddress2 = "12cbQLTFMXRnSzktFkuoG3eHoMeFtpTu3S";
  const testnetAddress1 = "2NE1LH35XT4YrdnEebk5oKMmRpGiYcUvpNR";
  const testnetAddress2 = "2NBcqxMAzZYygHFmYBCfvXba6FND1SvVi7Y";

  // Reset the database before each test case
  beforeEach(() => {
    cy.exec("npm run db:reset");
  });

  describe("List creation", () => {
    it("can create multiple lists with different address types", () => {
      // Create 3 different lists
      cy.createList(
        "List 0", [
          {
            value: mainnetAddress1,
            testnet: false,
          },
          {
            value: testnetAddress1,
            testnet: true,
          },
        ]);

      cy.createList(
        "List 1", [
          {
            value: testnetAddress1,
            testnet: true,
          },
        ]);

      cy.createList("List 2");

      cy.visit("/");

      // Validate each list summary is correct
      cy.get("button").then($lists => {
        expect($lists).to.have.length(3);

        expect($lists[0]).to.contain("List 0");
        expect($lists[0]).to.contain("2 addresses");

        expect($lists[1]).to.contain("List 1");
        expect($lists[1]).to.contain("1 address");

        expect($lists[2]).to.contain("List 2");
        expect($lists[2]).to.contain("0 addresses");
      });
    });
  });

  describe("List operations", () => {
    // Seed list data
    beforeEach(() => {
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

    it("can delete an entire list", () => {
      // Delete one of the lists
      cy.findByText("List A").click();
      cy.findByText("Delete List").click();

      cy.findByText("List B").should("exist");
      cy.findByText("List A").should("not.exist");

    });

    it("can view all addresses within a list", () => {
      cy.findByText("List A").click();

      // Validate addresses within a list
      cy.get("tr").not(':first').not(":last").then($rows => {
        expect($rows).to.have.length(4);
        expect($rows).to.contain(mainnetAddress1);
        expect($rows).to.contain(testnetAddress1);
        expect($rows).to.contain(testnetAddress2);
        expect($rows).to.contain(mainnetAddress2);
      });
    });
  });
});
