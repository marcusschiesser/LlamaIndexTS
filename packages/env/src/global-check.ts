import { glo } from "./utils/shared.js";

const importIdentifier = "__ $@vectorstores/env$ __";

if (glo[importIdentifier] === true) {
  /**
   * Dear reader of this message. Please take this seriously.
   *
   * If you see this message, make sure that you only import one version of vectorstores. In many cases,
   * your package manager installs two versions of vectorstores that are used by different packages within your project.
   * Another reason for this message is that some parts of your project use the CJS version of vectorstores
   * and others use the ESM version of vectorstores.
   *
   * This often leads to issues that are hard to debug. We often need to perform constructor checks,
   * e.g. `node instanceof TextNode`. If you imported different versions of vectorstores, it is impossible for us to
   * do the constructor checks anymore - which might break the functionality of your application.
   */
  console.error(
    "vectorstores was already imported. This breaks constructor checks and will lead to issues!",
  );
}
glo[importIdentifier] = true;
