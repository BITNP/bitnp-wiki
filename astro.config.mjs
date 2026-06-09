// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'My Docs',
			docsDir: 'content',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			sidebar: [
				{
					label: '诊所',
					items: [{ autogenerate: { directory: 'clinic' } }],
				},
				{
					label: '首页',
					items: [{ autogenerate: { directory: 'index' } }],
				},
				{
					label: '面试',
					items: [{ autogenerate: { directory: 'interview' } }],
				},
				{
					label: '生活',
					items: [{ autogenerate: { directory: 'live' } }],
				},
				{
					label: '日志',
					items: [{ autogenerate: { directory: 'log' } }],
				},
				{
					label: '办公网络',
					items: [{ autogenerate: { directory: 'office-network' } }],
				},
				{
					label: 'WinPE',
					items: [{ autogenerate: { directory: 'winpe' } }],
				},
			],
		}),
	],
});
