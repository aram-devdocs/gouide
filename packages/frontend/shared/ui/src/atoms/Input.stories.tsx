import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Atoms/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["outlined", "filled"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState("");
    return <Input value={value} onChange={setValue} placeholder="Enter text..." />;
  },
};

export const Outlined: Story = {
  render: () => {
    const [value, setValue] = React.useState("");
    return (
      <Input value={value} onChange={setValue} placeholder="Outlined input" variant="outlined" />
    );
  },
};

export const Filled: Story = {
  render: () => {
    const [value, setValue] = React.useState("");
    return <Input value={value} onChange={setValue} placeholder="Filled input" variant="filled" />;
  },
};

export const WithValue: Story = {
  render: () => {
    const [value, setValue] = useState("Hello World");
    return <Input value={value} onChange={setValue} placeholder="Type here..." />;
  },
};

export const Disabled: Story = {
  render: () => {
    const [value] = React.useState("");
    return (
      <Input
        value={value}
        onChange={() => {
          /* noop */
        }}
        placeholder="Disabled input"
        disabled
      />
    );
  },
};
