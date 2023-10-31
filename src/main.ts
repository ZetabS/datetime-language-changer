import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { locales } from './locale';

interface localeSettings {
	locale: string;
}

const DEFAULT_SETTINGS: localeSettings = {
	locale: 'en'
};

export default class SetMomentLocalePlugin extends Plugin {
	settings: localeSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new SettingTab(this.app, this));

		for (const locale of window.moment.locales()) {
			if (locale !== this.settings.locale) {
				window.moment.updateLocale(locale, null);
			}
		}
		window.moment.updateLocale(this.settings.locale, {});
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SettingTab extends PluginSettingTab {
	plugin: SetMomentLocalePlugin;

	constructor(app: App, plugin: SetMomentLocalePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h3', {
			text: `WARNING: DO NOT DELETE or DISABLE this plugin.`,
			attr: { style: 'color: red' }
		});

		const text = containerEl.createEl('p');

		text.createEl('span', {
			text: `Obsidian basically does NOT support to change internal "moment.js" locale.`
		});

		text.createEl('br');

		text.createEl('span', {
			text: `As a result, I couldn't fix the bug where the locale does not change when the plugin is disabled.`
		});

		new Setting(containerEl)
			.setName('Locale')
			.setDesc('* Restart needed')
			.addDropdown((dropdown) => {
				for (const code in locales) {
					dropdown.addOption(code, locales[code]);
				}

				dropdown.setValue(this.plugin.settings.locale).onChange(async (value) => {
					this.plugin.settings.locale = value;
					await this.plugin.saveSettings();
				});
			});
	}
}
