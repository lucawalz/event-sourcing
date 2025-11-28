---
layout: center
highlighter: shiki
css: unocss
colorSchema: dark
transition: fade-out
title: Event Sourcing - Von Zuständen zu Ereignissen
exportFilename: Event Sourcing Presentation
lineNumbers: false
drawings:
  persist: false
mdc: true
clicks: 0
preload: false
glowSeed: 229
routerMode: hash
presenter: true
download: true
---

<div flex="~ col" items-center justify-center h-full>
  <div
    v-motion
    :initial="{ opacity: 0, y: -20 }"
    :enter="{ opacity: 1, y: 0, transition: { delay: 200, duration: 800 } }"
    flex items-center gap-4 mb-8
  >
    <div i-carbon:event-schedule text-5xl text-blue-400 />
    <h1 text-6xl font-bold>
      Event Sourcing
    </h1>
  </div>

  <div
    v-motion
    :initial="{ opacity: 0, y: 20 }"
    :enter="{ opacity: 1, y: 0, transition: { delay: 400, duration: 800 } }"
    text-center
  >
    <h2 text-3xl opacity-80 mb-6>Von Zuständen zu Ereignissen</h2>
    <div text-xl opacity-60 max-w-2xl>
      Ein Architekturmuster für nachvollziehbare Systeme
    </div>
  </div>

  <div
    v-motion
    :initial="{ opacity: 0 }"
    :enter="{ opacity: 1, transition: { delay: 800, duration: 600 } }"
    mt-12 flex items-center gap-8
  >
    <div flex items-center gap-2 text-sm opacity-70>
      <div i-carbon:user />
      <span>Luca Walz</span>
    </div>
    <div h-4 w-px bg-white opacity-20 />
    <div flex items-center gap-2 text-sm opacity-70>
      <div i-carbon:calendar />
      <span>28.11.25</span>
    </div>
  </div>
</div>

<!--
**Eröffnung (15 Sek):**
Guten Tag! Heute möchte ich euch Event Sourcing vorstellen - ein Architekturmuster, das fundamental anders an Datenspeicherung herangeht als traditionelle Systeme.

**Why (45 Sek):**
Warum ist das relevant? Stellen wir uns vor: Ein Kunde ruft bei einer Bank an und sagt, sein Kontostand sei falsch. Mit traditionellen CRUD-Systemen sehen wir nur den aktuellen Wert - aber nicht, wie wir dorthin gekommen sind. Die Historie ist verloren. Bei regulatorischen Anforderungen, Audits oder Fehleranalysen ist das ein massives Problem.

**What (30 Sek):**
Event Sourcing speichert nicht den aktuellen Zustand unserer Daten, sondern die komplette Historie aller Zustandsänderungen als Sequenz von Events. Statt zu sagen 'Martins Konto hat 110€', speichern wir 'Martin hat 100€ eingezahlt, dann 10€ hinzugefügt'.

**How - Roadmap (30 Sek):**
In den nächsten 20 Minuten werden wir sehen:
1. Das Problem mit traditioneller Datenspeicherung
2. Event Sourcing Grundkonzepte & CQRS
3. Praktische Code-Beispiele (Events, Store, State Reconstruction)
4. Vor- & Nachteile
5. Anwendungsmuster (Sagas, Migration, Frameworks)
6. Detail-Probleme (GDPR, Versioning, Testing)
7. Fazit: Wann einsetzen?
-->

---
class: py-10
glowSeed: 100
---

# Das Problem mit traditioneller Datenspeicherung

<span>Wenn die Historie verloren geht</span>

<div mt-6 />

<div grid grid-cols-2 gap-6>
  <div
    v-click
    border="2 solid red-800" bg="red-800/20"
    rounded-lg overflow-hidden
  >
    <div bg="red-800/40" px-4 py-2 flex items-center>
      <div i-carbon:data-table text-red-300 text-xl mr-2 />
      <span font-bold>Traditionelles CRUD</span>
    </div>
    <div px-4 py-3>
      <div font-mono text-sm bg="black/30" rounded-lg p-3 mb-3>
        <div text-green-300>-- Order Table</div>
        <div>UPDATE orders</div>
        <div>SET status = 'CANCELLED'</div>
        <div>WHERE id = 123;</div>
        <div mt-2 text-red-400>-- Historie verloren!</div>
      </div>
      <div flex flex-col gap-2>
        <div flex items-center gap-2 text-sm>
          <div i-carbon:unknown text-red-400 />
          <span>WANN wurde storniert?</span>
        </div>
        <div flex items-center gap-2 text-sm>
          <div i-carbon:unknown text-red-400 />
          <span>WER hat storniert?</span>
        </div>
        <div flex items-center gap-2 text-sm>
          <div i-carbon:unknown text-red-400 />
          <span>WARUM wurde storniert?</span>
        </div>
      </div>
    </div>
  </div>

  <div
    v-click
    border="2 solid blue-800" bg="blue-800/20"
    rounded-lg overflow-hidden
  >
    <div bg="blue-800/40" px-4 py-2 flex items-center>
      <div i-carbon:warning-alt text-blue-300 text-xl mr-2 />
      <span font-bold>Kritische Use Cases</span>
    </div>
    <div px-4 py-3 flex flex-col gap-3>
      <div>
        <div flex items-center gap-2 mb-1>
          <div i-carbon:finance text-yellow-300 />
          <span font-semibold>Banking</span>
        </div>
        <div text-xs opacity-70>Regulatorische Anforderungen - vollständiger Audit-Trail</div>
      </div>
      <div>
        <div flex items-center gap-2 mb-1>
          <div i-carbon:shopping-cart text-green-300 />
          <span font-semibold>E-Commerce</span>
        </div>
        <div text-xs opacity-70>Customer Support - Was ist mit der Bestellung passiert?</div>
      </div>
      <div>
        <div flex items-center gap-2 mb-1>
          <div i-carbon:health-cross text-red-300 />
          <span font-semibold>Healthcare</span>
        </div>
        <div text-xs opacity-70>Wer hat wann welche Medikamentendosis geändert?</div>
      </div>
      <div>
        <div flex items-center gap-2 mb-1>
          <div i-carbon:document-tasks text-purple-300 />
          <span font-semibold>Compliance</span>
        </div>
        <div text-xs opacity-70>GDPR, SOX - Nachweispflicht über Datenänderungen</div>
      </div>
    </div>
  </div>
</div>

<div v-click mt-6 flex justify-center>
  <div
    border="2 solid white/5" bg="white/5" backdrop-blur-sm
    rounded-lg px-6 py-3 flex items-center gap-3
  >
    <div i-carbon:idea text-yellow-300 text-2xl />
    <span text-lg font-semibold>Wie können wir nicht nur SEHEN wo wir sind, sondern auch verstehen, WIE wir dorthin gekommen sind?</span>
  </div>
  <div absolute bottom-4 right-4 text-xs opacity-50>
    Quelle: Martin Fowler - "Event Sourcing"
  </div>
</div>

<!--
**Problem aufzeigen (60 Sek):**
Schauen wir uns an, wie wir normalerweise Daten speichern. In einem typischen E-Commerce-System haben wir eine Order-Tabelle. Wenn eine Bestellung storniert wird, UPDATE wir einfach den Status von 'PLACED' zu 'CANCELLED'. Das ist effizient, das funktioniert - aber wir verlieren Information.

Wir können nicht mehr beantworten: WANN wurde storniert? WER hat storniert? WARUM wurde storniert? War die Bestellung vorher vielleicht schon mal 'SHIPPED' und wurde zurückgesendet?

**Use Cases (60 Sek):**
Das wird zum Problem in mehreren Szenarien:
- Banking: Regulatorische Anforderungen - Banken MÜSSEN jeden Kontowechsel nachweisen können
- E-Commerce: Customer Support - 'Herr Müller beschwert sich, dass seine Bestellung nie ankam' - was ist passiert?
- Healthcare: Audit Trail - Wer hat wann welche Medikamentendosis geändert?
- Compliance: GDPR = protects personal data and privacy (EU), SOX = ensures financial reporting integrity (US) - Nachweispflicht über Datenänderungen

**Zentrale Frage (30 Sek):**
Die zentrale Frage ist also: Wie können wir nicht nur SEHEN wo wir sind, sondern auch verstehen, WIE wir dorthin gekommen sind?
[Quelle: Fowler - "We can query an application's state to find out the current state of the world, and this answers many questions. However there are times when we don't just want to see where we are, we also want to know how we got there."]
-->

---
class: py-10
glowSeed: 150
---

# Was ist Event Sourcing?

<span>Ein fundamental anderer Ansatz zur Datenspeicherung</span>

<div mt-4 />

<div
  v-click
  border="2 solid green-800" bg="green-800/20"
  rounded-lg p-4 mb-4
>
  <div flex items-center gap-2 mb-2>
    <div i-carbon:document-tasks text-green-300 text-2xl />
    <div>
      <div font-bold text-lg>Definition</div>
      <div text-xs opacity-70 mt-1>Alle Änderungen am Application State werden als Sequenz von Events gespeichert</div>
    </div>
  </div>
  <div bg="green-900/30" rounded-lg p-3>
    <div text-xs>
      <span font-semibold>Die Events sind unser 'System of Record'</span> - die einzige Quelle der Wahrheit. Statt den aktuellen Zustand zu überschreiben, speichern wir jede Zustandsänderung als separates, unveränderliches Event.
    </div>
  </div>
</div>

<div grid grid-cols-2 gap-4>
  <div
    v-click
    border="2 solid red-800" bg="red-800/20"
    rounded-lg overflow-hidden
  >
    <div bg="red-800/40" px-3 py-1.5 flex items-center>
      <div i-carbon:close text-red-300 text-lg mr-2 />
      <span font-bold text-sm>Traditionelles System</span>
    </div>
    <div px-3 py-2>
      <div font-mono text-xs bg="black/30" rounded-lg p-2>
        <div text-blue-300>// Ship Object</div>
        <div>location = "San Francisco"</div>
        <div mt-1 text-yellow-300>// Ship moves</div>
        <div>location = "Hong Kong"</div>
        <div mt-1 text-red-400>// Previous location lost!</div>
      </div>
      <div mt-2 flex items-center gap-2 text-xs text-red-300>
        <div i-carbon:warning-alt />
        <span>Historie überschrieben</span>
      </div>
    </div>
  </div>

  <div
    v-click
    border="2 solid green-800" bg="green-800/20"
    rounded-lg overflow-hidden
  >
    <div bg="green-800/40" px-3 py-1.5 flex items-center>
      <div i-carbon:checkmark-outline text-green-300 text-lg mr-2 />
      <span font-bold text-sm>Event Sourcing</span>
    </div>
    <div px-3 py-2>
      <div font-mono text-xs bg="black/30" rounded-lg p-2>
        <div text-green-300>// Event Stream</div>
        <div>Event 1: ShipDepartedFrom</div>
        <div>  location: "San Francisco"</div>
        <div>  time: 10:00</div>
        <div mt-1>Event 2: ShipArrivedAt</div>
        <div>  location: "Hong Kong"</div>
        <div>  time: 15:00</div>
        <div mt-1 text-green-400>// All events preserved!</div>
      </div>
      <div mt-2 flex items-center gap-2 text-xs text-green-300>
        <div i-carbon:checkmark-outline />
        <span>Vollständige Historie</span>
      </div>
    </div>
  </div>
  <div absolute bottom-4 right-4 text-xs opacity-50>
    Quelle: Ben Stopford - "Designing Event-Driven Systems"
  </div>
</div>

<!--
**Definition (45 Sek):**
Event Sourcing definiert einen fundamentally anderen Ansatz: Alle Änderungen am Application State werden als Sequenz von Events gespeichert.
[Quelle: Fowler - "Event Sourcing ensures that all changes to application state are stored as a sequence of events."]

Was heißt das konkret? Statt den aktuellen Zustand zu überschreiben, speichern wir jede Zustandsänderung als separates, unveränderliches Event. Die Events sind unser 'System of Record' - die einzige Quelle der Wahrheit.
[Quelle: Stopford, Chapter 6: "Making Events the Source of Truth"]

**Kernprinzip visualisieren (90 Sek):**
Schauen wir uns das im Vergleich an:

Traditionelles System: CRUD-System: Wir haben ein Ship-Objekt mit Location='San Francisco'. Ship bewegt sich nach Hong Kong → wir UPDATEn Location='Hong Kong'. Die vorherige Location ist weg.

Event Sourcing: Wir schreiben stattdessen:
- Event 1: 'ShipDepartedFrom San Francisco' um 10:00
- Event 2: 'ShipArrivedAt Hong Kong' um 15:00

Beide Events bleiben PERMANENT gespeichert. Der aktuelle Zustand ergibt sich aus dem Abspielen aller Events.
[Quelle: Fowler's Shipping Example]

**Events als Source of Truth (30 Sek):**
Der entscheidende Punkt: Die Events sind unsere Wahrheit, nicht der aktuelle Zustand. Der Zustand ist nur eine abgeleitete Projektion - wir können ihn jederzeit neu berechnen.
-->

---
class: py-10
glowSeed: 200
---

# Kernkonzepte von Event Sourcing

<span>Die vier Säulen des Patterns</span>

<div mt-3 />

<div grid grid-cols-2 gap-4>
  <div
    v-click="1"
    border="2 solid blue-800" bg="blue-800/20"
    rounded-lg overflow-hidden
    transition duration-500 ease-in-out
    :class="$clicks < 1 ? 'opacity-0 translate-y-20' : 'opacity-100 translate-y-0'"
  >
    <div bg="blue-800/40" px-3 py-1.5 flex items-center>
      <div i-carbon:document text-blue-300 text-lg mr-2 />
      <span font-bold text-sm>1. Events</span>
    </div>
    <div px-3 py-2>
      <div text-xs mb-1.5>Unveränderbare Fakten über etwas, das passiert IST</div>
      <div font-mono text-xs bg="black/30" rounded-lg p-1.5 mb-1.5>
        <div text-green-400>✅ OrderPlaced</div>
        <div text-green-400>✅ PaymentReceived</div>
        <div text-green-400>✅ ItemShipped</div>
        <div mt-0.5 text-red-400>❌ PlaceOrder (Command!)</div>
      </div>
      <div text-xs opacity-70>
        Event-Typ, Timestamp, Aggregate-ID, Daten, Metadaten
      </div>
    </div>
  </div>

  <div
    v-click="2"
    border="2 solid purple-800" bg="purple-800/20"
    rounded-lg overflow-hidden
    transition duration-500 ease-in-out
    :class="$clicks < 2 ? 'opacity-0 translate-y-20' : 'opacity-100 translate-y-0'"
  >
    <div bg="purple-800/40" px-3 py-1.5 flex items-center>
      <div i-carbon:data-base text-purple-300 text-lg mr-2 />
      <span font-bold text-sm>2. Event Store</span>
    </div>
    <div px-3 py-2>
      <div text-xs mb-1.5>Append-Only Log - wie ein Hauptbuch</div>
      <div flex items-center gap-2 mb-1>
        <div i-carbon:add text-green-400 />
        <span text-xs>Nur hinzufügen</span>
      </div>
      <div flex items-center gap-2 mb-1>
        <div i-carbon:close text-red-400 />
        <span text-xs>Niemals ändern oder löschen</span>
      </div>
      <div text-xs opacity-70 mt-1>
        EventStore DB, Kafka, Cosmos DB, PostgreSQL
      </div>
    </div>
  </div>

  <div
    v-click="3"
    border="2 solid green-800" bg="green-800/20"
    rounded-lg overflow-hidden
    transition duration-500 ease-in-out
    :class="$clicks < 3 ? 'opacity-0 translate-y-20' : 'opacity-100 translate-y-0'"
  >
    <div bg="green-800/40" px-3 py-1.5 flex items-center>
      <div i-carbon:view text-green-300 text-lg mr-2 />
      <span font-bold text-sm>3. Projektionen / Read Models</span>
    </div>
    <div px-3 py-2>
      <div text-xs mb-1.5>Materialisierte Ansichten des aktuellen Zustands</div>
      <div font-mono text-xs bg="black/30" rounded-lg p-1.5>
        <div>Events → Projektion</div>
        <div>→ Read Model (SQL/NoSQL)</div>
      </div>
      <div text-xs opacity-70 mt-1>
        Schnelle Queries ohne Event Replay
      </div>
    </div>
  </div>

  <div
    v-click="4"
    border="2 solid yellow-800" bg="yellow-800/20"
    rounded-lg overflow-hidden
    transition duration-500 ease-in-out
    :class="$clicks < 4 ? 'opacity-0 translate-y-20' : 'opacity-100 translate-y-0'"
  >
    <div bg="yellow-800/40" px-3 py-1.5 flex items-center>
      <div i-carbon:replay text-yellow-300 text-lg mr-2 />
      <span font-bold text-sm>4. Event Replay</span>
    </div>
    <div px-3 py-2>
      <div text-xs mb-1.5>Die Superkraft von Event Sourcing</div>
      <div flex flex-col gap-0.5 text-xs>
        <div flex items-center gap-2>
          <div i-carbon:checkmark-outline text-green-400 />
          <span>Complete Rebuild</span>
        </div>
        <div flex items-center gap-2>
          <div i-carbon:checkmark-outline text-green-400 />
          <span>Temporal Queries</span>
        </div>
        <div flex items-center gap-2>
          <div i-carbon:checkmark-outline text-green-400 />
          <span>Bug-Fixes rückwirkend</span>
        </div>
        <div flex items-center gap-2>
          <div i-carbon:checkmark-outline text-green-400 />
          <span>Neue Features auf alte Daten</span>
        </div>
      </div>
    </div>
  </div>
</div>
<div absolute bottom-4 right-4 text-xs opacity-50>
  Quelle: Microsoft Azure Architecture Patterns
</div>

<!--
**1. Events (45 Sek):**
Erstens: Events. Events sind unveränderbare Fakten über etwas, das passiert IST. Wichtig: Past Tense!

Beispiele:
- ✅ 'OrderPlaced', 'PaymentReceived', 'ItemShipped' - korrekt
- ❌ 'PlaceOrder', 'ReceivePayment' - falsch, das sind Commands

Events beschreiben WAS passiert ist, nicht was passieren soll. Sie enthalten: Event-Typ, Timestamp, Aggregate-ID, Event-Daten und optional Metadaten wie User-ID.

**2. Event Store (45 Sek):**
Zweitens: Der Event Store. Das ist ein Append-Only Log - wie ein Hauptbuch in der Buchhaltung. Wir können nur hinzufügen, niemals ändern oder löschen.

Technisch kann das implementiert werden als:
- Spezialisierte Datenbanken wie EventStore DB
- NoSQL-DBs wie Cosmos DB mit Change Feed
- Kafka als distributed log
- Oder sogar relationale DBs mit Append-Only-Constraint
[Quelle: Azure Event Sourcing Patterns]

**3. Projektionen/Read Models (45 Sek):**
Drittens: Projektionen. Wir können nicht jedes Mal alle Events abspielen, wenn jemand Daten abfragen will. Deswegen erstellen wir Read Models - materialisierte Ansichten des aktuellen Zustands.
[Quelle: Stopford, Chapter 6: "Materialized Views"]

Diese werden durch Event Replay aufgebaut: Wir nehmen alle Events und 'projizieren' sie in eine abfragbare Form. Wenn sich Requirements ändern, können wir einfach neue Projektionen erstellen.

**4. Event Replay (30 Sek):**
Viertens: Event Replay - die Superkraft von Event Sourcing. Wir können:
- Den kompletten State neu aufbauen (Complete Rebuild)
- Zu jedem Zeitpunkt in der Vergangenheit springen (Temporal Queries)
- Bugs rückwirkend korrigieren (Event Replay)
- Neue Features auf historische Daten anwenden
[Quelle: Fowler: "Complete Rebuild, Temporal Query, Event Replay"]
-->

---
class: py-10
glowSeed: 175
---

# Event Sourcing vs. Event-Driven Architecture

<span>Wichtige Abgrenzung zweier verwandter Konzepte</span>

<div mt-3 />

<div grid grid-cols-2 gap-4>
  <div
    v-click
    border="2 solid cyan-800" bg="cyan-800/20"
    rounded-lg overflow-hidden
  >
    <div bg="cyan-800/40" px-3 py-1.5 flex items-center>
      <div i-carbon:network-3 text-cyan-300 text-lg mr-2 />
      <span font-bold text-sm>Event-Driven Architecture</span>
    </div>
    <div px-3 py-2>
      <div text-xs mb-2>Kommunikationsmuster zwischen Services</div>
      <div text-xs opacity-70 mb-2>
        Fokus auf den Austausch von Nachrichten zwischen entkoppelten Systemen.
      </div>
      <div bg="blue-900/30" rounded p-2 text-xs flex items-center gap-2>
        <div i-carbon:presentation-file text-blue-300 />
        <span font-semibold>Siehe Vortrag am 05.12.</span>
      </div>
    </div>
  </div>

  <div
    v-click
    border="2 solid green-800" bg="green-800/20"
    rounded-lg overflow-hidden
  >
    <div bg="green-800/40" px-3 py-1.5 flex items-center>
      <div i-carbon:data-base text-green-300 text-lg mr-2 />
      <span font-bold text-sm>Event Sourcing</span>
    </div>
    <div px-3 py-2>
      <div text-xs mb-2>Persistenzmuster innerhalb eines Service</div>
      <div font-mono text-xs bg="black/30" rounded-lg p-2 mb-2>
        <div>Command → Event</div>
        <div>Event → Event Store</div>
        <div>Event Store → State</div>
      </div>
      <div flex flex-col gap-1 text-xs>
        <div flex items-center gap-2>
          <div i-carbon:checkmark-outline text-green-400 />
          <span>Datenspeicherung</span>
        </div>
        <div flex items-center gap-2>
          <div i-carbon:checkmark-outline text-green-400 />
          <span>Audit-Trail</span>
        </div>
        <div flex items-center gap-2>
          <div i-carbon:checkmark-outline text-green-400 />
          <span>Innerhalb eines Service</span>
        </div>
      </div>
    </div>
  </div>
</div>

<div
  v-click
  mt-4 border="2 solid indigo-800" bg="indigo-800/20"
  rounded-lg overflow-hidden
>
  <div bg="indigo-800/40" px-3 py-1.5 flex items-center>
    <div i-carbon:connection-signal text-indigo-300 text-lg mr-2 />
    <span font-bold text-sm>CQRS - Command Query Responsibility Segregation</span>
  </div>
  <div px-3 py-2 grid grid-cols-2 gap-3>
    <div>
      <div font-semibold text-xs mb-1>Write Side</div>
      <div font-mono text-xs bg="black/30" rounded-lg p-1.5>
        <div>Commands → Events</div>
        <div>→ Event Store</div>
      </div>
    </div>
    <div>
      <div font-semibold text-xs mb-1>Read Side</div>
      <div font-mono text-xs bg="black/30" rounded-lg p-1.5>
        <div>Events → Projektionen</div>
        <div>→ Read Models</div>
      </div>
    </div>
    <div col-span-2 text-xs opacity-70 mt-1>
      Trennung ermöglicht separate Skalierung, führt aber zu Eventual Consistency
    </div>
  </div>
</div>
<div absolute bottom-4 right-4 text-xs opacity-50>
  Quelle: Stopford; Microsoft CQRS Pattern
</div>

<!--
**Einordnung (30 Sek):**
Bevor wir weitermachen, müssen wir ein häufiges Missverständnis klären. Event Sourcing und Event-Driven Architecture (EDA) klingen ähnlich, lösen aber unterschiedliche Probleme.

**Event-Driven Architecture (30 Sek):**
EDA ist ein *Kommunikationsmuster*. Es geht darum, wie Services miteinander sprechen. Ein Service ruft "OrderPlaced!", und andere reagieren darauf.
Wichtig: Dazu gibt es am 05.12. einen eigenen Deep-Dive Vortrag.
Merkt euch für heute nur die Faustregel:
- EDA = Kommunikation zwischen Services (Integration)
- Event Sourcing = Persistenz innerhalb eines Services (State Management)
[Quelle: Stopford unterscheidet "Event Collaboration" vs "Event Sourcing"]

**CQRS Connection (45 Sek):**
Event Sourcing kommt selten allein. Der beste Freund von Event Sourcing ist CQRS (Command Query Responsibility Segregation).
Warum? Weil der Event Store super zum Schreiben ist (einfach anhängen), aber furchtbar zum Lesen (wer will schon 1000 Events replayen, nur um den Kontostand zu sehen?).

Deshalb trennen wir:
1. **Write Side:** Commands (z.B. "Buche Geld ab") erzeugen Events im Event Store.
2. **Read Side:** Wir bauen aus den Events optimierte Lese-Modelle (Projektionen).

Das erlaubt uns, beide Seiten getrennt zu skalieren, bringt aber "Eventual Consistency" mit sich – die Lese-Seite hinkt immer ein paar Millisekunden hinterher.
[Quelle: Microsoft CQRS Pattern; Wolff Video]
-->

---
class: py-10
glowSeed: 200
---

# CQRS: Command Query Responsibility Segregation

<span>Trennung von Schreib- und Lese-Operationen</span>

<div mt-8 grid grid-cols-2 gap-4>
  <!-- Write Side -->
  <div
    v-click
    border="2 solid indigo-800" bg="indigo-800/20"
    rounded-lg overflow-hidden
  >
    <div bg="indigo-800/40" px-3 py-1.5 flex items-center>
      <div i-carbon:edit text-indigo-300 text-lg mr-2 />
      <span font-bold text-sm>Command Side (Write)</span>
    </div>
    <div px-3 py-2>
```java
public void handle(CreateOrder cmd) {
  // 1. Validierung
  // 2. Business Logic
  // 3. Event erzeugen
}
```
      <div flex flex-col gap-1 text-xs opacity-80 mt-2>
        <div flex items-center gap-2>
          <div i-carbon:checkmark-outline text-green-400 />
          <span>Optimiert für Writes & Logik</span>
        </div>
        <div flex items-center gap-2>
          <div i-carbon:checkmark-outline text-green-400 />
          <span>Complex Domain Model</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Read Side -->
  <div
    v-click
    border="2 solid teal-800" bg="teal-800/20"
    rounded-lg overflow-hidden
  >
    <div bg="teal-800/40" px-3 py-1.5 flex items-center>
      <div i-carbon:search text-teal-300 text-lg mr-2 />
      <span font-bold text-sm>Query Side (Read)</span>
    </div>
    <div px-3 py-2>
```java
public OrderView getById(UUID id) {
  // Direkter Zugriff auf
  // denormalisierte Daten
  return repository.findById(id);
}
```
      <div flex flex-col gap-1 text-xs opacity-80 mt-2>
        <div flex items-center gap-2>
          <div i-carbon:checkmark-outline text-green-400 />
          <span>Optimiert für Reads</span>
        </div>
        <div flex items-center gap-2>
          <div i-carbon:checkmark-outline text-green-400 />
          <span>Denormalisiert (DTOs)</span>
        </div>
      </div>
    </div>
  </div>
</div>

<div
  v-click
  mt-8 border="1 solid gray-700" bg="gray-800/30"
  rounded-lg p-4
>
  <div flex items-center justify-center gap-2 mb-4>
    <div i-carbon:arrows-horizontal text-gray-400 text-xl />
    <span font-bold text-sm>Synchronisation: Eventual Consistency</span>
  </div>
  
  <div grid grid-cols-3 gap-4 text-center text-xs>
    <div flex flex-col items-center gap-2>
      <div i-carbon:flash text-yellow-400 text-2xl />
      <div>
        <div font-semibold>1. Event Published</div>
        <div opacity-70 mt-1>Write Side emittiert Event nach Transaktion</div>
      </div>
    </div>
    <div flex flex-col items-center gap-2>
      <div i-carbon:settings text-blue-400 text-2xl />
      <div>
        <div font-semibold>2. Projection Update</div>
        <div opacity-70 mt-1>Projector verarbeitet Event asynchron</div>
      </div>
    </div>
    <div flex flex-col items-center gap-2>
      <div i-carbon:data-view text-green-400 text-2xl />
      <div>
        <div font-semibold>3. Read Model Ready</div>
        <div opacity-70 mt-1>Daten sind für Queries verfügbar</div>
      </div>
    </div>
  </div>
</div>

<!--
**CQRS Deep Dive (60 Sek):**
Hier sehen wir, wie die Magie technisch funktioniert.

**Links: Die Write Side (Das Gehirn)**
Hier wird gearbeitet. Wenn ein Command reinkommt (z.B. "Bestellung aufgeben"), prüfen wir die Regeln: Ist genug Ware da? Ist das Konto gedeckt?
Wenn alles passt, speichern wir *nur* das Event. Wir schreiben nicht in Tabellen, wir hängen nur an das Log an. Das ist extrem schnell.

**Rechts: Die Read Side (Das Gedächtnis)**
Hier wird nur abgerufen. Die "Projektionen" haben die Arbeit schon erledigt und die Daten mundgerecht vorbereitet.
Wenn die App fragt "Zeig mir die Bestellung", muss die Datenbank nicht erst 5 Tabellen joinen. Das fertige JSON liegt schon bereit.
Das Ergebnis: Lesezugriffe im Millisekunden-Bereich, egal wie komplex die Daten eigentlich sind.

**Der Clou:**
Wir entkoppeln Schreiben und Lesen komplett.
Black Friday Sale? Millionen Leute lesen Produkte (Read Side skaliert hoch), aber nur wenige kaufen gleichzeitig (Write Side bleibt entspannt).
-->

---
class: py-10
glowSeed: 220
---

# Beispiel-Szenario: E-Commerce Bestellsystem

<span>Ein praktisches Beispiel für Event Sourcing</span>

<div mt-3 />

<div grid grid-cols-2 gap-4>
  <div
    v-click
    border="2 solid blue-800" bg="blue-800/20"
    rounded-lg overflow-hidden
  >
    <div bg="blue-800/40" px-3 py-1.5 flex items-center>
      <div i-carbon:shopping-cart text-blue-300 text-lg mr-2 />
      <span font-bold text-sm>Warum dieses Beispiel?</span>
    </div>
    <div px-3 py-2 flex flex-col gap-1.5>
      <div flex items-center gap-2>
        <div i-carbon:checkmark-outline text-green-400 />
        <span text-xs>Audit-Anforderungen</span>
      </div>
      <div flex items-center gap-2>
        <div i-carbon:checkmark-outline text-green-400 />
        <span text-xs>Komplexe Zustandsübergänge</span>
      </div>
      <div flex items-center gap-2>
        <div i-carbon:checkmark-outline text-green-400 />
        <span text-xs>Mehrere Akteure (Customer, Warehouse, Payment)</span>
      </div>
    </div>
  </div>

  <div
    v-click
    border="2 solid green-800" bg="green-800/20"
    rounded-lg overflow-hidden
  >
    <div bg="green-800/40" px-3 py-1.5 flex items-center>
      <div i-carbon:document text-green-300 text-lg mr-2 />
      <span font-bold text-sm>Event-Typen</span>
    </div>
    <div px-3 py-2>
      <div font-mono text-xs bg="black/30" rounded-lg p-1.5>
        <div text-green-400>OrderCreated</div>
        <div text-blue-400>ItemAddedToOrder</div>
        <div text-yellow-400>PaymentReceived</div>
        <div text-purple-400>OrderShipped</div>
        <div text-red-400>OrderCancelled</div>
      </div>
    </div>
  </div>
</div>

<div
  v-click
  mt-4 border="2 solid purple-800" bg="purple-800/20"
  rounded-lg overflow-hidden
>
  <div bg="purple-800/40" px-3 py-1.5 flex items-center>
    <div i-carbon:event-schedule text-purple-300 text-lg mr-2 />
    <span font-bold text-sm>Event Stream Beispiel</span>
  </div>
  <div px-3 py-2>
    <div font-mono text-xs bg="black/30" rounded-lg p-2>
      <div flex items-center gap-2>
        <span text-zinc-500>10:00</span>
        <div i-carbon:arrow-right text-green-400 />
        <span text-green-400>OrderCreated</span>
        <span text-zinc-400>(orderId: 123, customer: "Martin")</span>
      </div>
      <div flex items-center gap-2 mt-1>
        <span text-zinc-500>10:01</span>
        <div i-carbon:arrow-right text-blue-400 />
        <span text-blue-400>ItemAdded</span>
        <span text-zinc-400>(orderId: 123, product: "Laptop", qty: 1)</span>
      </div>
      <div flex items-center gap-2 mt-1>
        <span text-zinc-500>10:02</span>
        <div i-carbon:arrow-right text-blue-400 />
        <span text-blue-400>ItemAdded</span>
        <span text-zinc-400>(orderId: 123, product: "Mouse", qty: 1)</span>
      </div>
      <div flex items-center gap-2 mt-1>
        <span text-zinc-500>10:05</span>
        <div i-carbon:arrow-right text-yellow-400 />
        <span text-yellow-400>PaymentReceived</span>
        <span text-zinc-400>(orderId: 123, amount: 1050€)</span>
      </div>
      <div flex items-center gap-2 mt-1>
        <span text-zinc-500>11:00</span>
        <div i-carbon:arrow-right text-purple-400 />
        <span text-purple-400>OrderShipped</span>
        <span text-zinc-400>(orderId: 123, tracking: "DHL123")</span>
      </div>
    </div>
    <div mt-2 text-xs opacity-70 flex items-center gap-2>
      <div i-carbon:locked text-green-400 />
      <span>Jedes Event ist unveränderlich und trägt alle nötigen Informationen</span>
    </div>
  </div>
</div>

<!--
**Szenario Einführung (30 Sek):**
Nehmen wir ein E-Commerce-Bestellsystem. Das ist ein perfektes Beispiel, weil es:
- Audit-Anforderungen hat
- Komplexe Zustandsübergänge hat
- Mehrere Akteure involviert (Customer, Warehouse, Payment)

**Events definieren (60 Sek):**
In unserem System könnten folgende Events auftreten:

OrderCreated - OrderId, CustomerId, Timestamp
ItemAddedToOrder - OrderId, ProductId, Quantity, Price
PaymentReceived - OrderId, Amount, PaymentMethod
OrderShipped - OrderId, TrackingNumber, Carrier
OrderCancelled - OrderId, Reason

**Event Stream visualisieren (30 Sek):**
Wenn jetzt eine Bestellung durchläuft, sehen wir im Event Store:
10:00 → OrderCreated (orderId: 123)
10:01 → ItemAdded (orderId: 123, product: Laptop)
10:02 → ItemAdded (orderId: 123, product: Mouse)
10:05 → PaymentReceived (orderId: 123)
11:00 → OrderShipped (orderId: 123)

Jedes Event ist unveränderlich und trägt alle nötigen Informationen.
-->

---
class: py-10
glowSeed: 250
---

# Code-Beispiel Teil 1: Events & Event Store

<span>Implementierung der Grundbausteine</span>

<div mt-2></div>

<div grid="~ cols-2 gap-3">
  <div v-click>
    <div text-xs font-semibold mb-1>Event Definition</div>

```java
// Base Event
public abstract class DomainEvent {
    private final UUID eventId;
    private final LocalDateTime occurredAt;
    private final UUID aggregateId;
    
    // Constructor, Getters...
}

// Konkrete Events
public class OrderCreatedEvent extends DomainEvent {
    private final String customerId;
    private final List<OrderItem> items;
    
    public OrderCreatedEvent(UUID orderId, String customerId, List<OrderItem> items) {
        super(orderId);
        this.customerId = customerId;
        this.items = items;
        // Events sind immutable!
    }
}
```

  </div>

  <div v-click>
    <div text-xs font-semibold mb-1>Event Store mit Concurrency Control</div>

```java
public interface EventStore {
    // Append mit Optimistic Locking
    void append(UUID aggregateId, DomainEvent event, long expectedVersion);
    // ↑ Verhindert Lost Updates!
    
    List<DomainEvent> getEvents(UUID aggregateId);
    List<DomainEvent> getEvents(UUID aggregateId, long fromVersion);
}

// Usage
public class OrderService {
    private final EventStore eventStore;
    
    public void createOrder(UUID orderId, String customerId) {
        OrderCreatedEvent event = new OrderCreatedEvent(
            orderId, customerId, new ArrayList<>()
        );
        
        // Version 0 = neues Aggregate
        eventStore.append(orderId, event, 0);
    }
}
```

  </div>
</div>

<div v-click mt-2 bg="yellow-800/20" border="2 solid yellow-800" rounded-lg p-2>
  <div flex items-center gap-2>
    <div i-carbon:warning-alt text-yellow-300 text-lg></div>
    <span font-semibold text-xs>Kritisch:</span>
    <span text-xs>expectedVersion verhindert konkurrierende Schreibvorgänge - ähnlich wie Optimistic Locking</span>
  </div>
</div>

<!--
**Event Definition (Links, 45 Sek):**
Links sehen wir die Anatomie eines Events am Beispiel `OrderCreatedEvent`.

**Immutability ist nicht verhandelbar:** Alle Felder sind `final`. Warum? Events beschreiben die Vergangenheit - und die können wir nicht ändern. Keine Setter, keine Mutationen. "Martin hat um 10:15 eine Bestellung aufgegeben" bleibt für immer wahr.

**Past Tense:** `OrderCreatedEvent`, nicht `CreateOrderEvent`. Events sind Fakten ("ist passiert"), keine Befehle ("soll passieren").

**Fachliche Essenz:** Wir speichern nur, was geschäftlich relevant ist - `customerId` und `items`. Technische Metadaten (Event-ID, Timestamp, Aggregate-ID) kommen von der Basisklasse.

**Event Store mit Concurrency Control (90 Sek):**
Rechts das kritische Stück: Der Event Store ist "Append Only" - wir hängen nur an, niemals ändern.

Aber seht ihr `expectedVersion`? Das ist unser Schutz gegen Race Conditions.

**Das Szenario:** Zwei Benutzer laden Order 123 gleichzeitig (beide sehen Version 10). Beide wollen ein Item hinzufügen.
- User A speichert zuerst: `append(orderId, event, expectedVersion=10)` → ✅ Erfolg, Version wird 11
- User B versucht zu speichern: `append(orderId, event, expectedVersion=10)` → ❌ Fehler! Version ist jetzt 11, nicht 10

**Was passiert dann?** User B muss neu laden (mit Event 11), sein Event neu berechnen und erneut versuchen - klassisches Optimistic Locking.

**Warum essentiell?** Ohne `expectedVersion` hätten wir Lost Updates und inkonsistenten State. Das ist unsere Konsistenz-Garantie auf Aggregate-Ebene.

[Quelle: Stopford, Chapter 11: "Identity and Concurrency Control"]
-->

---

# Code-Beispiel Teil 2: State Reconstruction

<span>Vom Event Stream zum aktuellen Zustand</span>

<div mt-2></div>

<div grid="~ cols-2 gap-3">
  <div v-click>
    <div text-xs font-semibold mb-1>Event Replay Pattern</div>

```java
public class Order {
    private UUID orderId;
    private String customerId;
    private List<OrderItem> items = new ArrayList<>();
    private OrderStatus status;
    
    public static Order fromEvents(List<DomainEvent> events) {
        Order order = new Order();
        for (DomainEvent event : events) {
            order.apply(event);
        }
        return order;
    }
    
    private void apply(DomainEvent event) {
        if (event instanceof OrderCreatedEvent e) {
            this.orderId = e.getAggregateId();
            this.customerId = e.getCustomerId();
            this.status = OrderStatus.CREATED;
        } else if (event instanceof ItemAddedEvent e) {
            this.items.add(new OrderItem(
                e.getProductId(), e.getQuantity()));
        } else if (event instanceof OrderShippedEvent e) {
            this.status = OrderStatus.SHIPPED;
        }
    }
}
```

  </div>

  <div v-click>
    <div text-xs font-semibold mb-1>Snapshots für Performance</div>

```java
// Snapshot
public class OrderSnapshot {
    UUID orderId;
    long version;
    OrderState state;
}

// Mit Snapshot
public Order getById(UUID orderId) {
    // Latest Snapshot laden
    OrderSnapshot snapshot = snapshotStore.getLatest(orderId);
    
    // Nur Events NACH Snapshot
    List<DomainEvent> events = eventStore.getEvents(orderId, snapshot.version);
    
    // State rekonstruieren
    Order order = Order.fromSnapshot(snapshot);
    events.forEach(e -> order.apply(e));
    
    return order;
}
```

<div mt-2 bg="green-800/20" border="2 solid green-800" rounded-lg p-2>
  <div text-xs>
    <div flex items-center gap-2 mb-0.5>
      <div i-carbon:idea text-green-300></div>
      <span font-semibold>Performance-Optimierung</span>
    </div>
    <div opacity-70>
      Bei tausenden Events: State periodisch speichern, nur neuere Events abspielen
    </div>
  </div>
</div>

  </div>
</div>

<!--
**State Reconstruction (Links, 90 Sek):**
Links sehen wir das Herzstück von Event Sourcing: State Reconstruction durch Event Replay.

**Das Prinzip:** Wir "falten" Events nacheinander in einen Zustand - wie beim Aufbau eines LEGO-Modells, Stein für Stein.
- **fromEvents:** Wir beginnen mit einem leeren Order-Objekt und spielen alle Events chronologisch ab.
- **apply:** Für jedes Event aktualisieren wir den internen Zustand. OrderCreated setzt die Basis, ItemAdded fügt Positionen hinzu, OrderShipped ändert den Status.

**Der kritische Punkt:** In `apply` gibt es KEINE Validierung oder Business-Logik! 
Warum? Das Event ist bereits passiert - es ist eine Tatsache aus der Vergangenheit. Wir können es nicht ablehnen.
Validierung passiert VOR dem Speichern des Events (im Command Handler), nicht beim Replay.
`apply` ist rein deterministisch: Gleiche Events → Gleicher State. Immer.

**Merke:** Events schreiben Geschichte, `apply` liest sie nur.

**Snapshots - Der Performance-Trick (Rechts, 60 Sek):**
Problem: Ein Aggregate mit 10.000 Events? Event Replay würde Sekunden dauern.

Lösung: Snapshots sind "Checkpoints" des kompletten States.
1. Lade Snapshot bei Event 1000
2. Spiele nur Events 1001-1050 ab
3. Fertig - 20x schneller!

**Strategie:** Alle 100-500 Events einen Snapshot. Im Code sehen wir:
- `snapshotStore.getLatest()` holt den neuesten Checkpoint
- `eventStore.getEvents(id, version)` holt nur das Delta
- Wir bauen State aus Snapshot + Delta

**Trade-off:** 
✅ Millisekunden statt Sekunden
❌ Extra Speicher & Serialisierungs-Komplexität

**Merke:** Snapshots sind optional. Events bleiben die Wahrheit - Snapshots kann man jederzeit neu bauen.

[Quelle: Fowler: "Application State Storage"]
-->

---

# Vor- und Nachteile: Die Trade-offs

<span>Event Sourcing ist kein Silver Bullet</span>

<div mt-4 />

<div grid grid-cols-2 gap-4>
  <div
    border="2 solid green-800" bg="green-800/20"
    rounded-lg overflow-hidden
  >
    <div bg="green-800/40" px-4 py-2 flex items-center>
      <div i-carbon:checkmark-outline text-green-300 text-xl mr-2 />
      <span font-bold>Vorteile</span>
    </div>
    <div px-4 py-3 flex flex-col gap-2>
      <div
        v-click="1"
        flex items-start gap-2
        transition duration-300 ease-in-out
        :class="$clicks < 1 ? 'opacity-0 translate-x--10' : 'opacity-100 translate-x-0'"
      >
        <div i-carbon:document-tasks text-green-400 mt-0.5 />
        <div>
          <div font-semibold text-sm>Vollständige Audit-Historie</div>
          <div text-xs opacity-70>Unveränderliche Historie - WAS, WANN, WER</div>
        </div>
      </div>
      <div
        v-click="2"
        flex items-start gap-2
        transition duration-300 ease-in-out
        :class="$clicks < 2 ? 'opacity-0 translate-x--10' : 'opacity-100 translate-x-0'"
      >
        <div i-carbon:time text-green-400 mt-0.5 />
        <div>
          <div font-semibold text-sm>Temporal Queries</div>
          <div text-xs opacity-70>Zeitreisen: "Wie sah es am 31. Dez aus?"</div>
        </div>
      </div>
      <div
        v-click="3"
        flex items-start gap-2
        transition duration-300 ease-in-out
        :class="$clicks < 3 ? 'opacity-0 translate-x--10' : 'opacity-100 translate-x-0'"
      >
        <div i-carbon:debug text-green-400 mt-0.5 />
        <div>
          <div font-semibold text-sm>Debugging & Reproduzierbarkeit</div>
          <div text-xs opacity-70>Exakte Event-Sequenz in Test abspielen</div>
        </div>
      </div>
      <div
        v-click="4"
        flex items-start gap-2
        transition duration-300 ease-in-out
        :class="$clicks < 4 ? 'opacity-0 translate-x--10' : 'opacity-100 translate-x-0'"
      >
        <div i-carbon:renew text-green-400 mt-0.5 />
        <div>
          <div font-semibold text-sm>Flexibilität</div>
          <div text-xs opacity-70>Neue Projektionen ohne Datenmigrationen</div>
        </div>
      </div>
    </div>
  </div>

  <div
    border="2 solid red-800" bg="red-800/20"
    rounded-lg overflow-hidden
  >
    <div bg="red-800/40" px-4 py-2 flex items-center>
      <div i-carbon:warning-alt text-red-300 text-xl mr-2 />
      <span font-bold>Nachteile</span>
    </div>
    <div px-4 py-3 flex flex-col gap-2>
      <div
        v-click="5"
        flex items-start gap-2
        transition duration-300 ease-in-out
        :class="$clicks < 5 ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'"
      >
        <div i-carbon:warning-alt text-red-400 mt-0.5 />
        <div>
          <div font-semibold text-sm>Erhöhte Komplexität</div>
          <div text-xs opacity-70>Team muss in Events denken lernen</div>
        </div>
      </div>
      <div
        v-click="6"
        flex items-start gap-2
        transition duration-300 ease-in-out
        :class="$clicks < 6 ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'"
      >
        <div i-carbon:time text-red-400 mt-0.5 />
        <div>
          <div font-semibold text-sm>Eventual Consistency</div>
          <div text-xs opacity-70>Read/Write getrennt - Verzögerung möglich</div>
        </div>
      </div>
      <div
        v-click="7"
        flex items-start gap-2
        transition duration-300 ease-in-out
        :class="$clicks < 7 ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'"
      >
        <div i-carbon:version text-red-400 mt-0.5 />
        <div>
          <div font-semibold text-sm>Event Schema Evolution</div>
          <div text-xs opacity-70>Versionierung & Upcasting nötig</div>
        </div>
      </div>
      <div
        v-click="8"
        flex items-start gap-2
        transition duration-300 ease-in-out
        :class="$clicks < 8 ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'"
      >
        <div i-carbon:data-base text-red-400 mt-0.5 />
        <div>
          <div font-semibold text-sm>Storage & GDPR</div>
          <div text-xs opacity-70>Alles speichern + "Right to be Forgotten"</div>
        </div>
      </div>
    </div>
  </div>
</div>

<div v-click="8" mt-4 bg="blue-800/20" border="2 solid blue-800" rounded-lg p-4>
  <div flex items-center gap-3>
    <div i-carbon:scales text-blue-300 text-2xl />
    <div>
      <div font-bold>Der zentrale Trade-off</div>
      <div text-sm opacity-80 mt-1>
        Event Sourcing kauft uns Auditability und Flexibilität - wir bezahlen mit Komplexität. 
        <span text-yellow-300>"Not justified for most systems"</span> - Microsoft Azure Docs
      </div>
    </div>
  </div>
</div>

<!--
**Einleitung (20 Sek):**
Event Sourcing ist ein mächtiges Pattern - aber kein Silver Bullet. Schauen wir uns die Trade-offs an.

**Vorteile (90 Sek):**

1. Vollständige Audit-Historie: Der offensichtlichste Vorteil: Wir haben eine vollständige, unveränderliche Historie. Für regulierte Branchen ist das Gold wert. Jede Änderung ist nachvollziehbar - WAS, WANN, WER.
[Quelle: Microsoft: "Complete audit trail and history"]

2. Temporal Queries: Wir können in die Vergangenheit reisen. 'Wie sah Konto X am 31. Dezember aus?' - Einfach Events bis zu diesem Datum abspielen. Das ist mit CRUD nicht möglich.
[Quelle: Fowler: "Temporal Query: We can determine the application state at any point in time"]

3. Debugging & Reproduzierbarkeit: Production Bug? Wir können die exakte Event-Sequenz in einer Testumgebung abspielen und Schritt für Schritt durchgehen.
[Quelle: Azure: "Replay for debugging"]

4. Flexibilität bei neuen Requirements: Neue Anforderungen? Wir erstellen einfach neue Projektionen aus bestehenden Events. Keine komplexen Datenmigrationen.
[Quelle: Stopford: "Polyglot Views"]

**Nachteile (90 Sek):**

1. Erhöhte Komplexität: Der größte Nachteil: Komplexität. Event Sourcing erfordert ein Umdenken. Das Team muss verstehen, wie man in Events denkt, wie man Projektionen baut, wie man mit Eventual Consistency umgeht.
[Quelle: Microsoft: "High cost to migrate to/from event sourcing"]

2. Eventual Consistency: Write und Read sind getrennt. Nach dem Schreiben eines Events kann es Millisekunden bis Sekunden dauern, bis Projektionen aktualisiert sind. Nicht jede Domain kann damit leben.
[Quelle: Stopford, Chapter 11: "Eventual Consistency"]

3. Event Schema Evolution: Was, wenn sich Event-Struktur ändert? Alte Events existieren ja noch. Wir brauchen Versionierung und Upcasting-Strategien.
[Quelle: Stopford, Chapter 13: "Evolving Schemas and Data over Time"]

4. Storage Overhead & GDPR: Wir speichern ALLES. Bei High-Volume-Systemen kann das teuer werden. Events sind immutable - echtes Löschen ist nicht möglich. Bei personenbezogenen Daten wird das zum Problem.

**Zusammenfassung (20 Sek):**
Der zentrale Trade-off: Event Sourcing kauft uns Auditability und Flexibilität - wir bezahlen mit Komplexität. Microsoft sagt zu Recht: 'Not justified for most systems'.
[Quelle: Microsoft Azure Docs]
-->

---

# Saga Pattern: Verteilte Transaktionen

<span>Event Sourcing in Microservices</span>

<div mt-2 />

<div grid grid-cols-2 gap-4>
  <div
    v-click
    border="2 solid red-800" bg="red-800/20"
    rounded-lg overflow-hidden
  >
    <div bg="red-800/40" px-3 py-1.5 flex items-center>
      <div i-carbon:warning-alt text-red-300 text-lg mr-2 />
      <span font-bold text-sm>Das Problem</span>
    </div>
    <div px-3 py-2>
      <div text-xs mb-2>
        Wie koordinieren wir Transaktionen über mehrere Services hinweg?
      </div>
      <div bg="red-900/30" rounded-lg p-2 text-xs>
        <div flex items-center gap-2 mb-0.5>
          <div i-carbon:close text-red-400 />
          <span>Verteilte ACID-Transaktionen zu langsam</span>
        </div>
        <div flex items-center gap-2>
          <div i-carbon:close text-red-400 />
          <span>Zu fehleranfällig</span>
        </div>
      </div>
    </div>
  </div>

  <div
    v-click
    border="2 solid green-800" bg="green-800/20"
    rounded-lg overflow-hidden
  >
    <div bg="green-800/40" px-3 py-1.5 flex items-center>
      <div i-carbon:checkmark-outline text-green-300 text-lg mr-2 />
      <span font-bold text-sm>Die Lösung: Saga</span>
    </div>
    <div px-3 py-2>
      <div text-xs mb-2>
        Sequenz von lokalen Transaktionen, koordiniert über Events
      </div>
      <div bg="green-900/30" rounded-lg p-2 text-xs>
        <div>Bei Fehler: Kompensierende Transaktionen</div>
        <div mt-1 text-yellow-300>
          ⚠️ Kompensationen sind NEUE Events, nicht Rückgängig-machen!
        </div>
      </div>
    </div>
  </div>
</div>

<div v-click mt-3 grid grid-cols-2 gap-3>
  <div border="2 solid blue-800" bg="blue-800/20" rounded-lg overflow-hidden>
    <div bg="blue-800/40" px-2 py-1 font-bold text-xs>Erfolgsfall</div>
    <div px-2 py-2>
      <div font-mono text-xs bg="black/30" rounded-lg p-1.5>
        <div text-green-400>1. OrderCreated</div>
        <div text-green-400>2. PaymentProcessed</div>
        <div text-green-400>3. ItemsShipped</div>
        <div mt-1 text-zinc-500>✓ Alles erfolgreich</div>
      </div>
    </div>
  </div>

  <div border="2 solid yellow-800" bg="yellow-800/20" rounded-lg overflow-hidden>
    <div bg="yellow-800/40" px-2 py-1 font-bold text-xs>Fehlerfall mit Kompensation</div>
    <div px-2 py-2>
      <div font-mono text-xs bg="black/30" rounded-lg p-1.5>
        <div text-green-400>1. OrderCreated</div>
        <div text-green-400>2. PaymentProcessed</div>
        <div text-red-400>3. ShippingFailed ❌</div>
        <div mt-1 text-yellow-400>→ PaymentRefunded</div>
        <div text-yellow-400>→ OrderCancelled</div>
      </div>
    </div>
  </div>
</div>

<div v-click mt-4 text-center>
  <div bg="purple-800/20" border="1 solid purple-800" rounded-lg p-2 inline-block>
    <div flex items-center gap-2 text-xs>
      <div i-carbon:presentation-file text-purple-300 />
      <span>Details zu Sagas & Verteilten Systemen: Vortrag am 12.12.</span>
    </div>
  </div>
</div>
<div absolute bottom-4 right-4 text-xs opacity-50>
  Quelle: Ben Stopford; Chris Richardson
</div>

<!--
**Problem (30 Sek):**
Wir kommen zu einem der schwierigsten Probleme in verteilten Systemen: Transaktionen. In einem Monolithen ist das einfach – `BEGIN TRANSACTION`, `COMMIT`, fertig. ACID regelt das.
Aber in Microservices? Wir können keine verteilten ACID-Transaktionen über mehrere Services spannen. Das ist zu langsam (Latenz) und zu fehleranfällig (Single Point of Failure). Wir brauchen also einen anderen Weg.

**Die Lösung: Saga Pattern (60 Sek):**
Hier kommt das Saga Pattern ins Spiel. Statt einer großen Transaktion haben wir eine Sequenz von *lokalen* Transaktionen. Jeder Schritt wird durch ein Event ausgelöst.

Nehmen wir unser E-Commerce Beispiel:
1. Der Order-Service erstellt die Bestellung → `OrderCreated`.
2. Der Payment-Service hört das, bucht ab → `PaymentProcessed`.
3. Der Shipping-Service hört das, versendet → `ItemsShipped`.
Im Erfolgsfall ist das eine saubere Kette.

Aber was, wenn der Versand fehlschlägt? Wir können die Zeit nicht zurückdrehen.
Stattdessen führen wir **kompensierende Transaktionen** aus.
- Shipping schlägt fehl → `ShippingFailed`.
- Payment-Service hört das → führt Refund durch → `PaymentRefunded`.
- Order-Service hört das → storniert Bestellung → `OrderCancelled`.

WICHTIG: Kompensation bedeutet nicht "Löschen" oder "Undo" im klassischen Sinn. Wir erzeugen *neue* Events, die den Effekt der vorherigen logisch ausgleichen. Die Historie bleibt bestehen – wir sehen, dass bestellt, bezahlt und dann erstattet wurde.

**Koordination (15 Sek):**
Es gibt zwei Arten, Sagas zu koordinieren:
1. **Choreographie:** Dezentral, Services reagieren auf Events (wie beim Tanz).
2. **Orchestrierung:** Ein zentraler Manager steuert den Ablauf.
Details dazu im Deep-Dive am 12.12.

**Warum Event Sourcing? (30 Sek):**
Das ist der entscheidende Punkt: **Event Sourcing ist die perfekte Basis für Sagas.**
1. **Kommunikation:** Events sind bereits die Sprache unseres Systems.
2. **Historie:** Für Kompensationen müssen wir wissen, was genau passiert ist. Der Event Store liefert uns diesen Audit-Trail "gratis".
3. **Debugging:** Wenn eine Saga klemmt, haben wir die komplette Historie im Store und können genau sehen, wo es gehakt hat.
-->

---

# Migration Pattern: Strangler Fig

<span>Von CRUD zu Event Sourcing - schrittweise Migration</span>

<div mt-2 />

<div
  v-click
  border="2 solid blue-800" bg="blue-800/20"
  rounded-lg overflow-hidden mb-2
>
  <div bg="blue-800/40" px-2 py-1 flex items-center>
    <div i-carbon:tree-view text-blue-300 text-lg mr-2 />
    <span font-bold text-sm>Strangler Fig Pattern</span>
  </div>
  <div px-2 py-1.5>
    <div text-xs mb-1>
      Wie die Würgefeige: Neues System wächst um das alte herum, bis es komplett ersetzt ist
    </div>
    <div grid grid-cols-3 gap-2 text-center text-xs>
      <div bg="red-900/30" rounded p-1.5>
        <div font-semibold mb-0.5>Phase 1: Legacy</div>
        <div font-mono text-xs>
          <div>┌────────┐</div>
          <div>│ CRUD   │</div>
          <div>│ System │</div>
          <div>└────────┘</div>
        </div>
      </div>
      <div bg="yellow-900/30" rounded p-1.5>
        <div font-semibold mb-0.5>Phase 2: Parallel</div>
        <div font-mono text-xs>
          <div>┌─CRUD─┐┌─ES──┐</div>
          <div text-yellow-300>│ Old  ││ New │</div>
          <div>└──────┘└─────┘</div>
          <div text-green-300>    CDC ↑</div>
        </div>
      </div>
      <div bg="green-900/30" rounded p-1.5>
        <div font-semibold mb-0.5>Phase 3: Event-Based</div>
        <div font-mono text-xs>
          <div>┌────────┐</div>
          <div text-green-300>│ Event  │</div>
          <div text-green-300>│ Source │</div>
          <div>└────────┘</div>
        </div>
      </div>
    </div>
  </div>
</div>

<div v-click grid grid-cols-2 gap-2>
  <div border="2 solid purple-800" bg="purple-800/20" rounded-lg overflow-hidden>
    <div bg="purple-800/40" px-2 py-1 font-bold text-sm>Schritt 1: CDC Bridge</div>
    <div px-2 py-1.5>
      <div font-mono text-xs bg="black/30" rounded-lg p-1.5 mb-1.5>
        <div text-green-300>// Change Data Capture</div>
        <div>CRUD DB (Legacy)</div>
        <div text-yellow-300>  ↓ CDC Stream</div>
        <div>Event Store (New)</div>
        <div text-blue-300>  → Projections</div>
      </div>
      <div text-xs opacity-70>
        DB-Änderungen als Events capturen via Debezium/CDC
      </div>
    </div>
  </div>

  <div border="2 solid green-800" bg="green-800/20" rounded-lg overflow-hidden>
    <div bg="green-800/40" px-2 py-1 font-bold text-sm>Schritt 2: Write Migration</div>
    <div px-2 py-1.5>
      <div font-mono text-xs bg="black/30" rounded-lg p-1.5 mb-1.5>
        <div text-green-300>// Dual-Write Phase</div>
        <div>Command → Handler</div>
        <div text-yellow-300>  → Write Event Store</div>
        <div text-yellow-300>  → Write Legacy DB</div>
        <div text-blue-300>  → Verify Consistency</div>
      </div>
      <div text-xs opacity-70>
        Neue Writes gehen zu beiden Systemen (Shadowing)
      </div>
    </div>
  </div>
</div>

<div v-click mt-2 bg="blue-800/20" border="2 solid blue-800" rounded-lg p-1.5>
  <div flex items-center gap-2 mb-1.5>
    <div i-carbon:checkmark-outline text-blue-300 text-lg />
    <span font-semibold text-xs>Migrationsstrategie</span>
  </div>
  <div grid grid-cols-3 gap-2 text-xs>
    <div flex items-center gap-1>
      <span>1.</span>
      <span opacity-70>Historische Daten über CDC migrieren</span>
    </div>
    <div flex items-center gap-1>
      <span>2.</span>
      <span opacity-70>Dual-Write für neue Operationen</span>
    </div>
    <div flex items-center gap-1>
      <span>3.</span>
      <span opacity-70>Legacy System schrittweise abschalten</span>
    </div>
  </div>
</div>
<div absolute bottom-4 right-4 text-xs opacity-50>
  Quelle: Martin Fowler - StranglerFigApplication; Debezium Docs
</div>

<!--
**Strangler Fig Pattern (45 Sek):**
Der Name kommt von der Würgefeige - eine Pflanze, die um einen Baum herum wächst, bis sie ihn komplett ersetzt.
Das ist genau die Strategie für Migration zu Event Sourcing:

- **Phase 1:** Legacy CRUD-System läuft.
- **Phase 2:** Neues Event-Sourced System wächst parallel heran.
- **Phase 3:** Legacy wird Feature für Feature abgeschaltet, bis nur noch Event Sourcing übrig ist.

Kritisch: KEIN Big Bang Rewrite! Das scheitert meist.

**Schritt 1: CDC Bridge (45 Sek):**
Wir starten mit Change Data Capture (CDC):
- Tools wie Debezium lesen den DB Transaction Log.
- Jede Änderung in der Legacy-DB wird als Event captured.
- Diese "synthetischen" Events fließen in den neuen Event Store.

So haben wir eine Bridge: Legacy schreibt weiter in die DB, aber wir haben parallel einen Event Stream.
Wir können erste Projektionen aufbauen und testen, OHNE das Legacy-System zu ändern.

**Schritt 2: Write Migration (30 Sek):**
Jetzt beginnen wir, neue Features direkt in Event Sourcing zu schreiben:
- Dual-Write: Neue Writes gehen SOWOHL zum Event Store ALS AUCH zur Legacy-DB.
- Das nennt sich "Shadowing" - wir können Konsistenz vergleichen.
- Traffic langsam auf das neue System umleiten.

Sobald wir Vertrauen haben: Legacy-Writes abschalten, Feature für Feature.

**Vorteil:** Inkrementell, rollback-fähig, geringes Risiko.
-->

---

# Event Sourcing in der Praxis

<span>Tools, Frameworks und der pragmatische Ansatz</span>

<div mt-2 />

<div grid grid-cols-2 gap-4>
  <div
    v-click
    border="2 solid blue-800" bg="blue-800/20"
    rounded-lg overflow-hidden
  >
    <div bg="blue-800/40" px-3 py-1.5 flex items-center>
      <div i-carbon:tools text-blue-300 text-lg mr-2 />
      <span font-bold text-sm>Frameworks & Tools</span>
    </div>
    <div px-3 py-2 flex flex-col gap-1.5>
      <div flex items-center gap-2>
        <div i-logos:java text-lg />
        <div text-xs>
          <span font-semibold>Axon Framework</span>
          <div text-xs opacity-70>Full-featured CQRS + Event Sourcing</div>
        </div>
      </div>
      <div flex items-center gap-2>
        <div i-carbon:data-base text-purple-300 text-lg />
        <div text-xs>
          <span font-semibold>EventStore DB</span>
          <div text-xs opacity-70>Spezialisierte Event-Datenbank</div>
        </div>
      </div>
      <div flex items-center gap-2>
        <div i-carbon:flow-stream text-orange-400 text-lg />
        <div text-xs>
          <span font-semibold>Kafka + Streams</span>
          <div text-xs opacity-70>Distributed Event Log</div>
        </div>
      </div>
      <div flex items-center gap-2>
        <div i-carbon:cloud text-blue-300 text-lg />
        <div text-xs>
          <span font-semibold>Azure Cosmos DB</span>
          <div text-xs opacity-70>NoSQL mit Change Feed</div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-click
    border="2 solid green-800" bg="green-800/20"
    rounded-lg overflow-hidden
  >
    <div bg="green-800/40" px-3 py-1.5 flex items-center>
      <div i-carbon:industry text-green-300 text-lg mr-2 />
      <span font-bold text-sm>Industrie-Beispiele</span>
    </div>
    <div px-3 py-2 flex flex-col gap-1.5>
      <div>
        <div flex items-center gap-2 mb-0.5>
          <div i-carbon:finance text-yellow-300 />
          <span font-semibold text-xs>Banking</span>
        </div>
        <div text-xs opacity-70>Transaktionshistorie mit vollständigem Audit-Trail</div>
      </div>
      <div>
        <div flex items-center gap-2 mb-0.5>
          <div i-carbon:shopping-cart text-green-300 />
          <span font-semibold text-xs>E-Commerce</span>
        </div>
        <div text-xs opacity-70>Order Management & Customer Support</div>
      </div>
      <div>
        <div flex items-center gap-2 mb-0.5>
          <div i-carbon:iot-platform text-blue-300 />
          <span font-semibold text-xs>IoT-Systeme</span>
        </div>
        <div text-xs opacity-70>Sensor-Daten als Time-Series</div>
      </div>
      <div>
        <div flex items-center gap-2 mb-0.5>
          <div i-carbon:game-console text-purple-300 />
          <span font-semibold text-xs>Gaming</span>
        </div>
        <div text-xs opacity-70>Player State History & Replay</div>
      </div>
    </div>
  </div>
</div>

<div v-click mt-4 bg="yellow-800/20" border="2 solid yellow-800" rounded-lg overflow-hidden>
  <div bg="yellow-800/40" px-3 py-1.5 flex items-center>
    <div i-carbon:idea text-yellow-300 text-lg mr-2 />
    <span font-bold text-sm>Der pragmatische Ansatz: Bounded Contexts</span>
  </div>
  <div px-3 py-2 grid grid-cols-2 gap-3>
    <div>
      <div flex items-center gap-2 mb-1>
        <div i-carbon:checkmark-outline text-green-400 text-lg />
        <span font-semibold text-xs>RICHTIG</span>
      </div>
      <div bg="green-900/30" rounded-lg p-2 text-xs>
        <div mb-0.5>Event Sourcing in spezifischen Bounded Contexts:</div>
        <div>• Banking → nur Transaktions-Service</div>
        <div>• E-Commerce → nur Order-Service</div>
      </div>
    </div>
    <div>
      <div flex items-center gap-2 mb-1>
        <div i-carbon:close text-red-400 text-lg />
        <span font-semibold text-xs>FALSCH</span>
      </div>
      <div bg="red-900/30" rounded-lg p-2 text-xs>
        <div mb-0.5>Komplettes System auf Event Sourcing:</div>
        <div>• User-Profile-Service? → CRUD reicht!</div>
        <div>• Product-Catalog? → CRUD reicht!</div>
      </div>
    </div>
  </div>
  <div px-3 pb-2 text-xs opacity-80>
    Nutzt Event Sourcing dort, wo Audit-Trail kritisch ist - nicht überall!
  </div>
</div>
<div absolute bottom-4 right-4 text-xs opacity-50>
  Quelle: EventStore DB Docs; Axon Framework
</div>

<!--
**Frameworks (45 Sek):**
Für die Implementierung gibt es etablierte Frameworks:

- Axon Framework (Java): Full-featured, CQRS + Event Sourcing out-of-the-box
- EventStore DB: Spezialisierte Datenbank für Event Sourcing
- Kafka + Kafka Streams: Distributed Event Log mit Stream Processing
- Azure Cosmos DB + Change Feed: NoSQL mit Event-Unterstützung
- Akka Persistence (Scala/Java): Actor Model + Event Sourcing

[Quellen: EventStore Docs, Confluent Kafka Event Sourcing]

**Industrie-Beispiele (30 Sek):**
Wer nutzt Event Sourcing?
- Banken für Transaktionshistorie (vollständiger Audit-Trail)
- E-Commerce für Order Management
- IoT-Systeme für Sensor-Daten (Time-Series Data)
- Gaming für Player State History und Replay-Funktionen

**Bounded Contexts - Der pragmatische Ansatz (45 Sek):**
Kritisch: Event Sourcing muss nicht system-wide sein! Das ist ein häufiger Fehler.

✅ RICHTIG: Event Sourcing in spezifischen Bounded Contexts
- Banking → nur für Transaktions-Service
- E-Commerce → nur für Order-Service

❌ FALSCH: Komplettes System auf Event Sourcing umstellen
- User-Profile-Service? → CRUD reicht!
- Product-Catalog? → CRUD reicht!

Nutzt Event Sourcing dort, wo Audit-Trail kritisch ist - nicht überall.
-->

---

# GDPR & Event Sourcing: Crypto-Shredding

<span>"Right to be Forgotten" mit unveränderlichen Events</span>

<div mt-1 />

<div
  v-click
  border="2 solid red-800" bg="red-800/20"
  rounded-lg overflow-hidden mb-1.5
>
  <div bg="red-800/40" px-2 py-0.5 flex items-center>
    <div i-carbon:warning-alt text-red-300 text-lg mr-2 />
    <span font-bold text-sm>Das Problem</span>
  </div>
  <div px-2 py-1>
    <div text-xs mb-0.5>
      GDPR Artikel 17: "Right to be Forgotten" - Nutzer können Löschung ihrer Daten verlangen
    </div>
    <div bg="red-900/30" rounded-lg p-1 text-xs>
      <div flex items-center gap-2>
        <div i-carbon:locked text-red-400 />
        <span>Events sind unveränderlich - echtes Löschen widerspricht dem Pattern!</span>
      </div>
    </div>
  </div>
</div>

<div
  v-click
  border="2 solid green-800" bg="green-800/20"
  rounded-lg overflow-hidden
>
  <div bg="green-800/40" px-2 py-0.5 flex items-center>
    <div i-carbon:security text-green-300 text-lg mr-2 />
    <span font-bold text-sm>Lösung: Crypto-Shredding</span>
  </div>
  <div px-2 py-1>
    <div grid grid-cols-2 gap-2>
      <div>
        <div text-xs font-semibold mb-0.5>Konzept</div>
        <div font-mono text-xs bg="black/30" rounded-lg p-1>
          <div text-blue-300>// Verschlüssele PII</div>
          <div>Event: {</div>
          <div>  userId: "user-123",</div>
          <div text-yellow-300>  encrypted: encrypt(</div>
          <div>    data: "Max Müller",</div>
          <div>    key: userKey</div>
          <div text-yellow-300>  )</div>
          <div>}</div>
        </div>
      </div>
      <div>
        <div text-xs font-semibold mb-0.5>Löschen</div>
        <div font-mono text-xs bg="black/30" rounded-lg p-1>
          <div text-red-300>// Schlüssel löschen</div>
          <div>delete(userKey);</div>
          <div mt-0.5 text-green-400>// Event bleibt,</div>
          <div text-green-400>// aber unleserlich!</div>
          <div mt-0.5>encrypted: "j4k2..."</div>
          <div text-zinc-500>// ✓ Irreversibel</div>
        </div>
      </div>
    </div>
    <div mt-1 flex flex-col gap-0.5 text-xs>
      <div flex items-center gap-2>
        <div i-carbon:checkmark-outline text-green-400 />
        <span>1. Personenbezogene Daten (PII) mit User-spezifischem Schlüssel verschlüsseln</span>
      </div>
      <div flex items-center gap-2>
        <div i-carbon:checkmark-outline text-green-400 />
        <span>2. Bei Löschanfrage: Nur Schlüssel vernichten</span>
      </div>
      <div flex items-center gap-2>
        <div i-carbon:checkmark-outline text-green-400 />
        <span>3. Daten bleiben verschlüsselt, aber unwiderruflich unleserlich</span>
      </div>
    </div>
  </div>
</div>

<div v-click mt-1.5 bg="blue-800/20" border="2 solid blue-800" rounded-lg p-1>
  <div flex items-center gap-2>
    <div i-carbon:idea text-blue-300 text-lg />
    <div text-xs>
      <span font-semibold>Best Practice:</span> Trenne technische von fachlichen Daten. Nur PII verschlüsseln, Metadaten (Timestamps, Aggregate-IDs) bleiben lesbar für Audit-Zwecke.
    </div>
  </div>
</div>
<div absolute bottom-4 right-4 text-xs opacity-50>
  Quelle: GDPR Art. 17; Microsoft Azure Security Patterns
</div>

<!--
**Problem (30 Sek):**
GDPR Artikel 17 gibt Nutzern das "Right to be Forgotten". Sie können verlangen, dass ihre Daten gelöscht werden.
Aber Events sind unveränderlich - das ist ein Kernprinzip von Event Sourcing!
Wie lösen wir diesen offensichtlichen Konflikt?

**Lösung: Crypto-Shredding (90 Sek):**
Die elegante Lösung heißt "Crypto-Shredding":

1. **Verschlüsseln:** Wir verschlüsseln personenbezogene Daten (PII = Personally Identifiable Information) im Event mit einem User-spezifischen Schlüssel.
   - Events enthalten dann nur verschlüsselte Blobs statt Klartextnamen.
   - Der Schlüssel wird separat gespeichert (z.B. in einem Key Management Service).

2. **"Löschen":** Wenn ein Nutzer Löschung verlangt:
   - Wir löschen NICHT das Event (das würde das Pattern brechen).
   - Wir löschen NUR den Verschlüsselungsschlüssel.

3. **Ergebnis:** Die Events bleiben im Store, aber die verschlüsselten Daten sind unwiderruflich unleserlich.
   - Aus Sicht der GDPR sind die Daten "gelöscht" - sie sind nicht mehr rekonstruierbar.
   - Der Audit-Trail bleibt: Wir sehen DASS etwas passiert ist, aber nicht mehr WER betroffen war.

**Best Practice (15 Sek):**
Wichtig: Trennt technische von fachlichen Daten.
- PII verschlüsseln: Namen, E-Mails, Adressen
- Metadaten im Klartext: Timestamps, Aggregate-IDs, Betragsgrößen
So bleibt der Audit-Trail für Compliance lesbar, aber datenschutzkonform.
-->

---

# Event Versioning: Schema Evolution

<span>Wie ändern wir Events, wenn alte Versionen bereits gespeichert sind?</span>

<div mt-1 />

<div grid grid-cols-2 gap-2 items-start>
  <div
    v-click
    h-full
    border="2 solid yellow-800" bg="yellow-800/20"
    rounded-lg overflow-hidden
  >
    <div bg="yellow-800/40" px-2 py-0.5 flex items-center>
      <div i-carbon:warning-alt text-yellow-300 text-lg mr-2 />
      <span font-bold text-sm>Das Problem</span>
    </div>
    <div px-2 py-1>
      <div font-mono text-xs bg="black/30" rounded-lg p-1>
        <div text-green-300>// Version 1 (2023)</div>
        <div>OrderCreated { customerId: string }</div>
        <div text-blue-300>// Version 2 (2024)</div>
        <div>OrderCreated {</div>
        <div>  customerId: UUID</div>
        <div text-yellow-300>  customerEmail: string  // Neu!</div>
        <div>}</div>
      </div>
      <div text-xs mt-0.5 opacity-70>
        Alte Events fehlt das neue Feld
      </div>
    </div>
  </div>

  <div
    v-click
    h-full
    border="2 solid green-800" bg="green-800/20"
    rounded-lg overflow-hidden
    flex="~ col"
  >
    <div bg="green-800/40" px-2 py-0.5 flex items-center>
      <div i-carbon:renew text-green-300 text-lg mr-2 />
      <span font-bold text-sm>Strategien</span>
    </div>
    <div px-2 py-1 flex="~ col 1" justify-center>
      <div flex flex-col gap-1>
        <div>
          <div flex items-center gap-2>
            <div i-carbon:upgrade text-blue-300 />
            <span font-semibold text-xs>1. Upcasting</span>
          </div>
          <div text-xs opacity-70>Events beim Laden transformieren</div>
        </div>
        <div>
          <div flex items-center gap-2>
            <div i-carbon:version text-purple-300 />
            <span font-semibold text-xs>2. Versioned Events</span>
          </div>
          <div text-xs opacity-70>Explizite Versionsnummer</div>
        </div>
        <div>
          <div flex items-center gap-2>
            <div i-carbon:copy-file text-green-300 />
            <span font-semibold text-xs>3. Weak Schema</span>
          </div>
          <div text-xs opacity-70>Optionale Felder + Defaults</div>
        </div>
      </div>
    </div>
  </div>
</div>

<div v-click mt-1.5 border="2 solid blue-800" bg="blue-800/20" rounded-lg overflow-hidden>
  <div bg="blue-800/40" px-2 py-0.5 font-bold text-sm>Upcasting Beispiel</div>
  <div px-2 py-1>
    <div font-mono text-xs bg="black/30" rounded-lg p-1>
      <div text-green-300>// Event Upcaster</div>
      <div>public class OrderCreatedUpcaster {</div>
      <div>  public OrderCreatedV2 upcast(OrderCreatedV1 old) {</div>
      <div>    return new OrderCreatedV2(</div>
      <div>      old.customerId,</div>
      <div text-blue-300>      "unknown@example.com"  // Default</div>
      <div>    );</div>
      <div>  }</div>
      <div>}</div>
    </div>
    <div mt-0.5 text-xs flex items-center gap-2>
      <div i-carbon:idea text-blue-300 />
      <span opacity-70>On-the-fly Transformation beim Replay, alte Events bleiben unverändert</span>
    </div>
  </div>
</div>
<div absolute bottom-4 right-4 text-xs opacity-50>
  Quelle: Stopford Ch. 13; Axon Framework Docs
</div>

<!--
**Problem (30 Sek):**
Requirements ändern sich. Ihr habt 2023 OrderCreated-Events mit nur customerId gespeichert.
2024 braucht ihr plötzlich auch die customerEmail.
Aber die alten Events im Store haben dieses Feld nicht!
Ihr könnt sie nicht ändern (immutable), aber euer Code erwartet das neue Format.

**Strategien (60 Sek):**

1. **Upcasting:** Die häufigste Strategie.
   - Beim Laden aus dem Store transformieren wir alte Events automatisch ins neue Format.
   - Ein "Upcaster" mapped V1 → V2.
   - Wichtig: Die Events im Store bleiben unverändert, die Transformation passiert on-the-fly.

2. **Versioned Events:** Explizite Versionierung.
   - Events haben ein `version`-Feld.
   - Code kann mit mehreren Versionen umgehen (`if (event.version == 1) { ... }`).
   - Macht den Code komplexer, aber expliziter.

3. **Weak Schema:** Felder optional machen.
   - Alle neuen Felder sind nullable/optional mit sinnvollen Defaults.
   - Einfachste Lösung, aber semantisch manchmal schwierig.

**Code-Beispiel (30 Sek):**
Beim Upcasting schreiben wir einen kleinen Transformer:
- Alte Events werden beim Replay durch den Upcaster gejagt.
- Fehlende Felder bekommen Defaults (z.B. "unknown@example.com").
- Der Application-Code sieht nur noch die neue Version.

**Best Practice:** Kombiniere Strategien - Upcasting für Breaking Changes, Weak Schema für Additions.
-->

---

# Testing Event-Sourced Systems

<span>Testen von Events, Projektionen und Read Models</span>

<div mt-2 />

<div grid grid-cols-2 gap-2 items-start>
  <div
    v-click
    h-full
    border="2 solid blue-800" bg="blue-800/20"
    rounded-lg overflow-hidden
  >
    <div bg="blue-800/40" px-2 py-1 flex items-center>
      <div i-carbon:test-tool text-blue-300 text-lg mr-2 />
      <span font-bold text-sm>Given-When-Then</span>
    </div>
    <div px-2 py-1>
      <div font-mono text-xs bg="black/30" rounded-lg p-1.5>
        <div text-green-300>// Aggregate Test</div>
        <div>@Test void cancelOrder() {</div>
        <div text-yellow-300>  fixture.given(</div>
        <div>    new OrderCreated(...),</div>
        <div>    new PaymentReceived(...)</div>
        <div text-yellow-300>  )</div>
        <div text-yellow-300>  .when(new CancelOrderCommand(id))</div>
        <div text-yellow-300>  .expectEvents(</div>
        <div>    new OrderCancelled(...)</div>
        <div>  );</div>
        <div>}</div>
      </div>
      <div text-xs mt-1 opacity-70>
        Events abspielen → Command → Events prüfen
      </div>
    </div>
  </div>

  <div
    v-click
    h-full
    border="2 solid green-800" bg="green-800/20"
    rounded-lg overflow-hidden
  >
    <div bg="green-800/40" px-2 py-1 flex items-center>
      <div i-carbon:view text-green-300 text-lg mr-2 />
      <span font-bold text-sm>Projection Testing</span>
    </div>
    <div px-2 py-1>
      <div font-mono text-xs bg="black/30" rounded-lg p-1.5>
        <div text-green-300>// Projection Test</div>
        <div>@Test void orderView() {</div>
        <div text-yellow-300>  givenEvents(</div>
        <div>    OrderCreated(id, ...),</div>
        <div>    ItemAdded(...)</div>
        <div text-yellow-300>  ).whenProjected()</div>
        <div text-yellow-300>  .expectView(</div>
        <div>    OrderView(id, [item1])</div>
        <div>  );</div>
        <div>}</div>
      </div>
      <div text-xs mt-1 opacity-70>
        Events → Projektion → Read Model prüfen
      </div>
    </div>
  </div>
</div>

<div v-click mt-2 grid grid-cols-3 gap-2>
  <div border="1 solid purple-700" bg="purple-800/20" rounded-lg p-1.5>
    <div flex items-center gap-2 mb-0.5>
      <div i-carbon:network-3 text-purple-300 />
      <span font-semibold text-xs>Integration Tests</span>
    </div>
    <div text-xs opacity-70>Testcontainers für Store + DB</div>
  </div>
  <div border="1 solid orange-700" bg="orange-800/20" rounded-lg p-1.5>
    <div flex items-center gap-2 mb-0.5>
      <div i-carbon:data-backup text-orange-300 />
      <span font-semibold text-xs>Replay Tests</span>
    </div>
    <div text-xs opacity-70>Production Events abspielen</div>
  </div>
  <div border="1 solid cyan-700" bg="cyan-800/20" rounded-lg p-1.5>
    <div flex items-center gap-2 mb-0.5>
      <div i-carbon:purchase text-cyan-300 />
      <span font-semibold text-xs>Property-Based</span>
    </div>
    <div text-xs opacity-70>Invarianten über Sequenzen</div>
  </div>
</div>

<div v-click mt-2 bg="yellow-800/20" border="2 solid yellow-800" rounded-lg p-1.5>
  <div flex items-center gap-2>
    <div i-carbon:idea text-yellow-300 text-lg />
    <div text-xs>
      <span font-semibold>Vorteil:</span> Deterministisch - gleiche Events = gleiches Ergebnis. Kein DB-Mocking!
    </div>
  </div>
</div>
<div absolute bottom-4 right-4 text-xs opacity-50>
  Quelle: Axon Testing; Microsoft Testing Guide
</div>

<!--
**Given-When-Then (45 Sek):**
Event Sourcing eignet sich hervorragend für Given-When-Then Tests:

- **Given:** Wir spielen eine Sequenz historischer Events ab (Test Setup).
- **When:** Wir führen ein Command aus.
- **Then:** Wir prüfen, welche Events erzeugt wurden.

Das ist extrem klar und testbar. Frameworks wie Axon haben das bereits eingebaut.
Kein komplexes DB-Mocking nötig - wir können Events einfach in-memory abspielen.

**Projection Testing (30 Sek):**
Projektionen sind pure Funktionen: Events rein → State raus.
Wir testen:
1. Events einspeisen
2. Projection durchlaufen lassen
3. Resultierenden Read Model-State prüfen

Super einfach zu testen, weil deterministisch.

**Weitere Test-Strategien (30 Sek):**

- **Integration Tests:** Mit Testcontainers können wir echte Event Stores + Projektions-DBs hochfahren.
- **Replay Tests:** Production Events in Test-Umgebung abspielen - echtes Debugging!
- **Property-Based Testing:** Invarianten über beliebige Event-Sequenzen testen (z.B. "Kontostand darf nie negativ werden").

**Der große Vorteil:** Determinismus. Gleiche Event-Sequenz = immer gleiches Ergebnis. Flaky Tests sind selten.
-->

---

# Fazit: Wann Event Sourcing einsetzen?

<span>Bewusst nutzen, nicht dogmatisch</span>

<div mt-3 />

<div grid grid-cols-2 gap-4>
  <div
    v-click
    border="2 solid green-800" bg="green-800/20"
    rounded-lg overflow-hidden
  >
    <div bg="green-800/40" px-3 py-1.5 flex items-center>
      <div i-carbon:checkmark-outline text-green-300 text-lg mr-2 />
      <span font-bold text-sm>Wann JA?</span>
    </div>
    <div px-3 py-2 flex flex-col gap-1.5>
      <div flex items-center gap-2>
        <div i-carbon:document-tasks text-green-400 />
        <span text-xs>Hohe Audit-Anforderungen (Banking, Healthcare)</span>
      </div>
      <div flex items-center gap-2>
        <div i-carbon:time text-green-400 />
        <span text-xs>Historie ist kritisch (Compliance, Debugging)</span>
      </div>
      <div flex items-center gap-2>
        <div i-carbon:flow text-green-400 />
        <span text-xs>Komplexe Domains mit Event-basierten Workflows</span>
      </div>
      <div flex items-center gap-2>
        <div i-carbon:cube text-green-400 />
        <span text-xs>In spezifischen Bounded Contexts</span>
      </div>
    </div>
  </div>

  <div
    v-click
    border="2 solid red-800" bg="red-800/20"
    rounded-lg overflow-hidden
  >
    <div bg="red-800/40" px-3 py-1.5 flex items-center>
      <div i-carbon:close text-red-300 text-lg mr-2 />
      <span font-bold text-sm>Wann NEIN?</span>
    </div>
    <div px-3 py-2 flex flex-col gap-1.5>
      <div flex items-center gap-2>
        <div i-carbon:close text-red-400 />
        <span text-xs>Als Standard-Speichermethode für alle Daten</span>
      </div>
      <div flex items-center gap-2>
        <div i-carbon:close text-red-400 />
        <span text-xs>Für einfache CRUD-Anwendungen</span>
      </div>
      <div flex items-center gap-2>
        <div i-carbon:close text-red-400 />
        <span text-xs>Wenn Team nicht bereit für Komplexität</span>
      </div>
      <div flex items-center gap-2>
        <div i-carbon:close text-red-400 />
        <span text-xs>System-wide ohne klaren Nutzen</span>
      </div>
    </div>
  </div>
</div>

<div v-click mt-4 bg="blue-800/20" border="2 solid blue-800" rounded-lg p-3>
  <div flex items-center gap-2>
    <div i-carbon:idea text-blue-300 text-2xl />
    <div>
      <div font-bold text-base>Kernaussagen</div>
      <div text-xs opacity-80 mt-1 flex flex-col gap-0.5>
        <div>• Events sind unveränderlich und bilden die Single Source of Truth</div>
        <div>• Ermöglicht Audit-Trails, Temporal Queries und Event Replay</div>
        <div>• Trade-off: Auditability & Flexibilität vs. Komplexität</div>
        <div>• Nutzt es bewusst in spezifischen Bounded Contexts</div>
      </div>
    </div>
  </div>
</div>

<div v-click mt-3 bg="yellow-800/20" border="2 solid yellow-800" rounded-lg p-2>
  <div flex items-center gap-2>
    <div i-carbon:warning-alt text-yellow-300 text-lg />
    <span text-xs>
      <span font-semibold>Fowler's Warnung:</span> "Es ist schwer, das später zu retrofiten. Aber für die meisten Systeme ist die Komplexität nicht gerechtfertigt."
    </span>
  </div>
</div>
<div absolute bottom-4 right-4 text-xs opacity-50>
  Quelle: Martin Fowler; Microsoft Azure Docs
</div>

<!--
**Zusammenfassung (60 Sek):**
Was haben wir gelernt?

Event Sourcing:
- Speichert Zustandsänderungen als Events, nicht den Zustand selbst
- Events sind unveränderlich und bilden die Single Source of Truth
- Ermöglicht Audit-Trails, Temporal Queries und Event Replay
- Aber: Erhöhte Komplexität und Eventual Consistency

Wann einsetzen?
- ✅ Bei hohen Audit-Anforderungen (Banking, Healthcare)
- ✅ Wenn Historie kritisch ist (Compliance, Debugging)
- ✅ Für komplexe Domains mit Event-basierten Workflows
- ✅ In spezifischen Bounded Contexts, nicht system-wide!
- ❌ NICHT als Standard-Speichermethode für alle Daten
- ❌ NICHT für einfache CRUD-Anwendungen

**Kritische Distanz (30 Sek):**
Wichtig: Event Sourcing ist kein Silver Bullet. Fowler warnt zu Recht: Es ist schwer, das später zu retrofiten. Aber für die meisten Systeme ist die Komplexität nicht gerechtfertigt.
[Quelle: Fowler: "When to Use It"]

Mein Fazit: Nutzt es bewusst in spezifischen Bounded Contexts, nicht system-wide.
-->

---
layout: center
class: text-center
---

# Diskussion

<div mt-8 text-xl opacity-80>
  Zeit für eure Fragen und Diskussion
</div>

<div mt-8 grid grid-cols-2 gap-4 max-w-200 mx-auto>
  <div v-click bg="white/5" backdrop-blur-sm border="1 solid white/10" rounded-lg p-4>
    <div i-carbon:chat text-3xl mb-2 />
    <div font-semibold>Offene Fragen</div>
    <div text-sm opacity-70 mt-2>
      • Event Schema Evolution<br/>
      • GDPR & Immutable Events<br/>
      • Performance-Optimierung<br/>
      • Event Sourcing vs. CDC
    </div>
  </div>

  <div v-click bg="white/5" backdrop-blur-sm border="1 solid white/10" rounded-lg p-4>
    <div i-carbon:idea text-3xl mb-2 />
    <div font-semibold>Diskussionsthemen</div>
    <div text-sm opacity-70 mt-2>
      • Banking-System Use Case<br/>
      • Bounded Context Strategie<br/>
      • Testing-Ansätze<br/>
      • Eure Erfahrungen
    </div>
  </div>
</div>

<!--
**Diskussionsthesen mit Moderations-Impulsen:**

1. **Die Snapshot-Falle**
"Event Sourcing mit Snapshots ist eigentlich gescheitertes Event Sourcing - wenn Performance nur mit Snapshots geht, hat man das falsche Pattern gewählt."

*Falls Stille:*
- "Lasst mich provozieren: Snapshots sind doch nur Caching. Wenn ich cachen muss, ist mein Design kaputt, oder?"
- "Gegenthese: Kein System kommt ohne Snapshots aus. Auch Git macht Snapshots - wir klonen nicht immer die gesamte History."
- "Konkret: 10.000 Events = kein Problem. 10 Millionen Events = ? Wo zieht ihr die Grenze?"
- "Alternative Perspektive: Vielleicht sind Snapshots nicht Scheitern, sondern einfach pragmatische Architektur?"


2. **DSGVO vs. Immutability**
Ein Nutzer verlangt Löschung nach DSGVO. Team A sagt Crypto-Shredding, Team B sagt das ist Augenwischerei.

*Falls Stille:*
- "Mal ehrlich: Wenn der Schlüssel weg ist, aber die verschlüsselten Events noch da sind - ist das gelöscht oder nur versteckt?"
- "Juristen-Perspektive: DSGVO verlangt Löschung. Steht da 'unleserlich machen' oder wirklich 'löschen'?"
- "Technische Frage: Wenn ich neu projizieren will, aber 30% der Events sind verschlüsselt ohne Key - funktioniert mein System noch?"
- "Radikale Idee: Events ohne PIIs designen. 'UserCreated' enthält nur UUID, Name kommt in separate Projektion. Ist das überhaupt praktikabel?"
- "Edge Case: Was wenn in Event-Metadaten (Timestamps, Korrelations-IDs) auch PIIs stecken? Habt ihr das bedacht?"


3. **CDC vs. Event Sourcing - Der Pragmatiker-Einwand**
"CDC ist Event Sourcing für Arme - und für 80% ausreichend. Warum die Komplexität?"

*Falls Stille:*
- "Devil's Advocate: Postgres hat WAL-Logs. Debezium liest die aus. Fertig ist die Event-Historie. Was kann Event Sourcing, das CDC nicht kann?"
- "Intent vs. State: CDC sagt 'Balance = 100'. Event Sourcing sagt 'DepositMade(100)' oder 'FeesCharged(100)'. Macht das wirklich einen Unterschied?"
- "Use Case Challenge: Nennt mir ein Beispiel, wo CDC definitiv scheitert und Event Sourcing zwingend ist."
- "Gegenargument: CDC ist abhängig von DB-Implementierung. Event Sourcing ist Business-getrieben. Ist das relevant oder akademisch?"
- "Kompromiss: Event Sourcing für Bounded Contexts, CDC für Integrationen. Best of both worlds?"


4. **Die Upcasting-Hölle**
Nach 3 Jahren: 15 Event-Versionen, komplexe Upcasting-Chains, Debugging-Albtraum.

*Falls Stille:*
- "Horror-Szenario: 'CustomerAddressChanged_v1' → v2 → v3 ... → v15. Wer debugged das noch?"
- "Strategie 1: Weak Schema. Events als JSON, alte Felder optional. Klingt nach Tech Debt, oder ist das pragmatisch?"
- "Strategie 2: Events nie ändern, nur neue Events hinzufügen. 'CustomerAddressChanged' und 'CustomerAddressChangedV2' parallel. Ist das besser oder schlimmer?"
- "Code-Frage: Wer wartet den Upcasting-Code? Das Team, das die Events ursprünglich geschrieben hat, ist längst weg."
- "Snapshotting as Escape Hatch: Nach 2 Jahren einen Snapshot machen und alte Events 'vergessen'. Ist das Betrug oder clever?"
- "Realität-Check: Wie viele hier haben Event Sourcing > 2 Jahre produktiv? Wie habt ihr Event-Evolution gehandhabt?"
-->

---

<div text-left max-w-200 mx-auto text-sm>

<div mb-4>
  <div font-semibold mb-2>Hauptquellen</div>
  <div opacity-80 space-y-1>
    <div>[1] B. Stopford, "Designing Event-Driven Systems", O'Reilly Media, 2018</div>
    <div>[2] M. Fowler, "Event Sourcing", MartinFowler.com, 2005</div>
    <div>[3] Microsoft, "Event Sourcing pattern", Azure Architecture Center</div>
    <div>[4] Microsoft, "CQRS pattern", Azure Architecture Center</div>
  </div>
</div>

<div mb-4>
  <div font-semibold mb-2>Weiterführende Ressourcen</div>
  <div opacity-80 space-y-1>
    <div>[5] Event Store Ltd., "Event Store Documentation", EventStore.com</div>
    <div>[6] Confluent, "Event Sourcing with Apache Kafka", Confluent Blog</div>
    <div>[7] E. Wolff, "Events, Event Sourcing und CQRS", YouTube, 2023</div>
  </div>
</div>

<div>
  <div font-semibold mb-2>Frameworks & Tools</div>
  <div opacity-80 space-y-1>
    <div>• Axon Framework - axoniq.io</div>
    <div>• EventStore DB - eventstore.com</div>
    <div>• Apache Kafka - kafka.apache.org</div>
  </div>
</div>

</div>

---
layout: center
class: text-center
---

# Vielen Dank!

<div mt-8 text-xl opacity-80>
  Fragen? Diskussion? Feedback?
</div>

<div mt-12 flex justify-center>
  <div v-click flex flex-col items-center>
    <div i-ri:github-fill text-5xl mb-3 />
    <div text-base opacity-80>github.com/lucawalz/event-sourcing</div>
  </div>
</div>

<div mt-12 text-sm opacity-60>
  Event Sourcing: Von Zuständen zu Ereignissen
</div>

<!--
Vielen Dank für die spannende Diskussion! Event Sourcing ist definitiv kein einfaches Pattern, aber für die richtigen Use Cases sehr wertvoll. Denkt daran: Nutzt es bewusst, nicht dogmatisch. Gibt es noch letzte Fragen?
-->
