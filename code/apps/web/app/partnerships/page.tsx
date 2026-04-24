'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Building2, Users, Heart, Star, CheckCircle2, Lightbulb, TrendingUp, Sparkles, DollarSign, ExternalLink, Award } from 'lucide-react';
import { ImageWithFallback } from '../../components/ImageWithFallback';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:1337";

type Sponsor = {
  id: number;
  name: string;
  url: string | null;
  logoUrl: string | null;
  blurb: string | null;
  tier: string | null;
  sponsorType: string | null;
  amountLabel: string | null;
  callout: string | null;
  featured: boolean;
  displayOrder: number;
};

const PLACEHOLDER_SPONSORS: Sponsor[] = [
  { id: 9001, name: "Evergreen Community Bank", url: null, logoUrl: null, tier: "Legacy Sponsor", sponsorType: "Sponsor", amountLabel: "$10,000+", callout: "Investing in women-led futures", blurb: "Evergreen Community Bank has been a cornerstone partner of AWW, providing financial resources to help women achieve economic stability and independence.", featured: true, displayOrder: 1 },
  { id: 9002, name: "Northwest Women's Wellness Collective", url: null, logoUrl: null, tier: "Empowerment Sponsor", sponsorType: "Sponsor", amountLabel: "$5,000+", callout: "Holistic health for whole communities", blurb: "Supporting AWW's health and wellness programming so women have access to mental, physical, and emotional wellbeing resources.", featured: false, displayOrder: 2 },
  { id: 9003, name: "Horizon Legal Aid Partners", url: null, logoUrl: null, tier: "Empowerment Sponsor", sponsorType: "Grant Partner", amountLabel: "$5,000+", callout: "Justice for every woman", blurb: "Horizon Legal Aid provides pro bono legal guidance to AWW participants navigating housing, custody, and employment challenges.", featured: false, displayOrder: 3 },
  { id: 9004, name: "Unity Family Resource Center", url: null, logoUrl: null, tier: "Community Sponsor", sponsorType: "Partner", amountLabel: "$1,000+", callout: "Families stronger together", blurb: "Unity Family Resource Center partners with AWW on childcare and family support services, removing barriers so moms can focus on growth.", featured: false, displayOrder: 4 },
];

const TIER_BADGE: Record<string, string> = {
  "Legacy Sponsor":      "bg-yellow-100 text-yellow-800 border border-yellow-300",
  "Empowerment Sponsor": "bg-purple-100 text-purple-800 border border-purple-300",
  "Community Sponsor":   "bg-blue-100 text-blue-800 border border-blue-300",
  "Partner":             "bg-green-100 text-green-800 border border-green-300",
};

function mediaUrl(p?: string | null): string | null {
  if (!p) return null;
  return p.startsWith("http") ? p : `${CMS_URL}${p}`;
}

function pickImage(img: any): string | null {
  return img?.url || img?.data?.attributes?.url ||
    (Array.isArray(img?.data) ? img.data[0]?.attributes?.url : null) || null;
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

// ScrollReveal component
function ScrollReveal({ children, variants = fadeInUp, className = "" }: {
  children: React.ReactNode;
  variants?: any;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      <div>{children}</div>
    </motion.div>
  );
}

function PartnershipsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const url =
          `${CMS_URL}/api/sponsors?` +
          `populate=logo&filters[active][$eq]=true` +
          `&sort=displayOrder:asc&pagination[pageSize]=50`;
        const res = await fetch(url);
        if (!res.ok) { setSponsors(PLACEHOLDER_SPONSORS); return; }
        const rows: any[] = (await res.json())?.data ?? [];
        if (!rows.length) { setSponsors(PLACEHOLDER_SPONSORS); return; }
        setSponsors(rows.map((row) => {
          const a = row?.attributes ?? row;
          const img = pickImage(a?.logo);
          return {
            id: row.id ?? a.id,
            name: a?.name ?? "Sponsor",
            url: a?.url ?? null,
            logoUrl: img ? mediaUrl(img) : null,
            tier: a?.tier ?? null,
            sponsorType: a?.sponsorType ?? null,
            amountLabel: a?.amountLabel ?? null,
            callout: a?.callout ?? null,
            blurb: typeof a?.blurb === "string" ? a.blurb :
              Array.isArray(a?.blurb) ? a.blurb.map((b: any) =>
                (b?.children ?? []).map((c: any) => c?.text ?? "").join("")
              ).join(" ") : null,
            featured: a?.featured ?? false,
            displayOrder: a?.displayOrder ?? 0,
          } as Sponsor;
        }));
      } catch {
        setSponsors(PLACEHOLDER_SPONSORS);
      }
    })();
  }, []);

  const partnershipTypes = [
    {
      icon: Users,
      title: "Community Partners",
      description: "Join our network of local organizations, nonprofits, and community groups working together to empower women. Together, we can amplify our impact and reach more women in need.",
      image: "https://images.unsplash.com/photo-1697665387559-253e7a645e96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBwYXJ0bmVycyUyMG5vbnByb2ZpdHxlbnwxfHx8fDE3NjIzODA5MDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: "Measurable Impact",
      description: "Receive detailed reports showing the direct impact of your partnership on women's lives"
    },
    {
      icon: Users,
      title: "Community Connection",
      description: "Build authentic relationships with diverse communities and engage your team in meaningful work"
    },
    {
      icon: Lightbulb,
      title: "Thought Leadership",
      description: "Position your organization as a leader in women's empowerment and social responsibility"
    },
    {
      icon: Heart,
      title: "Brand Alignment",
      description: "Demonstrate your commitment to diversity, equity, and inclusion through action"
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero Section */}
      <section className="relative h-[350px] bg-gradient-to-br from-[#004080] to-[#003066] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1758518729240-7162d07427b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzc3dvbWVuJTIwaGFuZHNoYWtlJTIwcGFydG5lcnNoaXB8ZW58MXx8fHwxNzYyMzg3ODM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Partnerships"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white max-w-3xl text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-6xl mb-6">
                Partner with Us
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl mb-8 text-white/90"
            >
              Together, we can create lasting change and empower women to reach their full potential
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Featured Partnerships - PROMINENT SECTION */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#f7941D]/10 to-[#F79520]/5 rounded-full blur-3xl -z-0"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#004080]/10 to-blue-500/5 rounded-full blur-3xl -z-0"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#f7941D] to-[#F79520] text-white px-6 py-2 rounded-full mb-6">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Featured Success Stories</span>
            </div>
            <h2 className="text-4xl md:text-5xl text-[#004080] mb-4">
              Our Strategic Partnerships
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Through collaborative partnerships, we've received critical funding to expand our mission of empowering women and strengthening families
            </p>
          </ScrollReveal>

          <div className="space-y-8">
            {/* Spokane Workforce Council - Higher grant amount first */}
            <ScrollReveal variants={slideInLeft}>
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 border-[#f7941D]/20 bg-gradient-to-br from-white to-orange-50/30">
                <div className="grid md:grid-cols-5 gap-0">
                  <div className="md:col-span-2 bg-gradient-to-br from-[#004080] to-[#003066] p-8 md:p-12 flex flex-col justify-center items-center text-white">
                    <motion.div 
                      className="bg-white p-6 rounded-2xl mb-6 w-full max-w-xs"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <img 
                        src="/images/Spokane WorkForce Council.png" 
                        alt="Spokane Workforce Council"
                        className="w-full h-auto object-contain"
                      />
                    </motion.div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <DollarSign className="w-8 h-8 text-[#f7941D]" />
                        <span className="text-5xl font-bold text-[#f7941D]">$30,000</span>
                      </div>
                      <p className="text-white/90 text-lg">Grant Award</p>
                    </div>
                  </div>
                  <div className="md:col-span-3 p-8 md:p-12">
                    <div className="inline-block bg-[#f7941D] text-white px-4 py-1 rounded-full text-sm mb-4">
                      Strategic Partner
                    </div>
                    <h3 className="text-3xl md:text-4xl text-[#004080] mb-4">
                      Spokane Workforce Council
                    </h3>
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                      A Woman's Worth was awarded a <strong className="text-[#f7941D]">$30,000 grant</strong> from the Spokane Workforce Council to continue our vital work assisting women in their journey toward self-sufficiency through education, employment opportunities, and professional training programs.
                    </p>
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                      Through this transformative partnership, we've established comprehensive pathways that connect women to essential resources for themselves and their children. Our collaborative approach ensures that when we empower a woman, we strengthen the entire family unit—creating generational impact that extends far beyond individual success stories.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                        <CheckCircle2 className="w-5 h-5 text-[#004080]" />
                        <span className="text-[#004080]">Education Support</span>
                      </div>
                      <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                        <CheckCircle2 className="w-5 h-5 text-[#004080]" />
                        <span className="text-[#004080]">Employment Training</span>
                      </div>
                      <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                        <CheckCircle2 className="w-5 h-5 text-[#004080]" />
                        <span className="text-[#004080]">Family Resources</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </ScrollReveal>

            {/* The Way To Justice */}
            <ScrollReveal variants={slideInRight}>
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 border-[#f7941D]/20 bg-gradient-to-br from-white to-orange-50/30">
                <div className="grid md:grid-cols-5 gap-0">
                  <div className="md:col-span-3 p-8 md:p-12 order-2 md:order-1">
                    <div className="inline-block bg-[#f7941D] text-white px-4 py-1 rounded-full text-sm mb-4">
                      Strategic Partner
                    </div>
                    <h3 className="text-3xl md:text-4xl text-[#004080] mb-4">
                      The Way To Justice
                    </h3>
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                      A Woman's Worth was honored to receive a <strong className="text-[#f7941D]">$10,000 grant</strong> from The Way To Justice to advance our critical mission of empowering and supporting women who are courageously returning to society after incarceration.
                    </p>
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                      This partnership has enabled us to provide comprehensive support services, resources, and guidance to women navigating the challenging transition back into their communities. By addressing barriers and creating opportunities, we're not only transforming individual lives but also strengthening families and positively impacting the broader community through successful reintegration and long-term stability.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                        <CheckCircle2 className="w-5 h-5 text-[#004080]" />
                        <span className="text-[#004080]">Reintegration Support</span>
                      </div>
                      <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                        <CheckCircle2 className="w-5 h-5 text-[#004080]" />
                        <span className="text-[#004080]">Resource Access</span>
                      </div>
                      <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                        <CheckCircle2 className="w-5 h-5 text-[#004080]" />
                        <span className="text-[#004080]">Community Impact</span>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 bg-gradient-to-br from-[#004080] to-[#003066] p-8 md:p-12 flex flex-col justify-center items-center text-white order-1 md:order-2">
                    <motion.div 
                      className="bg-white p-6 rounded-2xl mb-6 w-full max-w-xs"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <img 
                        src="/images/The Way To justice.png" 
                        alt="The Way To Justice"
                        className="w-full h-auto object-contain"
                      />
                    </motion.div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <DollarSign className="w-8 h-8 text-[#f7941D]" />
                        <span className="text-5xl font-bold text-[#f7941D]">$10,000</span>
                      </div>
                      <p className="text-white/90 text-lg">Grant Award</p>
                    </div>
                  </div>
                </div>
              </Card>
            </ScrollReveal>
          </div>

          {/* Partnership Impact Summary */}
          <ScrollReveal className="mt-12">
            <Card className="bg-gradient-to-r from-[#004080] to-[#003066] text-white p-8 md:p-12 text-center border-0">
              <h3 className="text-3xl mb-4">
                Combined Partnership Impact
              </h3>
              <p className="text-xl text-white/90 mb-6 max-w-3xl mx-auto">
                Together, these strategic partnerships have provided <span className="font-bold text-[#f7941D]">$40,000</span> in funding, enabling us to expand our reach, enhance our programs, and create more opportunities for women to build brighter futures for themselves and their families.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-[#f7941D]" />
                  <span>Transforming Lives</span>
                </div>
                <span className="hidden sm:inline text-white/40">•</span>
                <div className="flex items-center gap-2">
                  <Heart className="w-6 h-6 text-[#f7941D]" />
                  <span>Strengthening Families</span>
                </div>
                <span className="hidden sm:inline text-white/40">•</span>
                <div className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-[#f7941D]" />
                  <span>Building Community</span>
                </div>
              </div>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      {/* Why Partner With Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl text-[#004080] mb-4">
              Why Partner With AWW?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your partnership creates meaningful change while providing valuable benefits for your organization
            </p>
          </ScrollReveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {benefits.map((benefit, index) => (
              <motion.div key={index}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-t-4 border-t-[#f7941D]">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#f7941D] to-[#F79520] rounded-full flex items-center justify-center mb-4">
                      <benefit.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl mb-3 text-[#004080]">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Partnership Types */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl text-[#004080] mb-4">
              Partnership Opportunities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find the partnership model that aligns with your organization's mission and values
            </p>
          </ScrollReveal>

          <div className="space-y-12">
            {partnershipTypes.map((type, index) => (
              <ScrollReveal key={index} variants={index % 2 === 0 ? slideInLeft : slideInRight}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className={`grid md:grid-cols-2 gap-0 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                    <div className={`${index % 2 === 1 ? 'md:order-2' : ''}`}>
                      <ImageWithFallback
                        src={type.image}
                        alt={type.title}
                        className="w-full h-full object-cover min-h-[300px]"
                      />
                    </div>
                    <div className={`p-8 md:p-12 flex flex-col justify-center ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                      <div className="w-16 h-16 bg-gradient-to-br from-[#f7941D] to-[#F79520] rounded-full flex items-center justify-center mb-6">
                        <type.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-3xl mb-4 text-[#004080]">
                        {type.title}
                      </h3>
                      <p className="text-gray-600 text-lg mb-6">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Sponsors */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#004080] to-[#003066] text-white px-6 py-2 rounded-full mb-6">
              <Award className="w-5 h-5" />
              <span className="font-medium">Our Sponsors</span>
            </div>
            <h2 className="text-4xl md:text-5xl text-[#004080] mb-4">Community Champions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Generous sponsors who invest in women's futures and make our mission possible.
            </p>
          </ScrollReveal>

          {sponsors.length > 0 && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {sponsors.map((s) => {
                const badgeClass = s.tier ? (TIER_BADGE[s.tier] ?? "bg-gray-100 text-gray-700 border border-gray-200") : null;
                return (
                  <motion.div key={s.id} variants={fadeInUp}>
                    <Card className="h-full flex flex-col overflow-hidden border border-black/5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white">
                      <div className="h-24 bg-gradient-to-br from-[#004080]/5 to-[#f7941D]/10 flex items-center justify-center p-4 border-b border-black/5">
                        {s.logoUrl ? (
                          <img src={s.logoUrl} alt={s.name} className="max-h-16 max-w-full object-contain" />
                        ) : (
                          <Building2 className="w-10 h-10 text-[#004080]/30" />
                        )}
                      </div>
                      <CardContent className="p-5 flex flex-col flex-1">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {s.tier && badgeClass && (
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}>{s.tier}</span>
                          )}
                          {s.sponsorType && s.sponsorType !== "Sponsor" && (
                            <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">{s.sponsorType}</span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-[#004080] mb-1">{s.name}</h3>
                        {s.callout && (
                          <p className="text-sm text-[#f7941D] font-semibold mb-2 italic">"{s.callout}"</p>
                        )}
                        {s.blurb && (
                          <p className="text-sm text-gray-600 mb-3 flex-1 line-clamp-3">{s.blurb}</p>
                        )}
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-neutral-100">
                          {s.amountLabel && (
                            <span className="flex items-center gap-1 text-xs text-[#f7941D] font-semibold">
                              <DollarSign className="w-3 h-3" /> {s.amountLabel}
                            </span>
                          )}
                          {s.url && (
                            <a href={s.url} target="_blank" rel="noopener noreferrer"
                              className="ml-auto inline-flex items-center gap-1 text-xs text-[#004080] hover:text-[#f7941D] transition-colors font-medium">
                              Visit <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* Sponsorship Tiers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl text-[#004080] mb-4">Sponsorship Tiers</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the level that fits your organization and magnify your community impact.
            </p>
          </ScrollReveal>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                tier: "Community Sponsor",
                amount: "$1,000+",
                color: "from-blue-600 to-blue-800",
                icon: Users,
                perks: ["Logo on website", "Newsletter mention", "Social media shoutout", "Event recognition"],
              },
              {
                tier: "Empowerment Sponsor",
                amount: "$5,000+",
                color: "from-[#f7941D] to-[#d4740e]",
                icon: Star,
                highlighted: true,
                perks: ["Everything in Community", "Feature article in newsletter", "Banner at events", "Dedicated impact report", "Quarterly partner call"],
              },
              {
                tier: "Legacy Sponsor",
                amount: "$10,000+",
                color: "from-[#004080] to-[#003066]",
                icon: Award,
                perks: ["Everything in Empowerment", "Named program recognition", "Speaking opportunity at Gala", "Custom impact video", "Advisory relationship"],
              },
            ].map((t, i) => {
              const Icon = t.icon;
              return (
                <motion.div key={i} variants={fadeInUp}>
                  <Card className={`h-full flex flex-col overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${t.highlighted ? "ring-2 ring-[#f7941D]" : ""}`}>
                    <div className={`bg-gradient-to-br ${t.color} p-8 text-white text-center`}>
                      <Icon className="w-10 h-10 mx-auto mb-3 opacity-90" />
                      <h3 className="text-2xl font-extrabold mb-1">{t.tier}</h3>
                      <p className="text-3xl font-bold text-white/90">{t.amount}</p>
                      {t.highlighted && (
                        <span className="mt-3 inline-block rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold uppercase tracking-widest">
                          Most Popular
                        </span>
                      )}
                    </div>
                    <CardContent className="flex-1 p-6 flex flex-col">
                      <ul className="space-y-2 flex-1 mb-6">
                        {t.perks.map((perk, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-[#f7941D] shrink-0 mt-0.5" />
                            {perk}
                          </li>
                        ))}
                      </ul>
                      <a href="/contact#contact-form">
                        <Button className="w-full bg-[#f7941D] hover:bg-[#d4740e] text-white rounded-full">
                          Become a Sponsor
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#004080] to-[#003066] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join our community of partners dedicated to empowering women and creating lasting change
            </p>
            <div className="flex justify-center">
              <a href="/contact#contact-form">
                <Button className="bg-[#f7941D] hover:bg-[#F79520] text-white px-8 py-6 text-lg rounded-full transition-all duration-200 hover:scale-105">
                  Become a Partner
                </Button>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h3 className="text-3xl text-[#004080] mb-6">
              Questions About Partnerships?
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              We'd love to discuss how we can work together to empower women in our community
            </p>
            <div className="flex justify-center">
              <a href="mailto:ghallman@aww.community" className="text-[#f7941D] hover:text-[#F79520] transition-colors text-lg">
                ghallman@aww.community
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

export default PartnershipsPage;