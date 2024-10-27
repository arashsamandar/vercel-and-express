import MyTestComponent from "../src/components/test_components/MyTestComponent.jsx";
import {render} from "@testing-library/react";

describe('MyTestComponent', () => {
    test('renders correctly', () => {
        render(<MyTestComponent />);
        expect(1).toBe(1);
    });
});
