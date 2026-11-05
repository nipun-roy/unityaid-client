import { EventItem } from './types';

function getFutureDate(daysAhead: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
}

export const DEFAULT_EVENTS: EventItem[] = [
  {
    _id: 'seed-event-1',
    title: 'Winter Clothes Distribution – Mirpur 10, Dhaka',
    description:
      'Join us in bringing warmth to families in Mirpur. We will be distributing high-quality thermal sweaters, jackets, mufflers, and socks to elderly citizens, children, and rickshaw pullers facing severe winter cold waves.',
    eventType: 'Donation',
    thumbnail: '/images/events/winter-clothes.jpg',
    location: 'Mirpur 10 Roundabout Community Center, Dhaka',
    eventDate: getFutureDate(5),
    creatorEmail: 'organizer@unityaid.org',
    creatorName: 'Tanvir Ahmed',
    attendeesCount: 28,
  },
  {
    _id: 'seed-event-2',
    title: 'Blanket Distribution for the Needy – Mohammadpur, Dhaka',
    description:
      'An overnight voluntary humanitarian outreach to deliver heavy warm blankets directly to pavement dwellers, street vendors, and homeless laborers across Mohammadpur, Town Hall, and Geneva Camp areas.',
    eventType: 'Donation',
    thumbnail: '/images/events/blanket-distribution.jpg',
    location: 'Town Hall Market Perimeter, Mohammadpur, Dhaka',
    eventDate: getFutureDate(8),
    creatorEmail: 'organizer@unityaid.org',
    creatorName: 'Ayesha Siddiqua',
    attendeesCount: 34,
  },
  {
    _id: 'seed-event-3',
    title: 'Buriganga Riverbank Cleanliness & Plastic Drive – Sadarghat, Dhaka',
    description:
      'Mobilizing 100+ youth eco-warriors to collect discarded non-biodegradable polythene bags, single-use bottles, and hazardous debris from the ghat embankment to revive marine hygiene and waterway beauty.',
    eventType: 'Cleanup',
    thumbnail: '/images/events/river-cleanup.jpg',
    location: 'Launch Terminal & Riverbank, Sadarghat, Old Dhaka',
    eventDate: getFutureDate(12),
    creatorEmail: 'greenbd@unityaid.org',
    creatorName: 'Nafis Mahmud',
    attendeesCount: 42,
  },
  {
    _id: 'seed-event-4',
    title: 'Free Pediatric Health & Nutrition Camp – Korail, Dhaka',
    description:
      'A comprehensive medical relief camp staffed by volunteer certified pediatricians and nurses offering free health checkups, nutritional supplements, deworming syrups, and hygiene masterclasses for children.',
    eventType: 'Healthcare',
    thumbnail: '/images/events/health-camp.jpg',
    location: 'Community School Field, Korail Bosti, Mohakhali, Dhaka',
    eventDate: getFutureDate(15),
    creatorEmail: 'health@unityaid.org',
    creatorName: 'Dr. Farhana Yasmin',
    attendeesCount: 56,
  },
  {
    _id: 'seed-event-5',
    title: 'Urban Afforestation & Tree Plantation – Uttara Sector 18, Dhaka',
    description:
      'Planting 500 indigenous fruit-bearing, shade-providing, and medicinal saplings (Neem, Krishnachura, Bakul, and Mango) across open walkways and lakeside green corridors of Diabari, Uttara.',
    eventType: 'Plantation',
    thumbnail: '/images/events/tree-plantation.jpg',
    location: 'Sector 18 Lakeside Walkway, Diabari, Uttara, Dhaka',
    eventDate: getFutureDate(18),
    creatorEmail: 'ecowarriors@unityaid.org',
    creatorName: 'Zubair Hossain',
    attendeesCount: 65,
  },
  {
    _id: 'seed-event-6',
    title: 'Free Blood Grouping & Voluntary Donation Drive – TSC, Dhaka University',
    description:
      'In partnership with local university youth clubs, providing rapid computerized blood grouping tests and collecting emergency whole-blood units for thalassemia patients and accident emergencies.',
    eventType: 'Healthcare',
    thumbnail: '/images/events/blood-donation.jpg',
    location: 'Teacher-Student Centre (TSC) Premises, University of Dhaka',
    eventDate: getFutureDate(21),
    creatorEmail: 'bloodconnect@unityaid.org',
    creatorName: 'Mehedi Hasan',
    attendeesCount: 80,
  },
  {
    _id: 'seed-event-7',
    title: 'Dhanmondi Lake Cleanliness & Eco-Awareness Campaign – Dhanmondi 8',
    description:
      'Youth-led cleanup effort to recover floating waste, plastic wrappers, and foam cups along the Dhanmondi Lake jogging paths and Rabindra Sarobar, alongside distributing eco-friendly jute shopping bags.',
    eventType: 'Cleanup',
    thumbnail: '/images/events/dhanmondi-lake.jpg',
    location: 'Rabindra Sarobar Amphitheatre, Dhanmondi Lake, Dhaka',
    eventDate: getFutureDate(24),
    creatorEmail: 'cleandhaka@unityaid.org',
    creatorName: 'Shaila Parveen',
    attendeesCount: 39,
  },
  {
    _id: 'seed-event-8',
    title: 'School Backpack & Learning Stationery Drive – Kamrangirchar, Dhaka',
    description:
      'Distributing 250 heavy-duty waterproof school backpacks complete with notebooks, geometric boxes, colored pencils, and Bengali storybooks to underprivileged elementary students in Kamrangirchar.',
    eventType: 'Education',
    thumbnail: '/images/events/education-drive.jpg',
    location: 'Shishu Kalyan Primary School Grounds, Kamrangirchar, Dhaka',
    eventDate: getFutureDate(27),
    creatorEmail: 'educationforall@unityaid.org',
    creatorName: 'Kamrul Islam',
    attendeesCount: 47,
  },
];

