import React from 'react'
import Navbar from '../Components/Common/Navbar'
import Footer from '../Components/Common/Footer'
import AboutHero from '../Components/Common/About-Hero-Section'
import FeatureCards from '../Components/Common/How-Its-Work-Card'
import LeaderMessage from '../Components/Common/Leader-Message'

export default function About() {
  return (
    <>
      <Navbar />
      <AboutHero />
      <FeatureCards />
      <LeaderMessage />
      <Footer />
    </>
  )
}
