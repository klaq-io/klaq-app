import { Combobox } from "@headlessui/react";
import {
  BuildingLibraryIcon,
  CheckIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { classNames } from "../../utils/utils";
import {
  useGetAutocompleteSuggestions,
  useRetrieveAddress,
} from "../../redux/Map/hooks";
import {
  AddressSuggestion,
  AddressSuggestions,
} from "../../interface/address-suggestion.interface";
import { RetrieveAddress } from "../../interface/retrieve-address.interface";

type MapAutocompleteInputProps = {
  defaultAddress: string;
  setAddress: (address: RetrieveAddress) => void;
};

export const MapAutocompleteInput: FC<MapAutocompleteInputProps> = (
  props: MapAutocompleteInputProps
) => {
  const { setAddress, defaultAddress } = props;

  const [suggestions, setSuggestions] = useState<AddressSuggestions>([]);
  const [, getAutocompleteSuggestions] = useGetAutocompleteSuggestions();
  const [, retrieveAddress] = useRetrieveAddress();

  const setSuggestion = async (mapboxId: string) => {
    setAddress(await retrieveAddress(mapboxId));
  };

  const fetchSuggestions = async (query: string) => {
    setSuggestions(await getAutocompleteSuggestions(query));
  };

  return (
    <Combobox as="div">
      <div className="relative mt-2">
        <Combobox.Input
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
          onChange={(event) => fetchSuggestions(event.target.value)}
          displayValue={(suggestion: AddressSuggestion) =>
            suggestion !== null ? suggestion.full_address : defaultAddress
          }
        />
        <Combobox.Button className="absolute inset-y-0 pl-3 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>
        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {suggestions && suggestions.length > 0
            ? suggestions.map((suggestion: AddressSuggestion) => {
                return (
                  <Combobox.Option
                    key={suggestion.mapboxId}
                    onClick={() => setSuggestion(suggestion.mapboxId)}
                    value={suggestion}
                    className={({ active }) =>
                      classNames(
                        "relative cursor-default select-none py-2 pl-3 pr-9",
                        active ? "bg-klaq-600 text-white" : "text-gray-900"
                      )
                    }
                  >
                    {({
                      active,
                      selected,
                    }: {
                      active: boolean;
                      selected: boolean;
                    }) => (
                      <>
                        <span
                          className={classNames(
                            "flex flex-row truncate space-x-2",
                            selected && "font-semibold"
                          )}
                        >
                          <BuildingLibraryIcon className="w-5 h-5" />
                          <span>{suggestion.name}</span>
                        </span>
                        {selected && (
                          <span
                            className={classNames(
                              "absolute inset-y-0 right-0 flex items-center pr-4",
                              active ? "text-white" : "text-klaq-600"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </Combobox.Option>
                );
              })
            : null}
        </Combobox.Options>
      </div>
    </Combobox>
  );
};
