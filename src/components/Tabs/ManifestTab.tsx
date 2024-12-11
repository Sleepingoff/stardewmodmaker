import {
  ChangeEventHandler,
  FormEventHandler,
  useContext,
  useEffect,
  useState,
} from "react";
import { InputContext } from "../../hooks/context";

type Manifest = {
  Name: string;
  Author: string;
  Version: string;
  Description: string;
  UniqueID: string;
  UpdateKeys: string[];
  ContentPackFor: {
    [key: string]: string;
  };
};

const initString = {
  Name: "Your Mod Name",
  Author: "Your Name",
  Version: "1.0.0",
  Description: "explain your mod",
  UniqueID: "yourname.UniqueModName",
  UpdateKeys: [],
  ContentPackFor: {
    UniqueID: "Pathoschild.ContentPatcher",
  },
};

const ManifestTab = () => {
  const { setter } = useContext(InputContext);
  const [manifest, setManifest] = useState<Manifest>(initString);
  useEffect(() => {
    if (!setter) return;
    setter((prev) => ({ ...prev, manifest: manifest }));
  }, [manifest, setter]);

  const handleChangeInputs: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    setManifest((prev) => ({ ...prev, [target.id]: target.value }));
  };
  const handleSubmitForm: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
  };

  return (
    <section>
      <form onSubmit={handleSubmitForm}>
        <label className="block m-1">
          Name:
          <input
            type="text"
            value={manifest.Name}
            onChange={handleChangeInputs}
            id="Name"
          />
        </label>
        <button type="submit">json으로 바꾸기</button>
      </form>
    </section>
  );
};

export default ManifestTab;
