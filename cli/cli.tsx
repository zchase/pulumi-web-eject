#!/usr/bin/env node
import React from "react";
import * as yargs from "yargs";
import { render } from "ink";
import { cli } from "./core/utils/index.js";
import { Provider } from "react-redux";
import { store } from "./store/index.js";

import Wrapper from "./wrapper.js";
import CreateEnv from "./createEnv.js";
import Deploy from "./deploy.js";
import Destroy from "./destroy.js";
import Eject from "./eject.js";
import Init from "./init.js";

function renderView(Cmp: React.FC<any>, args?: yargs.ArgumentsCamelCase) {
	render(
		<Provider store={store}>
			<Wrapper>
				<Cmp cliArgs={args} />
			</Wrapper>
		</Provider>
	);
}

const app = new cli.CLI();

app.addCommand({
	name: "init",
	description: "creates a pan project from a next.js project",
	options: (yargs) => {
		return yargs;
	},
	handler: (_args) => renderView(Init),
});

app.addCommand({
	name: "create-env",
	description: "create a new environment",
	options: (yargs) => yargs,
	handler: (_args) => renderView(CreateEnv),
});

app.addCommand({
	name: "deploy",
	description: "deploy your project to an environment",
	options: (yargs) => yargs
		.option("environment", {
			alias: "e",
			type: "string",
			describe: "The environment you want to deploy into."
		}),
	handler: (args) => renderView(Deploy, args),
});

app.addCommand({
	name: "destroy",
	description: "destroy the resources in your environment",
	options: (yargs) => yargs,
	handler: (_args) => renderView(Destroy),
});

app.addCommand({
	name: "eject",
	description: "eject into a raw pulumi program",
	options: (yargs) => yargs,
	handler: (_args) => renderView(Eject),
});

app.init();
