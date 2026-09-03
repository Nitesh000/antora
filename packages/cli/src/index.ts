#!/usr/bin/env node
import { Command } from "commander";

const program = new Command();

program
  .name("antora")
  .description("CLI to manage Antora UI components")
  .version("0.0.1");

program
  .command("init")
  .description("Initialize Antora UI in your project")
  .action(() => {
    console.log("Initializing Antora UI...");
    // TODO: implement initialization (tailwind config, tokens, etc)
  });

program
  .command("add")
  .description("Add a component to your project")
  .argument("<component>", "Component name")
  .action((component) => {
    console.log(`Adding component: ${component}...`);
    // TODO: implement pulling from registry
  });

program.parse();
