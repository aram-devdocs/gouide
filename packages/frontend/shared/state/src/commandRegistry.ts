/**
 * Command Registry - singleton command system with fuzzy search
 */

import Fuse from "fuse.js";

export type CommandCategory = "file" | "edit" | "view" | "search" | "settings" | "theme" | "help";

export interface Command {
  id: string;
  label: string;
  category: CommandCategory;
  keywords?: string[];
  icon?: string;
  keybinding?: string;
  when?: () => boolean;
  execute: () => void | Promise<void>;
}

export interface CommandRegistry {
  commands: Map<string, Command>;
  register(command: Command): void;
  unregister(id: string): void;
  execute(id: string): Promise<void>;
  search(query: string): Command[];
  getByCategory(category: CommandCategory): Command[];
  getAll(): Command[];
}

class CommandRegistryImpl implements CommandRegistry {
  commands = new Map<string, Command>();

  register(command: Command): void {
    this.commands.set(command.id, command);
  }

  unregister(id: string): void {
    this.commands.delete(id);
  }

  async execute(id: string): Promise<void> {
    const command = this.commands.get(id);
    if (!command) {
      throw new Error(`Command not found: ${id}`);
    }
    if (command.when && !command.when()) {
      return;
    }
    await command.execute();
  }

  search(query: string): Command[] {
    if (!query.trim()) {
      return Array.from(this.commands.values());
    }

    const fuse = new Fuse(Array.from(this.commands.values()), {
      keys: ["label", "keywords", "id", "category"],
      threshold: 0.3,
      includeScore: true,
    });

    return fuse.search(query).map((result) => result.item);
  }

  getByCategory(category: CommandCategory): Command[] {
    return Array.from(this.commands.values()).filter((cmd) => cmd.category === category);
  }

  getAll(): Command[] {
    return Array.from(this.commands.values());
  }
}

/**
 * Singleton command registry instance
 */
export const commandRegistry = new CommandRegistryImpl();
