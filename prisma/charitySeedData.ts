export const charityCategories = [
  {
    name: 'Orphan Support',
    description: 'Organizations focused on supporting orphans and vulnerable children',
    slug: 'orphan-support',
    img: ''
  },
  {
    name: 'Food Security',
    description: 'Organizations providing food aid and sustainable food solutions',
    slug: 'food-security',
    img: ''
  },
  {
    name: 'Education',
    description: 'Organizations focused on educational initiatives and schools',
    slug: 'education',
    img: ''
  },
  {
    name: 'Healthcare',
    description: 'Medical aid and healthcare service providers',
    slug: 'healthcare',
    img: ''
  },
  {
    name: 'Water & Sanitation',
    description: 'Organizations providing clean water and sanitation solutions',
    slug: 'water-sanitation',
    img: ''
  }
];

export const charities = [
  {
    name: 'Islamic Relief Worldwide',
    slug: 'islamic-relief',
    description: 'Providing relief and development in a dignified manner regardless of gender, race, or religion',
    img: '',
    city: 'Birmingham',
    country: 'United Kingdom',
    isVerified: true,
    links: [
      {
        name: 'Website',
        icon: 'globe',
        url: 'https://www.islamic-relief.org',
        type: 'WEBSITE'
      },
      {
        name: 'Twitter',
        icon: 'twitter',
        url: 'https://twitter.com/irworldwide',
        type: 'SOCIAL'
      },
      {
        name: 'Donate',
        icon: 'donate',
        url: 'https://www.islamic-relief.org/donate',
        type: 'DONATION'
      }
    ],
    categories: {
      connect: [
        { slug: 'food-security' },
        { slug: 'healthcare' },
        { slug: 'water-sanitation' }
      ]
    }
  },
  {
    name: 'UNRWA',
    slug: 'unrwa',
    description: 'United Nations Relief and Works Agency for Palestine Refugees in the Near East',
    img: '',
    city: 'Amman',
    country: 'Jordan',
    isVerified: true,
    links: [
      {
        name: 'Website',
        icon: 'globe',
        url: 'https://www.unrwa.org',
        type: 'WEBSITE'
      },
      {
        name: 'Donate',
        icon: 'donate',
        url: 'https://donate.unrwa.org',
        type: 'DONATION'
      }
    ],
    categories: {
      connect: [
        { slug: 'orphan-support' },
        { slug: 'education' },
        { slug: 'healthcare' }
      ]
    }
  },
  {
    name: 'UNICEF',
    slug: 'unicef',
    description: 'United Nations International Children\'s Emergency Fund',
    img: '',
    city: 'New York',
    country: 'United States',
    isVerified: true,
    links: [
      {
        name: 'Website',
        icon: 'globe',
        url: 'https://www.unicef.org',
        type: 'WEBSITE'
      },
      {
        name: 'Donate',
        icon: 'donate',
        url: 'https://www.unicef.org/take-action',
        type: 'DONATION'
      }
    ],
    categories: {
      connect: [
        { slug: 'orphan-support' },
        { slug: 'education' },
        { slug: 'healthcare' },
        { slug: 'water-sanitation' }
      ]
    }
  },
  {
    name: 'One Ummah',
    slug: 'one-ummah',
    description: 'A UK-based charity providing humanitarian aid to those in need around the world',
    img: '',
    city: 'Nottingham',
    country: 'United Kingdom',
    isVerified: true,
    links: [
      {
        name: 'Website',
        icon: 'globe',
        url: 'https://oneummahtrust.org',
        type: 'WEBSITE'
      },
      {
        name: 'Donate',
        icon: 'donate',
        url: 'https://oneummahtrust.org/donate',
        type: 'DONATION'
      }
    ],
    categories: {
      connect: [
        { slug: 'orphan-support' },
        { slug: 'food-security' },
        { slug: 'healthcare' }
      ]
    }
  },
  {
    name: 'World Health Organization',
    slug: 'who',
    description: 'United Nations specialized agency for international public health',
    img: '',
    city: 'Geneva',
    country: 'Switzerland',
    isVerified: true,
    links: [
      {
        name: 'Website',
        icon: 'globe',
        url: 'https://www.who.int',
        type: 'WEBSITE'
      },
      {
        name: 'Donate',
        icon: 'donate',
        url: 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/donate',
        type: 'DONATION'
      }
    ],
    categories: {
      connect: [
        { slug: 'healthcare' }
      ]
    }
  },
  {
    name: 'IslamNet',
    slug: 'islamnet',
    description: 'Islamic organization providing educational resources and humanitarian aid',
    img: '',
    city: 'Oslo',
    country: 'Norway',
    isVerified: true,
    links: [
      {
        name: 'Website',
        icon: 'globe',
        url: 'https://www.islam.net',
        type: 'WEBSITE'
      },
      {
        name: 'Donate',
        icon: 'donate',
        url: 'https://www.islam.net/donate',
        type: 'DONATION'
      }
    ],
    categories: {
      connect: [
        { slug: 'education' },
        { slug: 'orphan-support' }
      ]
    }
  }
];
