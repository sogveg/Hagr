interface JsonLdProps {
  data: Record<string, unknown>
}

/** Render JSON-LD structured data as a <script> tag */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

const BASE = 'https://www.tinyrent.no'

// ─── Organization + LocalBusiness (RentalService) ────────────────────────────

/** Full Organization + LocalBusiness + RentalService schema for homepage */
export function OrganizationSchema() {
  return (
    <>
      {/* WebSite with SearchAction → enables sitelinks search box in Google */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'TinyRent',
          url: BASE,
          description: 'Lei premium babyutstyr trygt og enkelt i Bergen.',
          inLanguage: ['nb-NO', 'en'],
          potentialAction: {
            '@type': 'SearchAction',
            target: { '@type': 'EntryPoint', urlTemplate: `${BASE}/bergen?q={search_term_string}` },
            'query-input': 'required name=search_term_string',
          },
        }}
      />

      {/* LocalBusiness */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': ['LocalBusiness', 'RentalService'],
          '@id': `${BASE}/#organization`,
          name: 'TinyRent',
          alternateName: 'TinyRent Bergen',
          description: 'Lei premium babyutstyr trygt og enkelt i Bergen. Vogner, bilstoler, hengekøyer, reisesenger og mer. Grundig vasket mellom hver utleie.',
          url: BASE,
          logo: {
            '@type': 'ImageObject',
            url: `${BASE}/images/logo.png`,
            width: 200,
            height: 60,
          },
          image: `${BASE}/images/hero.jpg`,
          email: 'hei@tinyrent.no',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Bergen',
            addressRegion: 'Vestland',
            postalCode: '5000',
            addressCountry: 'NO',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 60.3913,
            longitude: 5.3221,
          },
          areaServed: {
            '@type': 'City',
            name: 'Bergen',
            sameAs: 'https://www.wikidata.org/wiki/Q122926',
          },
          serviceArea: {
            '@type': 'GeoCircle',
            geoMidpoint: {
              '@type': 'GeoCoordinates',
              latitude: 60.3913,
              longitude: 5.3221,
            },
            geoRadius: '30000',
          },
          priceRange: '$$',
          currenciesAccepted: 'NOK',
          paymentAccepted: 'Credit Card, Debit Card, Visa, Mastercard',
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '09:00',
              closes: '17:00',
            },
          ],
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Babyutstyr til leie',
            itemListElement: [
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Barnevogn utleie' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Bilstol utleie' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Reiseseng utleie' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Hengekøye utleie' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Matstol utleie' } },
            ],
          },
          sameAs: [
            'https://www.instagram.com/tinyrent.no',
            'https://www.facebook.com/tinyrent.no',
          ],
          knowsAbout: [
            'Babyutstyr', 'Barnevogn', 'Bilstol', 'Hengekøye', 'Reiseseng',
            'Baby equipment rental', 'Stroller rental', 'Car seat rental',
          ],
        }}
      />

      {/* FAQPage — huge for AI assistants and Google featured snippets */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Hva koster det å leie babyutstyr hos TinyRent?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Prisene varierer etter produkt og leieperiode. Ukespris starter fra rundt 250 kr for enkelt tilbehør og opp til 600-900 kr for vogner og bilstoler. Vi tilbyr dagspris, ukespris og månedspris. Jo lenger leieperiode, jo bedre pris per dag.',
              },
            },
            {
              '@type': 'Question',
              name: 'Kan jeg hente babyutstyr selv i Bergen?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Ja, du kan hente utstyret selv. Vi avtaler henting i Bergen. Du kan også få utstyret levert hjem til deg. Ta kontakt for å avtale levering.',
              },
            },
            {
              '@type': 'Question',
              name: 'Er babyutstyret trygt og rengjort?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Ja, alt utstyr hos TinyRent er grundig vasket og desinfisert mellom hver utleie. Vi kontrollerer at alt er i god stand og i henhold til gjeldende sikkerhetsstandarder før det leies ut.',
              },
            },
            {
              '@type': 'Question',
              name: 'Hvor lenge kan jeg leie babyutstyr?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Du kan leie fra 1 dag til flere måneder. Vi tilbyr fleksible leieperioder som passer for alt fra en weekend, ferie, besøk av barnebarn, til en lengre periode mens du venter på eget utstyr.',
              },
            },
            {
              '@type': 'Question',
              name: 'Tilbyr TinyRent barnesete / bilstol til leie i Bergen?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Ja, TinyRent leier ut godkjente barneseter og bilstoler i Bergen. Perfekt for besteforeldre, besøkende og familier som trenger bilstol for en kortere periode.',
              },
            },
            {
              '@type': 'Question',
              name: 'Kan jeg leie MoonBoon hengekøye hos TinyRent?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Ja, TinyRent tilbyr MoonBoon hengekøye til utleie. MoonBoon er kjent for den rolige vuggebevegelsen som kan hjelpe babyer å roe seg. Du kan leie den for å teste om den passer for barnet ditt før du eventuelt kjøper.',
              },
            },
            {
              '@type': 'Question',
              name: 'What baby equipment can I rent in Bergen?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'TinyRent in Bergen offers rental of strollers, pushchairs, car seats, travel cots, baby hammocks (MoonBoon), high chairs, baby carriers and more. All equipment is thoroughly cleaned between rentals.',
              },
            },
          ],
        }}
      />
    </>
  )
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

interface BreadcrumbSchemaProps {
  items: { name: string; url?: string }[]
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          ...(item.url ? { item: item.url } : {}),
        })),
      }}
    />
  )
}

// ─── Article (BlogPosting) ────────────────────────────────────────────────────

interface ArticleSchemaProps {
  title:       string
  excerpt?:    string | null
  coverImage?: string | null
  publishedAt?: string | null
  updatedAt?:  string | null
  author?:     string | null
  slug:        string
}

export function ArticleSchema({ title, excerpt, coverImage, publishedAt, updatedAt, author, slug }: ArticleSchemaProps) {
  const url = `${BASE}/artikler/${slug}`
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description: excerpt ?? undefined,
        image: coverImage ? [coverImage] : [`${BASE}/images/hero.jpg`],
        url,
        datePublished: publishedAt ?? undefined,
        dateModified: updatedAt ?? publishedAt ?? undefined,
        inLanguage: 'nb-NO',
        author: {
          '@type': 'Organization',
          name: author ?? 'TinyRent',
          url: BASE,
        },
        publisher: {
          '@type': 'Organization',
          name: 'TinyRent',
          url: BASE,
          logo: { '@type': 'ImageObject', url: `${BASE}/images/logo.png`, width: 200, height: 60 },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url,
        },
        isPartOf: {
          '@type': 'Blog',
          name: 'TinyRent – Artikler og tips',
          url: `${BASE}/artikler`,
        },
      }}
    />
  )
}

// ─── Product ─────────────────────────────────────────────────────────────────

interface ProductSchemaProps {
  name:          string
  description?:  string | null
  brand?:        string | null
  imageUrl?:     string | null
  priceDay?:     number | null
  priceWeek?:    number | null
  priceMonth?:   number | null
  depositAmount?: number
  isAvailable:   boolean
  slug:          string
  locationSlug:  string
  categorySlug:  string
}

export function ProductSchema({
  name, description, brand, imageUrl,
  priceDay, priceWeek, priceMonth, depositAmount,
  isAvailable, slug, locationSlug, categorySlug,
}: ProductSchemaProps) {
  const url = `${BASE}/${locationSlug}/${categorySlug}/${slug}`
  const availability = isAvailable ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'

  const offers: Record<string, unknown>[] = []
  if (priceDay)   offers.push({ '@type': 'Offer', url, priceCurrency: 'NOK', price: priceDay.toString(),   priceSpecification: { '@type': 'UnitPriceSpecification', price: priceDay,   priceCurrency: 'NOK', unitText: 'DAY'   }, availability, seller: { '@type': 'Organization', name: 'TinyRent' } })
  if (priceWeek)  offers.push({ '@type': 'Offer', url, priceCurrency: 'NOK', price: priceWeek.toString(),  priceSpecification: { '@type': 'UnitPriceSpecification', price: priceWeek,  priceCurrency: 'NOK', unitText: 'WK'    }, availability, seller: { '@type': 'Organization', name: 'TinyRent' } })
  if (priceMonth) offers.push({ '@type': 'Offer', url, priceCurrency: 'NOK', price: priceMonth.toString(), priceSpecification: { '@type': 'UnitPriceSpecification', price: priceMonth, priceCurrency: 'NOK', unitText: 'MON'   }, availability, seller: { '@type': 'Organization', name: 'TinyRent' } })

  const fallbackImage = `${BASE}/images/products/${categorySlug}.jpg`

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Product',
        name,
        description: description ?? undefined,
        image: imageUrl ? [imageUrl] : [fallbackImage],
        url,
        brand: brand ? { '@type': 'Brand', name: brand } : undefined,
        itemCondition: 'https://schema.org/UsedCondition',
        offers: offers.length === 1 ? offers[0] : offers.length > 1 ? offers : undefined,
        additionalProperty: depositAmount && depositAmount > 0 ? [
          { '@type': 'PropertyValue', name: 'Depositum', value: `${depositAmount} NOK` },
        ] : undefined,
      }}
    />
  )
}

// ─── ItemList (for location/category pages) ──────────────────────────────────

interface ItemListSchemaProps {
  name:  string
  url:   string
  items: { name: string; url: string; image?: string | null; description?: string | null }[]
}

export function ItemListSchema({ name, url, items }: ItemListSchemaProps) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name,
        url,
        numberOfItems: items.length,
        itemListElement: items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          url: item.url,
          ...(item.image ? { image: item.image } : {}),
          ...(item.description ? { description: item.description } : {}),
        })),
      }}
    />
  )
}
