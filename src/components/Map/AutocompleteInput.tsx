import { Combobox } from '@headlessui/react';
import {
  BuildingLibraryIcon,
  CheckIcon,
  ChevronUpDownIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import {
  AddressSuggestion,
  AddressSuggestions,
} from '../../interface/address-suggestion.interface';
import { RetrieveAddress } from '../../interface/retrieve-address.interface';
import {
  useGetAutocompleteSuggestions,
  useRetrieveAddress,
} from '../../redux/Map/hooks';
import { classNames } from '../../utils/utils';
import { v4 as uuidv4 } from 'uuid';

type MapAutocompleteInputProps = {
  defaultAddress: string;
  setAddress: (address: RetrieveAddress) => void;
};

export const MapAutocompleteInput: FC<MapAutocompleteInputProps> = (
  props: MapAutocompleteInputProps,
) => {
  const intl = useIntl();
  const { setAddress, defaultAddress } = props;

  const [suggestions, setSuggestions] = useState<AddressSuggestions>([]);
  const [, getAutocompleteSuggestions] = useGetAutocompleteSuggestions();
  const [, retrieveAddress] = useRetrieveAddress();
  const sessionToken = uuidv4();

  const setSuggestion = async (mapboxId: string) => {
    const retrievedAddress = await retrieveAddress(mapboxId, sessionToken);
    setAddress(retrievedAddress);
  };

  const fetchSuggestions = async (query: string) => {
    setSuggestions(await getAutocompleteSuggestions(query, sessionToken));
  };

  return (
    <Combobox as="div">
      <div className="relative mt-2">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MapPinIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <Combobox.Input
          className="w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
          onChange={(event) => fetchSuggestions(event.target.value)}
          displayValue={(suggestion: AddressSuggestion) => {
            return suggestion !== null && suggestion.full_address
              ? suggestion.full_address
              : suggestion.name
                ? suggestion.name
                : defaultAddress;
          }}
        />
        <Combobox.Button className="absolute inset-y-0 pl-3 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>
        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {suggestions && suggestions.length > 0 ? (
            suggestions.map((suggestion: AddressSuggestion) => {
              return (
                <Combobox.Option
                  key={suggestion.mapboxId}
                  onClick={() => setSuggestion(suggestion.mapboxId)}
                  value={suggestion}
                  className={({ active }) =>
                    classNames(
                      'relative cursor-default select-none py-2 pl-3 pr-9',
                      active ? 'bg-klaq-600 text-white' : 'text-gray-900',
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
                          'flex flex-row truncate space-x-2',
                          selected && 'font-semibold',
                        )}
                      >
                        <BuildingLibraryIcon className="w-5 h-5" />
                        <span>{suggestion.name}</span>
                      </span>
                      {selected && (
                        <span
                          className={classNames(
                            'absolute inset-y-0 right-0 flex items-center pr-4',
                            active ? 'text-white' : 'text-klaq-600',
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
          ) : (
            <div className="px-6 py-14 text-center sm:px-14">
              <MapPinIcon
                className="mx-auto h-6 w-6 text-gray-400"
                aria-hidden="true"
              />
              <p className="mt-4 text-sm text-gray-900">
                {intl.formatMessage({
                  id: 'edit-event.address-not-found',
                })}
              </p>
            </div>
          )}
        </Combobox.Options>
      </div>
    </Combobox>
  );
};
