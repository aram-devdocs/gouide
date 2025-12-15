import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FormField } from "./FormField";

const meta: Meta<typeof FormField> = {
  title: "Molecules/FormField",
  component: FormField,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <FormField
        label="Username"
        value={value}
        onChange={setValue}
        placeholder="Enter your username"
      />
    );
  },
};

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <FormField
        label="Email"
        value={value}
        onChange={setValue}
        placeholder="Enter your email"
        error="Please enter a valid email address"
      />
    );
  },
};

export const WithValue: Story = {
  render: () => {
    const [value, setValue] = useState("john@example.com");
    return (
      <FormField
        label="Email Address"
        value={value}
        onChange={setValue}
        placeholder="Enter email"
      />
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <FormField
        label="Disabled Field"
        value="This field is disabled"
        onChange={() => {
          /* noop */
        }}
        disabled
      />
    );
  },
};

export const Required: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <FormField
        label="Password"
        value={value}
        onChange={setValue}
        placeholder="Enter password"
        required
      />
    );
  },
};
