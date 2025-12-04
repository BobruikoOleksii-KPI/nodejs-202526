module.exports = {
  mutate: ['src/**/*.js'],
  testRunner: 'jest',
  reporters: ['html', 'clear-text', 'progress'],
  coverageAnalysis: 'perTest',
  concurrency: 1,
};
