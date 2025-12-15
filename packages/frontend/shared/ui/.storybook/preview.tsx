import type { Preview } from "@storybook/react-vite";
import "@gouide/frontend-theme/variables.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#1a1b1e" },
        { name: "light", value: "#ffffff" },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          fontFamily: "var(--font-family)",
          backgroundColor: "var(--bg-primary)",
          color: "var(--fg-primary)",
          padding: "1rem",
          minHeight: "100vh",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
