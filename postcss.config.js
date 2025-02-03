/**
 * This is the configuration file for PostCSS.
 * It includes two essential plugins: tailwindcss and autoprefixer.
 * Tailwind CSS is used for utility-first CSS styling,
 * while Autoprefixer ensures compatibility with older browsers.
 * 
 * The file exports an object containing PostCSS plugins configuration.
 * 
 * @see https://tailwindcss.com/docs/installation for Tailwind CSS installation instructions.
 * @see https://github.com/postcss/autoprefixer for Autoprefixer details.
 */

export default {
  plugins: {
    /**
     * Tailwind CSS plugin
     * 
     * This plugin enables Tailwind's utility-first CSS framework.
     * Tailwind CSS is a highly customizable and responsive-first framework
     * that helps with rapid design and development.
     */
    tailwindcss: {},

    /**
     * Autoprefixer plugin
     * 
     * Autoprefixer automatically adds vendor prefixes to CSS rules.
     * This ensures cross-browser compatibility, especially with older browsers
     * that require specific CSS vendor prefixes.
     */
    autoprefixer: {},
  },
}
