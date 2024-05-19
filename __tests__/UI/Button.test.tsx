import Button from "@/components/UI/Button";
import { render, fireEvent } from "@testing-library/react-native";

describe("Button", () => {
  it("displays text correctly", () => {
    const { getByText } = render(<Button onPress={() => {}}>Test</Button>);

    const button = getByText("Test");
    expect(button).toBeTruthy();
  });

  it("fires onPress fn", () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(<Button onPress={mockOnPress}>Test</Button>);

    const button = getByText("Test");
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalled();
  });
  it("renders correctly when disabled", () => {
    const { getByText } = render(
      <Button onPress={() => {}} disabled={true}>
        Test
      </Button>
    );

    const buttonText = getByText("Test");

    expect(buttonText).toBeTruthy();

    const textStyle = buttonText.props.style;
    expect(textStyle[1].color).toBe("#222");
  });

  it("matches snapshot", () => {
    const tree = render(<Button onPress={() => {}}>Test</Button>).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
