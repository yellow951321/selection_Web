const browserSupportConditions = [
  // Use Taiwan usage statistics
  '> 0.1% in TW',

  // Versions of Firefox newer than 20
  'Firefox > 20',

  // All versions released since year 2015
  'since 2015',

  // Not dead
  'not dead',

  // Exclude ie
  // 'not ie <= 11',
]

module.exports = browserSupportConditions
