import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SearchBar } from "./SearchBar";

const meta: Meta<typeof SearchBar> = {
  title: "Molecules/SearchBar",
  component: SearchBar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Empty: Story = {
  args: {
    value: "",
    placeholder: "Search files...",
    onChange: (value) => console.log("Search:", value),
  },
};

export const WithValue: Story = {
  args: {
    value: "component",
    placeholder: "Search files...",
    onChange: (value) => console.log("Search:", value),
  },
};

export const WithClearButton: Story = {
  render: () => {
    const [value, setValue] = useState("test query");
    return (
      <SearchBar
        value={value}
        onChange={setValue}
        onClear={() => setValue("")}
        placeholder="Search files..."
      />
    );
  },
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div>
        <SearchBar
          value={value}
          onChange={setValue}
          onClear={() => setValue("")}
          placeholder="Type to search..."
        />
        <div style={{ marginTop: "1rem", color: "var(--fg-secondary)" }}>
          Current value: {value || "(empty)"}
        </div>
      </div>
    );
  },
};

export const CustomPlaceholder: Story = {
  args: {
    value: "",
    placeholder: "Search by name, path, or extension...",
    onChange: (value) => console.log("Search:", value),
  },
};
