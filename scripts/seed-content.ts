/**
 * Seeds starter services and FAQs so the website is not empty on first run.
 *
 *   npm run seed:content
 *
 * Everything created here is editable from the admin dashboard. Existing
 * records are never overwritten: a service or question is skipped if one with
 * the same slug or question text already exists.
 *
 * NOTE FOR THE CLIENT: this copy is deliberately conservative. It describes
 * process, not outcomes, and makes no claim about healing times, success rates
 * or credentials beyond the board certification supplied in the brief. Review
 * and edit every entry before launch.
 */
import { config } from "dotenv";
import mongoose from "mongoose";
import { Service } from "../src/models/Service";
import { Faq } from "../src/models/Faq";

config({ path: ".env.local" });
config({ path: ".env" });

const services = [
  {
    title: "Wound Assessment and Care Planning",
    slug: "wound-assessment-and-care-planning",
    shortDescription:
      "A full assessment of the wound and the factors affecting it, followed by a written plan you and your family can follow.",
    description: `The first visit is an assessment. We look at the wound itself, measure it and document its condition, and we look at the wider picture: circulation, mobility, nutrition, existing conditions and the medications you are taking.

From that assessment we build an individualized treatment plan. The plan sets out the dressing regimen, how often it needs changing, what to watch for between visits, and when to contact us.

The plan is written in plain language and shared with you, so anyone helping with your care at home knows what to do.`,
    features: [
      "Full wound assessment and documentation",
      "Review of health history and current medications",
      "Written, individualized treatment plan",
      "Guidance for family members and caregivers",
    ],
    order: 0,
    published: true,
  },
  {
    title: "Ongoing Wound Treatment at Home",
    slug: "ongoing-wound-treatment-at-home",
    shortDescription:
      "Scheduled mobile visits for dressing changes, wound cleaning and review of progress, delivered in your own home.",
    description: `Consistency matters in wound care. Missed dressing changes and long gaps between reviews make a wound harder to manage, and getting to a clinic is often the hardest part for patients with limited mobility.

Mobile visits remove that barrier. We come to you on an agreed schedule to clean the wound, change dressings, review progress against the plan and adjust the approach where the wound has changed.

Between visits, you have a clear point of contact for questions.`,
    features: [
      "Scheduled visits at your home",
      "Dressing changes and wound cleaning",
      "Progress reviewed and documented at each visit",
      "Treatment plan adjusted as the wound changes",
    ],
    order: 1,
    published: true,
  },
  {
    title: "Telehealth Consultation",
    slug: "telehealth-consultation",
    shortDescription:
      "A secure video consultation for follow-up, questions between visits, or an initial conversation about your wound.",
    description: `Not every conversation needs someone in the room. A telehealth consultation is a practical way to review how a wound is progressing, talk through a dressing routine, or discuss whether an in-person visit is the right next step.

Telehealth suits follow-up appointments, questions that come up between visits, and first conversations where you want to understand your options.

Where an in-person assessment would be more appropriate, we will say so and arrange a mobile visit instead.`,
    features: [
      "Secure video consultation",
      "Follow-up and progress review",
      "Guidance on dressing routines at home",
      "Referral to an in-person visit where appropriate",
    ],
    order: 2,
    published: true,
  },
  {
    title: "Caregiver and Family Education",
    slug: "caregiver-and-family-education",
    shortDescription:
      "Practical, hands-on guidance for the family members and caregivers who support wound care between visits.",
    description: `Most wound care happens between appointments, carried out by family members and caregivers. Giving them clear, practical guidance makes a real difference to how consistently a plan is followed.

We walk through the dressing routine step by step, explain what a healthy wound looks like and what warrants a call, and answer questions without rushing.

This can be included as part of a scheduled visit or arranged as a dedicated session.`,
    features: [
      "Step-by-step dressing technique",
      "What to monitor between visits",
      "Clear guidance on when to call us",
      "Time for questions, without rushing",
    ],
    order: 3,
    published: true,
  },
];

const faqs = [
  {
    question: "What areas do you serve?",
    answer:
      "We provide mobile wound care across the Dallas-Fort Worth area. If you are not sure whether we reach you, call us and we will tell you straight away.",
    order: 0,
    published: true,
  },
  {
    question: "Does submitting the booking form confirm my appointment?",
    answer:
      "No. The form sends a request. We will contact you by phone or email to confirm availability and agree a time. Your appointment is confirmed only once we have spoken with you.",
    order: 1,
    published: true,
  },
  {
    question: "What happens during the first visit?",
    answer:
      "The first visit is an assessment. We examine and document the wound, review your health history and current medications, and discuss the factors that may be affecting healing.\nFrom that we build an individualized treatment plan and explain it to you and anyone helping with your care.",
    order: 2,
    published: true,
  },
  {
    question: "Do I need a referral from my doctor?",
    answer:
      "Requirements vary depending on your situation and your insurance. Call us with your details and we will tell you what is needed in your case.",
    order: 3,
    published: true,
  },
  {
    question: "When is telehealth appropriate instead of a home visit?",
    answer:
      "Telehealth works well for follow-up, questions between visits, and initial conversations about your options. Where a wound needs to be examined, measured or physically treated, an in-person visit is the right choice, and we will tell you if that is the case.",
    order: 4,
    published: true,
  },
  {
    question: "How should I prepare for a home visit?",
    answer:
      "Have a well-lit space available where you can sit or lie comfortably, along with a list of your current medications and any dressings you already have at home. If a family member or caregiver helps with your wound care, it is useful to have them present.",
    order: 5,
    published: true,
  },
  {
    question: "What should I do in an emergency?",
    answer:
      "Call 911 or go to your nearest emergency department. Signs that need emergency attention include heavy bleeding that will not stop, a rapidly spreading area of redness or swelling, fever with a wound, or difficulty breathing. Do not wait for a scheduled visit.",
    order: 6,
    published: true,
  },
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.startsWith("PASTE_")) {
    throw new Error("MONGODB_URI is not set in .env.local.");
  }

  await mongoose.connect(uri);

  let servicesCreated = 0;
  for (const service of services) {
    const exists = await Service.findOne({ slug: service.slug }).lean();
    if (exists) continue;
    await Service.create(service);
    servicesCreated += 1;
  }

  let faqsCreated = 0;
  for (const faq of faqs) {
    const exists = await Faq.findOne({ question: faq.question }).lean();
    if (exists) continue;
    await Faq.create(faq);
    faqsCreated += 1;
  }

  console.log(`Services created: ${servicesCreated} (skipped ${services.length - servicesCreated} already present)`);
  console.log(`FAQs created: ${faqsCreated} (skipped ${faqs.length - faqsCreated} already present)`);
  console.log("No testimonials are seeded. Add real ones in the dashboard.");

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("\nSeeding failed:", error instanceof Error ? error.message : error);
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
