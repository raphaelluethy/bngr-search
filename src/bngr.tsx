import { closeMainWindow, open, Action, ActionPanel, List, getPreferenceValues } from "@raycast/api";
import { useState } from "react";

interface Preferences {
  customSearchUrl?: string;
}

const DEFAULT_SEARCH_URL = "https://bngr.ch?e=k";
const SEARCH_URL = getPreferenceValues<Preferences>().customSearchUrl || DEFAULT_SEARCH_URL;

const buildSearchUrl = (query: string, mode: "default" | "pipe") => {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return null;
  }

  const url = new URL(SEARCH_URL);
  const searchQuery = mode === "pipe" ? `|${trimmedQuery}` : trimmedQuery;
  url.searchParams.set("q", searchQuery);
  return url.toString();
};

export default function Command() {
  const [searchText, setSearchText] = useState("");

  return (
    <List
      searchText={searchText}
      searchBarPlaceholder="Enter search text..."
      onSearchTextChange={setSearchText}
      throttle={false}
      actions={
        <ActionPanel>
          <Action
            title="Search with Bngr"
            onAction={async () => {
              const url = buildSearchUrl(searchText, "default");
              if (!url) {
                return;
              }
              await closeMainWindow();
              await open(url);
            }}
          />
          <Action
            title="Pipe Search to Default Search"
            shortcut={{ modifiers: ["cmd"], key: "return" }}
            onAction={async () => {
              const url = buildSearchUrl(searchText, "pipe");
              if (!url) {
                return;
              }
              await closeMainWindow();
              await open(url);
            }}
          />
        </ActionPanel>
      }
    />
  );
}
