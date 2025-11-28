# Event Sourcing - From State to Events

A 20-minute presentation on Event Sourcing with practical code examples and application patterns.

## Quick Start

```bash
npm install
npm run dev
```

The presentation will open at `http://localhost:3030`

## Presentation Structure

20-minute presentation covering:
1. **Problem**: Traditional data storage limitations
2. **Concepts**: Event Sourcing fundamentals & CQRS
3. **Implementation**: Code examples (Events, Store, State Reconstruction)
4. **Trade-offs**: Advantages & disadvantages
5. **Patterns**: Sagas, Migration strategies, Frameworks
6. **Detail Problems**: GDPR compliance, Event versioning, Testing
7. **Conclusion**: When to use Event Sourcing

## Demo

The repository includes an interactive Event Sourcing demo built with Vite that visualizes:
- Event streams and event store operations
- State reconstruction from events
- Time-travel queries

To run the demo separately, navigate to the project directory and run `npm run dev`.

## Export

```bash
npm run export  # Export to PDF
npm run build   # Build static site
```

Manual build:
```bash
./deploy.sh
```

## References

[1] B. Stopford, "Designing Event-Driven Systems: Concepts and Patterns for Streaming Services with Apache Kafka," O'Reilly Media, 2018. [Online]. Available: https://sitic.org/wordpress/wp-content/uploads/Designing-Event-Driven-Systems.pdf

[2] E. Wolff, "Events, Event Sourcing und CQRS - SoftwareArchitekTOUR," YouTube, Nov. 2023. [Online Video]. Available: https://www.youtube.com/live/4xxwX52MLLI

[3] Microsoft, "Event Sourcing pattern - Azure Architecture Center," Microsoft Learn. [Online]. Available: https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing

[4] M. Fowler, "Event Sourcing," MartinFowler.com, Dec. 2005. [Online]. Available: https://martinfowler.com/eaaDev/EventSourcing.html

[5] Microsoft, "Event sourcing design pattern - Azure Cosmos DB," Microsoft Learn. [Online]. Available: https://learn.microsoft.com/en-us/samples/azure-samples/cosmos-db-design-patterns/event-sourcing/

[6] Event Store Ltd., "Event Store Documentation," EventStore.com. [Online]. Available: https://www.eventstore.com/

[7] Confluent, "Event Sourcing, CQRS, and Stream Processing with Apache Kafka," Confluent Blog. [Online]. Available: https://www.confluent.io/blog/event-sourcing-cqrs-stream-processing-apache-kafka/

[8] Microsoft, "CQRS pattern - Azure Architecture Center," Microsoft Learn. [Online]. Available: https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs

## Additional Resources

- Axon Framework: https://axoniq.io/
- EventStore DB: https://www.eventstore.com/
