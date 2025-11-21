# Event Sourcing Presentation

30-minute presentation covering Event Sourcing fundamentals, implementation patterns, and practical applications.

## Quick Start

```bash
npm install
npm run dev
```

## Structure

30-minute format:
- 20 minutes: Main presentation (12 slides)
- 10 minutes: Discussion

## Export

```bash
npm run export  # Export to PDF
npm run build   # Build static site
```

## Deploy to GitHub Pages

The presentation automatically deploys to GitHub Pages when you push to the main branch.

Setup:
1. Go to repository Settings → Pages
2. Select "GitHub Actions" as the source
3. Push to main branch

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
