# Assistant v3 Cluster Client

This is different from a generic client.

## Use this if you need to support over 20k servers

### Downsides:

- This client uses IPC to handle clusters
- This client uses a runtime database (assistant) that is removed on process exit.
