import { render, screen, fireEvent } from "@testing-library/react";
import { TalentTree } from "./TalentTree";

describe("TalentTree", () => {
  describe("Render()", () => {
    it("normal case", () => {
      render(<TalentTree />);
      const title = screen.getByText("TitanStar Legends - Rune Mastery Loadout Talent Calculator 9000");
      expect(title).toBeInTheDocument();

      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toEqual(8);

      const legend = screen.getByText(/\/ 6$/);
      expect(legend.innerHTML).toContain("3 / 6");  
    });
  });
  describe("Mouse Events()", () => {
    it("activate talent", () => {
      render(<TalentTree />);

      let buttons = screen.getAllByRole("button");
      let button = buttons.find(b => b.className === "talent lightning");
      if(!button) fail();


      fireEvent.click(button);
      buttons = screen.getAllByRole("button");
      button = buttons.find(b => b.className === "talent lightning active");
      expect(button).toBeTruthy();

      const legend = screen.getByText(/\/ 6$/);
      expect(legend.innerHTML).toContain("4 / 6");  
    });
    it("deactivate talent", () => {
      render(<TalentTree />);

      let buttons = screen.getAllByRole("button");
      let button = buttons.find(b => b.className === "talent scuba active");
      expect(button).toBeTruthy();
      if(!button) fail();

      fireEvent.contextMenu(button);
      buttons = screen.getAllByRole("button");
      button = buttons.find(b => b.className === "talent scuba");
      expect(button).toBeTruthy();

      const legend = screen.getByText(/\/ 6$/);
      expect(legend.innerHTML).toContain("2 / 6");  
    });
  });
});