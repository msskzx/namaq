import { eventsData } from './eventsSeedData';
import { prisma } from '../src/lib/prisma';
import { EventType } from '../src/generated/prisma';

async function main() {
  console.log('🌱 Deleting events...');
  await prisma.event.deleteMany();

  console.log('🌱 Seeding events...');
  // Get all battles to map slugs to IDs
  const battles = await prisma.battle.findMany({
    select: {
      id: true,
      slug: true,
    },
  });

  // Get all people to map slugs to IDs
  const people = await prisma.person.findMany({
    select: {
      id: true,
      slug: true,
    },
  });

  const battleSlugToId = new Map(battles.map((battle: { id: string; slug: string }) => [battle.slug, battle.id]));
  const personSlugToId = new Map(
    people
      .filter((person): person is { id: string; slug: string } => person.slug !== null)
      .map((person: { id: string; slug: string }) => [person.slug, person.id])
  );

  // Create events
  for (const eventData of eventsData) {
    const { battleSlug, personSlugs, ...eventInput } = eventData;
    
    // Prepare the data for create/update
    const eventDataForUpsert: any = {
      ...eventInput,
      metadata: eventInput.metadata ? JSON.stringify(eventInput.metadata) : null,
    };

    // Only add battle connection if battleSlug exists
    if (battleSlug && battleSlugToId.has(battleSlug)) {
      eventDataForUpsert.battle = {
        connect: { id: battleSlugToId.get(battleSlug) }
      };
    }

    try {
      // Try to find existing event by type and description
      const existingEvent = await prisma.event.findFirst({
        where: {
          type: eventInput.type as EventType,
          description: eventInput.description,
        },
        include: {
          people: {
            select: { id: true }
          }
        }
      });

      let eventId: string;
      
      if (existingEvent) {
        // Update existing event
        const updatedEvent = await prisma.event.update({
          where: { id: existingEvent.id },
          data: eventDataForUpsert,
        });
        eventId = updatedEvent.id;
        console.log(`✅ Updated event: ${eventInput.type} - ${eventInput.descriptionTransliterated.substring(0, 50)}...`);
      } else {
        // Create new event
        const newEvent = await prisma.event.create({
          data: eventDataForUpsert,
        });
        eventId = newEvent.id;
        console.log(`✅ Created event: ${eventInput.type} - ${eventInput.descriptionTransliterated.substring(0, 50)}...`);
      }

      // Handle person relationships if personSlugs exist
      if (personSlugs && personSlugs.length > 0) {
        // Get valid person IDs from the slugs
        const personIds = personSlugs
          .map(slug => personSlugToId.get(slug))
          .filter((id): id is string => id !== undefined);

        if (personIds.length > 0) {
          // Update the event to connect the people
          await prisma.event.update({
            where: { id: eventId },
            data: {
              people: {
                connect: personIds.map(id => ({ id }))
              }
            }
          });
          
          console.log(`   ↳ Connected ${personIds.length} people to event`);
        }
      }
    } catch (error) {
      console.error(`❌ Error processing event: ${eventInput.type} - ${eventInput.descriptionTransliterated}`, error);
    }
  }

  console.log('🌱 Seeding events completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding events:', e);
    process.exit(1);
  })
  .finally(async () => {
  });
