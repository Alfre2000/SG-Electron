const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@ui': path.resolve(__dirname, 'src/ui/'),
      '@components': path.resolve(__dirname, 'src/components/'),
      '@lib': path.resolve(__dirname, 'src/lib/'),
      '@hooks': path.resolve(__dirname, 'src/hooks/'),
      '@contexts': path.resolve(__dirname, 'src/contexts/'),
      '@utils': path.resolve(__dirname, 'src/utils/'),
      '@images': path.resolve(__dirname, 'src/images/'),
      '@api': path.resolve(__dirname, 'src/api/'),
      '@interfaces': path.resolve(__dirname, 'src/interfaces/'),
      '@pages': path.resolve(__dirname, 'src/pages/'),
      '@charts': path.resolve(__dirname, 'src/charts/'),
    },
  },
};