import React, { useEffect, useRef } from "react";
import { Link, customFetcher } from "../utils/short";
import { PencilIcon, ShareIcon, TrashIcon } from "@heroicons/react/24/outline";
import useSWR from "swr";
import useLocalStorage from "@rehooks/local-storage";

export type LinkQRCodeProps = {
  idString: string;
};

export const LinkQRCode: React.FC<LinkQRCodeProps> = ({ idString }) => {
  const [apiKey] = useLocalStorage("options.apiKey", "");
  const ref = useRef<HTMLImageElement>(null);

  const { data } = useSWR(
    apiKey ? [`/links/qr/${idString}`, apiKey] : null,
    customFetcher(
      {
        method: "POST",
        body: JSON.stringify({
          type: "svg",
          backgroundColor: "1a1a1a",
          color: "ffffff",
        }),
      },
      (r) => r.blob()
    )
  );

  useEffect(() => {
    if (!data || !ref.current) return;

    const image = data.slice(0, data.size, "image/svg+xml");
    const url = URL.createObjectURL(image);
    ref.current.src = url;
  }, [data, ref]);

  return (
    <div>
      <img alt="" ref={ref} className="aspect-square" />
    </div>
  );
};

export type LinkShareProps = {
  link: Link;
};

export const LinkShare = ({ link }: LinkShareProps) => {
  function onShare() {
    if ("share" in navigator === false) return;

    navigator.share({
      url: link.shortURL,
    });
  }

  return (
    <div
      className="rounded-md bg-dark-100 px-4 py-2 mx-auto w-full lg:max-w-lg"
      onClick={() => onShare()}
    >
      <div className="grid">
        <LinkQRCode idString={link.idString} />
        <div>
          <h2 className="font-mono text-prpl-400 text-center">
            {link.shortURL}
          </h2>
        </div>
      </div>
    </div>
  );
};

export type LinkDetailProps = {
  link: Link;
  expanded?: boolean;
};

const LinkDetail: React.FC<LinkDetailProps> = ({ link, expanded }) => {
  function onShare() {
    if ("share" in navigator === false) return;

    navigator.share({
      url: link.shortURL,
    });
  }

  return (
    <div className="rounded-md bg-dark-100 px-4 py-2" tabIndex={0}>
      <div className="grid grid-cols-2">
        <div className="overflow-hidden">
          {expanded && <LinkQRCode idString={link.idString} />}
          <h2 className="font-mono text-center md:text-left py-4 text-prpl-400 md:ml-1">
            <a
              href={link.shortURL}
              target="blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {link.shortURL}
            </a>
          </h2>
        </div>
        <nav className="flex items-center gap-2">
          <button className="text-white flex gap-2">
            <PencilIcon height={24} />
            Edit
          </button>
          <button className="text-white flex gap-2">
            <TrashIcon height={24} />
            Delete
          </button>
          {"share" in navigator && (
            <button className="text-white flex gap-2" onClick={() => onShare()}>
              <ShareIcon height={24} />
              Share
            </button>
          )}
        </nav>
      </div>
    </div>
  );
};

export default LinkDetail;
