import { CogIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import useLocalStorage from "@rehooks/local-storage";
import { Link, Navigate } from "react-router-dom";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import useSWRMutation from "swr/mutation";
import {
  poster,
  Domain,
  getter,
  LinkCreateOptions,
  Link as ShortLink,
} from "../utils/short";
import { useEffect, useState } from "react";
import LinkDetail from "../component/LinkDetail";
import VisibleCanary from "../component/VisibleCanary";
import Spinner from "../component/Spinner";

export const Links: React.FC = () => {
  const [apiKey] = useLocalStorage("options.apiKey", "");
  const [url, setURL] = useState("");
  const [domain, setDomain] = useState<Domain>();

  const { data: domains, error: domainsError } = useSWR<Domain[]>(
    apiKey ? ["/api/domains", apiKey] : null,
    getter
  );

  const {
    trigger: createLink,
    data: createLinkData,
    isMutating: createLinkIsMutating,
  } = useSWRMutation<
    ShortLink,
    any,
    [string, string] | null,
    LinkCreateOptions
  >(apiKey ? ["/links", apiKey] : null, poster);

  const links = useSWRInfinite<{
    links: ShortLink[];
    count: number;
    nextPageToken: string;
  }>(
    (_, previousData) =>
      apiKey
        ? [
            `/api/links?domain_id=${domain!.id}&limit=30&pageToken=${
              previousData?.nextPageToken
            }`,
            apiKey,
          ]
        : null,
    getter
  );

  const endReached = links.data?.[links.data.length - 1]?.links.length === 0;

  useEffect(() => {
    if (!domains) return;
    if (domains.length === 0) return;

    setDomain(domains[0]);
  }, [domains]);

  if (!apiKey || domainsError) {
    return <Navigate to="/prefs" replace />;
  }

  return (
    <>
      <header>
        <nav className="flex justify-between items-center pr-4">
          <h1 className="text-lg my-4">Active Links</h1>
          <Link to="/prefs" className="text-white flex gap-2">
            <CogIcon height={24} />
            Settings
          </Link>
        </nav>
        <div className="flex lg:flex-row flex-col gap-4">
          <div className="flex gap-4">
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
        </div>
        <Spinner hide={!createLinkIsMutating} />
      </header>
      <main className="mt-8">
        <h1 className="text-lg my-4">Links</h1>
        <section className="flex flex-col gap-4">
          {links.data?.map((page) =>
            page.links.map((link) => (
              <LinkDetail key={link.idString} link={link} />
            ))
          )}
        </section>
        <VisibleCanary
          onVisible={() => console.log("increase page size ")}
          onlyIf={!links.isLoading && !endReached}
        >
          {!endReached && <Spinner />}
        </VisibleCanary>
      </main>
    </>
  );
};

export default Links;
