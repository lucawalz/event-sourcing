import { Section } from "./components/Section";
import { CrudVsEs } from "./components/CrudVsEs";
import { CoreConcepts } from "./components/CoreConcepts";
import { EcommerceDemo } from "./components/EcommerceDemo";
import { CqrsDemo } from "./components/CqrsDemo";
import { GdprDemo } from "./components/GdprDemo";
import { SagaDemo } from "./components/SagaDemo";
import { VersioningDemo } from "./components/VersioningDemo";
import { TestingDemo } from "./components/TestingDemo";
import { StranglerFigDemo } from "./components/StranglerFigDemo";
import { BoundedContextsDemo } from "./components/BoundedContextsDemo";
import { motion, useScroll, useSpring } from "framer-motion";

function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen selection:bg-blue-500/30">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <Section
        id="hero"
        title="Event Sourcing"
        subtitle="From State to Events: A Journey into Traceable Systems"
        className="h-screen"
      >
        <div className="flex flex-col items-center gap-8">
          <div className="text-6xl animate-bounce">
            👇
          </div>
          <p className="text-slate-500">Scroll to explore</p>
        </div>
      </Section>

      {/* CRUD vs ES */}
      <Section
        id="crud-vs-es"
        title="The Problem with CRUD"
        subtitle="When history is lost, questions remain unanswered."
      >
        <CrudVsEs />
      </Section>

      <Section
        id="core-concepts"
        title="The Four Pillars"
        subtitle="Understanding the building blocks of Event Sourcing."
      >
        <CoreConcepts />
      </Section>

      <Section
        id="demo"
        title="Interactive Demo"
        subtitle="Experience Event Sourcing in action. Create an order and travel through time."
      >
        <EcommerceDemo />
      </Section>

      <Section
        id="cqrs"
        title="CQRS Pattern"
        subtitle="Separating the Write Side (Command) from the Read Side (Query)."
      >
        <CqrsDemo />
      </Section>

      <Section
        id="gdpr"
        title="GDPR & Crypto-Shredding"
        subtitle="How to 'forget' users in an immutable system."
      >
        <GdprDemo />
      </Section>

      <Section
        id="saga"
        title="Saga Pattern"
        subtitle="Managing distributed transactions with compensating events."
      >
        <SagaDemo />
      </Section>

      <Section
        id="versioning"
        title="Event Versioning"
        subtitle="Handling schema changes without altering history (Upcasting)."
      >
        <VersioningDemo />
      </Section>

      <Section
        id="testing"
        title="Testing Strategy"
        subtitle="Behavior-Driven Development (BDD) with Given-When-Then."
      >
        <TestingDemo />
      </Section>

      <Section
        id="strangler"
        title="Migration Strategy"
        subtitle="The Strangler Fig Pattern: Replacing the monolith piece by piece."
      >
        <StranglerFigDemo />
      </Section>

      <Section
        id="bounded-contexts"
        title="Pragmatic Architecture"
        subtitle="Not everything needs Event Sourcing. Choose the right tool for the job."
      >
        <BoundedContextsDemo />
      </Section>

      {/* Final Section */}
      <Section
        id="finish"
        title="Ready to Build?"
        subtitle="Event Sourcing is powerful, but complex. Use it wisely."
      >
        <div className="text-center">
          <a
            href="https://github.com/lucawalz/event-sourcing"
            target="_blank"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-200 transition-colors"
          >
            View Source Code
          </a>
        </div>
      </Section>
    </div>
  );
}

export default App;
