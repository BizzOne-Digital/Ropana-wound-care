import "server-only";
import { dbConnect, serialize } from "@/lib/db";
import { Booking } from "@/models/Booking";
import { Contact } from "@/models/Contact";
import { Faq } from "@/models/Faq";
import { Service } from "@/models/Service";
import { Testimonial } from "@/models/Testimonial";
import { WoundCase } from "@/models/WoundCase";
import { Setting } from "@/models/Setting";
import type { BookingStatus } from "@/models/Booking";
import type { ContactStatus } from "@/models/Contact";

export type AdminContact = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
};

export type AdminBooking = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  service: string;
  message: string;
  status: BookingStatus;
  createdAt: string;
};

export type AdminService = {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  features: string[];
  image: string;
  published: boolean;
  order: number;
  updatedAt: string;
};

export type AdminTestimonial = {
  _id: string;
  name: string;
  content: string;
  rating: number | null;
  location: string;
  published: boolean;
  createdAt: string;
};

export type AdminWoundCase = {
  _id: string;
  title: string;
  summary: string;
  timeframe: string;
  beforeImage: string;
  afterImage: string;
  consent: boolean;
  sensitive: boolean;
  published: boolean;
  order: number;
  createdAt: string;
};

export type AdminFaq = {
  _id: string;
  question: string;
  answer: string;
  published: boolean;
  order: number;
};

export type AdminSetting = {
  _id: string;
  key: string;
  value: string;
};

/**
 * Admin pages read straight from MongoDB rather than calling their own API,
 * which avoids a network hop and cookie forwarding during server rendering.
 * Every one of these is only ever reached through the authenticated
 * /admin layout, which is itself gated by middleware.
 */

export async function listContacts(): Promise<AdminContact[]> {
  await dbConnect();
  return serialize(
    await Contact.find({}).sort({ createdAt: -1 }).limit(300).lean()
  );
}

export async function listBookings(): Promise<AdminBooking[]> {
  await dbConnect();
  return serialize(
    await Booking.find({}).sort({ createdAt: -1 }).limit(300).lean()
  );
}

export async function listServices(): Promise<AdminService[]> {
  await dbConnect();
  return serialize(
    await Service.find({}).sort({ order: 1, createdAt: 1 }).lean()
  );
}

export async function getServiceById(
  id: string
): Promise<AdminService | null> {
  await dbConnect();
  const doc = await Service.findById(id).lean();
  return doc ? serialize<AdminService>(doc) : null;
}

export async function listTestimonials(): Promise<AdminTestimonial[]> {
  await dbConnect();
  return serialize(await Testimonial.find({}).sort({ createdAt: -1 }).lean());
}

export async function listWoundCases(): Promise<AdminWoundCase[]> {
  await dbConnect();
  return serialize(
    await WoundCase.find({}).sort({ order: 1, createdAt: -1 }).lean()
  );
}

export async function listFaqs(): Promise<AdminFaq[]> {
  await dbConnect();
  return serialize(await Faq.find({}).sort({ order: 1, createdAt: 1 }).lean());
}

export async function listSettings(): Promise<AdminSetting[]> {
  await dbConnect();
  return serialize(await Setting.find({}).lean());
}

export type DashboardStats = {
  contactsTotal: number;
  contactsNew: number;
  bookingsTotal: number;
  bookingsPending: number;
  testimonialsPublished: number;
  testimonialsTotal: number;
  servicesPublished: number;
  servicesTotal: number;
  faqsPublished: number;
  faqsTotal: number;
  resultsPublished: number;
  resultsTotal: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  await dbConnect();

  const [
    contactsTotal,
    contactsNew,
    bookingsTotal,
    bookingsPending,
    testimonialsPublished,
    testimonialsTotal,
    servicesPublished,
    servicesTotal,
    faqsPublished,
    faqsTotal,
    resultsPublished,
    resultsTotal,
  ] = await Promise.all([
    Contact.countDocuments({}),
    Contact.countDocuments({ status: "new" }),
    Booking.countDocuments({}),
    Booking.countDocuments({ status: "pending" }),
    Testimonial.countDocuments({ published: true }),
    Testimonial.countDocuments({}),
    Service.countDocuments({ published: true }),
    Service.countDocuments({}),
    Faq.countDocuments({ published: true }),
    Faq.countDocuments({}),
    WoundCase.countDocuments({ published: true }),
    WoundCase.countDocuments({}),
  ]);

  return {
    contactsTotal,
    contactsNew,
    bookingsTotal,
    bookingsPending,
    testimonialsPublished,
    testimonialsTotal,
    servicesPublished,
    servicesTotal,
    faqsPublished,
    faqsTotal,
    resultsPublished,
    resultsTotal,
  };
}
