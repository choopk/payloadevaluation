import sveltePlugin from 'eslint-plugin-svelte';
import baseConfig from './base.js';

export default [...baseConfig, ...sveltePlugin.configs['flat/recommended']];
