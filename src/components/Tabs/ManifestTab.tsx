import { useState } from "react";

const initString = `

`;

const ManifestTab = () => {
  const [manifest, setManifest] = useState<string>(initString);
  return <section>{manifest}</section>;
};

export default ManifestTab;
