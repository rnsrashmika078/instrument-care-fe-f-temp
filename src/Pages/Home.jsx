import React from 'react'
import Navbar from '../Components/Common/Navbar'
// import Hero from '../Components/Common/Hero-section'
import NewHero from '../Components/Common/NewHeroSection'
import FeatureCards from '../Components/Common/Cart'
import Services from '../Components/Common/Service'
import WhyUs from '../Components/Common/Why-Us'
import TestimonialSection from '../Components/Common/Testimonials'
import AppointmentSection from '../Components/Common/Appointment'
import Footer from '../Components/Common/Footer'
import CategorySearch from '../Components/Common/CategorySearch'
import LatestNews from '../Components/Common/LatestNews'
import RecentInstruments from '../Components/Common/RecentInstruments'
import StatsSection from '../Components/Common/StatsSection'
import Stakeholders from '../Components/Common/Stakeholders'
import Disclaimer from '../Components/Common/Disclaimer'
import Hero from '../Components/Common/Hero-section'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      {/* <NewHero /> */}
      {/* <FeatureCards/> */}
      {/* <CategorySearch /> */}
      <Services/>
      <WhyUs />
      <TestimonialSection />
      <AppointmentSection/>
      {/* <LatestNews />
      <RecentInstruments />
      <StatsSection />
      <Stakeholders /> */}
      {/* <Disclaimer /> */}
      <Footer />
    </>
  )
}
