import { CogIcon } from "@heroicons/react/24/outline";
import useLocalStorage from "@rehooks/local-storage";
import { Link, Navigate } from "react-router-dom";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import {
  poster,
  Domain,
  getter,
  LinkCreateOptions,
  Link as ShortLink,
  customFetcher,
} from "../utils/short";
import { useEffect, useRef, useState } from "react";
import { LinkShare } from "../component/LinkDetail";
import Spinner from "../component/Spinner";
import { onKeydown } from "../utils/useKeyboardShortcuts";

export const Index: React.FC = () => {
  const [apiKey] = useLocalStorage("options.apiKey", "");
  const [url, setURL] = useState("");
  const [domain, setDomain] = useState<Domain>();

  const urlInputRef = useRef<HTMLInputElement>(null);

  const { data: domains, error: domainsError } = useSWR<Domain[]>(
    apiKey ? ["/api/domains", apiKey] : null,
    getter
  );

  const [path, setPath] = useState("");
  const [title, setTitle] = useState("");
  const [androidURL, setAndroidURL] = useState("");
  const [iphoneURL, setIPhoneURL] = useState("");

  const {
    trigger: createLink,
    data: createLinkData,
    isMutating: createLinkIsMutating,
    reset: createLinkReset,
  } = useSWRMutation<
    ShortLink,
    any,
    [string, string] | null,
    LinkCreateOptions
  >(apiKey ? ["/links", apiKey] : null, poster);

  useEffect(() => {
    if (!domains) return;
    if (domains.length === 0) return;

    setDomain(domains[0]);
  }, [domains]);

  useEffect(() => {
    if (!createLinkData) return;

    setPath(createLinkData.path);
    setTitle(createLinkData.title ?? "");
    setAndroidURL(createLinkData.androidURL ?? "");
    setIPhoneURL(createLinkData.iphoneURL ?? "");
  }, [createLinkData]);

  const [isURLValid, setIsURLValid] = useState(true);
  function onURLChange(ev: React.ChangeEvent<HTMLInputElement>) {
    setURL(ev.currentTarget.value);

    const valid = ev.currentTarget.validity.valid;
    setIsURLValid(valid);
  }

  async function onURLFocus() {
    let parsedUrl = "";

    // Share Target
    const params = new URLSearchParams(window.location.search);
    if (params.get("url")) {
      parsedUrl = params.get("url")!;
    }

    // Paste from clipboard
    if (navigator.clipboard && !parsedUrl) {
      const clipboard = await navigator.clipboard.readText();

      try {
        const url = new URL(clipboard);
        parsedUrl = url.toString();
      } catch (e) {}
    }

    if (parsedUrl) {
      setURL(parsedUrl);
    }
  }

  function onGo() {
    if (!apiKey || !domain || !url) return;
    createLink({ domain: domain.hostname, originalURL: url });
  }

  async function onSave() {
    if (!apiKey || !domain || !url) return;

    const updated = {
      path,
      originalURL: url,
      title,
      androidURL,
      iphoneURL,
    };

    // Imperative update, because API doesn't have consistent URLs
    await poster([`/links/${createLinkData?.idString}`, apiKey], {
      arg: updated,
    });

    createLinkReset();
    createLink({ domain: domain.hostname, originalURL: url });
  }

  const { trigger: deleteLink } = useSWRMutation(
    apiKey && createLinkData
      ? [`/links/${createLinkData.idString}`, apiKey]
      : null,
    customFetcher({ method: "DELETE" }, (t) => t.json())
  );
  function onDelete() {
    if (!apiKey || !createLinkData) return;

    deleteLink();
    createLinkReset();
  }

  if (!apiKey || domainsError) {
    return <Navigate to="/prefs" replace />;
  }

  return (
    <>
      <header>
        <nav className="flex justify-between items-center pr-4">
          <h1 className="text-lg my-4">Shorten URL</h1>
          <nav className="flex gap-4">
            <Link to="/prefs" className="text-white flex gap-2">
              <CogIcon height={24} />
              Settings
            </Link>
            {/* <Link to="/links" className="text-white flex gap-2">
              <LinkIcon height={24} />
              Manage Links
            </Link> */}
          </nav>
        </nav>
        <div className="flex lg:flex-row flex-col gap-4">
          <div className="flex flex-1 gap-4">
            <input
              type="url"
              ref={urlInputRef}
              autoFocus
              className={
                "w-full rounded-md p-4 outline-none " +
                (isURLValid ? "" : "border border-red-400")
              }
              placeholder="URL"
              aria-label="The URL to shorten"
              value={url}
              onInput={onURLChange}
              onKeyDown={onKeydown({ key: "Enter", callback: onGo })}
              onFocus={onURLFocus}
            />
            <select
              className="h-full rounded-md py-4 border-x-8 border-x-transparent"
              aria-label="The domain to use"
              value={domain?.hostname}
              onChange={(ev) =>
                setDomain(
                  domains?.find((d) => d.hostname === ev.currentTarget.value)
                )
              }
            >
              {domains?.map((domain) => (
                <option value={domain.hostname} key={domain.id}>
                  {domain.hostname}
                </option>
              ))}
            </select>
          </div>
          <button disabled={createLinkIsMutating} onClick={() => onGo()}>
            Shorten
          </button>
        </div>
      </header>
      <section className="mt-8">
        <Spinner hide={!createLinkIsMutating} />
        {createLinkData && (
          <div className="flex flex-col lg:flex-row w-full gap-4">
            <LinkShare link={createLinkData} />
            <div className="bg-dark-100 flex-1 p-4 rounded-md ">
              <h1 className="text-md font-bold">Customization</h1>
              <section className="pt-4">
                <label htmlFor="slug" className="font-bold">
                  Slug
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    name="slug"
                    className="w-full rounded-md p-2 outline-none"
                    value={path}
                    onInput={(ev) => setPath(ev.currentTarget.value)}
                  />
                </div>
              </section>
              <section className="pt-4">
                <label htmlFor="title" className="font-bold">
                  Title
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    name="title"
                    className="w-full rounded-md p-2 outline-none"
                    value={title}
                    onInput={(ev) => setTitle(ev.currentTarget.value)}
                  />
                </div>
              </section>
              <section className="pt-4">
                <label htmlFor="URL" className="font-bold">
                  URL
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    name="URL"
                    className="w-full rounded-md p-2 outline-none"
                    value={url}
                    onInput={(ev) => setURL(ev.currentTarget.value)}
                  />
                </div>
              </section>

              <section className="pt-4">
                <label htmlFor="androidURL" className="font-bold">
                  Android URL
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    name="androidURL"
                    className="w-full rounded-md p-2 outline-none"
                    value={androidURL}
                    onInput={(ev) => setAndroidURL(ev.currentTarget.value)}
                  />
                </div>
              </section>
              <section className="pt-4">
                <label htmlFor="iosURL" className="font-bold">
                  iOS URL
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    name="iosURL"
                    className="w-full rounded-md p-2 outline-none"
                    value={iphoneURL}
                    onInput={(ev) => setIPhoneURL(ev.currentTarget.value)}
                  />
                </div>
              </section>
              <nav className="flex justify-end items-center mt-4 gap-4">
                <button onClick={() => onDelete()}>Delete URL</button>
                <button className="bg-prpl-400" onClick={() => onSave()}>
                  Save
                </button>
              </nav>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default Index;
