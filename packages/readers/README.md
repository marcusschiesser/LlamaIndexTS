# @vectorstores/readers

> Utilities for reading data from various sources

## Usage

```shell
npm i @vectorstores/readers
```

```ts
import { SimpleDirectoryReader } from "@vectorstores/readers/directory";

const reader = new SimpleDirectoryReader();
const documents = reader.loadData("./directory");
```

## License

MIT
