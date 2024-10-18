# Traduzioni personalizzate - Custom Translations Plugin

## General information
- **Author**: Michele Mincone
- **Date**: 18 October 2024
- **Version**: v1.0.0
- **Data Structure**: JSON
- **Plugin name**: Custom Translations Plugin by Michele Mincone (IT: Traduzioni Personalizzate - Plugin by Michele Mincone)
- **Developer website**: [https://michelemincone.com](https://michelemincone.com)
- **Available translatable languages**: Only one (italian for reference)

## Description
The Custom Translations Plugin for WordPress allows you to easily manage and customize translations for your website. Enhance your site's multilingual capabilities with user-friendly translation management.

This is an easy and ready to use WordPress plugin that through an user friendly dashboard (made in React Typescript) let's you apply translations to untraslated strings.

The plugin uses the ["gettext"](https://developer.wordpress.org/reference/hooks/gettext/) filter made available by WordPress.

The plugin saves the translations as a JSON string inside 'wp_options' table as 'ctp-translations' option key. The value is a JSON string.

On the first installation and activation, the plugin will generate a default translation file.

## Future improvements
Future versions of this plugin will provide:

- **One click auto-translations**: Automatic translations using various APIs of all the inserted strings that you want to translate
- **Multi-languages translations**: For each language, you can translate the targeted string. You'll be able to select the targeted language via a list, inside the already present user interface, to apply a translations for multi-lingual websites.
- **Improved JSON data structure to handle translations and other data**: Improvement of how data structures in JSON are handled, saved and structured
- **Text domain translations**: Each string from a plugin or theme has a specific text-domain or domain. In future versions you'll be able to translate the strings you want to translate for specific text-domains or domains to avoid string translation conflicts.
- **Per page (or per template) translations**: on each page or template you have specific and determined strings added via specific wordpress functions (for example: [_e()](https://developer.wordpress.org/reference/functions/_e/)) or not. Via the already existing user interface, you'll be able to specify the page template where you want to apply the translations. For example cart.php or checkout.php for woocommerce.

## Features
- Easy translation management
- User-friendly interface
- Seamless integration with WordPress
- 'gettext' WordPress filter to apply translations
- Export and import translations feature

## Installation
1. Download the plugin.
2. Upload the plugin files to the `/wp-content/plugins/custom-translations` directory.
3. Activate the plugin through the 'Plugins' menu in WordPress.

## Usage
1. Navigate to the Custom Translations settings page.
3. Add or edit translations as needed adding or removing strings and their translations.
4. Save your changes.

## Changelog
### 1.0.0
- Initial release
### 1.1.0
- Improved JSON data strucure
- Minor issues resolved and bug fixing
- Little improvements on security and React Typescript frontend user interface

## License
This plugin is licensed under the [GPLv2 or later](https://www.gnu.org/licenses/gpl-2.0.html).

## Support
For support, please visit the [official developer website (Michele Mincone)](https://michelemincone.com).
