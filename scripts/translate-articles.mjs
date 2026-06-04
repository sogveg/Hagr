/**
 * Translates all published articles to English and saves to Supabase.
 * Run: node scripts/translate-articles.mjs
 *
 * Requires migration 011 to have been run first (adds title_en, excerpt_en, content_en columns).
 * The script will check whether the columns exist before attempting the update.
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://trydqadpmyyjmvfdqjhc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyeWRxYWRwbXl5am12ZmRxamhjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTczMTY0OCwiZXhwIjoyMDk1MzA3NjQ4fQ.1ifBG7nEIuhf9ioqjVrLyBlHsI302HYpkt0bpF0uTdY'
)

// ─── Translations ─────────────────────────────────────────────────────────────

const translations = [

  // ── Article 1 ──────────────────────────────────────────────────────────────
  {
    slug: 'lei-babyutstyr-enkelt-trygt-og-fleksibelt-3',
    title_en: 'Rent baby gear easily, safely and flexibly',
    excerpt_en: 'Make everyday life and travel simpler with baby and children\'s equipment rental from TinyRent. We offer practical, quality gear for families with young children, grandparents and visitors who need safe, flexible and sustainable access to equipment for a shorter period.',
    content_en: `
Travelling with young children can be wonderful, but it can also require a lot of planning. Pushchairs, strollers, travel cots, car seats, baby carriers and other equipment take up space, weigh a lot and are often awkward to bring along. At TinyRent, we make it easier for families with young children to access quality equipment exactly when they need it.

TinyRent is designed for families who want a simpler everyday life, whether you're going on holiday, having grandchildren to stay, need equipment for a short period, or want to try a product before deciding to buy it yourself.

## Why rent baby equipment?

Children grow quickly and needs change all the time. Many products are only used for a short period but cost a lot to buy new. By renting, you can access good, practical equipment without tying up money in things that may only be used a handful of times.

It's also a more sustainable option. When more families share quality products, the equipment is better utilised and the need for unnecessary new purchases is reduced.

## Perfect for holidays and travel

If you're travelling with children, there's often a limit to how much you can take with you. A compact stroller, a travel cot or other practical travel gear can make the trip significantly easier.

At TinyRent you can rent equipment that works well for travel, weekend trips, overnight stays and visits. It means more space in the car, less stress at the airport and a simpler experience for both children and adults.

## Quality gear from well-known brands

We offer equipment from well-known and popular brands chosen because they are practical, safe and well suited for families with young children. Products are cleaned and inspected between each rental, so you can feel confident when renting from us.

Whether you need a lightweight stroller, a comfortable pushchair, a sleeping solution or other baby equipment, we want to make it easy to find what you need.

## For families, grandparents and visitors

TinyRent isn't just for parents of young children. Many grandparents, aunts, uncles and families receiving young visitors need equipment for short periods. Instead of buying expensive gear that rarely gets used, renting can be a much simpler solution.

The same applies to families visiting Bergen or the surrounding area who want to avoid bringing everything from home.

## A simpler and more sustainable solution

TinyRent is about making life with young children a little easier. We believe in smart solutions, good quality and less unnecessary consumption. By renting baby and children's equipment, you get flexibility, save space and at the same time help quality products live longer.

Need baby equipment for a short period? TinyRent could be a practical, safe and flexible solution.
`,
  },

  // ── Article 2 ──────────────────────────────────────────────────────────────
  {
    slug: 'da-babyen-ikke-sluttet-a-grate-moonboon-ga-oss-ro-i-en-krevende-periode',
    title_en: 'When the baby wouldn\'t stop crying: – MoonBoon gave us peace during a tough time',
    excerpt_en: 'When your baby cries a lot and sleep is hard to come by, even small breaks can mean an enormous amount. In this article we share how renting a MoonBoon can give new parents a flexible opportunity to test whether gentle rocking can help their baby find more calm.',
    content_en: `
For many new parents, the first months can be both wonderful and incredibly challenging. When the baby cries a lot, sleeps little and needs constant soothing, days can quickly become exhausting. At times like these it's often not about finding a perfect solution, but simply about getting a little more peace in everyday life.

At TinyRent you can rent a MoonBoon for shorter periods. It's ideal for families who want to test whether the hammock works for their child, need it during a particularly demanding phase, or want to avoid buying expensive baby equipment that may only be used for a limited time.

## – We were completely worn out

When the couple we spoke to had their first child, they'd imagined a calm parental leave filled with pram walks, cuddles and small breaks between feeds. It didn't quite turn out that way.

– Our baby cried a lot, especially in the evenings. We tried everything: rocking, walking, a baby carrier, singing, white noise and long laps around the living room. Some evenings it felt like nothing helped, says the mother.

After several nights of little sleep, they began looking for solutions that might bring the baby more calm. They'd heard about MoonBoon but weren't sure whether to buy one.

– When you're exhausted, it's easy to feel like you have to buy everything that might help. At the same time, MoonBoon is an investment, and we just didn't know whether our baby would like it.

## Why they chose to rent a MoonBoon

Instead of buying straight away, the family decided to rent a MoonBoon through TinyRent.

– It was really reassuring to be able to test it first. We didn't have to commit to buying something expensive in the middle of a period when we were desperate for sleep. We could just try it and see whether it worked.

MoonBoon is known for its calm and even rocking motion. Many parents find that the movement can help the baby settle, particularly during periods when the child needs a lot of closeness, rhythm and reassurance.

– The first evening we were a little sceptical but also very hopeful. We carefully laid the baby down, started the rocking and just stood nearby. After a short while she actually began to calm down. It was an incredible relief.

## – It gave us the small breaks we really needed

For the family, MoonBoon didn't become a magic solution that removed every challenge, but it did make everyday life easier.

– She didn't suddenly sleep through the night, but she settled more quickly. That meant we could sit down for a while, have supper together or just get a few minutes without constant crying. Right then, that felt huge.

They used the MoonBoon mainly in the evenings, when the baby was most unsettled.

– That was the time of day we dreaded most. When evening came, we knew there could be hours of crying and rocking ahead. With MoonBoon we had a tool that made that period a little more manageable.

## Smart to test before buying

For many new parents it can be difficult to know which equipment will actually work. What helps one baby doesn't necessarily work for another. That's why renting can be a good alternative.

– I'm really glad we didn't buy straight away. By renting we got to test whether our baby liked it, without spending a lot of money first. It made the decision so much easier.

The family also found that their needs changed over time.

– There are so many things you only need for a short phase. When you're in the thick of it, it feels like it'll last forever, but it usually passes. That's when it's really handy to be able to rent.

## A safer and more flexible solution

Renting a MoonBoon works well for families who want flexibility. Maybe you need it during a sleepless period, on a holiday, when visiting family, or simply to find out whether the product suits your child.

At TinyRent our goal is to make life with young children a little easier. We offer practical baby and children's equipment for short periods, so families can access quality products without having to buy everything themselves.

– For us it was about getting a little more peace. Not perfect nights, but better evenings. And that was more than enough at the time.

## Rent a MoonBoon from TinyRent

Do you have a baby who struggles to settle, or are you considering a MoonBoon before potentially buying one? At TinyRent you can rent a MoonBoon simply and flexibly for a shorter period.

Check availability and book your MoonBoon directly at TinyRent.no.
`,
  },

  // ── Article 3 ──────────────────────────────────────────────────────────────
  {
    slug: 'vi-leide-reisevogn-til-ferien-og-det-gjorde-turen-mye-enklere-2',
    title_en: 'We rented a travel stroller for our holiday, and it made the trip so much easier',
    excerpt_en: 'Travelling with young children takes a bit of extra planning, but the right equipment can make the trip far simpler. When one family went on holiday, they chose to rent a compact travel stroller from TinyRent instead of bringing their large pushchair from home.',
    content_en: `
Travelling with young children is lovely, but there's also a lot to keep track of. Suitcases, hand luggage, children, food, nappies, the airport and onward transport. That's why it's especially important that the equipment you bring actually makes things easier.

When a family went on a fly holiday, they wanted a practical solution for the pram. They had a regular pushchair at home, but it was large and heavy to travel with. Instead of buying a separate travel stroller, they chose to rent through TinyRent.

## – We just wanted to make the trip a little simpler

The family were flying and knew the airport could easily get a bit chaotic.

– We didn't want to drag the big pushchair from home. It's great for everyday use but impractical when travelling. At the same time we didn't want to buy a new stroller just for one holiday, says the customer.

So they rented a compact travel stroller.

– It was very straightforward. We found what we needed, chose the dates and picked it up before we left. It really was as simple as we'd hoped.

## The travel stroller got used the whole time

Right from the airport, the family noticed the travel stroller had been a good choice.

– It was easy to fold, simple to push and much less hassle than the big pushchair. It made a big difference when we had plenty of other things to carry.

On the holiday, the stroller came everywhere. To breakfast, on short walks, into shops, to restaurants and whenever the child needed a rest.

– We used it every day. When the little one got tired, they just hopped in the stroller. It meant we could be a bit more spontaneous instead of having to head back to the hotel every time.

For parents of young children, it's often the small things that determine whether a day feels easy or stressful. A lightweight travel stroller can be one of those things.

## Great not to have to buy everything

For the family, the main point was that they only needed the equipment for a short period.

– We had no need for a travel stroller sitting at home all year. We needed it for the holiday, so renting was a really good solution.

After the trip, they returned the equipment.

– It was lovely not to have to store even more baby gear at home. You end up with enough things as it is with young children.

## A small thing that made the holiday easier

Travelling with children is never entirely without planning, but the right equipment makes a big difference.

– For us this was a very practical solution. The trip was easier and we didn't have to spend money on something we only needed for a short time.

At TinyRent you can rent baby and children's equipment for short and longer periods, perfect for holidays, travel, visits or when you want to try a product before buying.

## Rent a travel stroller from TinyRent

Are you travelling with young children? At TinyRent you can rent a travel stroller so your trip is a little easier from start to finish.

Check availability and book directly at TinyRent.no.
`,
  },

  // ── Article 4 ──────────────────────────────────────────────────────────────
  {
    slug: 'lei-barnesete-nar-barnebarn-kommer-pa-besok-2',
    title_en: 'Rent a car seat when the grandchildren come to visit',
    excerpt_en: 'Having grandchildren to stay and need a car seat? At TinyRent you can rent a car seat for short periods. Perfect for family visits, holidays and a week with young children in the house.',
    content_en: `
When grandchildren come to visit, there's so much to look forward to. Maybe a trip to the playground, a short drive, dinner with family or just a few lovely days together at home. But if you're going in the car, the car seat needs to be ready.

A grandparent couple who were having their grandchild to stay for a week needed a car seat. They didn't have a lot of space in their flat and didn't want to buy a seat that would just end up taking up room. So they chose to rent through TinyRent.

## – We just wanted it sorted before they arrived

The grandparents had been looking forward to the visit for a long time. They'd planned a relaxed week of family time, small outings and time together with their grandchild.

– We don't have a car seat at home any more, but we knew we'd be using the car while they were here. We wanted it all sorted before they arrived, says the grandfather.

They first considered buying a seat, but quickly decided it wasn't necessary.

– It felt a bit unnecessary to buy something new just for one week. We didn't need it regularly, only when we had visitors.

## Easy to rent for a week

The solution was to rent a car seat through TinyRent.

– It was very straightforward. We found a seat that suited us, chose the period we needed it for and that was that. We didn't have to think about it any more.

For the grandparents, the most important thing was to avoid stress just before the visit. When the family arrived, they wanted to focus on spending time with them.

– It was a real relief to know the car seat was taken care of. That way we could concentrate on enjoying the visit.

## Easier to get out and about

With the car seat ready, it was simpler to be a bit spontaneous. They could pop to the shops, visit family or take a little day trip without having to plan everything around transport.

– It made the week so much easier. We could just get in the car and go when it suited us.

The seat got used several times during the visit.

– We used it more than we expected. It was really handy to have it available throughout the week.

## No need to buy something that will just sit there

For many grandparents, the need for baby equipment only comes around occasionally, when the children and grandchildren come to visit but not otherwise.

– We already have plenty of things taking up space, so it was good not to have to add more. When the visit was over, we simply returned the seat.

That made the whole thing simple and practical.

– For us it was exactly what we needed. No more hassle than necessary.

## Perfect when young children come to visit

Renting a car seat is ideal for grandparents, aunts, uncles and others who have young children visiting. It could be for a weekend, a week or a longer period.

At TinyRent you can rent baby and children's equipment for short and longer periods, so you have what you need when you need it, without having to buy everything yourself.

## Rent a car seat from TinyRent

Having grandchildren or young children in the family coming to stay? At TinyRent you can rent a car seat for exactly the period you need it.

Check availability and book directly at TinyRent.no.
`,
  },
]

// ─── Update articles ──────────────────────────────────────────────────────────

async function run() {
  console.log(`Updating ${translations.length} articles with English translations...\n`)

  let success = 0
  let failed = 0

  for (const t of translations) {
    const { error } = await supabase
      .from('articles')
      .update({
        title_en:   t.title_en,
        excerpt_en: t.excerpt_en,
        content_en: t.content_en,
        updated_at: new Date().toISOString(),
      })
      .eq('slug', t.slug)

    if (error) {
      console.error(`✗ ${t.slug}`)
      console.error(`  Error: ${error.message}`)
      if (error.message.includes('does not exist')) {
        console.error('\n  ⚠️  Columns not found — run migration 011 in Supabase SQL Editor first:\n')
        console.error('  ALTER TABLE articles')
        console.error('    ADD COLUMN IF NOT EXISTS title_en text,')
        console.error('    ADD COLUMN IF NOT EXISTS excerpt_en text,')
        console.error('    ADD COLUMN IF NOT EXISTS content_en text;\n')
        process.exit(1)
      }
      failed++
    } else {
      console.log(`✓ ${t.slug}`)
      success++
    }
  }

  console.log(`\nDone: ${success} updated, ${failed} failed.`)
}

run().catch(console.error)
