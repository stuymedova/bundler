import fs from 'node:fs';
import path from 'node:path';
import parser from '@babel/parser';
import _traverse from "@babel/traverse";
import { transformFromAst } from '@babel/core';

const traverse = _traverse.default;

export class Bundler {
	constructor({ outDir = './bundle.js' } = {}) {
		this.outDir = outDir;
	}

	build(pathToEntryFile) {
		const dependencyGraph = this.#createDependencyGraph(pathToEntryFile);
		let modules = '';

		dependencyGraph.forEach((module) => {
			modules += `
				${module.id}: [
					function(require, module, exports) {
						${module.code}
					}, ${JSON.stringify(module.map)}
				],`;
		});

		const bundle = `
			(function(modules) {
				require(0);

				function require(moduleId) {
					const [fn, map] = modules[moduleId];
					const localRequire = (dependencyPath) => {
						return require(map[dependencyPath]);
					}
					const module = { exports: {} };
					fn(localRequire, module, module.exports);
					return module.exports;
				}
			})({${modules}})`;

		try {
			fs.writeFileSync(this.outDir, bundle);
		} catch (error) {
			throw new Error(error);
		}
	}

	/**
	 * Creates dependency graph.
	 */
	#createDependencyGraph(pathToEntryFile) {
		const mainModuleData = this.#getModuleData(pathToEntryFile);
		const queue = [mainModuleData];

		for (const moduleData of queue) {
			const directoryPath = path.dirname(moduleData.filePath);

			moduleData.map = {};
			
			moduleData.dependencies.forEach(relativePath => {
				const pathRelativeToTheEntryFile = 
					path.join(directoryPath, relativePath);
				const importedModuleData = this.#getModuleData(pathRelativeToTheEntryFile);

				moduleData.map[relativePath] = importedModuleData.id;

				queue.push(importedModuleData);
			});
		}

		return queue;
	}

	/**
	 * Extract module data from the given module. Accepts a
	 * file path relative to the entry file as an argument.
	 */
	#getModuleData(filePath) {
		const id = new IdSingleton().getId();
		const entryFileContent = fs.readFileSync(filePath, 'utf-8');
		const ast = parser.parse(entryFileContent, {
			sourceType: 'module',
		});
		const { code } = transformFromAst(ast, null, {
			presets: ['@babel/preset-env'],
		});
		const dependencies = [];

		traverse(ast, {
			ImportDeclaration: ({ node }) => {
				dependencies.push(node.source.value);
			}
		});
		
		return { id, filePath, code, dependencies };
	}
}

/**
 * Provides an interface for creating an id.
 */
class IdSingleton {
	static _instance = null;
	_id = 0;

	constructor() {
		if (!IdSingleton._instance) {
            IdSingleton._instance = this;
        }
		return IdSingleton._instance;
	}

	getId() {
		return this._id++;
	}
}