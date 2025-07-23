import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
} from '@tabler/icons-react'

export const APP_CONFIG = {
  name: 'FivePlanner',
  creator: 'Abderrahmane MOUZOUNE',
  website: 'https://fiveplanner.fr',
  twitter: '@abderrahmane_js',
  authors: [
    { name: 'Abderrahmane MOUZOUNE', url: 'https://abderrahmanemouzoune.com' },
  ],
} as const

export const SOCIALS = [
  {
    Icon: IconBrandGithub,
    link: 'https://github.com/AbderrahmaneMouzoune',
    text: 'Github',
  },
  {
    Icon: IconBrandLinkedin,
    link: 'https://www.linkedin.com/in/abderrahmane-mouzoune/',
    text: 'LinkedIn',
  },
  {
    Icon: IconBrandX,
    link: 'https://twitter.com/abderrahmane_js',
    text: 'X',
  },
]
