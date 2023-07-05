import { PlusIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { PageLayout } from "../../layouts";
import { useFetchProductItems } from "../../redux/Products/hooks";
import { getAllProducts } from "../../redux/Products/selectors";
import { NewProducts } from "./NewProducts";

export const Products = () => {
  const intl = useIntl();

  const [{ isLoading }, fetchProducts] = useFetchProductItems();
  const productItems = useSelector(getAllProducts);

  const [openSidePanel, setOpenSidePanel] = useState(false);

  const handleOpenSidePanel = () => {
    setOpenSidePanel(true);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <PageLayout isLoading={isLoading}>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {intl.formatMessage({
              id: "products.title",
            })}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            {intl.formatMessage({
              id: "products.description",
            })}
          </p>
        </div>
      </div>

      <div className="flex flex-row">
        <div className="flex-1 mt-10">
          <div className="px-4 sm:px-0">
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              sit amet elit laoreet, maximus neque in, hendrerit lectus. Integer
              ultricies sapien libero, sed vestibulum dui sollicitudin quis.
              Nunc placerat eget nisl ut finibus. Nunc leo mauris, lacinia a
              blandit in, interdum sed nulla. Curabitur posuere venenatis
              libero, nec finibus massa scelerisque in.
            </p>
            <h3 className="text-base font-semibold leading-7 text-blue-600"></h3>
          </div>
          <div className="mt-6">
            <button
              onClick={handleOpenSidePanel}
              type="button"
              className="relative block sm:w-1/2 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <PlusIcon
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              />

              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                {intl.formatMessage({
                  id: "products.no-product",
                })}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {intl.formatMessage({
                  id: "products.get-started",
                })}
              </p>
            </button>
          </div>
        </div>
      </div>
      <NewProducts
        openSidePanel={openSidePanel}
        setOpenSidePanel={setOpenSidePanel}
      />
    </PageLayout>
  );
};
