import { Celebrations } from "@/components/Celebrations";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <div className="invitation-page">
      <a className="skip-link" href="#main">
        Skip to invitation
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Celebrations />
      </main>
      <Footer />
    </div>
  );
}
