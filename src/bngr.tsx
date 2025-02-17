import {
	closeMainWindow,
	open,
	Action,
	ActionPanel,
	List,
	getPreferenceValues,
} from "@raycast/api";
import { useState } from "react";

interface Preferences {
	customSearchUrl?: string;
}

const DEFAULT_SEARCH_URL = "https://bngr.ch?e=k";
const SEARCH_URL =
	getPreferenceValues<Preferences>().customSearchUrl || DEFAULT_SEARCH_URL;

const SEARCH_TYPES = {
	default: (query: string) => `${SEARCH_URL}&q=${query}`,
	pipe: (query: string) => `${SEARCH_URL}&q=|${query}`,
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
							const url = SEARCH_TYPES.default(searchText);
							await closeMainWindow();
							await open(url);
						}}
					/>
					<Action
						title="Pipe Search to Default Search"
						shortcut={{ modifiers: ["cmd"], key: "return" }}
						onAction={async () => {
							const url = SEARCH_TYPES.pipe(searchText);
							await closeMainWindow();
							await open(url);
						}}
					/>
				</ActionPanel>
			}
		/>
	);
}
