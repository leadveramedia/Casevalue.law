module.exports = {
  webpack: {
    configure: (config, { env }) => {
      if (env === 'production') {
        // Disable source maps in production
        config.devtool = false;

        // Strip console.log statements in production via Terser
        const terserPlugin = config.optimization.minimizer.find(
          (plugin) => plugin.constructor.name === 'TerserPlugin'
        );
        if (terserPlugin) {
          const compressOpts = terserPlugin.options?.minimizer?.options?.compress || {};
          terserPlugin.options.minimizer.options.compress = {
            ...compressOpts,
            drop_console: true,
          };
        }
      }
      return config;
    },
  },
};
