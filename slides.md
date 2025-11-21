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

**What (30 Sek):**
Event Sourcing speichert nicht den aktuellen Zustand unserer Daten, sondern die komplette Historie aller Zustandsänderungen als Sequenz von Events. Statt zu sagen 'Martins Konto hat 110€', speichern wir 'Martin hat 100€ eingezahlt, dann 10€ hinzugefügt'.

**Why (45 Sek):**
Warum ist das relevant? Stellen wir uns vor: Ein Kunde ruft bei einer Bank an und sagt, sein Kontostand sei falsch. Mit traditionellen CRUD-Systemen sehen wir nur den aktuellen Wert - aber nicht, wie wir dorthin gekommen sind. Die Historie ist verloren. Bei regulatorischen Anforderungen, Audits oder Fehleranalysen ist das ein massives Problem.

**How - Roadmap (30 Sek):**
In den nächsten 20 Minuten werden wir sehen:
1. Was genau das Problem mit traditioneller Speicherung ist
2. Wie Event Sourcing funktioniert
3. Ein praktisches Code-Beispiel
4. Wann dieses Pattern Sinn macht - und wann nicht
5. Anschließend haben wir 10 Minuten für eine moderierte Diskussion.
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
- Compliance: GDPR, SOX - Nachweispflicht über Datenänderungen

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

<div mt-6 />

<div
  v-click
  border="2 solid green-800" bg="green-800/20"
  rounded-lg p-6 mb-6
>
  <div flex items-center gap-3 mb-4>
    <div i-carbon:document-tasks text-green-300 text-3xl />
    <div>
      <div font-bold text-xl>Definition</div>
      <div text-sm opacity-70 mt-1>Alle Änderungen am Application State werden als Sequenz von Events gespeichert</div>
    </div>
  </div>
  <div bg="green-900/30" rounded-lg p-4>
    <div text-sm>
      <span font-semibold>Die Events sind unser 'System of Record'</span> - die einzige Quelle der Wahrheit. Statt den aktuellen Zustand zu überschreiben, speichern wir jede Zustandsänderung als separates, unveränderliches Event.
    </div>
  </div>
</div>

<div grid grid-cols-2 gap-6>
  <div
    v-click
    border="2 solid red-800" bg="red-800/20"
    rounded-lg overflow-hidden
  >
    <div bg="red-800/40" px-4 py-2 flex items-center>
      <div i-carbon:close text-red-300 text-xl mr-2 />
      <span font-bold>Traditionelles System</span>
    </div>
    <div px-4 py-3>
      <div font-mono text-xs bg="black/30" rounded-lg p-3>
        <div text-blue-300>// Ship Object</div>
        <div>location = "San Francisco"</div>
        <div mt-2 text-yellow-300>// Ship moves</div>
        <div>location = "Hong Kong"</div>
        <div mt-2 text-red-400>// Previous location lost!</div>
      </div>
      <div mt-3 flex items-center gap-2 text-sm text-red-300>
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
    <div bg="green-800/40" px-4 py-2 flex items-center>
      <div i-carbon:checkmark-outline text-green-300 text-xl mr-2 />
      <span font-bold>Event Sourcing</span>
    </div>
    <div px-4 py-3>
      <div font-mono text-xs bg="black/30" rounded-lg p-3>
        <div text-green-300>// Event Stream</div>
        <div>Event 1: ShipDepartedFrom</div>
        <div>  location: "San Francisco"</div>
        <div>  time: 10:00</div>
        <div mt-2>Event 2: ShipArrivedAt</div>
        <div>  location: "Hong Kong"</div>
        <div>  time: 15:00</div>
        <div mt-2 text-green-400>// All events preserved!</div>
      </div>
      <div mt-3 flex items-center gap-2 text-sm text-green-300>
        <div i-carbon:checkmark-outline />
        <span>Vollständige Historie</span>
      </div>
    </div>
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

<div mt-6 />

<div grid grid-cols-2 gap-4>
  <div
    v-click="1"
    border="2 solid blue-800" bg="blue-800/20"
    rounded-lg overflow-hidden
    transition duration-500 ease-in-out
    :class="$clicks < 1 ? 'opacity-0 translate-y-20' : 'opacity-100 translate-y-0'"
  >
    <div bg="blue-800/40" px-4 py-2 flex items-center>
      <div i-carbon:document text-blue-300 text-xl mr-2 />
      <span font-bold>1. Events</span>
    </div>
    <div px-4 py-3>
      <div text-sm mb-2>Unveränderbare Fakten über etwas, das passiert IST</div>
      <div font-mono text-xs bg="black/30" rounded-lg p-2 mb-2>
        <div text-green-400>✅ OrderPlaced</div>
        <div text-green-400>✅ PaymentReceived</div>
        <div text-green-400>✅ ItemShipped</div>
        <div mt-1 text-red-400>❌ PlaceOrder (Command!)</div>
      </div>
      <div text-xs opacity-70>
        Enthalten: Event-Typ, Timestamp, Aggregate-ID, Event-Daten, Metadaten
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
    <div bg="purple-800/40" px-4 py-2 flex items-center>
      <div i-carbon:data-base text-purple-300 text-xl mr-2 />
      <span font-bold>2. Event Store</span>
    </div>
    <div px-4 py-3>
      <div text-sm mb-2>Append-Only Log - wie ein Hauptbuch</div>
      <div flex items-center gap-2 mb-2>
        <div i-carbon:add text-green-400 />
        <span text-xs>Nur hinzufügen</span>
      </div>
      <div flex items-center gap-2 mb-2>
        <div i-carbon:close text-red-400 />
        <span text-xs>Niemals ändern oder löschen</span>
      </div>
      <div text-xs opacity-70 mt-2>
        Implementierungen: EventStore DB, Kafka, Cosmos DB, PostgreSQL
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
    <div bg="green-800/40" px-4 py-2 flex items-center>
      <div i-carbon:view text-green-300 text-xl mr-2 />
      <span font-bold>3. Projektionen / Read Models</span>
    </div>
    <div px-4 py-3>
      <div text-sm mb-2>Materialisierte Ansichten des aktuellen Zustands</div>
      <div font-mono text-xs bg="black/30" rounded-lg p-2>
        <div>Events → Projektion</div>
        <div>→ Read Model (SQL/NoSQL)</div>
      </div>
      <div text-xs opacity-70 mt-2>
        Ermöglicht schnelle Queries ohne Event Replay
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
    <div bg="yellow-800/40" px-4 py-2 flex items-center>
      <div i-carbon:replay text-yellow-300 text-xl mr-2 />
      <span font-bold>4. Event Replay</span>
    </div>
    <div px-4 py-3>
      <div text-sm mb-2>Die Superkraft von Event Sourcing</div>
      <div flex flex-col gap-1 text-xs>
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

<div mt-6 />

<div grid grid-cols-2 gap-6>
  <div
    v-click
    border="2 solid cyan-800" bg="cyan-800/20"
    rounded-lg overflow-hidden
  >
    <div bg="cyan-800/40" px-4 py-2 flex items-center>
      <div i-carbon:network-3 text-cyan-300 text-xl mr-2 />
      <span font-bold>Event-Driven Architecture</span>
    </div>
    <div px-4 py-3>
      <div text-sm mb-3>Kommunikationsmuster zwischen Services</div>
      <div font-mono text-xs bg="black/30" rounded-lg p-3 mb-3>
        <div>Service A → OrderPlaced</div>
        <div>Service B ← subscribes</div>
        <div>Service C ← subscribes</div>
      </div>
      <div flex flex-col gap-2 text-xs>
        <div flex items-center gap-2>
          <div i-carbon:checkmark-outline text-green-400 />
          <span>Lose Kopplung</span>
        </div>
        <div flex items-center gap-2>
          <div i-carbon:checkmark-outline text-green-400 />
          <span>Asynchrone Kommunikation</span>
        </div>
        <div flex items-center gap-2>
          <div i-carbon:checkmark-outline text-green-400 />
          <span>Service-zu-Service</span>
        </div>
      </div>
    </div>
  </div>

  <div
    v-click
    border="2 solid green-800" bg="green-800/20"
    rounded-lg overflow-hidden
  >
    <div bg="green-800/40" px-4 py-2 flex items-center>
      <div i-carbon:data-base text-green-300 text-xl mr-2 />
      <span font-bold>Event Sourcing</span>
    </div>
    <div px-4 py-3>
      <div text-sm mb-3>Persistenzmuster innerhalb eines Service</div>
      <div font-mono text-xs bg="black/30" rounded-lg p-3 mb-3>
        <div>Command → Event</div>
        <div>Event → Event Store</div>
        <div>Event Store → State</div>
      </div>
      <div flex flex-col gap-2 text-xs>
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
  mt-6 border="2 solid indigo-800" bg="indigo-800/20"
  rounded-lg overflow-hidden
>
  <div bg="indigo-800/40" px-4 py-2 flex items-center>
    <div i-carbon:connection-signal text-indigo-300 text-xl mr-2 />
    <span font-bold>CQRS - Command Query Responsibility Segregation</span>
  </div>
  <div px-4 py-3 grid grid-cols-2 gap-4>
    <div>
      <div font-semibold text-sm mb-2>Write Side</div>
      <div font-mono text-xs bg="black/30" rounded-lg p-2>
        <div>Commands → Events</div>
        <div>→ Event Store</div>
      </div>
    </div>
    <div>
      <div font-semibold text-sm mb-2>Read Side</div>
      <div font-mono text-xs bg="black/30" rounded-lg p-2>
        <div>Events → Projektionen</div>
        <div>→ Read Models</div>
      </div>
    </div>
    <div col-span-2 text-xs opacity-70 mt-2>
      Trennung ermöglicht separate Skalierung, führt aber zu Eventual Consistency
    </div>
  </div>
</div>

<!--
**Einordnung (30 Sek):**
Bevor wir ins Code-Beispiel gehen, wichtige Abgrenzung: Event Sourcing ist NICHT das gleiche wie Event-Driven Architecture, wird aber oft verwechselt.

**Event-Driven Architecture (45 Sek):**
Event-Driven Architecture ist ein Kommunikationsmuster zwischen Services. Services kommunizieren über Events - z.B. 'OrderPlaced' wird published, andere Services reagieren darauf. Das System ist lose gekoppelt.

Event Sourcing dagegen ist ein Persistenzmuster INNERHALB eines Service. Es geht darum, WIE wir Daten speichern, nicht wie Services kommunizieren.
[Quelle: Stopford unterscheidet zwischen "Event Collaboration" (EDA) und "Event Sourcing" (Persistenz)]

**CQRS Connection (45 Sek):**
Event Sourcing wird oft mit CQRS kombiniert - Command Query Responsibility Segregation. Die Idee: Write-Model und Read-Model trennen.

Mit Event Sourcing:
- Commands erzeugen Events → Event Store (Write Side)
- Events werden projiziert → Read Models (Query Side)

Diese Trennung bringt Performance-Vorteile durch separate Skalierung, führt aber zu Eventual Consistency.
[Quelle: Microsoft CQRS Pattern; Wolff Video zu CQRS & Event Sourcing]
-->

---
class: py-10
glowSeed: 220
---

# Beispiel-Szenario: E-Commerce Bestellsystem

<span>Ein praktisches Beispiel für Event Sourcing</span>

<div mt-6 />

<div grid grid-cols-2 gap-6>
  <div
    v-click
    border="2 solid blue-800" bg="blue-800/20"
    rounded-lg overflow-hidden
  >
    <div bg="blue-800/40" px-4 py-2 flex items-center>
      <div i-carbon:shopping-cart text-blue-300 text-xl mr-2 />
      <span font-bold>Warum dieses Beispiel?</span>
    </div>
    <div px-4 py-3 flex flex-col gap-2>
      <div flex items-center gap-2>
        <div i-carbon:checkmark-outline text-green-400 />
        <span text-sm>Audit-Anforderungen</span>
      </div>
      <div flex items-center gap-2>
        <div i-carbon:checkmark-outline text-green-400 />
        <span text-sm>Komplexe Zustandsübergänge</span>
      </div>
      <div flex items-center gap-2>
        <div i-carbon:checkmark-outline text-green-400 />
        <span text-sm>Mehrere Akteure (Customer, Warehouse, Payment)</span>
      </div>
    </div>
  </div>

  <div
    v-click
    border="2 solid green-800" bg="green-800/20"
    rounded-lg overflow-hidden
  >
    <div bg="green-800/40" px-4 py-2 flex items-center>
      <div i-carbon:document text-green-300 text-xl mr-2 />
      <span font-bold>Event-Typen</span>
    </div>
    <div px-4 py-3>
      <div font-mono text-xs bg="black/30" rounded-lg p-2>
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
  mt-6 border="2 solid purple-800" bg="purple-800/20"
  rounded-lg overflow-hidden
>
  <div bg="purple-800/40" px-4 py-2 flex items-center>
    <div i-carbon:event-schedule text-purple-300 text-xl mr-2 />
    <span font-bold>Event Stream Beispiel</span>
  </div>
  <div px-4 py-3>
    <div font-mono text-sm bg="black/30" rounded-lg p-4>
      <div flex items-center gap-3>
        <span text-zinc-500>10:00</span>
        <div i-carbon:arrow-right text-green-400 />
        <span text-green-400>OrderCreated</span>
        <span text-zinc-400>(orderId: 123, customer: "Martin")</span>
      </div>
      <div flex items-center gap-3 mt-2>
        <span text-zinc-500>10:01</span>
        <div i-carbon:arrow-right text-blue-400 />
        <span text-blue-400>ItemAdded</span>
        <span text-zinc-400>(orderId: 123, product: "Laptop", qty: 1)</span>
      </div>
      <div flex items-center gap-3 mt-2>
        <span text-zinc-500>10:02</span>
        <div i-carbon:arrow-right text-blue-400 />
        <span text-blue-400>ItemAdded</span>
        <span text-zinc-400>(orderId: 123, product: "Mouse", qty: 1)</span>
      </div>
      <div flex items-center gap-3 mt-2>
        <span text-zinc-500>10:05</span>
        <div i-carbon:arrow-right text-yellow-400 />
        <span text-yellow-400>PaymentReceived</span>
        <span text-zinc-400>(orderId: 123, amount: 1050€)</span>
      </div>
      <div flex items-center gap-3 mt-2>
        <span text-zinc-500>11:00</span>
        <div i-carbon:arrow-right text-purple-400 />
        <span text-purple-400>OrderShipped</span>
        <span text-zinc-400>(orderId: 123, tracking: "DHL123")</span>
      </div>
    </div>
    <div mt-3 text-xs opacity-70 flex items-center gap-2>
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

<div mt-4></div>

<div grid="~ cols-2 gap-4">
  <div v-click>
    <div text-sm font-semibold mb-2>Event Definition</div>

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
    <div text-sm font-semibold mb-2>Event Store mit Concurrency Control</div>

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

<div v-click mt-4 bg="yellow-800/20" border="2 solid yellow-800" rounded-lg p-3>
  <div flex items-center gap-2>
    <div i-carbon:warning-alt text-yellow-300 text-xl></div>
    <span font-semibold>Kritisch:</span>
    <span text-sm>expectedVersion verhindert konkurrierende Schreibvorgänge - ähnlich wie Optimistic Locking</span>
  </div>
</div>

<!--
**Event Definition (60 Sek):**
Zunächst definieren wir Events als einfache Datenklassen:

Wichtig: Events sind immutable - keine Setter! Alle Daten werden im Konstruktor gesetzt.

**Event Store mit Concurrency Control (90 Sek):**
Der Event Store ist Append Only - aber mit einer wichtigen Ergänzung für Concurrency Control:

Kritisch: expectedVersion verhindert konkurrierende Schreibvorgänge - ähnlich wie Optimistic Locking in traditionellen Systemen. Wenn zwei Prozesse gleichzeitig schreiben, schlägt einer fehl.
[Quelle: Stopford, Chapter 11: "Identity and Concurrency Control"]
-->

---
class: py-10
glowSeed: 275
---

# Code-Beispiel Teil 2: State Reconstruction

<span>Vom Event Stream zum aktuellen Zustand</span>

<div mt-4></div>

<div grid="~ cols-2 gap-4">
  <div v-click>
    <div text-sm font-semibold mb-2>Event Replay Pattern</div>

```java
public class Order {
    private UUID orderId;
    private String customerId;
    private List<OrderItem> items = new ArrayList<>();
    private OrderStatus status;
    private long version = 0;
    
    // Reconstruct from events
    public static Order fromEvents(List<DomainEvent> events) {
        Order order = new Order();
        for (DomainEvent event : events) {
            order.apply(event);
        }
        return order;
    }
    
    // Apply single event
    private void apply(DomainEvent event) {
        if (event instanceof OrderCreatedEvent e) {
            this.orderId = e.getAggregateId();
            this.customerId = e.getCustomerId();
            this.status = OrderStatus.CREATED;
        } else if (event instanceof ItemAddedEvent e) {
            this.items.add(new OrderItem(e.getProductId(), e.getQuantity()));
        } else if (event instanceof OrderShippedEvent e) {
            this.status = OrderStatus.SHIPPED;
        }
        this.version++;
    }
}
```

  </div>

  <div v-click>
    <div text-sm font-semibold mb-2>Snapshots für Performance</div>

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

<div mt-3 bg="green-800/20" border="2 solid green-800" rounded-lg p-3>
  <div text-xs>
    <div flex items-center gap-2 mb-1>
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
**Konzept (30 Sek):**
Um den aktuellen Zustand zu erhalten, spielen wir alle Events ab. Das nennt man Event Replay oder Rehydration.

**Code - Apply Pattern (90 Sek):**
Jedes Event wird sequenziell auf den State angewendet. Am Ende haben wir den aktuellen Zustand.
[Quelle: Fowler: Event processing logic in domain model]

**Snapshots für Performance (60 Sek):**
Bei tausenden Events wäre es langsam, alle abzuspielen. Deswegen nutzt man Snapshots - man speichert den State periodisch und spielt nur neuere Events ab.
[Quelle: Fowler: "Application State Storage"]
-->

---
class: py-10
clicks: 8
glowSeed: 300
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
class: py-10
glowSeed: 325
---

# Saga Pattern: Verteilte Transaktionen

<span>Event Sourcing in Microservices</span>

<div mt-4 />

<div grid grid-cols-2 gap-6>
  <div
    v-click
    border="2 solid red-800" bg="red-800/20"
    rounded-lg overflow-hidden
  >
    <div bg="red-800/40" px-4 py-2 flex items-center>
      <div i-carbon:warning-alt text-red-300 text-xl mr-2 />
      <span font-bold>Das Problem</span>
    </div>
    <div px-4 py-3>
      <div text-sm mb-3>
        Wie koordinieren wir Transaktionen über mehrere Services hinweg?
      </div>
      <div bg="red-900/30" rounded-lg p-3 text-xs>
        <div flex items-center gap-2 mb-1>
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
    <div bg="green-800/40" px-4 py-2 flex items-center>
      <div i-carbon:checkmark-outline text-green-300 text-xl mr-2 />
      <span font-bold>Die Lösung: Saga</span>
    </div>
    <div px-4 py-3>
      <div text-sm mb-3>
        Sequenz von lokalen Transaktionen, koordiniert über Events
      </div>
      <div bg="green-900/30" rounded-lg p-3 text-xs>
        <div>Bei Fehler: Kompensierende Transaktionen</div>
        <div mt-2 text-yellow-300>
          ⚠️ Kompensationen sind NEUE Events, nicht Rückgängig-machen!
        </div>
      </div>
    </div>
  </div>
</div>

<div v-click mt-4 grid grid-cols-2 gap-4>
  <div border="2 solid blue-800" bg="blue-800/20" rounded-lg overflow-hidden>
    <div bg="blue-800/40" px-3 py-2 font-bold text-sm>Erfolgsfall</div>
    <div px-3 py-3>
      <div font-mono text-xs bg="black/30" rounded-lg p-2>
        <div text-green-400>1. OrderCreated</div>
        <div text-green-400>2. PaymentProcessed</div>
        <div text-green-400>3. ItemsShipped</div>
        <div mt-2 text-zinc-500>✓ Alles erfolgreich</div>
      </div>
    </div>
  </div>

  <div border="2 solid yellow-800" bg="yellow-800/20" rounded-lg overflow-hidden>
    <div bg="yellow-800/40" px-3 py-2 font-bold text-sm>Fehlerfall mit Kompensation</div>
    <div px-3 py-3>
      <div font-mono text-xs bg="black/30" rounded-lg p-2>
        <div text-green-400>1. OrderCreated</div>
        <div text-green-400>2. PaymentProcessed</div>
        <div text-red-400>3. ShippingFailed ❌</div>
        <div mt-2 text-yellow-400>→ PaymentRefunded</div>
        <div text-yellow-400>→ OrderCancelled</div>
      </div>
    </div>
  </div>
</div>

<div v-click mt-4 grid grid-cols-2 gap-4>
  <div border="2 solid purple-800" bg="purple-800/20" rounded-lg p-3>
    <div font-bold text-sm mb-2>Choreographie</div>
    <div text-xs opacity-70 mb-2>Services reagieren auf Events</div>
    <div flex items-center gap-2 text-xs>
      <div i-carbon:checkmark-outline text-green-400 />
      <span>Dezentral, lose gekoppelt</span>
    </div>
    <div flex items-center gap-2 text-xs>
      <div i-carbon:close text-red-400 />
      <span>Schwer zu überwachen</span>
    </div>
  </div>

  <div border="2 solid indigo-800" bg="indigo-800/20" rounded-lg p-3>
    <div font-bold text-sm mb-2>Orchestrierung</div>
    <div text-xs opacity-70 mb-2>Saga-Koordinator steuert zentral</div>
    <div flex items-center gap-2 text-xs>
      <div i-carbon:checkmark-outline text-green-400 />
      <span>Leichter zu verstehen</span>
    </div>
    <div flex items-center gap-2 text-xs>
      <div i-carbon:close text-red-400 />
      <span>Single Point of Failure</span>
    </div>
  </div>
</div>

<!--
**Problem (30 Sek):**
In Microservices haben wir ein fundamentales Problem: Wie koordinieren wir Transaktionen über mehrere Services hinweg? Verteilte ACID-Transaktionen funktionieren nicht - zu langsam, zu fehleranfällig.

**Was ist eine Saga? (60 Sek):**
Eine Saga ist eine Sequenz von lokalen Transaktionen, koordiniert über Events. Wenn eine Transaktion fehlschlägt, werden kompensierende Transaktionen ausgeführt.

Beispiel: Order-Service → Payment-Service → Shipping-Service

Erfolgsfall:
- OrderCreated → PaymentProcessed → ItemsShipped

Fehlerfall:
- OrderCreated → PaymentProcessed → ShippingFailed
- → PaymentRefunded ← Kompensation!
- → OrderCancelled ← Kompensation!

Wichtig: Kompensationen sind NEUE Events, nicht das Rückgängig-machen alter Events. Events bleiben immutable!

**Zwei Ansätze (60 Sek):**

Choreographie: Services reagieren auf Events und publishen neue Events. Dezentral, lose gekoppelt - aber schwer zu überwachen und zu debuggen. Wer ist verantwortlich für den Gesamtablauf?

Orchestrierung: Ein Saga-Koordinator steuert den Ablauf zentral. Leichter zu verstehen und zu monitoren - aber Single Point of Failure und zentrale Abhängigkeit.
[Quelle: Stopford diskutiert beide Ansätze im Kontext von Event-Driven Systems]

**Verbindung zu Event Sourcing (30 Sek):**
Event Sourcing ist perfekt für Sagas, weil:
- Events die natürliche Kommunikation sind
- Der Event Store die Historie jeder Saga speichert
- Wir bei Fehlern die komplette Saga-Historie haben für Debugging
-->

---
class: py-10
glowSeed: 350
---

# Event Sourcing in der Praxis

<span>Tools, Frameworks und der pragmatische Ansatz</span>

<div mt-4 />

<div grid grid-cols-2 gap-6>
  <div
    v-click
    border="2 solid blue-800" bg="blue-800/20"
    rounded-lg overflow-hidden
  >
    <div bg="blue-800/40" px-4 py-2 flex items-center>
      <div i-carbon:tools text-blue-300 text-xl mr-2 />
      <span font-bold>Frameworks & Tools</span>
    </div>
    <div px-4 py-3 flex flex-col gap-2>
      <div flex items-center gap-2>
        <div i-logos:java text-xl />
        <div text-sm>
          <span font-semibold>Axon Framework</span>
          <div text-xs opacity-70>Full-featured CQRS + Event Sourcing</div>
        </div>
      </div>
      <div flex items-center gap-2>
        <div i-carbon:data-base text-purple-300 text-xl />
        <div text-sm>
          <span font-semibold>EventStore DB</span>
          <div text-xs opacity-70>Spezialisierte Event-Datenbank</div>
        </div>
      </div>
      <div flex items-center gap-2>
        <div i-logos:kafka text-xl />
        <div text-sm>
          <span font-semibold>Kafka + Streams</span>
          <div text-xs opacity-70>Distributed Event Log</div>
        </div>
      </div>
      <div flex items-center gap-2>
        <div i-carbon:cloud text-blue-300 text-xl />
        <div text-sm>
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
    <div bg="green-800/40" px-4 py-2 flex items-center>
      <div i-carbon:industry text-green-300 text-xl mr-2 />
      <span font-bold>Industrie-Beispiele</span>
    </div>
    <div px-4 py-3 flex flex-col gap-2>
      <div>
        <div flex items-center gap-2 mb-1>
          <div i-carbon:finance text-yellow-300 />
          <span font-semibold text-sm>Banking</span>
        </div>
        <div text-xs opacity-70>Transaktionshistorie mit vollständigem Audit-Trail</div>
      </div>
      <div>
        <div flex items-center gap-2 mb-1>
          <div i-carbon:shopping-cart text-green-300 />
          <span font-semibold text-sm>E-Commerce</span>
        </div>
        <div text-xs opacity-70>Order Management & Customer Support</div>
      </div>
      <div>
        <div flex items-center gap-2 mb-1>
          <div i-carbon:iot-platform text-blue-300 />
          <span font-semibold text-sm>IoT-Systeme</span>
        </div>
        <div text-xs opacity-70>Sensor-Daten als Time-Series</div>
      </div>
      <div>
        <div flex items-center gap-2 mb-1>
          <div i-carbon:game-console text-purple-300 />
          <span font-semibold text-sm>Gaming</span>
        </div>
        <div text-xs opacity-70>Player State History & Replay</div>
      </div>
    </div>
  </div>
</div>

<div v-click mt-6 bg="yellow-800/20" border="2 solid yellow-800" rounded-lg overflow-hidden>
  <div bg="yellow-800/40" px-4 py-2 flex items-center>
    <div i-carbon:idea text-yellow-300 text-xl mr-2 />
    <span font-bold>Der pragmatische Ansatz: Bounded Contexts</span>
  </div>
  <div px-4 py-3 grid grid-cols-2 gap-4>
    <div>
      <div flex items-center gap-2 mb-2>
        <div i-carbon:checkmark-outline text-green-400 text-xl />
        <span font-semibold text-sm>RICHTIG</span>
      </div>
      <div bg="green-900/30" rounded-lg p-3 text-xs>
        <div mb-1>Event Sourcing in spezifischen Bounded Contexts:</div>
        <div>• Banking → nur Transaktions-Service</div>
        <div>• E-Commerce → nur Order-Service</div>
      </div>
    </div>
    <div>
      <div flex items-center gap-2 mb-2>
        <div i-carbon:close text-red-400 text-xl />
        <span font-semibold text-sm>FALSCH</span>
      </div>
      <div bg="red-900/30" rounded-lg p-3 text-xs>
        <div mb-1>Komplettes System auf Event Sourcing:</div>
        <div>• User-Profile-Service? → CRUD reicht!</div>
        <div>• Product-Catalog? → CRUD reicht!</div>
      </div>
    </div>
  </div>
  <div px-4 pb-3 text-sm opacity-80>
    Nutzt Event Sourcing dort, wo Audit-Trail kritisch ist - nicht überall!
  </div>
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
class: py-10
glowSeed: 375
---

# Fazit: Wann Event Sourcing einsetzen?

<span>Bewusst nutzen, nicht dogmatisch</span>

<div mt-6 />

<div grid grid-cols-2 gap-6>
  <div
    v-click
    border="2 solid green-800" bg="green-800/20"
    rounded-lg overflow-hidden
  >
    <div bg="green-800/40" px-4 py-2 flex items-center>
      <div i-carbon:checkmark-outline text-green-300 text-xl mr-2 />
      <span font-bold>Wann JA?</span>
    </div>
    <div px-4 py-3 flex flex-col gap-2>
      <div flex items-center gap-2>
        <div i-carbon:document-tasks text-green-400 />
        <span text-sm>Hohe Audit-Anforderungen (Banking, Healthcare)</span>
      </div>
      <div flex items-center gap-2>
        <div i-carbon:time text-green-400 />
        <span text-sm>Historie ist kritisch (Compliance, Debugging)</span>
      </div>
      <div flex items-center gap-2>
        <div i-carbon:flow text-green-400 />
        <span text-sm>Komplexe Domains mit Event-basierten Workflows</span>
      </div>
      <div flex items-center gap-2>
        <div i-carbon:cube text-green-400 />
        <span text-sm>In spezifischen Bounded Contexts</span>
      </div>
    </div>
  </div>

  <div
    v-click
    border="2 solid red-800" bg="red-800/20"
    rounded-lg overflow-hidden
  >
    <div bg="red-800/40" px-4 py-2 flex items-center>
      <div i-carbon:close text-red-300 text-xl mr-2 />
      <span font-bold>Wann NEIN?</span>
    </div>
    <div px-4 py-3 flex flex-col gap-2>
      <div flex items-center gap-2>
        <div i-carbon:close text-red-400 />
        <span text-sm>Als Standard-Speichermethode für alle Daten</span>
      </div>
      <div flex items-center gap-2>
        <div i-carbon:close text-red-400 />
        <span text-sm>Für einfache CRUD-Anwendungen</span>
      </div>
      <div flex items-center gap-2>
        <div i-carbon:close text-red-400 />
        <span text-sm>Wenn Team nicht bereit für Komplexität</span>
      </div>
      <div flex items-center gap-2>
        <div i-carbon:close text-red-400 />
        <span text-sm>System-wide ohne klaren Nutzen</span>
      </div>
    </div>
  </div>
</div>

<div v-click mt-6 bg="blue-800/20" border="2 solid blue-800" rounded-lg p-4>
  <div flex items-center gap-3>
    <div i-carbon:idea text-blue-300 text-3xl />
    <div>
      <div font-bold text-lg>Kernaussagen</div>
      <div text-sm opacity-80 mt-2 flex flex-col gap-1>
        <div>• Events sind unveränderlich und bilden die Single Source of Truth</div>
        <div>• Ermöglicht Audit-Trails, Temporal Queries und Event Replay</div>
        <div>• Trade-off: Auditability & Flexibilität vs. Komplexität</div>
        <div>• Nutzt es bewusst in spezifischen Bounded Contexts</div>
      </div>
    </div>
  </div>
</div>

<div v-click mt-4 bg="yellow-800/20" border="2 solid yellow-800" rounded-lg p-3>
  <div flex items-center gap-2>
    <div i-carbon:warning-alt text-yellow-300 text-xl />
    <span text-sm>
      <span font-semibold>Fowler's Warnung:</span> "Es ist schwer, das später zu retrofiten. Aber für die meisten Systeme ist die Komplexität nicht gerechtfertigt."
    </span>
  </div>
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

<div v-click mt-8 text-sm opacity-60>
  10 Minuten moderierte Diskussion
</div>

<!--
**Eröffnung (30 Sek):**
Vielen Dank für eure Aufmerksamkeit! Jetzt ist eure Zeit. Ich habe einige Diskussionsfragen vorbereitet, aber beginnen wir mit euren Fragen. Wer möchte anfangen?

**Vorbereitete Diskussionsfragen:**

1. Banking-System Use Case (2-3 Min)
Stellt euch vor, ihr entwickelt ein Banking-System. Würdet ihr für das gesamte System oder nur für bestimmte Teile Event Sourcing einsetzen? Warum oder warum nicht?

2. GDPR & Immutable Events (2-3 Min)
Ein User fordert sein 'Right to be forgotten' gemäß DSGVO. Events sind aber immutable. Wie löst man das? Ist Event Sourcing überhaupt DSGVO-konform?

3. Performance bei Millionen Events (2 Min)
Ein Aggregate hat Millionen Events über Jahre angesammelt. Wie performant ist Event Replay dann noch? Wann wird das zum Problem?

4. Event Schema Evolution (2 Min)
Ihr habt ein OrderCreated-Event mit Version 1. Jetzt braucht ihr ein neues Feld. Wie ändert man Events, wenn alte Versionen bereits gespeichert sind?

5. Event Sourcing vs. Change Data Capture (2 Min)
Manche argumentieren: Warum nicht einfach Change Data Capture nutzen? DB-Logs geben uns auch die History. Wo liegt der Unterschied zu Event Sourcing?
-->

---

layout: center
class: text-center

---

# Quellenverzeichnis

<div mt-8 text-left max-w-200 mx-auto text-sm>

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

<div mt-12 flex justify-center gap-8>
  <div v-click flex flex-col items-center>
    <div i-carbon:email text-4xl mb-2 />
    <div text-sm opacity-70>ihre.email@example.com</div>
  </div>
  <div v-click flex flex-col items-center>
    <div i-ri:github-fill text-4xl mb-2 />
    <div text-sm opacity-70>github.com/username</div>
  </div>
  <div v-click flex flex-col items-center>
    <div i-carbon:logo-linkedin text-4xl mb-2 />
    <div text-sm opacity-70>linkedin.com/in/username</div>
  </div>
</div>

<div mt-12 text-sm opacity-60>
  Event Sourcing: Von Zuständen zu Ereignissen
</div>

<!--
Vielen Dank für die spannende Diskussion! Event Sourcing ist definitiv kein einfaches Pattern, aber für die richtigen Use Cases sehr wertvoll. Denkt daran: Nutzt es bewusst, nicht dogmatisch. Gibt es noch letzte Fragen?
-->
