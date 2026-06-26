"use client";

import Logo from "@/components/Logo";
import {
    ArrowRightIcon,
    ArrowTopRightOnSquareIcon,
    BuildingOfficeIcon,
    CheckCircleIcon,
    ChevronDownIcon,
    ClockIcon,
    CurrencyDollarIcon,
    EnvelopeIcon,
    GlobeAltIcon,
    MapPinIcon,
    PhoneIcon,
    PlayIcon,
    ShieldCheckIcon,
    SparklesIcon,
    TicketIcon,
    TruckIcon,
    UsersIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useEffect, useState } from "react";

const testimonials = [
  {
    name: "M. Mulumba",
    role: "Directeur, Transports RDC",
    content:
      "Africa Connect Logistic a transformé notre logistique. Service fiable et professionnel.",
    rating: 5,
  },
  {
    name: "Mme Nsimba",
    role: "Responsable, Congo Export",
    content:
      "Une équipe compétente qui comprend nos besoins. Je recommande vivement.",
    rating: 5,
  },
  {
    name: "M. Kabongo",
    role: "PDG, Logistique Kinshasa",
    content:
      "Le meilleur service de transport en RDC. Ponctualité et sécurité garanties.",
    rating: 5,
  },
];

function ScrollButton({
  children,
  targetId,
  className,
}: {
  children: React.ReactNode;
  targetId: string;
  className?: string;
}) {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <button onClick={() => scrollToSection(targetId)} className={className}>
      {children}
    </button>
  );
}

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: TruckIcon,
      title: "Transport de Personnel",
      description:
        "Voyagez en toute sécurité et confort à travers toute la RDC.",
      items: [
        "Véhicules climatisés",
        "Chauffeurs professionnels",
        "Suivi GPS temps réel",
      ],
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: GlobeAltIcon,
      title: "Transport Marchandises",
      description: "Solution fiable pour le transport de vos marchandises.",
      items: ["Transport sécurisé", "Assurance cargaison", "Livraison express"],
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      icon: ShieldCheckIcon,
      title: "Import / Export",
      description:
        "Services logistiques complets pour vos opérations internationales.",
      items: ["Dédouanement", "Transport international", "Suivi complet"],
      color: "from-violet-500 to-purple-600",
      bgColor: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      icon: TicketIcon,
      title: "Réservation en Ligne",
      description:
        "Réservez facilement vos billets vers toutes les destinations.",
      items: [
        "Réservation en ligne",
        "Paiement sécurisé",
        "E-ticket instantané",
      ],
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  const stats = [
    { label: "Transports par jour", value: "500+", icon: TruckIcon },
    { label: "Clients satisfaits", value: "15K+", icon: UsersIcon },
    { label: "Villes desservies", value: "50+", icon: MapPinIcon },
    { label: "Fiabilité", value: "99.9%", icon: ShieldCheckIcon },
  ];

  const whyChoose = [
    {
      icon: ShieldCheckIcon,
      title: "Sécurité garantie",
      desc: "Assurance complète et protocoles stricts",
    },
    {
      icon: ClockIcon,
      title: "Ponctualité",
      desc: "Livraison à temps, à chaque fois",
    },
    {
      icon: CurrencyDollarIcon,
      title: "Tarifs compétitifs",
      desc: "Meilleurs prix sans compromis",
    },
    {
      icon: UsersIcon,
      title: "Support 24/7",
      desc: "Service client toujours disponible",
    },
  ];

  const navLinks = [
    { label: "Services", href: "#services" },
    { label: "À propos", href: "#about" },
    { label: "Témoignages", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100" : "bg-transparent"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Logo
                size={52}
                showText={true}
                textClassName={isScrolled ? "text-gray-900" : "text-gray-900"}
                subTitle={
                  <span
                    className={`flex items-center ${isScrolled ? "text-gray-500" : "text-gray-500"}`}
                  >
                    <MapPinIcon className="h-3 w-3 mr-1" />
                    Lubumbashi
                  </span>
                }
              />
            </div>
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/auth"
                className="ml-4 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Se connecter
              </Link>
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-xl">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl font-medium transition-all"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/auth"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 mt-2 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg"
              >
                Se connecter
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Split Screen Style */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-blue-100/40 to-transparent" />

        {/* Animated blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                <SparklesIcon className="h-4 w-4" />
                <span>Votre partenaire logistique de confiance</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Transport & Logistique
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Professionnels
                </span>
                <br />
                en RDC
              </h1>

              <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                Solutions complètes de transport de personnel, marchandises et
                services d'import/export à travers la République Démocratique du
                Congo et l'Afrique Centrale.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-xl shadow-blue-500/30 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  Commencer maintenant
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </Link>
                <ScrollButton
                  targetId="services"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                >
                  <PlayIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Découvrir nos services
                </ScrollButton>
              </div>

              {/* Trust badges */}
              <div className="flex items-center space-x-6 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <StarSolidIcon
                        key={i}
                        className="h-4 w-4 text-yellow-400"
                      />
                    ))}
                    <span className="ml-2 text-sm font-semibold text-gray-900">
                      4.9/5
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Basé sur 2000+ avis clients
                  </p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Main card */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl transform rotate-3" />
                <div className="absolute inset-0 bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center justify-center p-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mb-6">
                    <GlobeAltIcon className="h-16 w-16 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Africa Connect
                  </h3>
                  <p className="text-gray-500 text-center mb-6">
                    Solutions logistiques complètes pour votre entreprise
                  </p>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="bg-blue-50 rounded-xl p-3 text-center">
                      <p className="text-xl font-bold text-blue-600">500+</p>
                      <p className="text-xs text-gray-500">Transports/jour</p>
                    </div>
                    <div className="bg-indigo-50 rounded-xl p-3 text-center">
                      <p className="text-xl font-bold text-indigo-600">50+</p>
                      <p className="text-xs text-gray-500">Villes</p>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-4 border border-gray-100 animate-bounce">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      En ligne
                    </span>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <TruckIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      Livraison rapide
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDownIcon className="h-6 w-6 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Stats Section - Modern Cards */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="relative group">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <stat.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="py-24 bg-gradient-to-b from-white to-gray-50/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
              Nos Services
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Solutions Logistiques
              <br />
              Complètes
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Des services adaptés à tous vos besoins de transport et logistique
              en RDC
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-transparent hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 h-full">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 mb-5 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <div
                          className={`w-5 h-5 rounded-full ${feature.bgColor} flex items-center justify-center mr-3 flex-shrink-0`}
                        >
                          <CheckCircleIcon
                            className={`h-3.5 w-3.5 ${feature.iconColor}`}
                          />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Modern Layout */}
      <section id="about" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Visual Side */}
            <div className="relative">
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                      <ShieldCheckIcon className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold mb-2">10+ ans</h3>
                    <p className="text-blue-100">
                      d'expérience dans le transport
                    </p>
                  </div>
                </div>
              </div>
              {/* Floating stats card */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">98%</p>
                    <p className="text-sm text-gray-500">Satisfaction client</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div>
              <span className="inline-flex items-center px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-4">
                Pourquoi Nous Choisir
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                L'Excellence au Cœur de
                <br />
                Chaque Transport
              </h2>
              <p className="text-lg text-gray-500 mb-10 leading-relaxed">
                Avec plus de 10 ans d'expérience dans le secteur du transport,
                Africa Connect Logistic s'est imposée comme un leader dans la
                fourniture de solutions logistiques innovantes en RDC.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {whyChoose.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <item.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Glassmorphism Cards */}
      <section
        id="testimonials"
        className="py-24 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-4">
              Témoignages
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Ce Que Disent Nos Clients
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Des témoignages authentiques de ceux qui nous font confiance
              chaque jour
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 md:p-12 border border-gray-100">
              {/* Quote icon */}
              <div className="absolute top-8 right-8 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              <div className="flex items-center mb-6">
                {[...Array(testimonials[activeTestimonial].rating)].map(
                  (_, i) => (
                    <StarSolidIcon
                      key={i}
                      className="h-5 w-5 text-yellow-400"
                    />
                  ),
                )}
              </div>

              <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed italic">
                "{testimonials[activeTestimonial].content}"
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonials[activeTestimonial].name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      {testimonials[activeTestimonial].name}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {testimonials[activeTestimonial].role}
                    </p>
                  </div>
                </div>
                <ArrowTopRightOnSquareIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center space-x-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${activeTestimonial === index ? "w-8 bg-blue-600" : "w-3 bg-gray-300 hover:bg-gray-400"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Prêt à Optimiser Votre Logistique?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Rejoignez des milliers d'entreprises qui nous font déjà confiance
            pour leurs besoins logistiques en RDC et en Afrique Centrale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-xl"
            >
              Commencer gratuitement
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </Link>
            <Link
              href="/auth"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/10 transition-all duration-200"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
              Contact
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Contactez-Nous
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Notre équipe est à votre disposition pour répondre à toutes vos
              questions
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {[
                {
                  icon: BuildingOfficeIcon,
                  title: "Siège Social",
                  info: "Kinshasa, République Démocratique du Congo",
                },
                {
                  icon: PhoneIcon,
                  title: "Téléphone",
                  info: "+243 812 345 678",
                },
                {
                  icon: EnvelopeIcon,
                  title: "Email",
                  info: "contact@africaconnect.cd",
                },
                {
                  icon: ClockIcon,
                  title: "Heures d'ouverture",
                  info: "Lun - Ven: 8h00 - 18h00\nSam: 9h00 - 14h00",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <item.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-sm whitespace-pre-line">
                      {item.info}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-3">
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                <form
                  className="space-y-5"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sujet
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Comment pouvons-nous vous aider?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Votre message..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
                  >
                    Envoyer le message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-1">
              <Logo
                size={48}
                showText={true}
                textClassName="text-white"
              />  
              <span className="flex items-center text-gray-400">
                <MapPinIcon className="h-3 w-3 mr-1" />
                Lubumbashi, RD Congo
              </span>
              <p className="mt-4 text-gray-400 leading-relaxed">
                Votre partenaire logistique de confiance en RDC et en Afrique
                Centrale. Transport sécurisé et professionnel.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Services</h4>
              <ul className="space-y-3">
                {[
                  "Transport Personnel",
                  "Transport Marchandises",
                  "Import/Export",
                  "Réservation en Ligne",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#services"
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Entreprise</h4>
              <ul className="space-y-3">
                {["À propos", "Carrières", "Presse", "Partenaires"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {item}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Légal</h4>
              <ul className="space-y-3">
                {[
                  "Conditions d'utilisation",
                  "Politique de confidentialité",
                  "Mentions légales",
                  "CGV",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © 2024 Africa Connect Logistic. Tous droits réservés.
            </p>
            <p className="text-gray-600 text-xs">
              Africa Connect System v1.1 | Développé par Andy Mukonde
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
