# Event Sourcing - Detaillierter Präsentationsablauf

## FOLIE 1: Titel & Motivation (2 Min)

### Visueller Inhalt

- Titel: **Event Sourcing: Von Zuständen zu Ereignissen**
- Untertitel: Ein Architekturmuster für nachvollziehbare Systeme
- Dein Name, Datum
- Hintergrundbild: Zeitstrahl oder Event-Stream Visualisierung

### Sprechnotizen & Ablauf

**Eröffnung (15 Sek):**

> "Guten Tag! Heute möchte ich euch Event Sourcing vorstellen - ein Architekturmuster, das fundamental anders an Datenspeicherung herangeht als traditionelle Systeme."

**What (30 Sek):**

> "Event Sourcing speichert nicht den aktuellen Zustand unserer Daten, sondern die komplette Historie aller Zustandsänderungen als Sequenz von Events. Statt zu sagen 'Martins Konto hat 110€', speichern wir 'Martin hat 100€ eingezahlt, dann 10€ hinzugefügt'."

**Why (45 Sek):**

> "Warum ist das relevant? Stellen wir uns vor: Ein Kunde ruft bei einer Bank an und sagt, sein Kontostand sei falsch. Mit traditionellen CRUD-Systemen sehen wir nur den aktuellen Wert - aber nicht, wie wir dorthin gekommen sind. Die Historie ist verloren. Bei regulatorischen Anforderungen, Audits oder Fehleranalysen ist das ein massives Problem."

**How - Roadmap (30 Sek):**

> "In den nächsten 20 Minuten werden wir sehen:
>
> 1. Was genau das Problem mit traditioneller Speicherung ist
> 2. Wie Event Sourcing funktioniert
> 3. Ein praktisches Code-Beispiel
> 4. Wann dieses Pattern Sinn macht - und wann nicht
> 5. Anschließend haben wir 10 Minuten für eine moderierte Diskussion."

**Übergang:**

> "Also, schauen wir uns zunächst das Problem an."

---

## FOLIE 2: Problemstellung (2-3 Min)

### Visueller Inhalt

- **Links:** Traditionelle DB-Tabelle mit nur aktuellem Zustand (z.B. Order-Tabelle)
- **Rechts:** Fragezeichen: "Wie sind wir hierhin gekommen?"
- Use Cases als Boxen: Banking, E-Commerce, Healthcare, Compliance

### Sprechnotizen & Ablauf

**Problem aufzeigen (60 Sek):**

> "Schauen wir uns an, wie wir normalerweise Daten speichern. In einem typischen E-Commerce-System haben wir eine Order-Tabelle. Wenn eine Bestellung storniert wird, UPDATE wir einfach den Status von 'PLACED' zu 'CANCELLED'. Das ist effizient, das funktioniert - aber wir verlieren Information."

> "Wir können nicht mehr beantworten: WANN wurde storniert? WER hat storniert? WARUM wurde storniert? War die Bestellung vorher vielleicht schon mal 'SHIPPED' und wurde zurückgesendet?"

**Use Cases (60 Sek):**

> "Das wird zum Problem in mehreren Szenarien:"
>
> - **Banking**: Regulatorische Anforderungen - Banken MÜSSEN jeden Kontowechsel nachweisen können
> - **E-Commerce**: Customer Support - 'Herr Müller beschwert sich, dass seine Bestellung nie ankam' - was ist passiert?
> - **Healthcare**: Audit Trail - Wer hat wann welche Medikamentendosis geändert?
> - **Compliance**: GDPR, SOX - Nachweispflicht über Datenänderungen

**Zentrale Frage (30 Sek):**

> "Die zentrale Frage ist also: **Wie können wir nicht nur SEHEN wo wir sind, sondern auch verstehen, WIE wir dorthin gekommen sind?**"
> [Quelle: [4] - Fowler formuliert es: "We can query an application's state to find out the current state of the world, and this answers many questions. However there are times when we don't just want to see where we are, we also want to know how we got there."]

**Übergang:**

> "Genau hier setzt Event Sourcing an. Schauen wir uns die Lösung an."

---

## FOLIE 3: Was ist Event Sourcing? (2-3 Min)

### Visueller Inhalt

- **Zentral:** Definition-Box
- **Links:** Traditionelles CRUD (State übergeschrieben)
- **Rechts:** Event Sourcing (Event Stream)
- Visualisierung: Timeline mit Events vs. Datenbank mit einem Record

### Sprechnotizen & Ablauf

**Definition (45 Sek):**

> "Event Sourcing definiert einen fundamentally anderen Ansatz: Alle Änderungen am Application State werden als Sequenz von Events gespeichert."
> [Quelle: [4] - Fowler: "Event Sourcing ensures that all changes to application state are stored as a sequence of events."]

> "Was heißt das konkret? Statt den aktuellen Zustand zu überschreiben, speichern wir jede Zustandsänderung als separates, unveränderliches Event. **Die Events sind unser 'System of Record'** - die einzige Quelle der Wahrheit."
> [Quelle: [1] - Stopford, Chapter 6: "Making Events the Source of Truth"]

**Kernprinzip visualisieren (90 Sek):**

> "Schauen wir uns das im Vergleich an:"

**Traditionelles System:**

> "CRUD-System: Wir haben ein Ship-Objekt mit Location='San Francisco'. Ship bewegt sich nach Hong Kong → wir UPDATEn Location='Hong Kong'. Die vorherige Location ist weg."

**Event Sourcing:**

> "Event Sourcing: Wir schreiben stattdessen:
>
> - Event 1: 'ShipDepartedFrom San Francisco' um 10:00
> - Event 2: 'ShipArrivedAt Hong Kong' um 15:00
>
> Beide Events bleiben PERMANENT gespeichert. Der aktuelle Zustand ergibt sich aus dem Abspielen aller Events."
> [Quelle: [4] - Fowler's Shipping Example]

**Events als Source of Truth (30 Sek):**

> "Der entscheidende Punkt: Die Events sind unsere Wahrheit, nicht der aktuelle Zustand. Der Zustand ist nur eine abgeleitete Projektion - wir können ihn jederzeit neu berechnen."

**Übergang:**

> "Aber wie funktioniert das technisch? Schauen wir uns die Kernkonzepte an."

---

## FOLIE 4: Kernkonzepte (2-3 Min)

### Visueller Inhalt

- Vier Boxen mit Icons:
  1. **Events** (Dokumenten-Icon)
  2. **Event Store** (Datenbank-Icon mit Append-Only-Pfeil)
  3. **Projektionen/Read Models** (Ansichten-Icon)
  4. **Event Replay** (Zurückspulen-Icon)

### Sprechnotizen & Ablauf

**1. Events (45 Sek):**

> "Erstens: Events. Events sind unveränderbare Fakten über etwas, das passiert IST. Wichtig: Past Tense!"

> "Beispiele:
>
> - ✅ 'OrderPlaced', 'PaymentReceived', 'ItemShipped' - korrekt
> - ❌ 'PlaceOrder', 'ReceivePayment' - falsch, das sind Commands
>
> Events beschreiben WAS passiert ist, nicht was passieren soll. Sie enthalten: Event-Typ, Timestamp, Aggregate-ID, Event-Daten und optional Metadaten wie User-ID."

**2. Event Store (45 Sek):**

> "Zweitens: Der Event Store. Das ist ein Append-Only Log - wie ein Hauptbuch in der Buchhaltung. Wir können nur hinzufügen, niemals ändern oder löschen."

> "Technisch kann das implementiert werden als:
>
> - Spezialisierte Datenbanken wie EventStore DB
> - NoSQL-DBs wie Cosmos DB mit Change Feed
> - Kafka als distributed log
> - Oder sogar relationale DBs mit Append-Only-Constraint"
>   [Quelle: [5] - Azure Event Sourcing Patterns]

**3. Projektionen/Read Models (45 Sek):**

> "Drittens: Projektionen. Wir können nicht jedes Mal alle Events abspielen, wenn jemand Daten abfragen will. Deswegen erstellen wir Read Models - materialisierte Ansichten des aktuellen Zustands."
> [Quelle: [1] - Stopford, Chapter 6: "Materialized Views"]

> "Diese werden durch Event Replay aufgebaut: Wir nehmen alle Events und 'projizieren' sie in eine abfragbare Form. Wenn sich Requirements ändern, können wir einfach neue Projektionen erstellen."

**4. Event Replay (30 Sek):**

> "Viertens: Event Replay - die Superkraft von Event Sourcing. Wir können:
>
> - Den kompletten State neu aufbauen (Complete Rebuild)
> - Zu jedem Zeitpunkt in der Vergangenheit springen (Temporal Queries)
> - Bugs rückwirkend korrigieren (Event Replay)
> - Neue Features auf historische Daten anwenden"
>   [Quelle: [4] - Fowler: "Complete Rebuild, Temporal Query, Event Replay"]

**Übergang:**

> "Theorie ist gut - aber schauen wir uns an, wie das in der Praxis aussieht."

---

## FOLIE 5: Event-Driven Architecture Kontext (2 Min)

### Visueller Inhalt

- Venn-Diagramm oder Layers:
  - Event-Driven Architecture (äußerer Kreis)
  - Event Sourcing (innerer Kreis)
  - CQRS (überlappend)

### Sprechnotizen & Ablauf

**Einordnung (30 Sek):**

> "Bevor wir ins Code-Beispiel gehen, wichtige Abgrenzung: Event Sourcing ist NICHT das gleiche wie Event-Driven Architecture, wird aber oft verwechselt."

**Event-Driven Architecture (45 Sek):**

> "Event-Driven Architecture ist ein Kommunikationsmuster zwischen Services. Services kommunizieren über Events - z.B. 'OrderPlaced' wird published, andere Services reagieren darauf. Das System ist lose gekoppelt."

> "Event Sourcing dagegen ist ein Persistenzmuster INNERHALB eines Service. Es geht darum, WIE wir Daten speichern, nicht wie Services kommunizieren."
> [Quelle: [1] - Stopford unterscheidet zwischen "Event Collaboration" (EDA) und "Event Sourcing" (Persistenz)]

**CQRS Connection (45 Sek):**

> "Event Sourcing wird oft mit CQRS kombiniert - Command Query Responsibility Segregation. Die Idee: Write-Model und Read-Model trennen."

> "Mit Event Sourcing:
>
> - Commands erzeugen Events → Event Store (Write Side)
> - Events werden projiziert → Read Models (Query Side)
>
> Diese Trennung bringt Performance-Vorteile durch separate Skalierung, führt aber zu Eventual Consistency."
> [Quelle: [8] - Microsoft CQRS Pattern; [2] - Wolff Video zu CQRS & Event Sourcing]

**Übergang:**

> "Genug Theorie. Schauen wir uns an, wie man das konkret implementiert."

---

## FOLIE 6: Beispiel-Szenario: Bestellsystem (2 Min)

### Visueller Inhalt

- Domain Model: Order, Customer, OrderItem
- Event Timeline mit 4-5 Events visualisiert
- Event Store als Log dargestellt

### Sprechnotizen & Ablauf

**Szenario Einführung (30 Sek):**

> "Nehmen wir ein E-Commerce-Bestellsystem. Das ist ein perfektes Beispiel, weil es:
>
> - Audit-Anforderungen hat
> - Komplexe Zustandsübergänge hat
> - Mehrere Akteure involviert (Customer, Warehouse, Payment)"

**Events definieren (60 Sek):**

> "In unserem System könnten folgende Events auftreten:"

```
OrderCreated
  - OrderId: UUID
  - CustomerId: String
  - Timestamp: DateTime

ItemAddedToOrder
  - OrderId: UUID
  - ProductId: String
  - Quantity: int
  - Price: Money

PaymentReceived
  - OrderId: UUID
  - Amount: Money
  - PaymentMethod: String

OrderShipped
  - OrderId: UUID
  - TrackingNumber: String
  - Carrier: String

OrderCancelled
  - OrderId: UUID
  - Reason: String
```

**Event Stream visualisieren (30 Sek):**

> "Wenn jetzt eine Bestellung durchläuft, sehen wir im Event Store:"

```
10:00 → OrderCreated (orderId: 123)
10:01 → ItemAdded (orderId: 123, product: Laptop)
10:02 → ItemAdded (orderId: 123, product: Mouse)
10:05 → PaymentReceived (orderId: 123)
11:00 → OrderShipped (orderId: 123)
```

> "Jedes Event ist unveränderlich und trägt alle nötigen Informationen."

**Übergang:**

> "Schauen wir uns jetzt den Code an, der das umsetzt."

---

## FOLIE 7: Code-Beispiel (Teil 1) - Events & Event Store (2-3 Min)

### Visueller Inhalt

- Code-Snippet: Event-Klassen
- Code-Snippet: Event Store Append-Operation
- Fokus: Append-Only Prinzip & Concurrency Control

### Sprechnotizen & Ablauf

**Event Definition (60 Sek):**

> "Zunächst definieren wir Events als einfache Datenklassen:"

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

> "Wichtig: Events sind immutable - keine Setter! Alle Daten werden im Konstruktor gesetzt."

**Event Store mit Concurrency Control (90 Sek):**

> "Der Event Store ist Append Only - aber mit einer wichtigen Ergänzung für Concurrency Control:"

```java
public interface EventStore {
    // Append event mit Optimistic Locking
    void append(UUID aggregateId, DomainEvent event, long expectedVersion);
    //                            ↑ Verhindert Lost Updates!

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

> "**Kritisch:** `expectedVersion` verhindert konkurrierende Schreibvorgänge - ähnlich wie Optimistic Locking in traditionellen Systemen. Wenn zwei Prozesse gleichzeitig schreiben, schlägt einer fehl."
> [Quelle: [1] - Stopford, Chapter 11: "Identity and Concurrency Control"]

**Übergang:**

> "Aber wie bekommen wir aus Events wieder einen nutzbaren State? Schauen wir uns die Projektion an."

---

## FOLIE 8: Code-Beispiel (Teil 2) - State Reconstruction (2-3 Min)

### Visueller Inhalt

- Code: Event Handler / Apply Method
- Visualisierung: Events → Replay → Current State
- Snapshot-Mechanismus

### Sprechnotizen & Ablauf

**Konzept (30 Sek):**

> "Um den aktuellen Zustand zu erhalten, spielen wir alle Events ab. Das nennt man Event Replay oder Rehydration."

**Code - Apply Pattern (90 Sek):**

```java
public class Order {
    private UUID orderId;
    private String customerId;
    private List<OrderItem> items = new ArrayList<>();
    private OrderStatus status;
    private long version = 0; // Für Concurrency Control

    // Reconstruct state from events
    public static Order fromEvents(List<DomainEvent> events) {
        Order order = new Order();
        for (DomainEvent event : events) {
            order.apply(event);
        }
        return order;
    }

    // Apply single event to state
    private void apply(DomainEvent event) {
        if (event instanceof OrderCreatedEvent e) {
            this.orderId = e.getAggregateId();
            this.customerId = e.getCustomerId();
            this.status = OrderStatus.CREATED;

        } else if (event instanceof ItemAddedEvent e) {
            this.items.add(new OrderItem(e.getProductId(), e.getQuantity()));

        } else if (event instanceof OrderShippedEvent e) {
            this.status = OrderStatus.SHIPPED;

        } else if (event instanceof OrderCancelledEvent e) {
            this.status = OrderStatus.CANCELLED;
        }
        this.version++; // Version hochzählen
    }
}
```

> "Jedes Event wird sequenziell auf den State angewendet. Am Ende haben wir den aktuellen Zustand."
> [Quelle: [4] - Fowler: Event processing logic in domain model]

**Snapshots für Performance (60 Sek):**

```java
// Snapshot
public class OrderSnapshot {
    UUID orderId;
    long version;  // Bei welcher Event-Version
    OrderState state;
}

// State-Rekonstruktion mit Snapshot
public Order getById(UUID orderId) {
    OrderSnapshot snapshot = snapshotStore.getLatest(orderId);

    // Nur Events NACH Snapshot laden
    List<DomainEvent> events = eventStore.getEvents(
        orderId,
        snapshot.version
    );

    Order order = Order.fromSnapshot(snapshot);
    events.forEach(e -> order.apply(e));
    return order;
}
```

> "Bei tausenden Events wäre es langsam, alle abzuspielen. Deswegen nutzt man Snapshots - man speichert den State periodisch und spielt nur neuere Events ab."
> [Quelle: [4] - Fowler: "Application State Storage"]

**Übergang:**

> "Jetzt haben wir gesehen, wie es funktioniert. Aber sollten wir es immer nutzen? Schauen wir uns Vor- und Nachteile an."

---

## FOLIE 9: Wissenschaftliche Evaluation - Vor- und Nachteile (3 Min)

### Visueller Inhalt

- Zwei Spalten: Vorteile | Nachteile
- Trade-off Box zentral
- Pro/Con mit Icons

### Sprechnotizen & Ablauf

**Einleitung (20 Sek):**

> "Event Sourcing ist ein mächtiges Pattern - aber kein Silver Bullet. Schauen wir uns die Trade-offs an."

**Vorteile (90 Sek):**

**1. Vollständige Audit-Historie**

> "Der offensichtlichste Vorteil: Wir haben eine vollständige, unveränderliche Historie. Für regulierte Branchen ist das Gold wert. Jede Änderung ist nachvollziehbar - WAS, WANN, WER."
> [Quelle: [5] - Microsoft: "Complete audit trail and history"]

**2. Temporal Queries**

> "Wir können in die Vergangenheit reisen. 'Wie sah Konto X am 31. Dezember aus?' - Einfach Events bis zu diesem Datum abspielen. Das ist mit CRUD nicht möglich."
> [Quelle: [4] - Fowler: "Temporal Query: We can determine the application state at any point in time"]

**3. Debugging & Reproduzierbarkeit**

> "Production Bug? Wir können die exakte Event-Sequenz in einer Testumgebung abspielen und Schritt für Schritt durchgehen."
> [Quelle: [5] - Azure: "Replay for debugging"]

**4. Flexibilität bei neuen Requirements**

> "Neue Anforderungen? Wir erstellen einfach neue Projektionen aus bestehenden Events. Keine komplexen Datenmigrationen."
> [Quelle: [1] - Stopford: "Polyglot Views" - verschiedene Sichten auf dieselben Events]

**Nachteile (90 Sek):**

**1. Erhöhte Komplexität**

> "Der größte Nachteil: Komplexität. Event Sourcing erfordert ein Umdenken. Das Team muss verstehen, wie man in Events denkt, wie man Projektionen baut, wie man mit Eventual Consistency umgeht."
> [Quelle: [5] - Microsoft: "High cost to migrate to/from event sourcing"]

**2. Eventual Consistency**

> "Write und Read sind getrennt. Nach dem Schreiben eines Events kann es Millisekunden bis Sekunden dauern, bis Projektionen aktualisiert sind. Nicht jede Domain kann damit leben."
> [Quelle: [1] - Stopford, Chapter 11: "Eventual Consistency"]

**3. Event Schema Evolution**

> "Was, wenn sich Event-Struktur ändert? Alte Events existieren ja noch. Wir brauchen Versionierung und Upcasting-Strategien."
> [Quelle: [1] - Stopford, Chapter 13: "Evolving Schemas and Data over Time"]

**4. Storage Overhead**

> "Wir speichern ALLES. Bei High-Volume-Systemen kann das teuer werden. Man muss Archivierungsstrategien haben."

**5. Externe Systeme**

> "Integration mit externen Systemen, die kein Event Sourcing nutzen, ist tricky. Bei Replays dürfen keine echten Aktionen ausgelöst werden."
> [Quelle: [4] - Fowler: "External Updates" Problem]

**6. GDPR "Right to be Forgotten"**

> "Events sind immutable - echtes Löschen ist nicht möglich. Bei personenbezogenen Daten wird das zum Problem. Workarounds: Crypto-Shredding, Tombstone-Events, oder Pseudonymisierung."

**Zusammenfassung (20 Sek):**

> "Der zentrale Trade-off: Event Sourcing kauft uns Auditability und Flexibilität - wir bezahlen mit Komplexität. Microsoft sagt zu Recht: 'Not justified for most systems'."
> [Quelle: [5] - Microsoft Azure Docs]

**Übergang:**

> "Interessant wird es, wenn wir Event Sourcing mit anderen Patterns kombinieren. Schauen wir uns Sagas an."

---

## FOLIE 10: Saga Pattern (2-3 Min)

### Visueller Inhalt

- Microservices mit Events
- Saga als Orchestrator oder Choreographie
- Erfolgsfall vs. Kompensation visualisiert

### Sprechnotizen & Ablauf

**Problem (30 Sek):**

> "In Microservices haben wir ein fundamentales Problem: Wie koordinieren wir Transaktionen über mehrere Services hinweg? Verteilte ACID-Transaktionen funktionieren nicht - zu langsam, zu fehleranfällig."

**Was ist eine Saga? (60 Sek):**

> "Eine Saga ist eine Sequenz von lokalen Transaktionen, koordiniert über Events. Wenn eine Transaktion fehlschlägt, werden kompensierende Transaktionen ausgeführt."

> "Beispiel: Order-Service → Payment-Service → Shipping-Service
>
> **Erfolgsfall:**
>
> - OrderCreated → PaymentProcessed → ItemsShipped
>
> **Fehlerfall:**
>
> - OrderCreated → PaymentProcessed → ShippingFailed
> - → PaymentRefunded ← **Kompensation!**
> - → OrderCancelled ← **Kompensation!**"

> "**Wichtig:** Kompensationen sind NEUE Events, nicht das Rückgängig-machen alter Events. Events bleiben immutable!"

**Zwei Ansätze (60 Sek):**

**Choreographie:**

> "Services reagieren auf Events und publishen neue Events. Dezentral, lose gekoppelt - aber schwer zu überwachen und zu debuggen. Wer ist verantwortlich für den Gesamtablauf?"

**Orchestrierung:**

> "Ein Saga-Koordinator steuert den Ablauf zentral. Leichter zu verstehen und zu monitoren - aber Single Point of Failure und zentrale Abhängigkeit."
> [Quelle: [1] - Stopford diskutiert beide Ansätze im Kontext von Event-Driven Systems]

**Verbindung zu Event Sourcing (30 Sek):**

> "Event Sourcing ist perfekt für Sagas, weil:
>
> - Events die natürliche Kommunikation sind
> - Der Event Store die Historie jeder Saga speichert
> - Wir bei Fehlern die komplette Saga-Historie haben für Debugging"

**Übergang:**

> "Und in der Praxis? Schauen wir uns Tools an."

---

## FOLIE 11: Event Sourcing in der Praxis (2 Min)

### Visueller Inhalt

- Logos/Namen von Frameworks und Tools
- Industrie-Beispiele
- Architektur-Diagramm: Bounded Contexts

### Sprechnotizen & Ablauf

**Frameworks (45 Sek):**

> "Für die Implementierung gibt es etablierte Frameworks:"

> - **Axon Framework (Java)**: Full-featured, CQRS + Event Sourcing out-of-the-box
> - **EventStore DB**: Spezialisierte Datenbank für Event Sourcing
> - **Kafka + Kafka Streams**: Distributed Event Log mit Stream Processing
> - **Azure Cosmos DB + Change Feed**: NoSQL mit Event-Unterstützung
> - **Akka Persistence (Scala/Java)**: Actor Model + Event Sourcing

> [Quellen: [6] EventStore Docs, [7] Confluent Kafka Event Sourcing]

**Industrie-Beispiele (30 Sek):**

> "Wer nutzt Event Sourcing?"
>
> - Banken für Transaktionshistorie (vollständiger Audit-Trail)
> - E-Commerce für Order Management
> - IoT-Systeme für Sensor-Daten (Time-Series Data)
> - Gaming für Player State History und Replay-Funktionen

**Bounded Contexts - Der pragmatische Ansatz (45 Sek):**

> "**Kritisch:** Event Sourcing muss nicht system-wide sein! Das ist ein häufiger Fehler."

> "✅ **RICHTIG:** Event Sourcing in spezifischen Bounded Contexts
>
> - Banking → nur für Transaktions-Service
> - E-Commerce → nur für Order-Service
>
> ❌ **FALSCH:** Komplettes System auf Event Sourcing umstellen
>
> - User-Profile-Service? → CRUD reicht!
> - Product-Catalog? → CRUD reicht!"

> "Nutzt Event Sourcing dort, wo Audit-Trail kritisch ist - nicht überall."

**Übergang:**

> "Fassen wir zusammen."

---

## FOLIE 12: Fazit (2 Min)

### Visueller Inhalt

- Kernaussagen als Bullet Points
- Decision-Tree: Wann Event Sourcing?
- Quellenverzeichnis (Überblick, Details auf Backup-Folien)

### Sprechnotizen & Ablauf

**Zusammenfassung (60 Sek):**

> "Was haben wir gelernt?"

> **Event Sourcing:**
>
> - Speichert Zustandsänderungen als Events, nicht den Zustand selbst
> - Events sind unveränderlich und bilden die Single Source of Truth
> - Ermöglicht Audit-Trails, Temporal Queries und Event Replay
> - Aber: Erhöhte Komplexität und Eventual Consistency

> **Wann einsetzen?**
>
> - ✅ Bei hohen Audit-Anforderungen (Banking, Healthcare)
> - ✅ Wenn Historie kritisch ist (Compliance, Debugging)
> - ✅ Für komplexe Domains mit Event-basierten Workflows
> - ✅ In **spezifischen Bounded Contexts**, nicht system-wide!
> - ❌ NICHT als Standard-Speichermethode für alle Daten
> - ❌ NICHT für einfache CRUD-Anwendungen

**Kritische Distanz (30 Sek):**

> "Wichtig: Event Sourcing ist kein Silver Bullet. Fowler warnt zu Recht: Es ist schwer, das später zu retrofiten. Aber für die meisten Systeme ist die Komplexität nicht gerechtfertigt."
> [Quelle: [4] - Fowler: "When to Use It"]

> "Mein Fazit: Nutzt es bewusst in spezifischen Bounded Contexts, nicht system-wide."

**Offene Fragen für Diskussion (30 Sek):**

> "Einige spannende Themen für unsere Diskussion:"
>
> - Event Schema Evolution & Versionierung
> - GDPR 'Right to be forgotten' mit immutable Events
> - Performance Optimization durch Snapshots
> - Event Sourcing vs. Change Data Capture

**Überleitung zur Diskussion:**

> "Damit kommen wir zu unserem 10-minütigen Diskussionsteil. Ich habe einige Fragen vorbereitet, aber eure Fragen haben Vorrang!"

---

## DISKUSSIONSTEIL (10 Minuten) - Moderationsleitfaden

### Eröffnung (30 Sek)

> "Vielen Dank für eure Aufmerksamkeit! Jetzt ist eure Zeit. Ich habe einige Diskussionsfragen vorbereitet, aber beginnen wir mit euren Fragen. Wer möchte anfangen?"

### Vorbereitete Diskussionsfragen (falls keine Fragen kommen)

#### **Frage 1: Banking-System Use Case (2-3 Min)**

**Frage stellen:**

> "Stellt euch vor, ihr entwickelt ein Banking-System. Würdet ihr für das gesamte System oder nur für bestimmte Teile Event Sourcing einsetzen? Warum oder warum nicht?"

**Erwartete Antworten & Moderation:**

- **Wenn "Ja, überall":** "Interessanter Punkt! Aber braucht der User-Profile-Service wirklich Event Sourcing? Was sind die Kosten?"
- **Wenn "Nur Transaktionen":** "Genau! Das ist der Bounded Context Ansatz. Welche anderen Services könnten davon profitieren?"

**Eigener Standpunkt (falls gefragt):**

> "Meine Meinung: Nur für den Transaktions-Service. Dort ist Audit-Trail gesetzlich vorgeschrieben. User-Profile, Product-Catalog? CRUD reicht völlig. Der Overhead lohnt sich nicht."

---

#### **Frage 2: GDPR & Immutable Events (2-3 Min)**

**Frage stellen:**

> "Ein User fordert sein 'Right to be forgotten' gemäß DSGVO. Events sind aber immutable. Wie löst man das? Ist Event Sourcing überhaupt DSGVO-konform?"

**Erwartete Antworten & Moderation:**

- **Wenn "Einfach löschen":** "Aber dann verlieren wir die Audit-Historie. Regulatoren verlangen oft, dass wir nachweisen können, WER gelöscht wurde - nicht nur dass jemand gelöscht wurde."
- **Wenn "Verschlüsselung":** "Crypto-Shredding - genau! Aber wie managen wir die Keys? Was ist bei Backup-Recovery?"

**Eigener Standpunkt:**

> "Drei Ansätze:
>
> 1. **Crypto-Shredding**: Events verschlüsseln, Schlüssel löschen → Daten unleserlich
> 2. **Tombstone-Events**: `PersonDataDeleted`-Event, Handler ignorieren alte Events
> 3. **Pseudonymisierung**: Keine direkten Personenbezüge in Events
>
> Rechtlich bleibt das eine Grauzone. DSGVO und Event Sourcing passen nicht perfekt zusammen. Manche Datenschutzexperten argumentieren, dass Verschlüsselung ausreicht - andere fordern echtes Löschen."

---

#### **Frage 3: Performance bei Millionen Events (2 Min)**

**Frage stellen:**

> "Ein Aggregate hat Millionen Events über Jahre angesammelt. Wie performant ist Event Replay dann noch? Wann wird das zum Problem?"

**Erwartete Antworten & Moderation:**

- **Wenn "Snapshots":** "Richtig! Wie oft macht man Snapshots? Nach X Events oder nach Zeit?"
- **Wenn "Zu langsam":** "Interessanterweise: Event Stores wie EventStore DB sind für genau das optimiert. Append-Only ist sehr schnell."

**Eigener Standpunkt:**

> "Drei Strategien:
>
> 1. **Snapshots**: State alle 100 Events speichern
> 2. **CQRS Read Models**: Queries gehen nie gegen Event Store, nur gegen Projektionen
> 3. **Event Archivierung**: Alte Events in Cold Storage, nur recent Events hot
>
> LinkedIn nutzt Event Sourcing für Milliarden Events täglich - mit richtiger Architektur skaliert das sehr gut."

---

#### **Frage 4: Event Schema Evolution (2 Min)**

**Frage stellen:**

> "Ihr habt ein `OrderCreated`-Event mit Version 1. Jetzt braucht ihr ein neues Feld. Wie ändert man Events, wenn alte Versionen bereits gespeichert sind?"

**Erwartete Antworten & Moderation:**

- **Wenn "Einfach neues Feld":** "Aber alte Events haben das Feld nicht. Wie handled man das beim Replay?"
- **Wenn "Versionierung":** "Genau! Aber dann müssen Handler mehrere Versionen verstehen."

**Eigener Standpunkt:**

> "Drei Ansätze:
>
> 1. **Upcasting**: Alte Events beim Lesen in neue Version konvertieren
>    ```java
>    OrderCreatedV2 upcast(OrderCreatedV1 old) {
>        return new OrderCreatedV2(old.data, DEFAULT_NEW_FIELD);
>    }
>    ```
> 2. **Versionierung**: Events mit Version-Nummer, Handler unterstützen mehrere Versionen
> 3. **Weak Schema**: Events als JSON, nur bekannte Felder lesen (flexibel aber unsicher)
>
> In der Praxis oft Kombination aus 1 & 2. Das wird aber komplex - deshalb Event-Design von Anfang an wichtig!"

---

#### **Frage 5: Event Sourcing vs. Change Data Capture (2 Min)**

**Frage stellen:**

> "Manche argumentieren: Warum nicht einfach Change Data Capture nutzen? DB-Logs geben uns auch die History. Wo liegt der Unterschied zu Event Sourcing?"

**Erwartete Antworten & Moderation:**

- **Wenn "Kein Unterschied":** "Interessanter Punkt! Aber CDC zeigt uns DB-Changes, nicht Business-Events."
- **Wenn "Intent vs. State":** "Genau! Das ist der Kernunterschied."

**Eigener Standpunkt:**

> "Fundamentaler Unterschied: **Intent vs. State**
>
> **CDC (Change Data Capture):**
>
> - `UPDATE orders SET status='CANCELLED'`
> - Zeigt WAS sich geändert hat, nicht WARUM
> - Technisches Event
>
> **Event Sourcing:**
>
> - `OrderCancelledByCustomer(reason='Out of stock')`
> - Zeigt Business-Intent und Kontext
> - Domain Event
>
> CDC ist gut für Replikation. Event Sourcing ist gut für Business-Logic und Audit. Man kann auch beides kombinieren!"

---

### Abschluss der Diskussion (30 Sek)

> "Vielen Dank für die spannende Diskussion! Event Sourcing ist definitiv kein einfaches Pattern, aber für die richtigen Use Cases sehr wertvoll. Denkt daran: Nutzt es bewusst, nicht dogmatisch. Gibt es noch letzte Fragen?"

---

## Quellenverzeichnis (Backup-Folie)

### IEEE-Format für Zitierweise

[1] B. Stopford, "Designing Event-Driven Systems: Concepts and Patterns for Streaming Services with Apache Kafka," O'Reilly Media, 2018. [Online]. Available: https://sitic.org/wordpress/wp-content/uploads/Designing-Event-Driven-Systems.pdf

[2] E. Wolff, "Events, Event Sourcing und CQRS - SoftwareArchitekTOUR," YouTube, Nov. 2023. [Online Video]. Available: https://www.youtube.com/live/4xxwX52MLLI

[3] Microsoft, "Event Sourcing pattern - Azure Architecture Center," Microsoft Learn. [Online]. Available: https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing

[4] M. Fowler, "Event Sourcing," MartinFowler.com, Dec. 2005. [Online]. Available: https://martinfowler.com/eaaDev/EventSourcing.html

[5] Microsoft, "Event sourcing design pattern - Azure Cosmos DB," Microsoft Learn. [Online]. Available: https://learn.microsoft.com/en-us/samples/azure-samples/cosmos-db-design-patterns/event-sourcing/

[6] Event Store Ltd., "Event Store Documentation," EventStore.com. [Online]. Available: https://www.eventstore.com/

[7] Confluent, "Event Sourcing, CQRS, and Stream Processing with Apache Kafka," Confluent Blog. [Online]. Available: https://www.confluent.io/blog/event-sourcing-cqrs-stream-processing-apache-kafka/

[8] Microsoft, "CQRS pattern - Azure Architecture Center," Microsoft Learn. [Online]. Available: https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs

---

## Timing-Checkliste (20 Min Präsentation + 10 Min Diskussion)

| Folie          | Inhalt                    | Zeit      | Kumulativ |
| -------------- | ------------------------- | --------- | --------- |
| 1              | Titel & Motivation        | 2:00      | 2:00      |
| 2              | Problemstellung           | 2:30      | 4:30      |
| 3              | Was ist Event Sourcing?   | 2:30      | 7:00      |
| 4              | Kernkonzepte              | 2:30      | 9:30      |
| 5              | Event-Driven Architecture | 2:00      | 11:30     |
| 6              | Beispiel-Szenario         | 2:00      | 13:30     |
| 7              | Code Teil 1               | 2:30      | 16:00     |
| 8              | Code Teil 2               | 2:30      | 18:30     |
| 9              | Vor-/Nachteile            | 3:00      | 21:30     |
| 10             | Saga Pattern              | 2:30      | 24:00     |
| 11             | Praxis                    | 2:00      | 26:00     |
| 12             | Fazit                     | 2:00      | 28:00     |
| **Diskussion** | **Moderierte Diskussion** | **10:00** | **38:00** |

**Puffer:** ~2 Minuten für Zwischenfragen während Präsentation

---

## Erwartete Fragen und Antworten (Vorbereitung)

### **Q: "Ist Event Sourcing nicht total langsam, wenn man alle Events abspielen muss?"**

**A:** "Gute Frage! Ja, naives Replay wäre langsam. Deswegen nutzt man Snapshots - man speichert den State regelmäßig und spielt nur neuere Events ab. Außerdem sind die meisten Queries gegen Read Models, nicht gegen den Event Store direkt. Event Stores wie EventStore DB oder Kafka sind für Append-Only optimiert - das ist extrem schnell."

---

### **Q: "Was ist mit Bi-Temporal Modeling?"**

**A:** "Sehr gute Frage! Bi-Temporal bedeutet zwei Zeitachsen:

1. **Valid Time**: Wann war etwas gültig in der realen Welt?
2. **Transaction Time**: Wann haben wir davon erfahren?

Beispiel: 'Bestellung wurde am 1. Nov storniert, aber wir haben es erst am 5. Nov erfahren.'

Event Sourcing ermöglicht das natürlich - man speichert beide Timestamps. Das wird aber sehr komplex und ist nur bei spezifischen Domains nötig (z.B. Versicherungen, Finanzderivate)."

---

### **Q: "Kann man Event Sourcing mit traditionellen Datenbanken kombinieren?"**

**A:** "Ja! Hybrid-Ansatz ist häufig:

- Event Store für kritische Domains (z.B. Transactions)
- Traditionelle DB für unkritische Domains (z.B. User Profiles)
- Beide synchronisiert über Events

Das nennt man auch 'Polyglot Persistence'. Man nutzt verschiedene Storage-Technologien für verschiedene Anforderungen."

---

### **Q: "Wie testet man Event-Sourced Systeme?"**

**A:** "Tatsächlich ist Testing sehr elegant:

1. **Given**: Vorherige Events im Event Store
2. **When**: Command ausführen
3. **Then**: Neue Events prüfen

Beispiel:

```java
@Test
public void cancelOrder_shouldProduceOrderCancelledEvent() {
    // Given
    eventStore.append(new OrderCreated(...));
    eventStore.append(new PaymentReceived(...));

    // When
    orderService.cancelOrder(orderId, "Customer request");

    // Then
    List<Event> events = eventStore.getEvents(orderId);
    assertThat(events.last()).isInstanceOf(OrderCancelled.class);
}
```

Das ist deterministisch und einfach zu debuggen!"

---

### **Q: "Was ist der Unterschied zu Event Streaming Platforms wie Kafka?"**

**A:** "Wichtige Unterscheidung:

**Kafka als Event Store:**

- Kafka IST ein Event Log (Append-Only)
- Perfekt für Event Sourcing geeignet
- Aber: Keine native Aggregate-basierte Abfrage

**EventStore DB als Event Store:**

- Speziell für Event Sourcing designed
- Aggregate-basierte Streams
- Native Projektionen

Kafka nutzt man oft für Event-Driven Architecture (Service-zu-Service). EventStore DB für Event Sourcing innerhalb eines Service. Man kann auch beides kombinieren!"

---

## Letzte Vorbereitungschecklist

**Inhaltlich:**

- [x] Alle Quellenangaben korrekt eingefügt
- [x] Code-Beispiele auf Richtigkeit geprüft
- [x] Concurrency Control ergänzt
- [x] GDPR-Problematik angesprochen
- [x] Bounded Context Ansatz betont

**Diskussion:**

- [x] 5 Hauptfragen vorbereitet
- [x] Erwartete Antworten durchdacht
- [x] Eigene Position klar formuliert
- [x] Zusatzfragen für tiefere Diskussion

**Präsentation:**

- [ ] Folien erstellt mit max. 7 Stichpunkten pro Folie
- [ ] Sprechnotizen ausgedruckt
- [ ] Gesamtvortrag 2x komplett durchgesprochen (20 Min)
- [ ] Diskussionsfragen laut durchgespielt (10 Min)
- [ ] Timing pro Folie überprüft
- [ ] Technik getestet (Beamer, Backup auf USB)
- [ ] Code-Beispiele in IDE getestet (optional)

**Materialien:**

- [ ] Vollständiges Quellenverzeichnis gedruckt
- [ ] Diskussions-Moderationskarten
- [ ] Whiteboard/Flipchart für spontane Diagramme
- [ ] Handout erstellt (optional)

---

## Tipps für die Moderation der Diskussion

### **Dos:**

✅ Offene Fragen stellen: "Was denkt ihr über...?"
✅ Gegenmeinungen einladen: "Sieht das jemand anders?"
✅ Bei Stille: Konkrete Beispiele geben
✅ Verschiedene Meinungen wertschätzen: "Interessanter Punkt!"
✅ Zeit im Blick behalten: 2-3 Min pro Frage

### **Don'ts:**

❌ Nicht monologisieren - Diskussion facilitieren
❌ Nicht defensiv werden bei Kritik
❌ Nicht zu schnell eigene Meinung pushen
❌ Nicht zu lange bei einer Frage bleiben

### **Bei schwierigen Situationen:**

**Niemand sagt etwas:**

> "Okay, dann stelle ich eine konkrete Frage: Würdet ihr in eurem aktuellen Projekt Event Sourcing einsetzen? [Pause] Wer sagt ja? Wer nein? Warum?"

**Jemand dominiert die Diskussion:**

> "Danke für den Punkt! Gibt es andere Perspektiven dazu? [Zu anderem Teilnehmer] Was denkst du?"

**Kontroverse Diskussion:**

> "Spannend - wir haben hier zwei Lager. Das zeigt genau die Trade-offs von Event Sourcing. Beide Perspektiven haben ihre Berechtigung."

**Zeit läuft ab:**

> "Wir haben noch 2 Minuten - gibt es eine letzte, brennende Frage?"

