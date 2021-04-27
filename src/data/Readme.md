## Data

### DataStore

Data store is an abstract class that you can extend for custom providers. If you wish to support custom objects, such as a custom message object, this is the place for you

```ts
class MyStore extends DataStore {
  protected onMessageCreate(p: EventPacket): CustomStructure {
    return new CustomStructure(p);
  }
}
```

However if you wish to just support custom objects, you can do so in `client.structures`. (this does not support intellisense) EG:

```ts
import { set } from "assistant";
set("guild", CustomStructure);
```
