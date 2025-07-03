import { fireEvent, render } from "@testing-library/react-native";
import App from "../App";

describe("Welcome screen", function () {
  it("shows error message when user submits empty name on button press", function () {
    const { getByRole, queryByTestId } = render(<App />);

    const button = getByRole("button");
    expect(queryByTestId("name-error")).toBeNull();
    fireEvent.press(button);
    expect(queryByTestId("name-error")).toHaveTextContent(/required/i);
  });

  it("shows error message when user submits empty name on submit in text field", function () {
    const { getByDisplayValue, queryByTestId } = render(<App />);

    const input = getByDisplayValue("");
    expect(queryByTestId("name-error")).toBeNull();
    fireEvent(input, "onSubmitEditing");

    expect(queryByTestId("name-error")).toHaveTextContent(/required/i);
  });

  it("goes to chat screen when submitting valid name", function () {
    const { getByDisplayValue } = render(<App />);
    const input = getByDisplayValue("");

    fireEvent.changeText(input, "foobar");
    fireEvent(input, "onSubmitEditing");
  });
});
