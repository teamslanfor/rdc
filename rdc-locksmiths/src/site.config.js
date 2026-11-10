/**
 * Single source of truth for business details.
 * Sources: Yell https://www.yell.com/biz/rdc-locksmiths-inverness-11032179/, the business's Facebook page
 * (https://www.facebook.com/p/RDC-Locksmiths-100090196368464/ – as summarised in search results; the page itself needs a login),
 * Top Scot Trades listing (based in North Kessock; 5.0 from 5 reviews), plus the phone and email supplied by the client.
 * Edit here, then run `npm run build`. Items marked CONFIRM should be checked with the owner.
 */
module.exports = {
  name: 'RDC Locksmiths',
  shortName: 'RDC Locksmiths',
  brandSub: 'Locksmith & Door Specialist',
  lang: 'en-GB',
  locale: 'en_GB',
  phoneFormat: 'UK',
  url: 'https://www.rdclocksmiths.co.uk', // matches the email domain – CONFIRM
  area: 'Inverness, North Kessock, the Black Isle & the Highlands',
  phone: '07777 165148',
  phoneIntl: '+447777165148',
  phoneHref: 'tel:+447777165148',
  // CONFIRM: that this mobile is on WhatsApp
  whatsapp: 'https://wa.me/447777165148?text=' + encodeURIComponent('Hi RDC Locksmiths, I need some help with a lock/door.'),
  whatsappNumber: '447777165148',
  // Listings place the business at 2 Drumsmittal Rd, North Kessock IV1 3JU. Only the area is shown publicly – CONFIRM
  // whether the owner wants the full address on the site.
  address: { street: '', city: 'North Kessock, Inverness', region: '', postcode: 'IV1', country: 'GB' },
  addressLine: 'North Kessock, Inverness IV1',
  mapQuery: 'North Kessock, Inverness',
  yell: 'https://www.yell.com/biz/rdc-locksmiths-inverness-11032179/',
  facebook: 'https://www.facebook.com/p/RDC-Locksmiths-100090196368464/',
  reviewSiteName: 'Yell',
  // Opening hours were not listed – leave null to hide.
  hours: null, openFrom: null, openTo: null, hoursShort: '', hoursLabel: '', openingHoursSchema: '',
  schemaType: 'Locksmith',
  schemaDescription: 'Locksmith and door specialist based in North Kessock, serving Inverness and the Highlands: emergency entry, lock changes and repairs, door installation, glass replacement and security upgrades.',
  footerAbout: 'Your local locksmith and door specialist, based in North Kessock and serving Inverness and the wider Highlands.',
  ctaTitle: 'Locked out or need a lock changed?',
  ctaText: 'Call Robert now, or send a quick message and we’ll get back to you.',
  headerCta: 'Get a quote',
  manifestShort: 'RDC Locks',
  license: '',
  owner: { name: 'Robert' }, // from a public customer review – CONFIRM surname/preferred name

  // Quote form + chatbot leads are emailed here via FormSubmit (formsubmit.co). The FIRST submission sends a
  // one-time activation email to this inbox – click the link in it once.
  email: 'rdclocksmiths@rdclocksmiths.co.uk',
  formEndpoint: null,

  socials: [
    { label: 'RDC Locksmiths on Facebook', icon: 'facebook', url: 'https://www.facebook.com/p/RDC-Locksmiths-100090196368464/' },
    { label: 'RDC Locksmiths on Yell', icon: 'star', url: 'https://www.yell.com/biz/rdc-locksmiths-inverness-11032179/' },
  ],
};
if (!module.exports.formEndpoint && module.exports.email) {
  module.exports.formEndpoint = 'https://formsubmit.co/ajax/' + module.exports.email;
}
