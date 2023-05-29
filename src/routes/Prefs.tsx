import { getter, Domain } from "../utils/short";
import useSWR from "swr";
import { Link } from "react-router-dom";
import useLocalStorage from "@rehooks/local-storage";

export const Prefs: React.FC = () => {
  const [apiKey, setApiKey] = useLocalStorage("options.apiKey", "");

  const { data: domains, error } = useSWR<Domain[]>(
    apiKey ? ["/api/domains", apiKey] : null,
    getter
  );

  // Developer Info
  const params = new URLSearchParams(window.location.search);

  return (
    <section className=" rounded-md p-4">
      <h1 className="text-lg">Settings</h1>

      <section className="pt-4">
        <label htmlFor="apiKey" className="font-bold">
          API Key
        </label>
        <p>
          Your short.io API Key, which you can access from the dashboard{" "}
          <a href="https://app.short.io/settings/integrations/api-key">here</a>.
          This key is stored locally on your device.
        </p>
        <input
          name="apiKey"
          type="text"
          className="w-full font-mono rounded-md p-2 px-4 mt-2"
          placeholder="API Key"
          aria-label="Your API Key"
          defaultValue={apiKey}
          onBlur={(ev) => setApiKey(ev.currentTarget.value)}
        />
        {error ? (
          <>
            <p className="pt-4 text-red-400">
              Invalid API Key (<span className="font-mono">{apiKey}</span>)
            </p>
            <section>{JSON.stringify(error, null, 4)}</section>
          </>
        ) : (
          <>
            <p className="pt-4 text-green-400">Authorized</p>
            <p className="pt-2">Domains Available:</p>
            <ul className="list-disc pl-8">
              {domains?.map((domain) => (
                <li className="font-mono" key={domain.id}>
                  {domain.hostname}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
      <section className="mt-8">
        <h2 className="font-bold">Developer Info</h2>
        <section className="mt-4">
          <p>Share Target Info</p>
          <code className="rounded-md p-4 bg-dark-100 block mt-2">
            {[...params.entries()].map(([key, value]) => (
              <p key={key}>
                <span className="font-bold">{key}</span>: {value}
              </p>
            ))}
          </code>
        </section>
      </section>
      <nav className="pt-4 flex justify-end">
        <Link to="/" className="button">
          Save
        </Link>
      </nav>
    </section>
  );
};

export default Prefs;
