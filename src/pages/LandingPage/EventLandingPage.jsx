// src/assets/EventLandingPage.jsx
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";
import HeroSection from "./heroSection";
import JourneySection from "./JourneySection";
import PerfectOccasion from "./PerfectOccasion";
import CustomizationSection from "./CustomizationSection";
import HowItWorksSection from "./HowItWorksSection";
import CoreFeaturesSection from "./CoreFeaturesSection";
import ProblemSection from "./ProblemSection";
import SolutionSection from "./SolutionSection";
import WhyChooseUsSection from "./WhyChooseUsSection";
import StatsBar from "./StatsBar";
import Pricing from "./Pricing";
import Footer from "./Footer";
import BuildToScaleSection from "./BuildToScaleSection";
import CTASection from "./CTASection";
import { getCmsSection } from "../../services/cmsService";

const EventLandingPage = () => {
  const [visibility, setVisibility] = useState({
  home: {
    pricing: true,
     services: true,
  },
});

useEffect(() => {
  fetchVisibility();
}, []);

const fetchVisibility = async () => {
  try {
    const res = await getCmsSection("visibility");

    if (res.data?.data?.content) {
      setVisibility(res.data.data.content);
    }
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div style={{ backgroundColor: "#ffffff" }}>
      {/* Navbar */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Journey Section ("Celebrate Better Plan Smarter Today") */}
      <JourneySection />

      {/* Specialization Section ("Events We Specialize In") */}
      <PerfectOccasion />
        {/* The Problem Section */}
      <ProblemSection />

      {/* The Solution Section */}
      <SolutionSection />

      {/* Customization Section ("Designed Around Your Fully Needs") */}
     <CustomizationSection />

      {/* How It Works (Timeline workflow) */}
      <HowItWorksSection />

      {/* Core Features (9-card overview grid) */}
    
       {visibility?.home?.services && <CoreFeaturesSection />}
 

      {/* Why Choose Us Section (arches and middle list) */}
      <WhyChooseUsSection />

      {/* Stats Counter Bar */}
      <StatsBar />

      {/* Pricing Section */}
      {visibility?.home?.pricing && <Pricing />}
      <BuildToScaleSection/>
      <CTASection/>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default EventLandingPage;