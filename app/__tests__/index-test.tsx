import { fireEvent, render } from "@testing-library/react-native";
import HomeScreen from "../index";
import * as useNavigate from "../../router/useNavigate";

describe("Welcome screen", function () {
  it("shows error message when user submits empty name on button press", function () {
    const { getByRole, queryByTestId } = render(<HomeScreen />);

    const button = getByRole("button");
    expect(queryByTestId("name-error")).toBeNull();
    fireEvent.press(button);
    expect(queryByTestId("name-error")).toHaveTextContent(/required/i);
  });

  it("shows error message when user submits empty name on submit in text field", function () {
    const { getByDisplayValue, queryByTestId } = render(<HomeScreen />);

    const input = getByDisplayValue("");
    expect(queryByTestId("name-error")).toBeNull();
    fireEvent(input, "onSubmitEditing");

    expect(queryByTestId("name-error")).toHaveTextContent(/required/i);
  });

  describe("successfully enters name", function () {
    let navigateSpy: jest.Mock;
    beforeEach(function () {
      const useNavigateSpy = jest.spyOn(useNavigate, "useNavigate");
      navigateSpy = jest.fn();
      useNavigateSpy.mockReturnValue(navigateSpy);
    });

    it("goes to chat screen when submitting valid name", function () {
      const { getByDisplayValue } = render(<HomeScreen />);
      const input = getByDisplayValue("");

      fireEvent.changeText(input, "Jacob");
      fireEvent(input, "onSubmitEditing");

      expect(navigateSpy).toHaveBeenCalledWith({
        pathname: "/chat",
        params: { name: "Jacob" },
      });
    });

    it("trims the name", function () {
      const { getByDisplayValue } = render(<HomeScreen />);
      const input = getByDisplayValue("");

      fireEvent.changeText(input, " Jacob ");
      fireEvent(input, "onSubmitEditing");

      expect(navigateSpy).toHaveBeenCalledWith({
        pathname: "/chat",
        params: { name: "Jacob" },
      });
    });
  });
});
