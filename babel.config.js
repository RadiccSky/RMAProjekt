module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'], // Dodaj ako koristiš Expo
      plugins: [
        'react-native-reanimated/plugin', // Ovo ostaje
      ],
    };
  };
  